"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product, ProductCategory } from "@/lib/products";
import { CATALOG_CATEGORIES } from "@/lib/products";
import type { Coupon } from "@/lib/coupons";

const CATEGORIES = CATALOG_CATEGORIES.filter((c) => c !== "Todas") as ProductCategory[];

// Categorías que usan "Encargar" (WhatsApp aparte) en vez del carrito — los
// cupones limitados a estas categorías todavía no tienen efecto real.
const ENCARGAR_CATEGORIES: ProductCategory[] = [
  "Desayunos y Meriendas",
  "Postres individuales",
  "Vianda Fiesta!",
];

// ── Utilidades ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Tipos locales ─────────────────────────────────────────────────────────────

type VarianteForm = { nombre: string; stock: number };

type EditForm = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock: number;
  stockDulces: number;
  stockSalados: number;
  sinSelectorSabor: boolean;
  variantes: VarianteForm[];
  available: boolean;
  image: string;
  images: string[];
  video: string;
  imageX: number;
  imageY: number;
  imageZoom: number;
};

const DEFAULT_FORM: EditForm = {
  id: "",
  name: "",
  category: "Waffles Congelados",
  description: "",
  price: 0,
  stock: 0,
  stockDulces: 0,
  stockSalados: 0,
  sinSelectorSabor: false,
  variantes: [],
  available: true,
  image: "",
  images: [],
  video: "",
  imageX: 50,
  imageY: 50,
  imageZoom: 1,
};

function productToForm(p: Product): EditForm {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
    stock: p.stock,
    stockDulces: p.stockDulces ?? 0,
    stockSalados: p.stockSalados ?? 0,
    sinSelectorSabor: p.sinSelectorSabor ?? false,
    variantes: p.variantes ?? [],
    available: p.available !== false,
    image: p.image,
    images: p.images ?? [],
    video: p.video ?? "",
    imageX: p.imageX ?? 50,
    imageY: p.imageY ?? 50,
    imageZoom: p.imageZoom ?? 1,
  };
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState<"Todas" | ProductCategory>("Todas");
  const [filterHidden, setFilterHidden] = useState<"all" | "visible" | "hidden">("all");
  const [editProduct, setEditProduct] = useState<EditForm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [savingCoupons, setSavingCoupons] = useState(false);
  const [visits, setVisits] = useState<{ total: number; today: number; last7Days: number } | null>(null);
  const [excludingDevice, setExcludingDevice] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [ranking, setRanking] = useState<{ productId: string; count: number }[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);

  // Verificar sesión al cargar (la cookie es httpOnly, no se puede leer desde JS)
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(!!data.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      setProducts(data);
    } catch {
      showToast("Error al cargar productos", false);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isLoggedIn) fetchProducts();
  }, [isLoggedIn, fetchProducts]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/admin/visits")
      .then((res) => res.json())
      .then((data) => setVisits(data))
      .catch(() => setVisits(null));
  }, [isLoggedIn]);

  const handleExcludeDevice = async () => {
    setExcludingDevice(true);
    try {
      await fetch("/api/track/exclude-device");
      showToast("Este dispositivo ya no se va a contar como visita");
    } catch {
      showToast("No se pudo excluir el dispositivo", false);
    } finally {
      setExcludingDevice(false);
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsLoggedIn(true);
    } else {
      setLoginError("Contraseña incorrecta");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsLoggedIn(false);
    setProducts([]);
    setPassword("");
  };

  // ── Guardar producto ──────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!editProduct) return;
    setSaving(true);
    try {
      // Si hay galería, la portada siempre es la primera imagen de la galería
      const mainImage =
        editProduct.images.length > 0 ? editProduct.images[0] : editProduct.image;
      const payload: Partial<Product> = {
        ...editProduct,
        image: mainImage,
        // Guardar galería si tiene al menos 1 imagen (evita perder fotos subidas)
        images: editProduct.images.length >= 1 ? editProduct.images : undefined,
        video: editProduct.video || undefined,
      };
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${editProduct.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al guardar");
      }
      showToast(isNew ? "Producto creado ✓" : "Cambios guardados ✓");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      showToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  // ── Reordenar productos ───────────────────────────────────────────────────

  const handleMoveProduct = useCallback(async (id: string, direction: "up" | "down") => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const category = products[idx].category;

    // Buscar el producto adyacente de la misma categoría en el array completo
    const sameCategory = products
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.category === category);
    const posInCat = sameCategory.findIndex(({ i }) => i === idx);
    const targetPos = direction === "up" ? posInCat - 1 : posInCat + 1;
    if (targetPos < 0 || targetPos >= sameCategory.length) return;

    const targetIdx = sameCategory[targetPos].i;
    const newProducts = [...products];
    [newProducts[idx], newProducts[targetIdx]] = [newProducts[targetIdx], newProducts[idx]];
    setProducts(newProducts);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProducts),
      });
      if (!res.ok) throw new Error("Error al guardar orden");
      showToast("Orden actualizado ✓");
    } catch {
      showToast("Error al guardar orden", false);
      fetchProducts();
    }
  }, [products, showToast, fetchProducts]);

  // ── Toggle visibilidad ────────────────────────────────────────────────────

  const handleToggleVisible = async (product: Product) => {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !product.available }),
    });
    if (res.ok) {
      showToast(product.available ? "Producto ocultado" : "Producto visible");
      fetchProducts();
    }
  };

  // ── Eliminar producto ─────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Producto eliminado");
      setConfirmDelete(null);
      fetchProducts();
    }
  };

  // ── Cupones ───────────────────────────────────────────────────────────────

  const fetchCoupons = useCallback(async () => {
    setCouponsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      setCoupons(data);
    } catch {
      showToast("Error al cargar cupones", false);
    } finally {
      setCouponsLoading(false);
    }
  }, [showToast]);

  const openCoupons = () => {
    setShowCoupons(true);
    fetchCoupons();
  };

  const openRanking = async () => {
    setShowRanking(true);
    setRankingLoading(true);
    try {
      const res = await fetch("/api/admin/product-views");
      const data = await res.json();
      setRanking(data.ranking ?? []);
    } catch {
      showToast("Error al cargar el ranking", false);
    } finally {
      setRankingLoading(false);
    }
  };

  const handleSaveCoupons = async () => {
    setSavingCoupons(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coupons),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al guardar cupones");
      }
      showToast("Cupones guardados ✓");
      setShowCoupons(false);
    } catch (err) {
      showToast((err as Error).message, false);
    } finally {
      setSavingCoupons(false);
    }
  };

  // ── Subir imagen ──────────────────────────────────────────────────────────

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "main" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file || !editProduct) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "productos/uploads");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Error al subir");
      const { path } = await res.json();
      if (target === "main") {
        setEditProduct((prev) => prev ? { ...prev, image: path, images: prev.images.length > 0 ? [path, ...prev.images.slice(1)] : [] } : prev);
      } else {
        setEditProduct((prev) => prev ? { ...prev, images: [...prev.images, path] } : prev);
      }
      showToast("Imagen subida ✓");
    } catch {
      showToast("Error al subir imagen", false);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // ── Subir video ──────────────────────────────────────────────────────────

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editProduct) return;
    setUploadingVideo(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "productos/uploads");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Error al subir");
      const { path } = await res.json();
      setEditProduct((prev) => prev ? { ...prev, video: path } : prev);
      showToast("Video subido ✓");
    } catch {
      showToast("Error al subir video", false);
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  // ── Filtrado ──────────────────────────────────────────────────────────────

  const displayed = products.filter((p) => {
    if (filterCat !== "Todas" && p.category !== filterCat) return false;
    if (filterHidden === "visible" && p.available === false) return false;
    if (filterHidden === "hidden" && p.available !== false) return false;
    return true;
  });

  // ── Login Screen ──────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🏠</div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Celisan</h1>
            <p className="text-sm text-gray-500 mt-1">Panel de administración</p>
          </div>
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {loginError && <p className="text-red-500 text-xs mb-3">{loginError}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-celisan-red text-white font-bold hover:opacity-90 transition-opacity"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${toast.ok ? "bg-green-600" : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-celisan-red text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="font-bold text-lg leading-tight">Admin Celisan</h1>
            <p className="text-xs text-white/70">{products.length} productos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {visits && (
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs" title={`${visits.today} hoy · ${visits.last7Days} últimos 7 días`}>
              <span>👁</span>
              <span className="font-bold">{visits.total.toLocaleString("es-AR")}</span>
              <span className="hidden sm:inline text-white/70">visitas</span>
            </div>
          )}
          <button
            onClick={handleExcludeDevice}
            disabled={excludingDevice}
            title="Usá esto en tu celular/PC para que tus propias visitas no sumen al contador"
            className="text-xs text-white/70 hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-white/10 disabled:opacity-50"
          >
            <span className="sm:hidden">📵</span>
            <span className="hidden sm:inline">📵 No contar este dispositivo</span>
          </button>
          <button
            onClick={openRanking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors"
          >
            🏆 Más vistos
          </button>
          <a href="/" target="_blank" className="text-xs text-white/80 hover:text-white underline">Ver sitio</a>
          <button
            onClick={openCoupons}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors"
          >
            🎟️ Cupones
          </button>
          <button
            onClick={() => { setIsNew(true); setEditProduct({ ...DEFAULT_FORM, id: slugify(`prod-${Date.now()}`) }); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-celisan-red font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            + Nuevo Producto
          </button>
          <button onClick={handleLogout} className="text-xs text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10">
            Salir
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 flex-wrap">
          {(["Todas", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat as "Todas" | ProductCategory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterCat === cat ? "bg-celisan-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          {(["all", "visible", "hidden"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterHidden(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterHidden === v ? "bg-olive text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {v === "all" ? "Todos" : v === "visible" ? "👁 Visibles" : "🙈 Ocultos"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-400 py-20">Cargando...</p>
        ) : displayed.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No hay productos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayed.map((product) => {
              const sameInDisplayed = displayed.filter((p) => p.category === product.category);
              const posInCat = sameInDisplayed.findIndex((p) => p.id === product.id);
              return (
                <AdminCard
                  key={product.id}
                  product={product}
                  onEdit={() => { setIsNew(false); setEditProduct(productToForm(product)); }}
                  onToggle={() => handleToggleVisible(product)}
                  onDelete={() => setConfirmDelete(product.id)}
                  onMoveUp={() => handleMoveProduct(product.id, "up")}
                  onMoveDown={() => handleMoveProduct(product.id, "down")}
                  isFirst={posInCat === 0}
                  isLast={posInCat === sameInDisplayed.length - 1}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editProduct && (
        <EditModal
          form={editProduct}
          isNew={isNew}
          saving={saving}
          uploadingImage={uploadingImage}
          uploadingVideo={uploadingVideo}
          onChange={setEditProduct}
          onSave={handleSave}
          onClose={() => setEditProduct(null)}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
        />
      )}

      {/* Modal de cupones */}
      {showCoupons && (
        <CouponsModal
          coupons={coupons}
          loading={couponsLoading}
          saving={savingCoupons}
          onChange={setCoupons}
          onSave={handleSaveCoupons}
          onClose={() => setShowCoupons(false)}
        />
      )}

      {/* Modal de ranking de productos más vistos */}
      {showRanking && (
        <RankingModal
          ranking={ranking}
          products={products}
          loading={rankingLoading}
          onClose={() => setShowRanking(false)}
        />
      )}

      {/* Confirmación de borrado */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-800 mb-2">¿Eliminar producto?</h3>
            <p className="text-sm text-gray-500 mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Modal de cupones ───────────────────────────────────────────────────────────

function CouponsModal({
  coupons,
  loading,
  saving,
  onChange,
  onSave,
  onClose,
}: {
  coupons: Coupon[];
  loading: boolean;
  saving: boolean;
  onChange: (coupons: Coupon[]) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const updateCoupon = (index: number, patch: Partial<Coupon>) => {
    onChange(coupons.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const deleteCoupon = (index: number) => {
    onChange(coupons.filter((_, i) => i !== index));
  };

  const addCoupon = () => {
    onChange([...coupons, { code: "", percent: 10, active: false, label: "" }]);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">🎟️ Cupones de descuento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Cargando...</p>
          ) : coupons.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No hay cupones creados todavía.</p>
          ) : (
            coupons.map((c, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Código</label>
                    <input
                      type="text"
                      value={c.code}
                      onChange={(e) => updateCoupon(i, { code: e.target.value.toUpperCase() })}
                      placeholder="CUPONAMIGO"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">% Off</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={c.percent}
                      onChange={(e) => updateCoupon(i, { percent: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre interno (no lo ve el cliente)</label>
                  <input
                    type="text"
                    value={c.label ?? ""}
                    onChange={(e) => updateCoupon(i, { label: e.target.value })}
                    placeholder="Ej: Día del Amigo"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Categorías donde aplica (ninguna elegida = todo el pedido)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => {
                      const selected = (c.categories ?? []).includes(cat);
                      const esEncargar = ENCARGAR_CATEGORIES.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const current = c.categories ?? [];
                            const next = selected ? current.filter((x) => x !== cat) : [...current, cat];
                            updateCoupon(i, { categories: next });
                          }}
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                            selected
                              ? "bg-celisan-red text-white border-celisan-red"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {cat}{esEncargar ? " ⚠️" : ""}
                        </button>
                      );
                    })}
                  </div>
                  {(c.categories ?? []).some((cat) => ENCARGAR_CATEGORIES.includes(cat as ProductCategory)) && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      ⚠️ Las categorías marcadas todavía no pasan por el carrito (usan "Encargar" por WhatsApp aparte) — este cupón no se va a aplicar ahí todavía.
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={c.active}
                      onChange={(e) => updateCoupon(i, { active: e.target.checked })}
                      className="w-4 h-4 accent-celisan-red"
                    />
                    {c.active ? "Activo" : "Inactivo"}
                  </label>
                  <button
                    onClick={() => deleteCoupon(i)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}

          <button
            onClick={addCoupon}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-semibold hover:border-celisan-red hover:text-celisan-red transition-colors"
          >
            + Agregar cupón
          </button>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-celisan-red text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de ranking de productos más vistos ────────────────────────────────────

function RankingModal({
  ranking,
  products,
  loading,
  onClose,
}: {
  ranking: { productId: string; count: number }[];
  products: Product[];
  loading: boolean;
  onClose: () => void;
}) {
  const top5 = ranking.slice(0, 5);
  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">🏆 Productos más vistos</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400" aria-label="Cerrar">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-xs text-gray-400 mb-4">
            Cuenta cada vez que un cliente toca la foto o el video de un producto para ampliarlo. De cualquier categoría.
          </p>

          {loading ? (
            <p className="text-center text-gray-400 py-10 text-sm">Cargando...</p>
          ) : top5.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">Todavía no hay datos suficientes.</p>
          ) : (
            <div className="space-y-2">
              {top5.map((item, i) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                    <span className="text-lg flex-shrink-0">{medals[i]}</span>
                    {product?.image && (
                      <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{product?.name ?? "Producto eliminado"}</p>
                      {product && <p className="text-[11px] text-gray-400 truncate">{product.category}</p>}
                    </div>
                    <span className="text-sm font-bold text-celisan-red flex-shrink-0">{item.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Card de producto en el admin ──────────────────────────────────────────────

function AdminCard({
  product,
  onEdit,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  product: Product;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const isHidden = product.available === false;
  const hasVariantes = !!product.variantes?.length;
  const isCongelado = product.category === "Waffles Congelados";
  const isCongeladoConSelector = isCongelado && !product.sinSelectorSabor;
  const noStock = hasVariantes
    ? product.variantes!.every((v) => v.stock <= 0)
    : isCongeladoConSelector
    ? (product.stockDulces ?? 0) <= 0 && (product.stockSalados ?? 0) <= 0
    : product.stock <= 0;

  return (
    <div className={`bg-white rounded-xl border ${isHidden ? "border-gray-200 opacity-60" : "border-gray-100"} overflow-hidden shadow-sm flex flex-col`}>
      <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{
            objectPosition: `${product.imageX ?? 50}% ${product.imageY ?? 50}%`,
            transform: `scale(${product.imageZoom ?? 1})`,
            transformOrigin: `${product.imageX ?? 50}% ${product.imageY ?? 50}%`,
          }}
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isHidden && <span className="px-2 py-0.5 rounded-full bg-gray-700 text-white text-[10px] font-bold">OCULTO</span>}
          {noStock && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">SIN STOCK</span>}
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-xs text-gray-400 mb-0.5">{product.category}</p>
        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center justify-between mt-auto mb-3">
          <span className="text-celisan-red font-bold text-sm">${product.price.toLocaleString("es-AR")}</span>
          {hasVariantes ? (
            <div className="flex flex-wrap gap-1 justify-end">
              {product.variantes!.map((v) => (
                <span key={v.nombre} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${v.stock <= 0 ? "bg-red-50 text-red-600" : v.stock === 1 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"}`}>
                  {v.nombre.slice(0, 3)}: {v.stock}
                </span>
              ))}
            </div>
          ) : isCongeladoConSelector ? (
            <div className="flex gap-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${(product.stockDulces ?? 0) <= 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                🍫 {product.stockDulces ?? 0}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${(product.stockSalados ?? 0) <= 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                🧂 {product.stockSalados ?? 0}
              </span>
            </div>
          ) : (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${noStock ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
              Stock: {product.stock}
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <button onClick={onToggle} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isHidden ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {isHidden ? "👁 Mostrar" : "🙈 Ocultar"}
          </button>
          <button onClick={onEdit} className="flex-1 py-1.5 rounded-lg bg-celisan-red/10 text-celisan-red text-xs font-semibold hover:bg-celisan-red/20">
            ✏️ Editar
          </button>
          <button onClick={onDelete} className="py-1.5 px-2.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 text-xs">
            🗑
          </button>
        </div>
        <div className="flex gap-1.5 mt-1.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="flex-1 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-semibold hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            title="Mover arriba en la categoría"
          >
            ↑ Subir
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="flex-1 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-semibold hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            title="Mover abajo en la categoría"
          >
            ↓ Bajar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de edición ──────────────────────────────────────────────────────────

function EditModal({
  form,
  isNew,
  saving,
  uploadingImage,
  uploadingVideo,
  onChange,
  onSave,
  onClose,
  onImageUpload,
  onVideoUpload,
}: {
  form: EditForm;
  isNew: boolean;
  saving: boolean;
  uploadingImage: boolean;
  uploadingVideo: boolean;
  onChange: (f: EditForm) => void;
  onSave: () => void;
  onClose: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, target: "main" | "gallery") => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [tab, setTab] = useState<"info" | "imagen" | "galeria">("info");
  const isCongeladoConSelector = form.category === "Waffles Congelados" && !form.sinSelectorSabor;

  const set = (key: keyof EditForm, value: EditForm[keyof EditForm]) =>
    onChange({ ...form, [key]: value });

  // Mueve una foto en la galería: intercambia posiciones y sincroniza portada
  const moveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= form.images.length) return;
    const arr = [...form.images];
    [arr[fromIdx], arr[toIdx]] = [arr[toIdx], arr[fromIdx]];
    // La primera imagen de la galería siempre es la portada
    onChange({ ...form, images: arr, image: arr[0] });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">{isNew ? "Nuevo Producto" : "Editar Producto"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {(["info", "imagen", "galeria"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors capitalize ${tab === t ? "border-celisan-red text-celisan-red" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {t === "info" ? "Información" : t === "imagen" ? "Imagen" : "Galería"}
            </button>
          ))}
        </div>

        {/* Tab: Información */}
        {tab === "info" && (
          <div className="p-6 space-y-4">
            {isNew && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">ID del producto</label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => set("id", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                  placeholder="ej: wcb-nuevo"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value as ProductCategory)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red bg-white"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red resize-none"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Precio ($)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                />
              </div>
              {!isCongeladoConSelector && (
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock (unidades)</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => set("stock", Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                  />
                </div>
              )}
            </div>
            {isCongeladoConSelector && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">🍫 Stock Dulces</label>
                  <input
                    type="number"
                    value={form.stockDulces}
                    onChange={(e) => set("stockDulces", Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">🧂 Stock Salados</label>
                  <input
                    type="number"
                    value={form.stockSalados}
                    onChange={(e) => set("stockSalados", Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                  />
                </div>
              </div>
            )}
            {form.variantes.length > 0 && (
              <div className="p-4 bg-olive/5 rounded-xl border border-olive/20">
                <label className="block text-xs font-semibold text-gray-700 mb-3">📦 Stock por variante</label>
                <div className="space-y-2">
                  {form.variantes.map((v, i) => (
                    <div key={v.nombre} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700 w-24 shrink-0">{v.nombre}</span>
                      <input
                        type="number"
                        value={v.stock}
                        min={0}
                        onChange={(e) => {
                          const next = [...form.variantes];
                          next[i] = { ...next[i], stock: Number(e.target.value) };
                          set("variantes", next);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
                      />
                      <span className={`text-xs font-bold w-20 text-right ${v.stock <= 0 ? "text-red-500" : v.stock === 1 ? "text-orange-500" : "text-green-600"}`}>
                        {v.stock <= 0 ? "Sin stock" : v.stock === 1 ? "¡Queda 1!" : "¡Hay stock!"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-700">Visible en el catálogo</p>
                <p className="text-xs text-gray-400">Si está oculto no aparece para los clientes</p>
              </div>
              <button
                type="button"
                onClick={() => set("available", !form.available)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.available ? "bg-celisan-red" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.available ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>
        )}

        {/* Tab: Imagen */}
        {tab === "imagen" && (
          <div className="p-6 space-y-4">
            {/* Preview */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${form.imageX}% ${form.imageY}%`,
                    transform: `scale(${form.imageZoom})`,
                    transformOrigin: `${form.imageX}% ${form.imageY}%`,
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-sm">Sin imagen</div>
              )}
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <SliderField
                label="Posición X"
                value={form.imageX}
                min={0} max={100} step={1}
                format={(v) => `${v}%`}
                onChange={(v) => set("imageX", v)}
              />
              <SliderField
                label="Posición Y"
                value={form.imageY}
                min={0} max={100} step={1}
                format={(v) => `${v}%`}
                onChange={(v) => set("imageY", v)}
              />
              <SliderField
                label="Zoom"
                value={form.imageZoom}
                min={1} max={3} step={0.05}
                format={(v) => `${v.toFixed(2)}x`}
                onChange={(v) => set("imageZoom", v)}
              />
            </div>

            {/* Subir imagen */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subir nueva foto de portada</label>
              <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-celisan-red cursor-pointer transition-colors ${uploadingImage ? "opacity-50" : ""}`}>
                <span className="text-sm text-gray-500">{uploadingImage ? "Subiendo..." : "Seleccionar archivo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(e) => onImageUpload(e, "main")}
                />
              </label>
              {form.image && (
                <p className="text-xs text-gray-400 mt-1 truncate">Actual: {form.image}</p>
              )}
            </div>

            {/* Video */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                🎬 Video (opcional — se muestra al pasar el mouse por la card)
              </label>
              {form.video && (
                <div className="mb-2 rounded-xl overflow-hidden bg-black aspect-video">
                  <video src={form.video} controls className="w-full h-full" />
                </div>
              )}
              <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-celisan-red cursor-pointer transition-colors mb-2 ${uploadingVideo ? "opacity-50" : ""}`}>
                <span className="text-sm text-gray-500">{uploadingVideo ? "Subiendo video..." : "📁 Subir video desde la PC"}</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={uploadingVideo}
                  onChange={onVideoUpload}
                />
              </label>
              {form.video && (
                <button
                  type="button"
                  onClick={() => onChange({ ...form, video: "" })}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  🗑 Quitar video
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab: Galería */}
        {tab === "galeria" && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-gray-500">
              La galería activa el carrusel. Necesitás al menos 2 fotos. <strong>La primera es la portada.</strong> Usá las flechas para reordenar.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((img, i) => (
                <div key={img + i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  <img src={img} alt={`Galería ${i + 1}`} className="w-full h-full object-cover" />

                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = form.images.filter((_, idx) => idx !== i);
                      onChange({ ...form, images: next, image: next[0] ?? form.image });
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 z-10"
                  >
                    ✕
                  </button>

                  {/* Badge portada */}
                  {i === 0 && (
                    <span className="absolute bottom-7 left-1 text-[9px] bg-celisan-red text-white px-1.5 py-0.5 rounded font-bold z-10">
                      PORTADA
                    </span>
                  )}

                  {/* Flechas de reordenamiento */}
                  <div className="absolute bottom-1 left-0 right-0 flex justify-between px-1 z-10">
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      disabled={i === 0}
                      title="Mover a la izquierda"
                      className="w-7 h-7 rounded-full bg-black/60 text-white text-base font-bold flex items-center justify-center hover:bg-black/80 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                    >
                      ‹
                    </button>
                    <span className="self-center text-[10px] text-white/70 bg-black/40 px-1.5 rounded font-mono">
                      {i + 1}/{form.images.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveImage(i, i + 1)}
                      disabled={i === form.images.length - 1}
                      title="Mover a la derecha"
                      className="w-7 h-7 rounded-full bg-black/60 text-white text-base font-bold flex items-center justify-center hover:bg-black/80 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                    >
                      ›
                    </button>
                  </div>
                </div>
              ))}

              {/* Botón agregar */}
              <label className={`aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-celisan-red flex flex-col items-center justify-center cursor-pointer transition-colors ${uploadingImage ? "opacity-50" : ""}`}>
                <span className="text-2xl text-gray-300">+</span>
                <span className="text-xs text-gray-400 mt-1">Agregar</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(e) => onImageUpload(e, "gallery")}
                />
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-celisan-red text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Guardando..." : isNew ? "Crear Producto" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Slider reutilizable ───────────────────────────────────────────────────────

function SliderField({
  label, value, min, max, step, format, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-celisan-red"
      />
      <span className="text-xs font-mono text-gray-600 w-12 text-right">{format(value)}</span>
    </div>
  );
}

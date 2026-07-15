export interface Coupon {
  /** Código que escribe el cliente (se compara sin importar mayúsculas/minúsculas) */
  code: string;
  /** Porcentaje de descuento sobre el subtotal, ej: 5, 10, 15 */
  percent: number;
  /** Si está apagado, el cupón no se puede usar aunque exista */
  active: boolean;
  /** Texto interno para identificarlo en el admin (no lo ve el cliente) */
  label?: string;
  /**
   * Categorías a las que aplica el descuento. Vacío o ausente = todo el pedido.
   * Solo tiene efecto real en categorías que pasan por el carrito (Viandas,
   * Panificados, Waffles Congelados, Waffles con Cobertura) — las de "Encargar"
   * (Desayunos y Meriendas, Postres individuales, Vianda Fiesta!) no pasan por
   * el carrito todavía, así que un cupón limitado a esas categorías no tiene
   * efecto hasta que se agregue soporte de cupón en esos formularios.
   */
  categories?: string[];
}

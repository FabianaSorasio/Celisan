export default function Banner() {
  return (
    <div
      className="relative py-4 px-4 text-center font-medium tracking-wide text-cream bg-cover bg-center bg-no-repeat min-h-[4.5rem] flex items-center justify-center"
      style={{
        backgroundImage: "url(/img/banner.jpg)",
      }}
    >
      {/* Degradé verde oliva → rojo */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: "linear-gradient(to right, #556B2F, #B52C2C)",
        }}
        aria-hidden
      />
      <div className="relative z-10 text-center">
        <h2 className="text-xl sm:text-2xl tracking-wide">
          <span className="font-semibold">Entrega Martes y Viernes</span>
          <span className="mx-2">—</span>
          <span className="font-normal">Cupos limitados</span>
        </h2>
        <p className="text-cream text-base sm:text-lg mt-1 font-normal">
          <a href="tel:+543564626508" className="hover:underline">Cel 3564 626508</a>
        </p>
      </div>
    </div>
  );
}

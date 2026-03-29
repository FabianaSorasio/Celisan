export default function Banner() {
  return (
    <div
      className="relative py-5 px-4 text-center font-medium tracking-wide text-cream bg-cover bg-center bg-no-repeat min-h-[5.5rem] flex items-center justify-center"
      style={{
        backgroundImage: "url(/banner.png)",
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
      <div className="relative z-10 text-center px-2 flex flex-col items-center gap-1">
        <p className="text-xl sm:text-2xl md:text-3xl tracking-wide font-semibold leading-tight m-0">
          Stock Limitado
        </p>
        <h2 className="text-lg sm:text-xl md:text-2xl tracking-wide font-semibold leading-tight m-0">
          Sólo martes y viernes
        </h2>
        <p className="text-cream text-base sm:text-lg mt-1 font-normal">
          <a href="tel:+543564626508" className="hover:underline">Cel 3564 626508</a>
        </p>
      </div>
    </div>
  );
}

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
        <p className="text-lg sm:text-xl md:text-2xl tracking-wide font-semibold leading-tight m-0">
          Waffles sin gluten
        </p>
        <a
          href="https://wa.me/5493564626508"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-cream text-2xl sm:text-3xl font-bold hover:underline leading-tight"
          aria-label="Contactar por WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 sm:w-7 sm:h-7"
            aria-hidden
          >
            <path d="M20.52 3.48A11.78 11.78 0 0 0 12.14 0C5.58 0 .24 5.34.24 11.9c0 2.1.55 4.17 1.6 6L0 24l6.3-1.8a11.8 11.8 0 0 0 5.84 1.5h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.18-3.53-8.32ZM12.15 21.7h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.22-3.74 1.07 1-3.65-.24-.37a9.86 9.86 0 0 1-1.52-5.25C2.28 6.45 6.72 2 12.14 2c2.64 0 5.12 1.03 6.98 2.89a9.81 9.81 0 0 1 2.9 6.99c0 5.42-4.44 9.82-9.87 9.82Zm5.39-7.35c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.76.97-.94 1.17-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.38-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.2 5.08 4.49.7.3 1.25.48 1.68.61.7.22 1.33.19 1.84.11.56-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
          </svg>
          3564 626508
        </a>
      </div>
    </div>
  );
}

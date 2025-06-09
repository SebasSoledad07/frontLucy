


const Brand = ({ dark = false }: { dark?: boolean }) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg py-2 px-4 ${
        dark ? 'bg-[#B695E0]' : 'bg-white'
      }`}
    >
      <img
        src="/logo.png"
        alt="lucy-mundo-de-pijamas"
        width={50}
        height={50}
        className="rounded-full border-2 border-[#B695E0]"
      />
      <span
        className={`text-xl font-bold tracking-wide ${
          dark ? 'text-white' : 'text-[#7A5B47]'
        }`}
      >
        Lucy Mundo de Pijamas
      </span>
    </div>
  );
};


export default Brand;

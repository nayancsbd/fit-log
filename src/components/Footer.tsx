import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0c0e] border-t border-zinc-900 py-6 mt-16 text-zinc-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg tracking-wider uppercase">
          <Image
            src="/logo.png"
            alt="FITLOG Logo"
            width={22}
            height={22}
            className="w-5 h-5 object-contain"
          />
          <span className="font-oswald">FITLOG</span>
        </div>

        <p className="text-xs text-zinc-500">
          &copy; 2026 FitLog &mdash; Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}

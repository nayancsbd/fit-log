export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 py-16">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-[#bef264] animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-[#bef264]/10 border border-[#bef264]/40 flex items-center justify-center animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-[#bef264]" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-1.5 mt-2">
        <span className="font-oswald text-[#bef264] text-xs uppercase tracking-widest font-bold">
          FITLOG WORKOUT ENGINE
        </span>
        <p className="text-zinc-400 text-sm font-medium animate-pulse">
          Loading workout data...
        </p>
      </div>
    </div>
  );
}

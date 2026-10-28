export default function HeaderBuk() {
    return (
    <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
            <img 
            src="/ceiba-logo.png" 
            alt="Ceiba Software Logo" 
            className="h-10 w-auto object-contain" 
                />
            </div>
        <span className="text-slate-300">|</span>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            ceiba.buk.co
        </span>
            </div>

        <div className="flex items-center gap-4 text-xs font-medium">
        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Middleware Direct Connect: LinkedIn → BUK
        </span>
        <span className="text-slate-500">Trabajo | Usuario Ceiba</span>
        </div>
    </header>
    );
}

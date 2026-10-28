export default function KanbanBoard({ candidatesList }) {
  // Aseguramos que sea un arreglo seguro por si viene vacío o undefined
    const safeCandidates = Array.isArray(candidatesList) ? candidatesList : [];

    return (
        <div className="flex gap-4 p-6 overflow-x-auto flex-1">
        {/* Columna 1: POSTULANTES */}
        <div className="bg-[#F8F9FA] rounded-xl p-4 w-80 flex flex-col gap-3 shrink-0 border border-slate-200">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                POSTULANTES ({safeCandidates.length})
                </h2>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Middleware Active
            </span>
            </div>

            {/* Lista de candidatos reales sincronizados (Daniela, Andrés, etc.) */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
            {safeCandidates.map((candidate, index) => (
                <div
                key={index}
                className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1.5"
                >
                <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                    {candidate.name}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-1.5 py-0.5 rounded border border-blue-100">
                    {candidate.id}
                    </span>
                </div>
                <p className="text-[11px] text-slate-500">{candidate.role}</p>
                <div className="border-t border-slate-100 pt-2 mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                    Calificación: <strong className="text-slate-700">{candidate.score}</strong>
                    </span>
                    <span className="text-emerald-600 font-medium">Registrado</span>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Columna 2: POR CONTACTAR */}
        <div className="bg-[#F8F9FA] rounded-xl p-4 w-80 flex flex-col gap-3 shrink-0 border border-slate-200">
            <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs text-slate-700 uppercase tracking-wide">
                POR CONTACTAR (2)
            </h2>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1">
            <span className="font-bold text-xs text-slate-900">Lina Esperanza Mejía</span>
            <p className="text-[11px] text-slate-500">Practicante Selección</p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1">
            <span className="font-bold text-xs text-slate-900">Mateo Cabeza Fonseca</span>
            <p className="text-[11px] text-slate-500">Practicante Selección</p>
            </div>
        </div>

        {/* Columna 3: VALIDACIONES */}
        <div className="bg-[#F8F9FA] rounded-xl p-4 w-80 flex flex-col gap-3 shrink-0 border border-slate-200">
            <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs text-slate-700 uppercase tracking-wide">
                VALIDACIONES (1)
            </h2>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1">
            <span className="font-bold text-xs text-slate-900">Jhon Marchena Mantilla</span>
            <p className="text-[11px] text-slate-500">Documentos en regla</p>
            </div>
        </div>

        {/* Columna 4: PRUEBA TÉCNICA */}
        <div className="bg-[#F8F9FA] rounded-xl p-4 w-80 flex flex-col gap-3 shrink-0 border border-slate-200">
            <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs text-slate-700 uppercase tracking-wide">
                PRUEBA TÉCNICA (0)
            </h2>
            </div>
            <p className="text-[11px] text-slate-400 italic text-center mt-6">
            Sin candidatos en esta etapa
            </p>
        </div>

        {/* Columna 5: ENTREVISTA TÉCNICA */}
        <div className="bg-[#F8F9FA] rounded-xl p-4 w-80 flex flex-col gap-3 shrink-0 border border-slate-200">
            <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs text-slate-700 uppercase tracking-wide">
                ENTREVISTA TÉCNICA (1)
            </h2>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1">
            <span className="font-bold text-xs text-slate-900">Maria Paula Bohórquez</span>
            <p className="text-[11px] text-slate-500">Evaluación programada</p>
            </div>
        </div>
        </div>
    );
}
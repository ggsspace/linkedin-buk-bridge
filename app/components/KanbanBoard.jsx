'use client';

export default function KanbanBoard({
    jsonInput,
    setJsonInput,
    responseOutput,
    loading,
    handleSubmit,
    loadPreset,
    candidatesList
    }) {
    return (
        <main className="flex-1 p-5 overflow-x-auto bg-[#F4F5F7]">
        <div className="flex gap-4 overflow-x-auto pb-4 items-start">
            
            {/* ==========================================
                COLUMNA 1: POSTULANTES (MIDDLEWARE INTEGRADO)
                ========================================== */}
            <div className="w-80 shrink-0 bg-[#E8F0FE] rounded-xl border-2 border-[#1A73E8] p-3 shadow-md">
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs text-[#174EA6] uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8]"></span>
                Postulantes ({candidatesList.length})
                </span>
                <span className="text-[10px] bg-[#1A73E8] text-white font-bold px-2 py-0.5 rounded-full">
                Middleware Active
                </span>
            </div>

            {/* Panel de pruebas interactivo dentro de la misma columna */}
            <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-xs mb-3">
                <div className="text-[11px] font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>Simular Payload LinkedIn</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    Zod Verified
                </span>
                </div>
                
                {/* Botones de selección rápida de escenarios */}
                <div className="flex gap-1 mb-2">
                <button 
                    onClick={() => loadPreset('valid')} 
                    className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-medium transition"
                >
                    Válido (201)
                </button>
                <button 
                    onClick={() => loadPreset('invalid_country')} 
                    className="text-[10px] bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded font-medium transition"
                >
                    Extranjero (422)
                </button>
                <button 
                    onClick={() => loadPreset('missing_fields')} 
                    className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded font-medium transition"
                >
                    Faltante (400)
                </button>
                </div>

                {/* Editor del JSON de entrada */}
                <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={5}
                className="w-full bg-[#1E1E1E] font-mono text-[10px] p-2 rounded text-emerald-400 focus:outline-none border border-slate-700"
                />

                {/* Botón de envío que activa la integración */}
                <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold py-1.5 text-xs rounded transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-1"
                >
                {loading ? 'Procesando en Middleware...' : '✦ Enviar Postulación a BUK'}
                </button>
            </div>

            {/* Visualizador de la respuesta HTTP del servidor en tiempo real */}
            {responseOutput && (
                <div className="mb-3 p-2 bg-[#1E1E1E] rounded text-[10px] font-mono border border-slate-700 shadow-xs">
                <span className={`font-bold ${responseOutput.status === 201 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    HTTP {responseOutput.status} {responseOutput.status === 201 ? 'CREATED' : responseOutput.status === 422 ? 'UNPROCESSABLE' : 'BAD REQUEST'}
                </span>
                <pre className="text-slate-300 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(responseOutput.data, null, 2)}
                </pre>
                </div>
            )}

            {/* Tarjetas de candidatos registrados en tiempo real */}
            <div className="flex flex-col gap-2">
                {candidatesList.map((c, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col gap-1 hover:border-[#1A73E8] transition">
                    <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-slate-900">{c.name}</span>
                    <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-100">
                        {c.id}
                    </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{c.role}</span>
                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>Calificación: <strong className="text-slate-700">{c.score}</strong></span>
                    <span className="text-emerald-600 font-medium">Registrado</span>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* ==========================================
                COLUMNA 2: POR CONTACTAR (VISUAL BUK)
                ========================================== */}
            <div className="w-64 shrink-0 bg-white/70 rounded-xl border border-slate-200 p-3">
            <span className="font-bold text-xs text-slate-600 uppercase tracking-wide block mb-3">Por contactar (5)</span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-2 opacity-75 shadow-xs">
                <span className="font-bold text-xs text-slate-800 block">Lina Esperanza Mejía</span>
                <span className="text-[11px] text-slate-500">Practicante Selección</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-2 opacity-75 shadow-xs">
                <span className="font-bold text-xs text-slate-800 block">Mateo Cabeza Fonseca</span>
                <span className="text-[11px] text-slate-500">Practicante Selección</span>
            </div>
            </div>

            {/* ==========================================
                COLUMNA 3: VALIDACIONES (VISUAL BUK)
                ========================================== */}
            <div className="w-64 shrink-0 bg-white/70 rounded-xl border border-slate-200 p-3">
            <span className="font-bold text-xs text-slate-600 uppercase tracking-wide block mb-3">Validaciones (2)</span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 opacity-75 shadow-xs">
                <span className="font-bold text-xs text-slate-800 block">Jhon Marchena Mantilla</span>
                <span className="text-[11px] text-slate-500">Documentos en regla</span>
            </div>
            </div>

            {/* ==========================================
                COLUMNA 4: PRUEBA TÉCNICA (VISUAL BUK)
                ========================================== */}
            <div className="w-64 shrink-0 bg-white/70 rounded-xl border border-slate-200 p-3">
            <span className="font-bold text-xs text-slate-600 uppercase tracking-wide block mb-3">Prueba Técnica (0)</span>
            <div className="text-xs text-slate-400 italic text-center py-6">Sin candidatos en esta etapa</div>
            </div>

            {/* ==========================================
                COLUMNA 5: ENTREVISTA TÉCNICA (VISUAL BUK)
                ========================================== */}
            <div className="w-64 shrink-0 bg-white/70 rounded-xl border border-slate-200 p-3">
            <span className="font-bold text-xs text-slate-600 uppercase tracking-wide block mb-3">Entrevista Técnica (3)</span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-2 opacity-75 shadow-xs">
                <span className="font-bold text-xs text-slate-800 block">María Paula Bohórquez</span>
                <span className="text-[11px] text-slate-500">Evaluación programada</span>
            </div>
            </div>

        </div>
        </main>
    );
}
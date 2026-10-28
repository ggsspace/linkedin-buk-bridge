'use client';
import { useState } from 'react';

export default function Home() {
  // ==========================================
  // 1. ESTADOS Y CONFIGURACIÓN INICIAL
  // ==========================================
  // Estado para el payload JSON inicial (con un nuevo candidato de prueba)
  const [jsonInput, setJsonInput] = useState(JSON.stringify({
    fullName: "Camila Andrea Marín",
    email: "camila.marin@example.com",
    phone: "+573114567890",
    jobId: "VAC-3924",
    country: "Colombia",
    city: "Medellín",
    resumeUrl: "https://example.com/cv/camila-marin.pdf"
  }, null, 2));

  // Estado para capturar la respuesta del servidor (HTTP status y data)
  const [responseOutput, setResponseOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lista inicial de candidatos actualizados para la columna "Postulantes" de BUK
  const [candidatesList, setCandidatesList] = useState([
    { id: 'BUK-774921', name: 'Andrés Felipe Hincapié', role: 'Practicante de Contratación', score: '4.5' },
    { id: 'BUK-883920', name: 'Manuela Arango Ríos', role: 'Practicante de Contratación', score: '4.8' },
    { id: 'BUK-556210', name: 'Santiago Osorio Betancur', role: 'Practicante de Contratación', score: '3.8' },
  ]);

  // ==========================================
  // 2. FUNCIÓN DE ENVÍO AL MIDDLEWARE
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseOutput(null);

    try {
      const parsedData = JSON.parse(jsonInput);
      
      // Petición POST al endpoint del middleware (/api/candidates)
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
      });
      const data = await res.json();
      setResponseOutput({ status: res.status, data });

      // Si el registro es exitoso (HTTP 201), se añade dinámicamente el candidato a la interfaz de BUK
      if (res.status === 201 && data.buk_details) {
        const newCandidate = {
          id: data.buk_details.buk_candidate_id || `BUK-${Math.floor(100000 + Math.random() * 900000)}`,
          name: parsedData.fullName,
          role: 'Practicante de Contratación',
          score: '5.0 (Nuevo)'
        };
        setCandidatesList(prev => [newCandidate, ...prev]);
      }
    } catch (err) {
      setResponseOutput({ status: 500, data: { error: "JSON inválido o error de red: " + err.message } });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. CARGA DE PRESETS (CASOS DE PRUEBA)
  // ==========================================
  const loadPreset = (type) => {
    if (type === 'valid') {
      setJsonInput(JSON.stringify({
        fullName: "Camila Andrea Marín",
        email: "camila.marin@example.com",
        phone: "+573114567890",
        jobId: "VAC-3924",
        country: "Colombia",
        city: "Medellín",
        resumeUrl: "https://example.com/cv/camila-marin.pdf"
      }, null, 2));
    } else if (type === 'invalid_country') {
      setJsonInput(JSON.stringify({
        fullName: "Michael Smith",
        email: "michael.smith@example.com",
        phone: "+15550192837",
        jobId: "VAC-3924",
        country: "Estados Unidos",
        city: "New York",
        resumeUrl: "https://example.com/cv/michael-smith.pdf"
      }, null, 2));
    } else if (type === 'missing_fields') {
      setJsonInput(JSON.stringify({
        fullName: "Felipe",
        email: "felipe@example.com"
      }, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans text-slate-800 flex flex-col">
      
      {/* ==========================================
          4. HEADER SUPERIOR ESTILO BUK & LOGO CEIBA
          ========================================== */}
      <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-6">
          {/* Logo oficial de Ceiba cargado desde /public/ceiba-logo.png */}
          <div className="flex items-center gap-2">
            <img 
              src="/ceiba-logo.png" 
              alt="Ceiba Software Logo" 
              className="h-8 w-auto object-contain" 
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

      {/* ==========================================
          5. BARRA DE TÍTULO DE LA VACANTE
          ========================================== */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            3924 Practicante de Contratación Pública
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">Prioridad Alta</span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Inicio: 25/09/2026 | Vigencia hasta 10 días | Proceso: Activo</p>
        </div>
      </div>

      {/* ==========================================
          6. NAVEGACIÓN SECUNDARIA DE LA VACANTE
          ========================================== */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-6 text-xs text-slate-600 font-medium">
        <span className="text-[#00C853] border-b-2 border-[#00C853] py-2.5 font-bold cursor-pointer">Proceso</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Formularios</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Pruebas</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Automatización</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Agentes</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Historial</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Postulantes</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ==========================================
            7. SIDEBAR LATERAL IZQUIERDO DE BUK
            ========================================== */}
        <aside className="w-52 bg-white border-r border-slate-200 p-4 text-xs flex flex-col gap-1 shrink-0">
          <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-2">Desarrollo Organizacional</div>
          <div className="text-slate-600 p-2 hover:bg-slate-50 rounded cursor-pointer font-medium">Talento</div>
          
          <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mt-3 mb-2">Selección</div>
          <div className="bg-emerald-50 text-emerald-800 font-bold p-2 rounded border border-emerald-200 cursor-pointer flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></span>
            Procesos
          </div>
          <div className="text-slate-600 p-2 hover:bg-slate-50 rounded cursor-pointer">Postulantes</div>
          <div className="text-slate-600 p-2 hover:bg-slate-50 rounded cursor-pointer">Plantillas</div>
          <div className="text-slate-600 p-2 hover:bg-slate-50 rounded cursor-pointer">Configuraciones</div>
        </aside>

        {/* ==========================================
            8. ÁREA PRINCIPAL: TABLERO KANBAN DE BUK
            ========================================== */}
        <main className="flex-1 p-5 overflow-x-auto bg-[#F4F5F7]">
          
          <div className="flex gap-4 overflow-x-auto pb-4 items-start">
            
            {/* ==========================================
                COLUMNA 1: POSTULANTES (AQUÍ VIVE NUESTRO MIDDLEWARE)
                ========================================== */}
            <div className="w-80 shrink-0 bg-[#E8F0FE] rounded-xl border-2 border-[#1A73E8] p-3 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs text-[#174EA6] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8]"></span>
                  Postulantes ({candidatesList.length})
                </span>
                <span className="text-[10px] bg-[#1A73E8] text-white font-bold px-2 py-0.5 rounded-full">Middleware Active</span>
              </div>

              {/* Panel de pruebas interactivo dentro de la misma columna */}
              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-xs mb-3">
                <div className="text-[11px] font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>Simular Payload LinkedIn</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Zod Verified</span>
                </div>
                
                {/* Botones de selección rápida de escenarios */}
                <div className="flex gap-1 mb-2">
                  <button onClick={() => loadPreset('valid')} className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-medium transition">Válido (201)</button>
                  <button onClick={() => loadPreset('invalid_country')} className="text-[10px] bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded font-medium transition">Extranjero (422)</button>
                  <button onClick={() => loadPreset('missing_fields')} className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded font-medium transition">Faltante (400)</button>
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
                  <pre className="text-slate-300 mt-1 whitespace-pre-wrap">{JSON.stringify(responseOutput.data, null, 2)}</pre>
                </div>
              )}

              {/* Tarjetas de candidatos registrados en tiempo real */}
              <div className="flex flex-col gap-2">
                {candidatesList.map((c, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col gap-1 hover:border-[#1A73E8] transition">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900">{c.name}</span>
                      <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-100">{c.id}</span>
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
      </div>
    </div>
  );
}
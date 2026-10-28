'use client';
import { useState, useEffect } from 'react';
import HeaderBuk from './components/HeaderBuk';
import KanbanBoard from './components/KanbanBoard';

export default function Home() {
  const [candidates, setCandidates] = useState([]);

  // Función para cargar los candidatos desde la API
  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/candidates');
      const json = await res.json();
      if (json.success) {
        setCandidates(json.data);
      }
    } catch (err) {
      console.error("Error al cargar candidatos:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

export default function Home() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify({
    fullName: "Camila Andrea Marín",
    email: "camila.marin@example.com",
    phone: "+573114567890",
    jobId: "VAC-3924",
    country: "Colombia",
    city: "Medellín",
    resumeUrl: "https://example.com/cv/camila-marin.pdf"
  }, null, 2));

  const [responseOutput, setResponseOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidatesList, setCandidatesList] = useState([
    { id: 'BUK-774921', name: 'Andrés Felipe Hincapié', role: 'Practicante de Contratación', score: '4.5' },
    { id: 'BUK-883920', name: 'Manuela Arango Ríos', role: 'Practicante de Contratación', score: '4.8' },
    { id: 'BUK-556210', name: 'Santiago Osorio Betancur', role: 'Practicante de Contratación', score: '3.8' },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseOutput(null);

    try {
      const parsedData = JSON.parse(jsonInput);
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
      });
      const data = await res.json();
      setResponseOutput({ status: res.status, data });

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
      <HeaderBuk />

      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            3924 Practicante de Contratación Pública
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">Prioridad Alta</span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Inicio: 25/09/2026 | Vigencia hasta 10 días | Proceso: Activo</p>
        </div>
      </div>

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

        <KanbanBoard
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          responseOutput={responseOutput}
          loading={loading}
          handleSubmit={handleSubmit}
          loadPreset={loadPreset}
          candidatesList={candidatesList}
        />
      </div>
    </div>
  );
}
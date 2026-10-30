'use client';
import { useState, useEffect } from 'react';
import HeaderBuk from './components/HeaderBuk';
import KanbanBoard from './components/KanbanBoard';

export default function Home() {
  const [candidatesList, setCandidatesList] = useState([]);

  // Función única para obtener candidatos desde la API BUK de forma segura
  const loadBukCandidates = async () => {
    try {
      // Usamos el origen dinámico del navegador para evitar fallos de fetch en desarrollo
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/candidates`, {
        cache: 'no-store' // Garantiza que siempre traiga los datos en tiempo real desde la extensión
      });

      // Si la respuesta del servidor no es OK (200-299), salimos sin romper la ejecución
      if (!res.ok) {
        console.warn(`Aviso BUK API: Estado HTTP ${res.status}`);
        return;
      }

      const json = await res.json();
      
      if (json && json.data) {
        const formatted = json.data.map(c => ({
          id: c.id,
          name: c.fullName || `${c.first_name || ''} ${c.last_name || ''}`.trim(),
          role: c.role || c.jobTitle || 'Practicante de Contratación Pública',
          score: c.score || '5.0',
          country: c.country,
          city: c.city,
          resumeUrl: c.resumeUrl
        }));
        
        setCandidatesList(formatted);
      }
    } catch (err) {
      console.error("Error al sincronizar con BUK API:", err);
    }
  };

  useEffect(() => {
    loadBukCandidates();
    
    // Intervalo de polling de 3 segundos para refrescar automáticamente si llega un nuevo perfil desde la extensión
    const interval = setInterval(loadBukCandidates, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Encabezado principal */}
      <HeaderBuk />

      {/* Sub-header de la Vacante BUK */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            3924 Practicante de Contratación Pública
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">Prioridad Alta</span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Inicio: 25/09/2026 | Vigencia hasta 10 días | Proceso: Activo</p>
        </div>
      </div>

      {/* Pestañas del Proceso */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-6 text-xs text-slate-600 font-medium shrink-0">
        <span className="text-[#00C853] border-b-2 border-[#00C853] py-2.5 font-bold cursor-pointer">Proceso</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Formularios</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Pruebas</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Automatización</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Agentes</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Historial</span>
        <span className="py-2.5 hover:text-slate-900 cursor-pointer">Postulantes</span>
      </div>

      {/* Contenido Principal con Sidebar y Tablero Kanban */}
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

        {/* Tablero Kanban con la lista sincronizada */}
        <KanbanBoard candidatesList={candidatesList} />
      </div>
    </main>
  );
}
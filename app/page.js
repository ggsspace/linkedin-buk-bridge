'use client';
import { useState } from 'react';

export default function Home() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify({
    fullName: "Ana María Pérez Gómez",
    email: "ana.perez@example.com",
    phone: "+573001234567",
    jobId: "VAC-2026-01",
    country: "Colombia",
    city: "Medellín",
    resumeUrl: "https://example.com/cv/ana-perez.pdf"
  }, null, 2));

  const [responseOutput, setResponseOutput] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setResponseOutput({ status: 500, data: { error: "JSON inválido o error de red: " + err.message } });
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type) => {
    if (type === 'valid') {
      setJsonInput(JSON.stringify({
        fullName: "Carlos Alberto Restrepo",
        email: "carlos.restrepo@example.com",
        phone: "+573119876543",
        jobId: "VAC-2026-02",
        country: "Colombia",
        city: "Bogotá",
        resumeUrl: "https://example.com/cv/carlos-restrepo.pdf"
      }, null, 2));
    } else if (type === 'invalid_country') {
      setJsonInput(JSON.stringify({
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+15551234567",
        jobId: "VAC-2026-02",
        country: "Estados Unidos",
        city: "Miami",
        resumeUrl: "https://example.com/cv/john-doe.pdf"
      }, null, 2));
    } else if (type === 'missing_fields') {
      setJsonInput(JSON.stringify({
        fullName: "Incompleto",
        email: "incompleto@example.com"
      }, null, 2));
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">Ceiba Software & SENA CUEE 2.0</span>
          <h1 className="text-3xl font-bold mt-1">Direct Connect: LinkedIn to BUK Middleware</h1>
          <p className="text-slate-400 mt-2">Panel de pruebas interactivo para demostración del prototipo.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna de Entrada */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold mb-3">Payload de LinkedIn (JSON)</h2>
            <div className="flex gap-2 mb-3 flex-wrap">
              <button onClick={() => loadPreset('valid')} className="text-xs bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded font-medium transition">Válido (Col)</button>
              <button onClick={() => loadPreset('invalid_country')} className="text-xs bg-amber-600 hover:bg-amber-500 px-2.5 py-1 rounded font-medium transition">Extranjero (422)</button>
              <button onClick={() => loadPreset('missing_fields')} className="text-xs bg-rose-600 hover:bg-rose-500 px-2.5 py-1 rounded font-medium transition">Incompleto (400)</button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 font-mono text-sm p-3 rounded border border-slate-700 focus:outline-none focus:border-emerald-500 text-slate-200"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Procesando postulación...' : 'Enviar Postulación al Middleware'}
            </button>
          </div>

          {/* Columna de Resultados */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold mb-3">Respuesta del Servidor</h2>
            <div className="flex-1 bg-slate-950 p-4 rounded border border-slate-700 font-mono text-sm overflow-auto max-h-[380px]">
              {responseOutput ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${responseOutput.status >= 200 && responseOutput.status < 300 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      HTTP {responseOutput.status}
                    </span>
                  </div>
                  <pre className="text-emerald-300 whitespace-pre-wrap">{JSON.stringify(responseOutput.data, null, 2)}</pre>
                </div>
              ) : (
                <span className="text-slate-500 italic">Esperando envío de datos... Haz clic en enviar para ver la respuesta en tiempo real.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
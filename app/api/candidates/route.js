import { NextResponse } from 'next/server';

// Arreglo global en memoria para guardar los candidatos recibidos en la sesión activa
global.candidatesList = global.candidatesList || [
  {
    id: "BUK-774921",
    fullName: "Andrés Felipe Hincapié",
    email: "andres.hincapie@example.com",
    country: "Colombia",
    city: "Medellín",
    jobTitle: "Practicante de Contratación",
    rating: "4.5",
    status: "Registrado"
  },
  {
    id: "BUK-883920",
    fullName: "Manuela Arango Ríos",
    email: "manuela.arango@example.com",
    country: "Colombia",
    city: "Medellín",
    jobTitle: "Practicante de Contratación",
    rating: "4.8",
    status: "Registrado"
  },
  {
    id: "BUK-556210",
    fullName: "Santiago Osorio Betancur",
    email: "santiago.osorio@example.com",
    country: "Colombia",
    city: "Medellín",
    jobTitle: "Practicante de Contratación",
    rating: "3.8",
    status: "Registrado"
  }
];

// 1. Método GET: Permite consultar la lista completa de candidatos guardados
export async function GET() {
  return NextResponse.json({
    success: true,
    data: global.candidatesList
  }, { status: 200 });
}

// 2. Método POST: Recibe el payload de la extensión de Chrome y agrega el candidato
export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, country, city, resumeUrl, jobId } = body;

    // Validación de Negocio: País obligatorio Colombia
    if (!country || !country.toLowerCase().includes('colombia')) {
      return NextResponse.json({
        success: false,
        message: "Candidato rechazado: Solo se aceptan postulaciones de residentes en Colombia."
      }, { status: 422 });
    }

    const newCandidateId = `BUK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCandidate = {
      id: newCandidateId,
      fullName: fullName || "Candidato Extraído",
      email: email || "correo@ejemplo.com",
      phone: phone || "+573000000000",
      country: country,
      city: city || "Medellín",
      jobTitle: "Practicante de Contratación",
      rating: "5.0",
      status: "Registrado",
      resumeUrl: resumeUrl || "",
      jobId: jobId || "VAC-3924"
    };

    // Agregar al inicio de la lista en memoria
    global.candidatesList.unshift(newCandidate);

    return NextResponse.json({
      success: true,
      message: "Candidato sincronizado con BUK exitosamente",
      buk_details: {
        buk_candidate_id: newCandidateId,
        sync_timestamp: new Date().toISOString()
      },
      candidate: newCandidate
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error procesando el payload de la extensión."
    }, { status: 500 });
  }
}
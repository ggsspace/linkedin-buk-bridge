import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Company-Code',
};

global.bukCandidatesDatabase = global.bukCandidatesDatabase || [
  {
    id: "BUK-774921",
    first_name: "Andrés Felipe",
    last_name: "Hincapié",
    email: "andres.hincapie@example.com",
    phone: "3001234567",
    job_posting_id: "VAC-3924",
    job_title: "Practicante de Contratación Pública",
    location: { country: "Colombia", city: "Medellín" },
    stage: { id: "stage_applied", name: "Postulantes" },
    created_at: new Date().toISOString()
  }
];

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
  const formattedCandidates = global.bukCandidatesDatabase.map(item => ({
    id: item.id,
    fullName: `${item.first_name} ${item.last_name}`,
    email: item.email,
    phone: item.phone,
    role: item.job_title || "Practicante de Contratación",
    score: "5.0",
    country: item.location?.country || "Colombia",
    city: item.location?.city || "Medellín"
  }));

  return NextResponse.json({
    data: formattedCandidates,
    pagination: { total: formattedCandidates.length, page: 1 }
  }, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, country, city, resumeUrl, jobId } = body;

    // 1. Validar que no se envíe ningún campo vacío
    if (!fullName || !email || !phone || !country || !city || !resumeUrl) {
      return NextResponse.json({
        error: { code: "UNPROCESSABLE_ENTITY", message: "Error BUK: Todos los campos del postulante son obligatorios." }
      }, { status: 422, headers: corsHeaders });
    }

    // 2. Validar que nombres y apellidos no tengan números
    if (/\d/.test(fullName)) {
      return NextResponse.json({
        error: { code: "UNPROCESSABLE_ENTITY", message: "Error BUK: Los nombres y apellidos no pueden contener números." }
      }, { status: 422, headers: corsHeaders });
    }

    // 3. Validar que el teléfono sea estrictamente numérico
    if (!/^\d+$/.test(phone)) {
      return NextResponse.json({
        error: { code: "UNPROCESSABLE_ENTITY", message: "Error BUK: El formato del teléfono debe ser puramente numérico." }
      }, { status: 422, headers: corsHeaders });
    }

    // 4. NUEVA VALIDACIÓN SERVIDORES: País y Ciudad no pueden contener números
    if (/\d/.test(country) || /\d/.test(city)) {
      return NextResponse.json({
        error: { code: "UNPROCESSABLE_ENTITY", message: "Error BUK: Los campos geográficos (País y Ciudad) no pueden contener números." }
      }, { status: 422, headers: corsHeaders });
    }

    // 5. Regla de Negocio BUK: Vacante restringida exclusivamente a Colombia
    if (!country.toLowerCase().includes('colombia')) {
      return NextResponse.json({
        error: { 
          code: "BUSINESS_RULE_VIOLATION", 
          message: `Rechazado por BUK Engine: El candidato pertenece a '${country}' (${city}) y la vacante VAC-3924 solo acepta residentes en Colombia.` 
        }
      }, { status: 422, headers: corsHeaders });
    }

    const nameParts = fullName.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ');

    const bukCandidateId = `BUK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCandidateRecord = {
      id: bukCandidateId,
      first_name,
      last_name,
      email,
      phone,
      job_posting_id: jobId || "VAC-3924",
      job_title: "Practicante de Contratación Pública",
      location: { country, city },
      stage: { id: "stage_applied", name: "Postulantes" },
      resume_url: resumeUrl,
      created_at: new Date().toISOString()
    };

    global.bukCandidatesDatabase.unshift(newCandidateRecord);

    return NextResponse.json({
      success: true,
      message: "Candidato indexado correctamente en el sistema BUK.",
      data: {
        id: bukCandidateId,
        fullName: `${first_name} ${last_name}`,
        email,
        phone,
        country,
        city
      }
    }, { status: 201, headers: corsHeaders });

  } catch (err) {
    return NextResponse.json({
      error: { code: "INTERNAL_SERVER_ERROR", message: "Error interno procesando en BUK API." }
    }, { status: 500, headers: corsHeaders });
  }
}
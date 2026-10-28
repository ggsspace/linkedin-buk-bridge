import { NextResponse } from 'next/server';
import { z } from 'zod';

// Esquema de validación estricto (Zod) según el contrato de datos de LinkedIn
const candidateSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(7, "Teléfono inválido"),
  jobId: z.string().min(1, "El ID de la vacante es requerido"),
  country: z.string().min(2, "El país es requerido"),
  city: z.string().min(2, "La ciudad es requerida"),
  resumeUrl: z.string().url("URL del CV inválida")
});

export async function POST(request) {
  try {
    // 1. Simulación de verificación de firma de seguridad del Webhook
    const linkedinSignature = request.headers.get('x-linkedin-signature');
    
    // 2. Recepción del Payload enviado por LinkedIn (o por el simulador)
    const body = await request.json();

    // 3. Validación de estructura con Zod
    const validation = candidateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Datos de postulación incompletos o malformados", 
          errors: validation.error.format() 
        },
        { status: 400 }
      );
    }

    const candidateData = validation.data;

    // 4. Regla de Negocio Ceiba: Filtro geográfico exclusivo para Colombia
    if (candidateData.country.toLowerCase() !== 'colombia') {
      return NextResponse.json(
        { 
          status: "rejected", 
          message: `Postulación no procesada: La vacante ${candidateData.jobId} es exclusiva para candidatos en Colombia.` 
        },
        { status: 422 }
      );
    }

    // 5. Normalización y Estandarización de datos
    const normalizedData = {
      ...candidateData,
      fullName: candidateData.fullName.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      processedAt: new Date().toISOString()
    };

    // 6. Registro simulado en la API de BUK
    const bukCandidateId = `BUK-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json(
      {
        status: "success",
        message: "Candidato transferido e integrado exitosamente en BUK",
        webhook_source: linkedinSignature ? "LinkedIn Recruiter API Real" : "LinkedIn Webhook Simulator",
        buk_details: {
          buk_candidate_id: bukCandidateId,
          stage: "Postulantes",
          status: "Registrado",
          sync_timestamp: normalizedData.processedAt
        },
        candidate: normalizedData
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Error interno del Middleware: " + error.message },
      { status: 500 }
    );
  }
}



/*import { NextResponse } from 'next/server';

export async function POST(request) {
  const startTime = Date.now();

  try {
    const data = await request.json();

    // Tarea 1: Validación de campos requeridos
    const { fullName, email, phone, jobId, country, city, resumeUrl } = data;

    if (!fullName || !email || !phone || !jobId || !country || !city || !resumeUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Fallo en la validación: faltan campos obligatorios requeridos por BUK.",
        },
        { status: 400 }
      );
    }

    // Regla de negocio: Restricción geográfica (Sólo Colombia)
    if (country.toLowerCase() !== 'colombia' && country.toLowerCase() !== 'col') {
      return NextResponse.json(
        {
          success: false,
          error: "Postulación rechazada: la vacante aplica únicamente para residentes en Colombia.",
        },
        { status: 422 }
      );
    }

    // Tarea 1: Mapeo y Transformación (Separar nombres y apellidos para BUK)
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "No especificado";

    const bukPayload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      job_id: jobId,
      location: `${city}, ${country}`,
      resume_url: resumeUrl,
      source: "LinkedIn",
      applied_at: new Date().toISOString()
    };

    // Tarea 2: Consumo interno del Mock / API de BUK mediante fetch
    const host = request.headers.get("origin") || "http://localhost:3000";
    const response = await fetch(`${host}/api/mock-buk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bukPayload),
    });

    const bukResponse = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: "Postulación procesada y registrada exitosamente en BUK sin intervención manual.",
        processing_time_ms: Date.now() - startTime,
        buk_details: bukResponse
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Error interno en el middleware al procesar la postulación.",
        details: error.message
      },
      { status: 500 }
    );
  }
}*/
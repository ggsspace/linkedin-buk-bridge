import { NextResponse } from 'next/server';

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
}
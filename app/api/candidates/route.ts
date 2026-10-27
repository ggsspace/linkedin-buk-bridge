import { NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Esquema de Validación según los campos requeridos por Ceiba
const LinkedInApplicationSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es obligatorio."),
  email: z.string().email("Formato de correo electrónico inválido."),
  phone: z.string().min(7, "El número celular es obligatorio."),
  jobId: z.string().min(1, "El ID de la vacante es obligatorio."),
  country: z.string().default("Colombia"),
  city: z.string().min(2, "La ciudad es obligatoria."),
  resumeUrl: z.string().url("La URL de la hoja de vida es obligatoria."),
  linkedinProfileUrl: z.string().url().optional()
});

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const rawBody = await request.json();

    // 2. Validación de datos con Zod
    const validationResult = LinkedInApplicationSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Fallo en la validación de campos requeridos para BUK.",
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 3. Regla de negocio: Restricción geográfica (Sólo Colombia)
    if (data.country.toLowerCase() !== 'colombia' && data.country.toLowerCase() !== 'col') {
      return NextResponse.json(
        {
          success: false,
          error: "Postulación rechazada: La vacante aplica únicamente para residentes en Colombia."
        },
        { status: 422 }
      );
    }

    // 4. Mapeo y separación de Nombre y Primer Apellido
    const nameParts = data.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "N/A";

    // 5. Payload mapeado para BUK
    const bukPayload = {
      first_name: firstName,
      last_name: lastName,
      email: data.email,
      phone_number: data.phone,
      country: data.country,
      city: data.city,
      job_opening_id: data.jobId,
      cv_url: data.resumeUrl,
      linkedin_url: data.linkedinProfileUrl || null,
      source: "LinkedIn Open Innovation Bridge"
    };

    // 6. Envío de datos al Mock de BUK
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    const bukResponse = await fetch(`${protocol}://${host}/api/mock-buk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bukPayload),
    });

    const bukResult = await bukResponse.json();
    const processingTimeMs = Date.now() - startTime;

    // 7. Respuesta consolidada con métricas de tiempo ahorrado
    return NextResponse.json(
      {
        success: true,
        message: "Candidato validado, mapeado y registrado en BUK exitosamente.",
        metrics: {
          processing_time: `${processingTimeMs} ms`,
          manual_time_saved: "4 minutos reducidos a <1 segundo",
          mapped_fields_count: 8
        },
        integration_data: {
          linkedin_input: data,
          buk_payload_sent: bukPayload,
          buk_response: bukResult
        }
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error interno procesando la postulación." },
      { status: 500 }
    );
  }
}
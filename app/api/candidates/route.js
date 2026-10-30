import { NextResponse } from 'next/server';

let candidatesStorage = [];

export async function GET() {
  return NextResponse.json({ success: true, data: candidatesStorage });
}

export async function POST(request) {
  try {
    const body = await request.json();

    // 🛑 REGLA DE NEGOCIO EN BACKEND: Filtrado geográfico estricto para VAC-3924
    const country = (body.country || '').trim().toLowerCase();
    if (country !== 'colombia') {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: `Candidato no apto: La vacante VAC-3924 solo admite candidatos en Colombia. País recibido: ${body.country}` } 
        },
        { status: 422 } // Unprocessable Entity
      );
    }

    const newCandidate = {
      id: `CAND-${Date.now()}`,
      fullName: body.fullName || `${body.firstName || ''} ${body.lastName || ''}`.trim(),
      headline: body.headline || '',
      country: body.country,
      city: body.city || '',
      experience: body.experience || [],
      education: body.education || [],
      skills: body.skills || [],
      resumeUrl: body.resumeUrl || '',
      createdAt: new Date().toISOString()
    };

    candidatesStorage.unshift(newCandidate);

    return NextResponse.json(
      { success: true, message: 'Candidato guardado exitosamente en BUK', data: newCandidate },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
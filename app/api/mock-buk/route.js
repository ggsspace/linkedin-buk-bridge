import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    // Simula una respuesta exitosa del servidor de BUK generando un ID único
    const randomId = Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json(
      {
        status: 'success',
        buk_candidate_id: `BUK-${randomId}`,
        message: 'Candidato registrado exitosamente en el módulo de Selección de BUK.',
        received_at: new Date().toISOString(),
        candidate_summary: body
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Error interno en el servidor BUK simulado.' },
      { status: 500 }
    );
  }
}









/*import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simula una respuesta exitosa del servidor de BUK
    return NextResponse.json(
      {
        status: 'success',
        buk_candidate_id: `BUK-${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'Candidato registrado exitosamente en el módulo de Selección de BUK.',
        received_at: new Date().toISOString(),
        candidate_summary: body
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Error interno en el servidor BUK simulado.' },
      { status: 500 }
    );
  }
}*/
import { NextResponse } from 'next/server';

// Función auxiliar para eliminar etiquetas HTML y espacios sobrantes
function cleanHtml(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

export async function POST(request) {
    try {
        const body = await request.json();

        // 1. Limpieza de campos de texto por si traen HTML o espacios extra
        const fullName = cleanHtml(body.fullName);
        const firstName = cleanHtml(body.firstName);
        const lastName = cleanHtml(body.lastName);
        const about = cleanHtml(body.about);
        const country = cleanHtml(body.country);
        const email = cleanHtml(body.email) || 'No se registró correo';

        // 2. Validación de campos obligatorios
        if (!fullName || !country || !body.resumeUrl) {
            return NextResponse.json(
                { success: false, error: { message: 'Faltan campos obligatorios (Nombre, País o URL).' } },
                { status: 400 }
            );
        }

        // 3. Validación estricta de la regla de negocio para la vacante VAC-3924
        if (country.toLowerCase() !== 'colombia') {
            return NextResponse.json(
                { success: false, error: { message: `Rechazado: La vacante es solo para Colombia. País detectado: ${country}` } },
                { status: 422 }
            );
        }

        // Simulación de guardado exitoso (aquí es donde luego conectaras tu base de datos o BUK real)
        const candidateRecord = {
            id: Math.floor(Math.random() * 10000),
            fullName,
            firstName,
            lastName,
            country,
            city: cleanHtml(body.city),
            headline: cleanHtml(body.headline),
            about,
            email,
            experience: (body.experience || []).map(exp => cleanHtml(exp)),
            education: (body.education || []).map(edu => cleanHtml(edu)),
            resumeUrl: body.resumeUrl,
            jobId: body.jobId || 'VAC-3924',
            createdAt: new Date().toISOString()
        };

        console.log('✅ Candidato procesado y limpio con éxito:', candidateRecord);

        return NextResponse.json(
            { success: true, message: 'Candidato guardado correctamente', data: candidateRecord },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, error: { message: error.message } },
            { status: 500 }
        );
    }
}
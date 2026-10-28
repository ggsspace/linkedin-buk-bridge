document.getElementById('extractBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractLinkedInData
    }, (results) => {
        if (results && results[0] && results[0].result) {
        const data = results[0].result;
        
        // Asignar el nombre extraído o fallback
        document.getElementById('fullName').value = data.fullName || "Daniela Pérez Agualimpia";
        if (data.country) document.getElementById('country').value = data.country;
        if (data.city) document.getElementById('city').value = data.city;
        
        // Si el correo está vacío, genera uno basado en el nombre real
        if (!data.email) {
            const cleanName = (data.fullName || "daniela.perez").toLowerCase().replace(/\s+/g, '.');
            document.getElementById('email').value = `${cleanName}@gmail.com`;
        } else {
            document.getElementById('email').value = data.email;
        }

        document.getElementById('resumeUrl').value = data.url || tab.url;
        
        showStatus('¡Perfil real extraído con éxito!', 'success');
        } else {
        showStatus('Uso de valores de respaldo para el perfil activo.', 'success');
        }
    });
    });

    // Función de extracción ejecutada en el DOM de LinkedIn
    function extractLinkedInData() {
    const url = window.location.href;
    let fullName = '';
    let country = 'Colombia';
    let city = 'Medellín';
    let email = '';

    // 1. Intento 1: Buscar en el H1 principal
    const h1 = document.querySelector('h1');
    if (h1 && h1.innerText.trim()) {
        fullName = h1.innerText.trim().split('\n')[0];
    }

    // 2. Intento 2: Si H1 falla, extraer del título del navegador (ej: "Daniela Pérez Agualimpia | LinkedIn")
    if (!fullName || fullName.length < 3) {
        const pageTitle = document.title;
        if (pageTitle && pageTitle.includes('|')) {
        fullName = pageTitle.split('|')[0].trim();
        } else if (pageTitle && pageTitle.includes('-')) {
        fullName = pageTitle.split('-')[0].trim();
        }
    }

    // 3. Extraer ubicación
    const bodyText = document.body.innerText;
    if (bodyText.includes('Medellín')) city = 'Medellín';
    if (bodyText.includes('Bogotá')) city = 'Bogotá';
    if (bodyText.includes('Cali')) city = 'Cali';

    return { fullName, country, city, email, url };
    }

    // Botón para enviar la data a tu Middleware local en Next.js
    document.getElementById('sendBtn').addEventListener('click', async () => {
    const payload = {
        fullName: document.getElementById('fullName').value || "Daniela Pérez Agualimpia",
        email: document.getElementById('email').value || "daniela.perez@example.com",
        phone: document.getElementById('phone').value || "+573101234567",
        jobId: "VAC-3924",
        country: document.getElementById('country').value || "Colombia",
        city: document.getElementById('city').value || "Medellín",
        resumeUrl: document.getElementById('resumeUrl').value || "https://linkedin.com/in/danielaperezagualimpia"
    };

    showStatus('Enviando candidato a BUK...', 'success');

    try {
        const response = await fetch('http://localhost:3000/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.status === 201) {
        showStatus(`✅ ¡Registrado en BUK con éxito!\nCandidate ID: ${result.buk_details.buk_candidate_id}`, 'success');
        } else {
        showStatus(`❌ Filtro de negocio (${response.status}):\n${result.message}`, 'error');
        }
    } catch (err) {
        showStatus('Asegúrate de que Next.js esté corriendo en http://localhost:3000', 'error');
    }
    });

    function showStatus(msg, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = msg;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
}
document.getElementById('extractBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractLinkedInData
    }, (results) => {
        if (results && results[0] && results[0].result) {
        const data = results[0].result;
        
        if (data.fullName) document.getElementById('fullName').value = data.fullName;
        if (data.country) document.getElementById('country').value = data.country;
        if (data.city) document.getElementById('city').value = data.city;
        if (data.email) document.getElementById('email').value = data.email;
        document.getElementById('resumeUrl').value = data.url || tab.url;
        
        showStatus('¡Datos extraídos con éxito!', 'success');
        } else {
        showStatus('No se pudieron extraer datos automáticamente. Puedes completarlos manualmente.', 'error');
        }
    });
    });

    // Función de extracción mejorada con múltiples selectores
    function extractLinkedInData() {
    const url = window.location.href;
    let fullName = '';
    let country = 'Colombia';
    let city = 'Medellín';
    let email = '';

    // 1. Extraer Nombre Completo (Prueba varias etiquetas comunes de LinkedIn)
    const nameSelectors = [
        'h1.text-heading-xlarge',
        'h1',
        '.pv-text-details__left-panel h1',
        '.top-card-layout__title'
    ];

    for (const selector of nameSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText.trim()) {
        fullName = el.innerText.trim();
        break;
        }
    }

    // 2. Extraer Ubicación / País / Ciudad
    const locationSelectors = [
        '.text-body-small.inline.t-black--light.break-words',
        '.pv-text-details__left-panel .text-body-small',
        '.top-card__subline-item',
        'span.text-body-small'
    ];

    for (const selector of locationSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText.trim()) {
        const locText = el.innerText.trim();
        if (locText.includes(',')) {
            const parts = locText.split(',');
            city = parts[0].trim();
            country = parts[parts.length - 1].trim();
        } else if (locText.length > 2 && !locText.includes('contacto')) {
            country = locText;
        }
        break;
        }
    }

    return { fullName, country, city, email, url };
    }

    // Botón para enviar la data extraída a tu Middleware de Next.js
    document.getElementById('sendBtn').addEventListener('click', async () => {
    const payload = {
        fullName: document.getElementById('fullName').value || "Daniela Pérez Agualimpia",
        email: document.getElementById('email').value || "daniela.perez@example.com",
        phone: document.getElementById('phone').value || "+573101234567",
        jobId: "VAC-3924",
        country: document.getElementById('country').value || "Colombia",
        city: document.getElementById('city').value || "Medellín",
        resumeUrl: document.getElementById('resumeUrl').value || window.location.href
    };

    showStatus('Enviando a Middleware...', 'success');

    try {
        const response = await fetch('http://localhost:3000/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.status === 201) {
        showStatus(`✅ Creado en BUK exitosamente!\nID: ${result.buk_details.buk_candidate_id}`, 'success');
        } else {
        showStatus(`❌ Rechazado (${response.status}):\n${result.message}`, 'error');
        }
    } catch (err) {
        showStatus('Error al conectar con el Middleware local (http://localhost:3000). Asegúrate de que esté encendido.', 'error');
    }
    });

    function showStatus(msg, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = msg;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
}
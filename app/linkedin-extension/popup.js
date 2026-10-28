
document.getElementById('extractBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    showStatus('Leyendo datos de LinkedIn...', 'success');

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractLinkedInData
    }, (results) => {
        if (results && results[0] && results[0].result) {
        const data = results[0].result;
        
        let cleanName = (data.fullName || "").replace(/^\(\d+\)\s*/, '').trim();
        
        if (!cleanName || cleanName === "LinkedIn") {
            const titleParts = (tab.title || "").split('|')[0].split('-')[0].trim();
            cleanName = titleParts.replace(/^\(\d+\)\s*/, '').trim() || "William Park";
        }

        document.getElementById('fullName').value = cleanName;
        document.getElementById('country').value = data.country || "Estados Unidos";
        document.getElementById('city').value = data.city || "Nueva York";

        if (data.country && data.country.toLowerCase().includes('colombia')) {
            document.getElementById('phone').value = "3001234567";
        } else {
            document.getElementById('phone').value = "15550192837";
        }
        
        const normalizedEmailName = cleanName
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '.');

        document.getElementById('email').value = `${normalizedEmailName}@gmail.com`;
        document.getElementById('resumeUrl').value = data.url || tab.url;
        
        showStatus(`✅ Perfil extraído: ${data.city}, ${data.country}`, 'success');
        } else {
        showStatus('❌ No se pudo conectar con la página activa.', 'error');
        }
    });
    });

    function extractLinkedInData() {
    let fullName = '';
    let country = 'Estados Unidos';
    let city = 'Nueva York';

    const h1 = document.querySelector('h1');
    if (h1 && h1.innerText.trim()) {
        fullName = h1.innerText.trim().split('\n')[0];
    }

    if (!fullName || fullName.length < 2) {
        const pageTitle = document.title || '';
        if (pageTitle.includes('|')) fullName = pageTitle.split('|')[0];
        else if (pageTitle.includes('-')) fullName = pageTitle.split('-')[0];
    }

    const topCard = document.querySelector('main') || document.body;
    const pageText = topCard ? topCard.innerText : '';

    if (pageText.includes('Colombia') || pageText.includes('Medellín') || pageText.includes('Bogotá') || pageText.includes('Cali')) {
        country = 'Colombia';
        if (pageText.includes('Medellín')) city = 'Medellín';
        else if (pageText.includes('Bogotá')) city = 'Bogotá';
        else if (pageText.includes('Cali')) city = 'Cali';
        else city = 'Colombia';
    } else if (pageText.includes('Nueva York') || pageText.includes('United States') || pageText.includes('Estados Unidos') || pageText.includes('US Capital')) {
        country = 'Estados Unidos';
        city = 'Nueva York';
    } else if (pageText.includes('España') || pageText.includes('Madrid') || pageText.includes('Barcelona')) {
        country = 'España';
        city = pageText.includes('Barcelona') ? 'Barcelona' : 'Madrid';
    }

    fullName = fullName.replace(/^\(\d+\)\s*/, '').trim();

    return { fullName, country, city, url: window.location.href };
    }

    // Botón "Sincronizar a BUK" - Incluye la validación de NO NÚMEROS en campos geográficos
    document.getElementById('sendBtn').addEventListener('click', async () => {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const country = document.getElementById('country').value.trim();
    const city = document.getElementById('city').value.trim();
    const resumeUrl = document.getElementById('resumeUrl').value.trim();

    // 1. Campos obligatorios completos
    if (!fullName || !email || !phone || !country || !city || !resumeUrl) {
        showStatus('Error: Todos los campos son obligatorios.', 'error');
        return;
    }

    // 2. Nombre sin números
    if (/\d/.test(fullName)) {
        showStatus('Error: El nombre y apellido no pueden contener números.', 'error');
        return;
    }

    // 3. Teléfono puramente numérico
    if (!/^\d+$/.test(phone)) {
        showStatus('Error: El teléfono debe contener únicamente números.', 'error');
        return;
    }

    // 4. NUEVA VALIDACIÓN: País y Ciudad NO pueden contener números
    if (/\d/.test(country) || /\d/.test(city)) {
        showStatus('Error: Los campos geográficos (País/Ciudad) no pueden contener números.', 'error');
        return;
    }

    const payload = { fullName, email, phone, jobId: "VAC-3924", country, city, resumeUrl };

    showStatus('Enviando a BUK...', 'success');

    try {
        const response = await fetch('http://localhost:3000/api/candidates', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Company-Code': 'CEIBA-COL'
        },
        body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.status === 201) {
        showStatus(`¡Registrado en BUK con éxito!\nID: ${result.data?.id}`, 'success');
        } else if (response.status === 422) {
        const errorMsg = result.error?.message || 'Rechazado por regla de negocio BUK';
        showStatus(`RECHAZADO POR BUK (422):\n${errorMsg}`, 'error');
        } else {
        showStatus(`Error (${response.status}):\n${result.error?.message || 'Error en BUK'}`, 'error');
        }
    } catch (err) {
        showStatus('Fallo de conexión con Next.js (http://localhost:3000)', 'error');
    }
    });

    function showStatus(msg, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = msg;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
}

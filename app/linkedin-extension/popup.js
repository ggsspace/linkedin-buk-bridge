document.addEventListener('DOMContentLoaded', () => {
    const extractBtn = document.getElementById('extractBtn');
    const sendBtn = document.getElementById('sendBtn');

    if (extractBtn) extractBtn.addEventListener('click', extractDataFromLinkedIn);
    if (sendBtn) sendBtn.addEventListener('click', sendDataToBuk);
});

async function extractDataFromLinkedIn() {
    showStatus('⏳ Desplazando y cargando secciones de LinkedIn...', 'success');

    // Limpieza previa de campos para no heredar datos anteriores
    resetFormFields();

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.url.includes('linkedin.com')) {
            showStatus('❌ Abre un perfil activo de LinkedIn.', 'error');
            return;
        }

        // 1. EJECUTAR EL SCROLL AVANZADO PASO A PASO PARA FORZAR EL LAZY LOADING
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: async () => {
                const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                const pageHeight = () =>
                    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                
                const maxScroll = () => Math.max(0, pageHeight() - window.innerHeight);
                const goTo = (y) => window.scrollTo({ top: y, behavior: 'instant' });
                
                const STEP = Math.round(window.innerHeight * 0.6); 
                const STEP_DELAY = 500;      
                const BOTTOM_DELAY = 2000;   
                const STABLE_ROUNDS = 3;     
                const MAX_TOTAL_MS = 60000;  
                const startTime = Date.now();
                const hasTime = () => Date.now() - startTime < MAX_TOTAL_MS;

                // 1. Recorrido lento, paso a paso, desde arriba hasta el fondo
                goTo(0);
                await sleep(600);
                let y = 0;
                while (y < maxScroll() && hasTime()) {
                    y = Math.min(y + STEP, maxScroll());
                    goTo(y);
                    await sleep(STEP_DELAY);
                }

                // 2. Insistir en el fondo
                let stable = 0;
                let lastHeight = pageHeight();
                while (stable < STABLE_ROUNDS && hasTime()) {
                    goTo(Math.max(0, maxScroll() - STEP));
                    await sleep(400);
                    goTo(maxScroll());
                    await sleep(BOTTOM_DELAY);
                    const currentHeight = pageHeight();
                    if (currentHeight === lastHeight) {
                        stable++;
                    } else {
                        stable = 0;
                        lastHeight = currentHeight;
                    }
                }

                // 3. Volver al inicio
                for (let i = 0; i < 3 && window.scrollY > 5; i++) {
                    goTo(0);
                    await sleep(500);
                }
                await sleep(500);
                return true;
            }
        });

        showStatus('Extrayendo datos de la página...', 'success');

        // 2. EXTRAER LOS DATOS CON LOS SELECTORES ESTABLES QUE LOGRAMOS
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: inyectedExtractionScript
        });

        if (results && results[0] && results[0].result) {
            const data = results[0].result;

            // Desglose de Nombres y Apellidos
            const parsedName = parseFullName(data.fullName || '');

            setInputValue('firstName', parsedName.firstName);
            setInputValue('middleName', parsedName.middleName);
            setInputValue('lastName', parsedName.lastName);
            setInputValue('secondLastName', parsedName.secondLastName);

            setInputValue('country', data.country || '');
            setInputValue('city', data.city || '');
            setInputValue('headline', data.headline || '');
            setInputValue('about', data.about || '');
            setInputValue('experience', (data.experience || []).join('\n'));
            setInputValue('education', data.education || ''); // Campo Universidad / Institución
            setInputValue('phone', data.phone || '');
            setInputValue('resumeUrl', data.url || tab.url);

            showStatus(`✅ Extraído: ${data.fullName} (${data.country || 'Desconocido'})`, 'success');
        } else {
            showStatus('❌ No se obtuvieron datos de la página.', 'error');
        }
    } catch (err) {
        showStatus('❌ Error al ejecutar extracción: ' + err.message, 'error');
    }
}

// Algoritmo de división limpia para nombres y apellidos
function parseFullName(rawName) {
    const parts = rawName.trim().split(/\s+/).filter(Boolean);
    let firstName = '';
    let middleName = '';
    let lastName = '';
    let secondLastName = '';

    if (parts.length === 1) {
        firstName = parts[0];
    } else if (parts.length === 2) {
        firstName = parts[0];
        lastName = parts[1];
    } else if (parts.length === 3) {
        firstName = parts[0];
        lastName = parts[1];
        secondLastName = parts[2];
    } else if (parts.length >= 4) {
        firstName = parts[0];
        middleName = parts[1];
        lastName = parts[2];
        secondLastName = parts.slice(3).join(' ');
    }

    return { firstName, middleName, lastName, secondLastName };
}

// Función inyectada que ejecuta la extracción dentro del DOM de LinkedIn
function inyectedExtractionScript() {
    let fullName = '';
    let headline = '';
    let country = '';
    let city = '';
    let about = '';

    // Helper de limpieza
    const clean = (el) => (el ? el.textContent : '').replace(/\s+/g, ' ').trim();

    // 1. NOMBRE COMPLETO
    const nameEl = document.querySelector('h2.b0ak37') || 
                   document.querySelector('h1') || 
                   document.querySelector('h2.b0ak8d');

    if (nameEl && nameEl.innerText.trim()) {
        fullName = nameEl.innerText.trim().split('\n')[0];
    }

    if (!fullName || fullName.toLowerCase().includes('linkedin')) {
        const docTitle = document.title || '';
        fullName = docTitle.split('|')[0].split('-')[0].trim();
    }

    // 2. TITULAR / HEADLINE
    const headlineEl = document.querySelector('p.b0ak3v') || 
                       document.querySelector('.text-body-medium.break-words') ||
                       document.querySelector('.pv-text-details__left-panel .text-body-medium');

    if (headlineEl && headlineEl.innerText.trim()) {
        headline = headlineEl.innerText.trim();
    }

    // 3. UBICACIÓN
    let locationText = '';
    const allElements = Array.from(document.querySelectorAll('a, span, div'));
    const contactInfoElement = allElements.find(el => {
        const txt = el.innerText ? el.innerText.trim().toLowerCase() : '';
        return txt === 'información de contacto' || txt === 'contact info';
    });

    if (contactInfoElement) {
        const parentLine = contactInfoElement.closest('div') || contactInfoElement.parentElement;
        if (parentLine) {
            let rawText = parentLine.innerText || '';
            rawText = rawText.replace(/información de contacto/gi, '')
                             .replace(/contact info/gi, '')
                             .replace(/·/g, '')
                             .trim();
            if (rawText) locationText = rawText.split('\n')[0].trim();
        }
    }

    if (locationText) {
        const parts = locationText.split(',').map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length === 1) {
            country = parts[0];
            city = parts[0];
        } else if (parts.length >= 2) {
            city = parts[0];
            country = parts[parts.length - 1];
        }
    }

    // 4. RESUMEN PROFESIONAL / ACERCA DE
    const sections = Array.from(document.querySelectorAll('section, div.b0alro'));
    sections.forEach(sec => {
        const h2 = sec.querySelector('h2');
        if (!h2) return;
        const title = h2.innerText.trim().toLowerCase();

        if (title.startsWith('acerca de') || title.startsWith('about')) {
            const content = sec.querySelector('.inline-show-more-text') || sec;
            about = content.innerText.replace(/acerca de|about/gi, '').trim();
        }
    });

    // 5. EDUCACIÓN Y EXPERIENCIA (Con los selectores que ya afinamos)
    const findSection = (key, titles) => {
        const h2 =
            document.querySelector(`h2[componentkey="ProfileNullStateCardAnchor_${key}"]`) ||
            [...document.querySelectorAll('h2')].find((h) => titles.includes(clean(h)));
        return h2 ? h2.closest('section') || h2.closest('div.b0alro') || h2.parentElement : null;
    };

    // EDUCACIÓN: primer <p> de la sección = primera institución
    const eduSection = findSection('Education', ['Educación', 'Education']);
    const university = clean(eduSection && eduSection.querySelector('p'));

    // EXPERIENCIA: por ítem, 1ª <p> = cargo, 2ª <p> = empresa
    const expSection = findSection('Experience', ['Experiencia', 'Experience']);
    const experience = expSection
        ? [...expSection.querySelectorAll('[componentkey^="entity-collection-item"]')]
            .map((item) => {
                const ps = [...item.querySelectorAll('p')].filter(
                    (p) => !p.querySelector('[data-testid="expandable-text-box"]')
                );
                const cargo = clean(ps[0]);
                const empresa = clean(ps[1]);
                return cargo && empresa ? `${cargo} en ${empresa}` : '';
            })
            .filter(Boolean)
        : [];

    fullName = fullName.replace(/^\(\d+\)\s*/, '').trim();

    return {
        fullName,
        headline,
        country,
        city,
        about,
        experience,
        education: university,
        url: window.location.href
    };
}

// Envío a Next.js / BUK
async function sendDataToBuk() {
    const firstName = getInputValue('firstName');
    const middleName = getInputValue('middleName');
    const lastName = getInputValue('lastName');
    const secondLastName = getInputValue('secondLastName');

    const fullName = [firstName, middleName, lastName, secondLastName].filter(Boolean).join(' ');
    const country = getInputValue('country').trim();
    const city = getInputValue('city');
    const resumeUrl = getInputValue('resumeUrl');

    if (!fullName || !country || !resumeUrl) {
        showStatus('❌ Faltan campos obligatorios (Nombre, País, URL).', 'error');
        return;
    }

    // 🛑 VALIDACIÓN DE NEGOCIO ESTRICTA PARA VAC-3924 (Solo Colombia)
    if (country.toLowerCase() !== 'colombia') {
        showStatus(`❌ RECHAZADO: La vacante VAC-3924 es exclusiva para candidatos en Colombia.\nPaís detectado: "${country}".`, 'error');
        return;
    }

    const payload = {
        fullName,
        firstName,
        middleName,
        lastName,
        secondLastName,
        headline: getInputValue('headline'),
        country,
        city,
        about: getInputValue('about'),
        experience: getInputValue('experience').split('\n').filter(Boolean),
        education: [getInputValue('education')].filter(Boolean),
        resumeUrl,
        jobId: 'VAC-3924'
    };

    showStatus('Sincronizando con BUK...', 'success');

    try {
        const res = await fetch('http://localhost:3000/api/candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.status === 201) {
            showStatus(`✅ ¡Candidato guardado en BUK!\nID: ${result.data?.id}`, 'success');
        } else {
            showStatus(`❌ Error BUK (${res.status}): ${result.error?.message || 'Error al guardar'}`, 'error');
        }
    } catch (err) {
        showStatus('❌ Fallo de conexión con Next.js (http://localhost:3000)', 'error');
    }
}

function resetFormFields() {
    ['firstName', 'middleName', 'lastName', 'secondLastName', 'headline', 'country', 'city', 'phone', 'about', 'experience', 'education', 'resumeUrl'].forEach(id => {
        setInputValue(id, '');
    });
}

function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function showStatus(msg, type) {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        statusDiv.innerText = msg;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
    }
}
// background.js - V14.0 MeridIAn Intelligence
const MODEL = "gemini-2.0-flash-exp";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze') {
        runGhostSDR(request.data).then(sendResponse);
        return true; 
    }
});

async function runGhostSDR(profile) {
    const { apiKey, icp } = await chrome.storage.sync.get(['apiKey', 'icp']);
    if (!apiKey) return { error: "No Key" };

    const prompt = `
    ROL: Ghost SDR MeridIAn. Eres un experto en inteligencia de ventas.
    
    ESTRATEGIA (PROMPT MAESTRO DEL BDR): 
    "${icp.promptTemplate}"

    TARGET CARGOS: ${icp.titles.join(', ')}

    VOLCADO DE TEXTO DEL PERFIL:
    "${profile.fullDump}"

    INSTRUCCIONES:
    1. Lee el volcado como un humano. Identifica el cargo y la empresa.
    2. Si el lead es CDO, CEO o Founder de una empresa tecnológica o logística, el MATCH es crítico (>90%).
    3. Usa estrictamente el PROMPT MAESTRO del BDR para calificar.
    4. Redacta el mensaje personalizado de contacto.

    OUTPUT JSON:
    { "score": number, "suggestedMessage": "string" }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { response_mime_type: "application/json" } })
        });
        const res = await response.json();
        return JSON.parse(res.candidates[0].content.parts[0].text);
    } catch (e) {
        return { error: e.message };
    }
}
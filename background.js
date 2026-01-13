// background.js - V18.5 MeridIAn Intelligence Engine
const MODEL = "gemini-2.0-flash-exp";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze') {
        runInsightLogic(request.data).then(sendResponse);
        return true; 
    }
});

async function runInsightLogic(profile) {
    const { apiKey, icp } = await chrome.storage.sync.get(['apiKey', 'icp']);
    if (!apiKey) return { error: "No Key" };

    const prompt = `
    ROL: Analista Estratégico MeridIAn.
    PROMPT MAESTRO BDR: "${icp.promptTemplate}"
    NUESTRA PV: "${icp.valueProp}"

    VOLCADO PERFIL: "${profile.fullDump}"

    TAREA:
    1. DNA PROFESIONAL: Identifica estilo de liderazgo y enfoque estratégico.
    2. DOLORES ESTRATÉGICOS: Deduce 3 dolores críticos basados en su sector y la PV.
    3. FOCO Y ACTIVIDAD: Frecuencia de interacción y temas que trata.
    4. MATCH SCORE (0-100): Compatibilidad con la estrategia del BDR.
    5. ÁNGULO DE ENTRADA: Gancho de apertura cruzando su perfil con nuestra PV.

    OUTPUT JSON ESTRICTO:
    { 
      "score": number, 
      "dna": "string", 
      "pains": [{"text": "string"}], 
      "activity": {"recency": "string", "context": "string"},
      "opportunity": "string" 
    }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }], 
                generationConfig: { response_mime_type: "application/json", temperature: 0.1 } 
            })
        });
        const resData = await response.json();
        return JSON.parse(resData.candidates[0].content.parts[0].text);
    } catch (e) {
        return { error: e.message };
    }
}
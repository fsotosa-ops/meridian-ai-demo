// background.js - V16.2 MeridIAn Intelligence Engine
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

    const systemPrompt = `
    ROL: Analista de Inteligencia de Negocios MeridIAn.
    ESTRATEGIA DEL BDR (PROMPT MAESTRO): "${icp.promptTemplate}"
    TARGET CARGOS: ${icp.titles.join(', ')}

    VOLCADO DE TEXTO DEL PERFIL: "${profile.fullDump}"

    TAREA: Analiza con profundidad para un BDR senior.
    1. MATCH SCORE: Calcula de 0 a 100 basado estrictamente en el PROMPT MAESTRO.
    2. DNA PROFESIONAL: Estilo de liderazgo y enfoque estratégico.
    3. DOLORES ESTRATÉGICOS: 3 dolores críticos deducidos de su sector y cargo.
    4. FOCO Y ACTIVIDAD: Frecuencia de interacción y temas de su contenido.
    5. ÁNGULO DE ENTRADA: La mejor forma de iniciar la conversación.

    OUTPUT JSON ESTRICTO:
    { 
      "score": number, 
      "dna": "string",
      "pains": [{"icon": "alert|trending|target", "text": "string"}],
      "activity": {"recency": "string", "context": "string"},
      "opportunity": "string"
    }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: systemPrompt }] }], 
                generationConfig: { response_mime_type: "application/json", temperature: 0.1 } 
            })
        });
        const resData = await response.json();
        return JSON.parse(resData.candidates[0].content.parts[0].text);
    } catch (e) {
        return { error: e.message };
    }
}
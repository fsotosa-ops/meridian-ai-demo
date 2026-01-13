// background.js - V15.0 MeridIAn Insight Engine
const MODEL = "gemini-2.0-flash-exp";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze') {
        runInsightInference(request.data).then(sendResponse);
        return true; 
    }
});

async function runInsightInference(profile) {
    const { apiKey, icp } = await chrome.storage.sync.get(['apiKey', 'icp']);
    if (!apiKey) return { error: "No Key" };

    const systemPrompt = `
    ROL: Ghost SDR MeridIAn. Experto en inteligencia de ventas y perfilamiento psicológico.
    
    ESTRATEGIA DEL BDR (PROMPT MAESTRO):
    "${icp.promptTemplate}"

    TARGET CARGOS: ${icp.titles.join(', ')}

    VOLCADO DE TEXTO DEL PERFIL (TOTAL VISION):
    "${profile.fullDump}"

    TAREA DE EXTRACCIÓN DE INSIGHTS:
    1. DETERMINAR SCORE: Calcula un Match Score (0-100) real comparando el volcado con el Prompt Maestro. No inventes el puntaje.
    2. DOLORES (PAIN POINTS): Identifica 3 dolores probables basados en su cargo actual y los desafíos del sector que menciona o infiere.
    3. CARACTERÍSTICAS: Define su perfil profesional (ej: "Líder técnico", "Orientado a resultados", "Estratega Digital").
    4. ACTIVIDAD RECIENTE: Busca en el texto indicios de fechas o publicaciones (ej. "hace 2 días", "compartió un artículo"). Indica la RECENCIA y los TEMAS sobre los que escribe regularmente.
    5. MENSAJE SNIPER: Redacta un mensaje que use la actividad reciente o un dolor detectado como gancho inicial.

    OUTPUT JSON ESTRICTO:
    { 
      "score": number, 
      "insights": {
        "painPoints": ["string"],
        "characteristics": "string",
        "activity": {
          "recency": "string",
          "topics": ["string"]
        }
      },
      "suggestedMessage": "string" 
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
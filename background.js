// background.js - Ghost SDR v2.0 - Intelligence Engine
const MODEL = "gemini-2.0-flash-exp";

// Cache para evitar búsquedas duplicadas
const searchCache = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze') {
        performDeepAnalysis(request.data).then(sendResponse);
        return true;
    }
    if (request.action === 'enrich') {
        enrichProfileData(request.data).then(sendResponse);
        return true;
    }
});

// Función de búsqueda web para enriquecimiento
async function searchWeb(query, apiKey) {
    // Usar cache si existe
    if (searchCache.has(query)) {
        return searchCache.get(query);
    }

    const searchPrompt = `
    Busca información adicional sobre: ${query}
    Extrae SOLO información relevante sobre:
    - Logros recientes de la empresa
    - Noticias o comunicados de prensa
    - Iniciativas de transformación digital
    - Problemas o desafíos mencionados públicamente
    - Tecnologías que están implementando
    
    Responde en formato JSON:
    { 
        "insights": ["insight1", "insight2", ...],
        "painPoints": ["pain1", "pain2", ...],
        "opportunities": ["opp1", "opp2", ...]
    }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: searchPrompt }] }], 
                generationConfig: { 
                    response_mime_type: "application/json",
                    temperature: 0.3 
                } 
            })
        });
        
        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);
        
        // Guardar en cache por 24 horas
        searchCache.set(query, result);
        setTimeout(() => searchCache.delete(query), 86400000);
        
        return result;
    } catch (e) {
        return { insights: [], painPoints: [], opportunities: [] };
    }
}

async function performDeepAnalysis(profile) {
    const { apiKey, icp } = await chrome.storage.sync.get(['apiKey', 'icp']);
    if (!apiKey) return { error: "No API Key configured" };

    // Extraer información clave del perfil
    const headerParts = profile.header.split('\n').filter(x => x.trim());
    const name = headerParts[0] || "Unknown";
    const title = headerParts[1] || "";
    const company = headerParts[2] || "";
    
    // Realizar búsqueda web enriquecida
    const webData = await searchWeb(`${name} ${company} ${title}`, apiKey);
    
    // Análisis profundo con contexto enriquecido
    const deepPrompt = `
    ## ROL: Ghost SDR Elite - Meridian Intelligence System
    
    ## CONTEXTO DEL ICP DEFINIDO POR EL USUARIO:
    - ESTRATEGIA MAESTRA: "${icp.promptTemplate || 'Identificar leads de alto valor en tecnología'}"
    - CARGOS OBJETIVO: ${icp.titles?.join(', ') || 'CEO, CDO, CTO, Founder, Director'}
    - INDUSTRIA: ${icp.industry?.join(', ') || 'Tecnología, Logística, SaaS'}
    - PAIN POINTS CLAVE: ${icp.signals?.painPoints?.join(', ') || 'transformación digital, automatización, eficiencia'}
    
    ## DATOS DEL PERFIL ANALIZADO:
    - NOMBRE: ${name}
    - CARGO ACTUAL: ${title}
    - EMPRESA: ${company}
    - RESUMEN PROFESIONAL: ${profile.about}
    - EXPERIENCIA RELEVANTE: ${profile.experience}
    
    ## INTELIGENCIA ADICIONAL (WEB RESEARCH):
    - INSIGHTS: ${webData.insights.join(', ')}
    - PAIN POINTS DETECTADOS: ${webData.painPoints.join(', ')}
    - OPORTUNIDADES: ${webData.opportunities.join(', ')}
    
    ## ANÁLISIS REQUERIDO:
    
    1. EVALUACIÓN DE CARGO:
       - ¿Es el cargo actual de nivel C-Suite o equivalente? (CEO, CTO, CDO, Founder, Co-Founder = ALTO VALOR)
       - ¿Es Director, VP o Head en área estratégica? (VALOR MEDIO-ALTO)
       - Chief Data Officer (CDO) = MÁXIMO VALOR (100)
       - Co-Founder en tecnología = MÁXIMO VALOR (95-100)
    
    2. EVALUACIÓN DE FIT CON ICP:
       - ¿La empresa opera en las industrias objetivo?
       - ¿El perfil muestra señales de los pain points identificados?
       - ¿Hay indicadores de presupuesto o autoridad de decisión?
    
    3. SEÑALES DE OPORTUNIDAD:
       - Cambios recientes de cargo (nuevos en posición = alta receptividad)
       - Menciones de transformación, innovación o mejora
       - Problemas específicos que tu solución puede resolver
    
    4. GENERACIÓN DE MENSAJE PERSONALIZADO:
       - Usar el nombre y empresa reales
       - Mencionar un insight específico de su perfil o empresa
       - Conectar con un pain point real identificado
       - Propuesta de valor clara y relevante
       - Call to action suave pero claro
    
    ## REGLAS DE SCORING:
    - CEO/Founder/Co-Founder en empresa tech/logística: 90-100
    - CDO (Chief Data Officer): 95-100  
    - CTO/CPO en empresa objetivo: 85-95
    - Director/VP en área relevante: 70-85
    - Head/Manager en área relevante: 60-75
    - Otros: <60
    
    ## OUTPUT REQUERIDO (JSON):
    {
        "score": [0-100 basado en fit real],
        "reasoning": "Explicación breve del score",
        "keyInsights": ["insight1", "insight2", "insight3"],
        "suggestedMessage": "Mensaje personalizado de 3-4 líneas máximo",
        "followUpStrategy": "Estrategia de seguimiento si no responde"
    }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: deepPrompt }] }], 
                generationConfig: { 
                    response_mime_type: "application/json",
                    temperature: 0.2,
                    topP: 0.95,
                    topK: 20
                } 
            })
        });
        
        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);
        
        // Guardar estadísticas
        const stats = await chrome.storage.sync.get('stats') || { analyzed: 0, qualified: 0 };
        stats.analyzed = (stats.analyzed || 0) + 1;
        if (result.score >= 70) {
            stats.qualified = (stats.qualified || 0) + 1;
        }
        await chrome.storage.sync.set({ stats });
        
        return result;
    } catch (e) {
        console.error('Analysis error:', e);
        return { 
            error: e.message,
            score: 0,
            suggestedMessage: "Error en el análisis"
        };
    }
}

// Función para enriquecer datos del perfil con búsquedas adicionales
async function enrichProfileData(data) {
    const { apiKey } = await chrome.storage.sync.get(['apiKey']);
    if (!apiKey) return { error: "No API Key" };
    
    const enrichPrompt = `
    Busca información adicional sobre ${data.name} de ${data.company}.
    Encuentra:
    1. Publicaciones recientes en LinkedIn o artículos
    2. Participación en eventos o conferencias
    3. Proyectos o iniciativas mencionadas
    4. Tecnologías que utilizan o buscan implementar
    
    Formato JSON:
    {
        "additionalInfo": ["info1", "info2"],
        "recentActivity": ["activity1", "activity2"],
        "technologies": ["tech1", "tech2"]
    }`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: enrichPrompt }] }], 
                generationConfig: { 
                    response_mime_type: "application/json",
                    temperature: 0.3
                } 
            })
        });
        
        const result = await response.json();
        return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (e) {
        return { additionalInfo: [], recentActivity: [], technologies: [] };
    }
}
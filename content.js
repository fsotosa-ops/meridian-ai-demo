// content.js - V16.2 MeridIAn Strategic Suite
const ICONS = {
    dna: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 21c0-3 1.8-5.7 4.5-6.6M18 14.4c2.7.9 4.5 3.6 4.5 6.6M10.5 7a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM7 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM13 18c0-2.2 1.8-4 4-4s4 1.8 4 4v3H13v-3ZM3 18c0-2.2 1.8-4 4-4s4 1.8 4 4v3H3v-3Z"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    trending: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    target: `<svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    gear: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`
};

function injectUI() {
    if (document.getElementById('meridian-root')) return;
    const root = document.createElement('div');
    root.id = 'meridian-root';
    root.innerHTML = `
        <div id="m-panel">
            <div class="m-app-header">
                <div class="m-logo">MeridIAn</div>
                <div class="m-btn-group">
                    <button id="m-toggle-conf" class="m-icon-btn">${ICONS.gear}</button>
                    <button id="m-close" class="m-icon-btn">${ICONS.x}</button>
                </div>
            </div>

            <div id="m-view-main" style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                <div class="m-score-card">
                    <div class="m-score-header">
                        <span class="m-score-title">ICP COMPATIBILIDAD</span>
                        <span class="m-score-big"><span id="m-score-val">0</span>%</span>
                    </div>
                    <div class="m-progress-bar"><div id="m-progress-fill" class="m-progress-fill" style="width:0%"></div></div>
                </div>
                
                <div class="m-scroll" id="m-insights-display" style="display:none;">
                    <div class="m-insight-block">
                        <div class="m-block-title">${ICONS.dna} DNA PROFESIONAL</div>
                        <p id="m-dna-text" class="m-text-main"></p>
                    </div>

                    <div class="m-insight-block">
                        <div class="m-block-title">🚨 DOLORES ESTRATÉGICOS</div>
                        <div id="m-pains-grid" class="m-list"></div>
                    </div>

                    <div class="m-insight-block">
                        <div class="m-block-title">📅 FOCO Y ACTIVIDAD</div>
                        <div id="m-activity-block"></div>
                    </div>

                    <div class="m-insight-block m-highlight-block">
                        <div class="m-block-title">${ICONS.target} ÁNGULO DE ENTRADA</div>
                        <p id="m-opp-text" class="m-text-main" style="font-weight:600; color:white;"></p>
                    </div>
                </div>

                <button id="m-run-btn" class="m-btn-run">GENERAR INSIGHTS</button>
            </div>

            <div id="m-view-conf" style="display:none; padding:24px; overflow-y:auto; flex:1;">
                <label class="m-score-title" style="margin-bottom:10px; display:block;">GEMINI API KEY</label>
                <input type="password" id="m-api-key" class="m-input" placeholder="••••••••">
                
                <label class="m-score-title" style="margin-bottom:10px; display:block;">ESTRATEGIA (PROMPT MAESTRO)</label>
                <textarea id="m-api-prompt" class="m-input" placeholder="Define tu lógica de ventas..."></textarea>
                
                <label class="m-score-title" style="margin-bottom:10px; display:block;">CARGOS OBJETIVO</label>
                <input type="text" id="m-api-titles" class="m-input" placeholder="CDO, CEO, Founder...">

                <button id="m-save" class="m-btn-run" style="width:100% !important; margin:10px 0 !important;">GUARDAR CONFIGURACIÓN</button>
                <p id="m-back" style="text-align:center; cursor:pointer; font-size:12px; margin-top:15px; opacity:0.6; color:white;">← Volver al análisis</p>
            </div>
        </div>
        <div id="m-trigger" style="display:flex; align-items:center; justify-content:center;">🧭</div>`;
    document.body.appendChild(root);
    setupV162();
}

function setupV162() {
    const panel = document.getElementById('m-panel');
    document.getElementById('m-trigger').onclick = () => panel.classList.toggle('active');
    document.getElementById('m-close').onclick = () => panel.classList.remove('active');
    
    document.getElementById('m-toggle-conf').onclick = () => {
        document.getElementById('m-view-main').style.display = 'none';
        document.getElementById('m-view-conf').style.display = 'block';
    };
    document.getElementById('m-back').onclick = () => {
        document.getElementById('m-view-conf').style.display = 'none';
        document.getElementById('m-view-main').style.display = 'flex';
    };

    chrome.storage.sync.get(['icp', 'apiKey'], (data) => {
        if (data.apiKey) document.getElementById('m-api-key').placeholder = "ACTIVA (••••)";
        if (data.icp) {
            document.getElementById('m-api-titles').value = data.icp.titles.join(', ');
            document.getElementById('m-api-prompt').value = data.icp.promptTemplate;
        }
    });

    document.getElementById('m-save').onclick = async () => {
        const btn = document.getElementById('m-save');
        const key = document.getElementById('m-api-key').value;
        const titles = document.getElementById('m-api-titles').value.split(',').map(t => t.trim());
        const prompt = document.getElementById('m-api-prompt').value;
        
        const update = { icp: { titles, promptTemplate: prompt } };
        if (key) update.apiKey = key;
        
        await chrome.storage.sync.set(update);
        btn.innerText = "¡CONFIGURACIÓN ACTUALIZADA!";
        btn.style.background = "#10b981";
        setTimeout(() => { btn.innerText = "GUARDAR CONFIGURACIÓN"; btn.style.background = ""; }, 2000);
    };

    document.getElementById('m-run-btn').onclick = async () => {
        const btn = document.getElementById('m-run-btn');
        btn.innerText = "ESCANEO ESTRATÉGICO...";
        
        const data = {
            fullDump: (document.querySelector('main') || document.body).innerText.replace(/\s+/g, ' ').substring(0, 7500)
        };

        chrome.runtime.sendMessage({ action: 'analyze', data }, (res) => {
            btn.innerText = "RE-ANALIZAR PERFIL";
            if (res && !res.error) {
                document.getElementById('m-insights-display').style.display = 'block';
                document.getElementById('m-score-val').innerText = res.score;
                document.getElementById('m-progress-fill').style.width = res.score + '%';

                document.getElementById('m-dna-text').innerText = res.dna || "Análisis de DNA no disponible";
                document.getElementById('m-pains-grid').innerHTML = res.pains.map(p => `
                    <div class="m-item">${ICONS[p.icon] || ICONS.alert} <span>${p.text}</span></div>
                `).join('');

                document.getElementById('m-activity-block').innerHTML = `
                    <div style="font-size:12.5px; color:#fff; margin-bottom:5px;"><strong>Frecuencia:</strong> ${res.activity.recency}</div>
                    <div style="font-size:12.5px; color:#cbd5e1; line-height:1.4;">${res.activity.context}</div>`;

                document.getElementById('m-opp-text').innerText = res.opportunity || "No se detectó un ángulo claro.";
            }
        });
    };
}

let lastUrlV162 = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrlV162) {
        lastUrlV162 = location.href;
        document.getElementById('meridian-root')?.remove();
        setTimeout(injectUI, 2000);
    }
}).observe(document, { subtree: true, childList: true });

injectUI();
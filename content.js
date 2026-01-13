// content.js - V14.0 MeridIAn (Ghost SDR Suite)
const ICONS = {
    compass: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>`,
    gear: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`
};

function injectUI() {
    if (document.getElementById('meridian-root')) return;
    const root = document.createElement('div');
    root.id = 'meridian-root';
    root.innerHTML = `
        <div id="m-panel">
            <div class="m-app-header">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="color:var(--m-accent)">${ICONS.compass}</div>
                    <div>
                        <div style="font-weight:800; font-size:12px; letter-spacing:1px;">MERIDIAN AI</div>
                        <div class="m-status">Análisis Activo</div>
                    </div>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <button id="m-settings-toggle" class="m-icon-btn" style="background:none; border:none; color:white; cursor:pointer;">${ICONS.gear}</button>
                    <button id="m-close" class="m-icon-btn" style="background:none; border:none; color:white; cursor:pointer;">${ICONS.x}</button>
                </div>
            </div>

            <div class="m-view" id="m-view-main" style="flex:1; display:flex; flex-direction:column; overflow-y:auto;">
                <div class="m-match-card">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
                        <span style="font-size:10px; font-weight:800; opacity:0.5; letter-spacing:1px;">COMPATIBILIDAD ICP</span>
                        <span style="font-size:36px; font-weight:800;"><span id="m-score-val">0</span>%</span>
                    </div>
                    <div class="m-progress-bar"><div id="m-progress-fill" class="m-progress-fill" style="width:0%"></div></div>
                </div>
                
                <div id="m-ghost-results" style="padding:0 24px; display:none;">
                    <div style="background:var(--m-card); border:1px solid var(--m-border); border-radius:18px; padding:20px; font-size:13px; line-height:1.6;" id="m-final-msg"></div>
                </div>

                <button id="m-run-intel" class="m-btn-main" style="margin-top:auto;">INVESTIGAR PERFIL</button>
            </div>

            <div class="m-view" id="m-view-conf" style="display:none; padding:24px;">
                <label style="font-size:9px; font-weight:800; color:var(--m-accent); margin-bottom:8px; display:block;">ESTRATEGIA (PROMPT MAESTRO)</label>
                <textarea id="m-api-pitch" class="m-input" style="height:150px;" placeholder="Define tu lógica de ventas..."></textarea>
                
                <label style="font-size:9px; font-weight:800; color:var(--m-accent); margin-bottom:8px; display:block;">CARGOS OBJETIVO</label>
                <input type="text" id="m-api-titles" class="m-input" placeholder="CEO, CDO, Founder...">

                <label style="font-size:9px; font-weight:800; color:var(--m-accent); margin-bottom:8px; display:block;">GEMINI API KEY</label>
                <input type="password" id="m-api-key" class="m-input" placeholder="AIzaSy...">

                <button id="m-save-ghost" class="m-btn-main" style="width:100% !important; margin:20px 0 0 0 !important;">GUARDAR ESTRATEGIA</button>
                <p id="m-back" style="text-align:center; cursor:pointer; font-size:12px; margin-top:15px; opacity:0.6;">← Volver al análisis</p>
            </div>
        </div>
        <div id="m-trigger">${ICONS.compass}</div>`;
    document.body.appendChild(root);
    setupGhostV14();
}

function setupGhostV14() {
    const panel = document.getElementById('m-panel');
    document.getElementById('m-trigger').onclick = () => panel.classList.toggle('active');
    document.getElementById('m-close').onclick = () => panel.classList.remove('active');
    
    document.getElementById('m-settings-toggle').onclick = () => {
        document.getElementById('m-view-main').style.display = 'none';
        document.getElementById('m-view-conf').style.display = 'block';
    };
    document.getElementById('m-back').onclick = () => {
        document.getElementById('m-view-conf').style.display = 'none';
        document.getElementById('m-view-main').style.display = 'flex';
    };

    chrome.storage.sync.get(['icp', 'apiKey'], (data) => {
        if (data.icp) {
            document.getElementById('m-api-titles').value = data.icp.titles.join(', ');
            document.getElementById('m-api-pitch').value = data.icp.promptTemplate;
        }
    });

    document.getElementById('m-run-intel').onclick = async () => {
        const btn = document.getElementById('m-run-intel');
        btn.innerText = "GHOST RESEARCHING...";
        
        // --- TOTAL VISION SCRAPER ---
        const data = {
            fullDump: (document.querySelector('main') || document.body).innerText.replace(/\s+/g, ' ').substring(0, 5000)
        };

        chrome.runtime.sendMessage({ action: 'analyze', data }, (res) => {
            btn.innerText = "INVESTIGAR PERFIL";
            if (res && !res.error) {
                document.getElementById('m-ghost-results').style.display = 'block';
                document.getElementById('m-score-val').innerText = res.score;
                document.getElementById('m-progress-fill').style.width = res.score + '%';
                document.getElementById('m-final-msg').innerText = res.suggestedMessage;
            }
        });
    };

    document.getElementById('m-save-ghost').onclick = async () => {
        const btn = document.getElementById('m-save-ghost');
        const key = document.getElementById('m-api-key').value;
        const titles = document.getElementById('m-api-titles').value.split(',').map(t => t.trim());
        const prompt = document.getElementById('m-api-pitch').value;
        await chrome.storage.sync.set({ apiKey: key || "", icp: { titles, promptTemplate: prompt } });
        btn.innerText = "¡ESTRATEGIA ACTUALIZADA!";
        setTimeout(() => btn.innerText = "GUARDAR ESTRATEGIA", 2000);
    };
}

injectUI();
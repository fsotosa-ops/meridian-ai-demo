// content.js - V18.5 MeridIAn (Insight Rebuild)
const SVG_MERIDIAN = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`;

const ICONS = {
    dna: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 21c0-3 1.8-5.7 4.5-6.6M18 14.4c2.7.9 4.5 3.6 4.5 6.6M10.5 7a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM7 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM13 18c0-2.2 1.8-4 4-4s4 1.8 4 4v3H13v-3ZM3 18c0-2.2 1.8-4 4-4s4 1.8 4 4v3H3v-3Z"/></svg>`,
    target: `<svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
};

function injectUI() {
    if (document.getElementById('meridian-root')) return;
    const root = document.createElement('div');
    root.id = 'meridian-root';
    root.innerHTML = `
        <div id="m-panel">
            <div class="m-app-header">
                <div class="m-logo">MeridIAn</div>
                <div style="display:flex; gap:10px;">
                    <button id="m-settings-toggle" style="background:none; border:none; cursor:pointer; color:#94a3b8;">⚙️</button>
                    <button id="m-close" style="background:none; border:none; cursor:pointer; color:#94a3b8;">✕</button>
                </div>
            </div>

            <div class="m-body-scroll" id="m-view-main">
                <div style="background:var(--m-card); border:1px solid var(--m-border); border-radius:22px; padding:24px; margin-bottom:24px; margin-top:24px;">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
                        <span style="font-size:9px; font-weight:800; opacity:0.5; letter-spacing:1px;">ICP COMPATIBILIDAD</span>
                        <span class="m-score-val"><span id="m-score-num">0</span>%</span>
                    </div>
                    <div style="width:100%; height:8px; background:rgba(255,255,255,0.05); border-radius:10px; overflow:hidden;">
                        <div id="m-progress-fill" style="height:100%; width:0%; background:linear-gradient(90deg, #6366f1, #10b981); transition:1s ease;"></div>
                    </div>
                </div>
                
                <div id="m-insight-render-area" style="display:none;"></div>

                <button id="m-run-btn" class="m-btn-run">INVESTIGAR PERFIL</button>
            </div>

            <div class="m-body-scroll" id="m-view-conf" style="display:none; padding-top:24px;">
                <h3 style="font-size:14px; font-weight:800; margin-bottom:20px;">Configuración</h3>
                <label style="font-size:9px; font-weight:800; opacity:0.5; display:block; margin-bottom:8px;">PROPUESTA DE VALOR</label>
                <textarea id="m-api-pv" class="m-input-premium" style="height:80px;"></textarea>
                <label style="font-size:9px; font-weight:800; opacity:0.5; display:block; margin-bottom:8px;">PROMPT MAESTRO</label>
                <textarea id="m-api-prompt" class="m-input-premium" style="height:120px;"></textarea>
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:15px; border-radius:18px; margin-bottom:15px;">
                    <span style="font-size:9px; font-weight:800; opacity:0.5;">AUTO-APERTURA %</span>
                    <input type="number" id="m-th-num" style="width:60px; background:none; border:1px solid var(--m-accent); color:white; text-align:center; border-radius:8px; font-weight:800;" value="75">
                </div>
                <label style="font-size:9px; font-weight:800; opacity:0.5; display:block; margin-bottom:8px;">GEMINI API KEY</label>
                <input type="password" id="m-api-key" class="m-input-premium">
                <button id="m-save" class="m-btn-run" style="background:#10b981 !important;">GUARDAR CAMBIOS</button>
                <p id="m-back" style="text-align:center; cursor:pointer; font-size:12px; margin-top:15px; opacity:0.6;">← Volver</p>
            </div>
        </div>
        <button id="m-trigger">${SVG_MERIDIAN}</button>`;
    document.body.appendChild(root);
    setupV185();
}

function setupV185() {
    const panel = document.getElementById('m-panel');
    document.getElementById('m-trigger').onclick = () => panel.classList.toggle('active');
    document.getElementById('m-close').onclick = () => panel.classList.remove('active');
    document.getElementById('m-settings-toggle').onclick = () => {
        document.getElementById('m-view-main').style.display = 'none';
        document.getElementById('m-view-conf').style.display = 'flex';
    };
    document.getElementById('m-back').onclick = () => {
        document.getElementById('m-view-conf').style.display = 'none';
        document.getElementById('m-view-main').style.display = 'flex';
    };

    chrome.storage.sync.get(['icp', 'apiKey', 'threshold'], (data) => {
        if (data.icp) {
            document.getElementById('m-api-prompt').value = data.icp.promptTemplate || "";
            document.getElementById('m-api-pv').value = data.icp.valueProp || "";
        }
        if (data.threshold) document.getElementById('m-th-num').value = data.threshold;
        if (data.apiKey) document.getElementById('m-api-key').placeholder = "ACTIVA (••••)";
    });

    document.getElementById('m-save').onclick = async () => {
        const btn = document.getElementById('m-save');
        const key = document.getElementById('m-api-key').value;
        const titles = ["CEO", "CDO", "Founder", "Director"];
        const update = {
            threshold: document.getElementById('m-th-num').value,
            icp: { titles, promptTemplate: document.getElementById('m-api-prompt').value, valueProp: document.getElementById('m-api-pv').value }
        };
        if (key) update.apiKey = key;
        await chrome.storage.sync.set(update);
        btn.innerText = "¡SINCRONIZADO!";
        setTimeout(() => btn.innerText = "GUARDAR CAMBIOS", 2000);
    };

    document.getElementById('m-run-btn').onclick = async () => {
        const btn = document.getElementById('m-run-btn');
        btn.innerText = "ESCANEANDO INSIGHTS...";
        const data = { fullDump: (document.querySelector('main') || document.body).innerText.replace(/\s+/g, ' ').substring(0, 8000) };

        chrome.runtime.sendMessage({ action: 'analyze', data }, (res) => {
            btn.innerText = "RE-ANALIZAR PERFIL";
            if (res && !res.error) {
                document.getElementById('m-score-num').innerText = res.score;
                document.getElementById('m-progress-fill').style.width = res.score + '%';
                
                const renderArea = document.getElementById('m-insight-render-area');
                renderArea.style.display = 'block';
                renderArea.innerHTML = `
                    <div class="m-insight-card">
                        <div class="m-card-title">${ICONS.dna} DNA PROFESIONAL</div>
                        <p class="m-insight-text">${res.dna}</p>
                    </div>
                    <div class="m-insight-card">
                        <div class="m-card-title">🚨 DOLORES ESTRATÉGICOS</div>
                        <ul style="margin:0; padding-left:15px;" class="m-insight-text">
                            ${(res.pains || []).map(p => `<li>${p.text}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="m-insight-card">
                        <div class="m-card-title">📅 FOCO Y ACTIVIDAD</div>
                        <p class="m-insight-text"><strong>Recencia:</strong> ${res.activity.recency}</p>
                        <p class="m-insight-text" style="opacity:0.8; font-size:12px; margin-top:5px;">${res.activity.context}</p>
                    </div>
                    <div class="m-insight-card m-highlight">
                        <div class="m-card-title" style="color:var(--m-accent);">${ICONS.target} ÁNGULO DE ENTRADA</div>
                        <p class="m-insight-text" style="font-weight:600;">${res.opportunity}</p>
                    </div>
                `;
            }
        });
    };
}
injectUI();
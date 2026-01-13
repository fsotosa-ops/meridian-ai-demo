// content.js - Ghost SDR v2.0 - Advanced LinkedIn Scanner
const ICONS = {
    brain: `<svg viewBox="0 0 24 24"><path d="M9.5 2C5.36 2 2 5.36 2 9.5c0 1.23.3 2.4.83 3.42L7 11.49V11c0-1.38 1.12-2.5 2.5-2.5.82 0 1.54.4 2 1h1c.46-.6 1.18-1 2-1 1.38 0 2.5 1.12 2.5 2.5v.49l4.17 1.43c.53-1.02.83-2.19.83-3.42C22 5.36 18.64 2 14.5 2c-1.06 0-2.07.22-3 .62A7.474 7.474 0 0 0 9.5 2M7 12.5v3c0 .28.22.5.5.5s.5-.22.5-.5V14h1v4.31C7.83 19.35 7 20.7 7 22h10c0-1.3-.83-2.65-2-3.69V14h1v1.5c0 .28.22.5.5.5s.5-.22.5-.5v-3c0-.55-.45-1-1-1s-1 .45-1 1v1h-1v-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V13h-1v-1c0-.55-.45-1-1-1s-1 .45-1 1"/></svg>`,
    target: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/></svg>`,
    lightning: `<svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>`,
    check: `<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
    x: `<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/></svg>`,
    gear: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24M3.54 15.98l4.24 4.24M1 12h6m6 0h6m-13.22 4.22 4.24-4.24m7.96 0 4.24 4.24"/></svg>`,
    database: `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3m18 7c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
};

let analysisInProgress = false;

function injectUI() {
    if (document.getElementById('meridian-root')) return;
    
    const root = document.createElement('div');
    root.id = 'meridian-root';
    root.innerHTML = `
        <div id="m-panel">
            <div class="m-header">
                <div class="m-logo-section">
                    <div class="m-logo">
                        ${ICONS.brain}
                        <span>GHOST SDR</span>
                    </div>
                    <div class="m-status" id="m-status">
                        <span class="m-status-dot"></span>
                        <span>Ready</span>
                    </div>
                </div>
                <div class="m-controls">
                    <button id="m-settings-btn" class="m-icon-btn" title="Settings">${ICONS.gear}</button>
                    <button id="m-close" class="m-icon-btn" title="Close">${ICONS.x}</button>
                </div>
            </div>
            
            <div class="m-content">
                <!-- Main Analysis View -->
                <div id="m-view-main" class="m-view active">
                    <div class="m-score-section">
                        <div class="m-score-circle" id="m-score-circle">
                            <svg class="m-score-svg" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="90" class="m-score-bg"/>
                                <circle cx="100" cy="100" r="90" class="m-score-progress" id="m-score-progress"/>
                            </svg>
                            <div class="m-score-content">
                                <div class="m-score-value" id="m-score-val">--</div>
                                <div class="m-score-label">ICP MATCH</div>
                            </div>
                        </div>
                        
                        <div class="m-reasoning" id="m-reasoning" style="display:none;">
                            <div class="m-section-title">📊 Análisis</div>
                            <div id="m-reasoning-text"></div>
                        </div>
                    </div>
                    
                    <div class="m-insights" id="m-insights" style="display:none;">
                        <div class="m-section-title">💡 Key Insights</div>
                        <ul id="m-insights-list"></ul>
                    </div>
                    
                    <div class="m-message-section" id="m-message-section" style="display:none;">
                        <div class="m-section-title">✉️ Mensaje Sugerido</div>
                        <div class="m-message-box" id="m-message-box">
                            <div id="m-suggested-message"></div>
                            <button class="m-copy-btn" id="m-copy-message">
                                📋 Copiar
                            </button>
                        </div>
                    </div>
                    
                    <div class="m-followup" id="m-followup" style="display:none;">
                        <div class="m-section-title">🎯 Estrategia de Follow-up</div>
                        <div id="m-followup-text"></div>
                    </div>
                    
                    <button id="m-analyze" class="m-btn-primary">
                        ${ICONS.search}
                        <span>ANALIZAR PERFIL</span>
                    </button>
                    
                    <button id="m-enrich" class="m-btn-secondary" style="display:none;">
                        ${ICONS.database}
                        <span>ENRIQUECER DATOS</span>
                    </button>
                </div>
                
                <!-- Settings View -->
                <div id="m-view-settings" class="m-view">
                    <div class="m-settings-section">
                        <label class="m-label">🔑 Gemini API Key</label>
                        <input type="password" id="m-api-key" class="m-input" placeholder="sk-...">
                    </div>
                    
                    <div class="m-settings-section">
                        <label class="m-label">🎯 Prompt del BDR (Estrategia)</label>
                        <textarea id="m-prompt" class="m-textarea" placeholder="Define tu estrategia de prospección..."></textarea>
                    </div>
                    
                    <div class="m-settings-section">
                        <label class="m-label">👔 Cargos Target</label>
                        <input type="text" id="m-titles" class="m-input" placeholder="CEO, CTO, Director...">
                    </div>
                    
                    <div class="m-settings-section">
                        <label class="m-label">🏭 Industrias</label>
                        <input type="text" id="m-industries" class="m-input" placeholder="Logística, SaaS, Fintech...">
                    </div>
                    
                    <div class="m-settings-section">
                        <label class="m-label">🎚️ Umbral de Auto-Apertura: <span id="m-threshold-val">75</span>%</label>
                        <input type="range" id="m-threshold" class="m-slider" min="50" max="100" value="75">
                    </div>
                    
                    <button id="m-save-settings" class="m-btn-primary">
                        ${ICONS.check}
                        <span>GUARDAR CONFIGURACIÓN</span>
                    </button>
                    
                    <button id="m-back" class="m-btn-secondary">
                        ← Volver al Análisis
                    </button>
                </div>
            </div>
            
            <div class="m-footer">
                <div class="m-stats">
                    <div class="m-stat">
                        <span class="m-stat-label">Analizados</span>
                        <span class="m-stat-value" id="m-stat-analyzed">0</span>
                    </div>
                    <div class="m-stat">
                        <span class="m-stat-label">Calificados</span>
                        <span class="m-stat-value" id="m-stat-qualified">0</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="m-trigger" class="m-trigger">
            <div class="m-trigger-icon">${ICONS.brain}</div>
            <div class="m-trigger-pulse"></div>
        </div>`;
    
    document.body.appendChild(root);
    setupEvents();
    loadStats();
}

function setupEvents() {
    const panel = document.getElementById('m-panel');
    const trigger = document.getElementById('m-trigger');
    
    // Panel toggle
    trigger.onclick = () => panel.classList.toggle('active');
    document.getElementById('m-close').onclick = () => panel.classList.remove('active');
    
    // View switching
    document.getElementById('m-settings-btn').onclick = () => {
        document.getElementById('m-view-main').classList.remove('active');
        document.getElementById('m-view-settings').classList.add('active');
    };
    
    document.getElementById('m-back').onclick = () => {
        document.getElementById('m-view-settings').classList.remove('active');
        document.getElementById('m-view-main').classList.add('active');
    };
    
    // Settings
    document.getElementById('m-threshold').oninput = (e) => {
        document.getElementById('m-threshold-val').innerText = e.target.value;
    };
    
    // Load saved settings
    chrome.storage.sync.get(['apiKey', 'icp', 'threshold'], (data) => {
        if (data.apiKey) {
            document.getElementById('m-api-key').placeholder = '••••••••• (Saved)';
        }
        if (data.icp) {
            document.getElementById('m-prompt').value = data.icp.promptTemplate || '';
            document.getElementById('m-titles').value = data.icp.titles?.join(', ') || '';
            document.getElementById('m-industries').value = data.icp.industry?.join(', ') || '';
        }
        if (data.threshold) {
            document.getElementById('m-threshold').value = data.threshold;
            document.getElementById('m-threshold-val').innerText = data.threshold;
        }
    });
    
    // Save settings
    document.getElementById('m-save-settings').onclick = async () => {
        const apiKey = document.getElementById('m-api-key').value;
        const promptTemplate = document.getElementById('m-prompt').value;
        const titles = document.getElementById('m-titles').value.split(',').map(t => t.trim());
        const industry = document.getElementById('m-industries').value.split(',').map(i => i.trim());
        const threshold = document.getElementById('m-threshold').value;
        
        const storageData = {
            threshold,
            icp: {
                promptTemplate,
                titles,
                industry,
                signals: { painPoints: [] }
            }
        };
        
        if (apiKey) storageData.apiKey = apiKey;
        
        await chrome.storage.sync.set(storageData);
        
        const btn = document.getElementById('m-save-settings');
        btn.innerHTML = `${ICONS.check}<span>¡GUARDADO!</span>`;
        setTimeout(() => {
            btn.innerHTML = `${ICONS.check}<span>GUARDAR CONFIGURACIÓN</span>`;
        }, 2000);
    };
    
    // Main analysis
    document.getElementById('m-analyze').onclick = performAnalysis;
    
    // Copy message
    document.getElementById('m-copy-message').onclick = () => {
        const message = document.getElementById('m-suggested-message').innerText;
        navigator.clipboard.writeText(message);
        document.getElementById('m-copy-message').innerText = '✅ Copiado';
        setTimeout(() => {
            document.getElementById('m-copy-message').innerText = '📋 Copiar';
        }, 2000);
    };
    
    // Enrich data
    document.getElementById('m-enrich').onclick = enrichProfile;
}

async function performAnalysis() {
    if (analysisInProgress) return;
    analysisInProgress = true;
    
    const btn = document.getElementById('m-analyze');
    const status = document.getElementById('m-status');
    
    // Update UI
    btn.innerHTML = `${ICONS.lightning}<span>ANALIZANDO...</span>`;
    btn.disabled = true;
    status.innerHTML = '<span class="m-status-dot m-status-active"></span><span>Analizando</span>';
    
    // Extract profile data with better selectors
    const profileData = extractProfileData();
    
    // Send for analysis
    chrome.runtime.sendMessage({ action: 'analyze', data: profileData }, (result) => {
        analysisInProgress = false;
        btn.innerHTML = `${ICONS.search}<span>ANALIZAR PERFIL</span>`;
        btn.disabled = false;
        status.innerHTML = '<span class="m-status-dot"></span><span>Ready</span>';
        
        if (result && !result.error) {
            displayResults(result);
            
            // Auto-open if score is high enough
            chrome.storage.sync.get(['threshold'], (data) => {
                if (result.score >= (data.threshold || 75)) {
                    document.getElementById('m-panel').classList.add('active');
                }
            });
        } else {
            console.error('Analysis error:', result?.error);
            alert('Error en el análisis. Verifica tu API key.');
        }
    });
}

function extractProfileData() {
    // Improved selectors for LinkedIn profile extraction
    const nameElement = document.querySelector('h1.text-heading-xlarge') || 
                       document.querySelector('.pv-text-details__left-panel h1') ||
                       document.querySelector('.pv-top-card h1');
    
    const titleElement = document.querySelector('.text-body-medium.break-words') ||
                        document.querySelector('.pv-text-details__left-panel .text-body-medium') ||
                        document.querySelector('.pv-top-card-section__headline');
    
    const aboutSection = document.querySelector('#about')?.parentElement ||
                        document.querySelector('.pv-about-section');
    
    const experienceSection = document.querySelector('#experience')?.parentElement ||
                             document.querySelector('.pv-profile-section.experience-section');
    
    // Get structured data
    const header = [];
    if (nameElement) header.push(nameElement.innerText.trim());
    if (titleElement) header.push(titleElement.innerText.trim());
    
    // Extract company from experience or headline
    const companyElement = document.querySelector('.pv-text-details__right-panel') ||
                          document.querySelector('.pv-entity__secondary-title');
    if (companyElement) header.push(companyElement.innerText.trim());
    
    return {
        header: header.join('\n'),
        about: aboutSection?.innerText.trim() || 'No about section',
        experience: experienceSection?.innerText.trim().substring(0, 2000) || 'No experience data'
    };
}

function displayResults(result) {
    // Update score with animation
    const scoreVal = document.getElementById('m-score-val');
    const scoreProgress = document.getElementById('m-score-progress');
    const scoreCircle = document.getElementById('m-score-circle');
    
    scoreVal.innerText = result.score;
    
    // Animate progress circle
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (result.score / 100) * circumference;
    scoreProgress.style.strokeDashoffset = offset;
    
    // Color based on score
    if (result.score >= 85) {
        scoreCircle.className = 'm-score-circle m-score-high';
    } else if (result.score >= 70) {
        scoreCircle.className = 'm-score-circle m-score-medium';
    } else {
        scoreCircle.className = 'm-score-circle m-score-low';
    }
    
    // Show reasoning
    if (result.reasoning) {
        document.getElementById('m-reasoning').style.display = 'block';
        document.getElementById('m-reasoning-text').innerText = result.reasoning;
    }
    
    // Show insights
    if (result.keyInsights && result.keyInsights.length > 0) {
        document.getElementById('m-insights').style.display = 'block';
        const insightsList = document.getElementById('m-insights-list');
        insightsList.innerHTML = result.keyInsights
            .map(insight => `<li>${insight}</li>`)
            .join('');
    }
    
    // Show message
    if (result.suggestedMessage) {
        document.getElementById('m-message-section').style.display = 'block';
        document.getElementById('m-suggested-message').innerText = result.suggestedMessage;
    }
    
    // Show follow-up strategy
    if (result.followUpStrategy) {
        document.getElementById('m-followup').style.display = 'block';
        document.getElementById('m-followup-text').innerText = result.followUpStrategy;
    }
    
    // Show enrich button
    document.getElementById('m-enrich').style.display = 'block';
}

async function enrichProfile() {
    const btn = document.getElementById('m-enrich');
    btn.innerHTML = `${ICONS.database}<span>ENRIQUECIENDO...</span>`;
    btn.disabled = true;
    
    const profileData = extractProfileData();
    const [name, title, company] = profileData.header.split('\n');
    
    chrome.runtime.sendMessage({ 
        action: 'enrich', 
        data: { name, company, title }
    }, (result) => {
        btn.innerHTML = `${ICONS.database}<span>ENRIQUECER DATOS</span>`;
        btn.disabled = false;
        
        if (result && !result.error) {
            // Display enriched data
            console.log('Enriched data:', result);
            // You can add UI elements to display this enriched data
        }
    });
}

function loadStats() {
    chrome.storage.sync.get(['stats'], (data) => {
        if (data.stats) {
            document.getElementById('m-stat-analyzed').innerText = data.stats.analyzed || 0;
            document.getElementById('m-stat-qualified').innerText = data.stats.qualified || 0;
        }
    });
}

// Monitor URL changes for LinkedIn navigation
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        // Reset UI on profile change
        setTimeout(() => {
            document.getElementById('meridian-root')?.remove();
            injectUI();
        }, 1500);
    }
}).observe(document, { subtree: true, childList: true });

// Initial injection
setTimeout(injectUI, 1000);
// popup.js - Ghost SDR v2.0 - Configuration Manager
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize tabs
    setupTabs();
    
    // Load saved configuration
    await loadConfiguration();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load and display stats
    await loadStats();
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            
            // Update active states
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

async function loadConfiguration() {
    const data = await chrome.storage.sync.get(['apiKey', 'icp', 'threshold', 'settings']);
    
    // API Key
    if (data.apiKey) {
        document.getElementById('apiKey').placeholder = '••••••••• (Guardada)';
        document.getElementById('apiKey').dataset.hasKey = 'true';
    }
    
    // ICP Configuration
    if (data.icp) {
        document.getElementById('industries').value = data.icp.industry?.join(', ') || '';
        document.getElementById('titles').value = data.icp.titles?.join(', ') || '';
        document.getElementById('painpoints').value = data.icp.signals?.painPoints?.join(', ') || '';
        document.getElementById('promptTemplate').value = data.icp.promptTemplate || '';
    }
    
    // Threshold
    if (data.threshold) {
        document.getElementById('threshold').value = data.threshold;
        document.getElementById('thresholdValue').textContent = data.threshold;
    }
    
    // Settings
    if (data.settings) {
        document.getElementById('autoOpen').checked = data.settings.autoOpen !== false;
        document.getElementById('webSearch').checked = data.settings.webSearch !== false;
    }
}

async function loadStats() {
    const data = await chrome.storage.sync.get(['stats']);
    
    if (data.stats) {
        const analyzed = data.stats.analyzed || 0;
        const qualified = data.stats.qualified || 0;
        const conversion = analyzed > 0 ? Math.round((qualified / analyzed) * 100) : 0;
        
        document.getElementById('analyzed').textContent = analyzed;
        document.getElementById('qualified').textContent = qualified;
        document.getElementById('conversion').textContent = `${conversion}%`;
    }
}

function setupEventListeners() {
    // Threshold slider
    document.getElementById('threshold').addEventListener('input', (e) => {
        document.getElementById('thresholdValue').textContent = e.target.value;
    });
    
    // Save button
    document.getElementById('save').addEventListener('click', saveConfiguration);
    
    // Test button
    document.getElementById('test').addEventListener('click', testConfiguration);
    
    // Reset stats button
    document.getElementById('resetStats').addEventListener('click', resetStats);
}

async function saveConfiguration() {
    const btn = document.getElementById('save');
    btn.disabled = true;
    btn.innerHTML = '⏳ Guardando...';
    
    try {
        // Collect all data
        const apiKeyInput = document.getElementById('apiKey');
        const apiKey = apiKeyInput.value.trim();
        
        const industries = document.getElementById('industries').value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
            
        const titles = document.getElementById('titles').value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
            
        const painPoints = document.getElementById('painpoints').value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
            
        const promptTemplate = document.getElementById('promptTemplate').value;
        const threshold = document.getElementById('threshold').value;
        
        const settings = {
            autoOpen: document.getElementById('autoOpen').checked,
            webSearch: document.getElementById('webSearch').checked
        };
        
        // Prepare storage data
        const storageData = {
            threshold,
            settings,
            icp: {
                industry: industries,
                titles,
                signals: { painPoints },
                promptTemplate
            }
        };
        
        // Only update API key if new one was provided
        if (apiKey) {
            storageData.apiKey = apiKey;
        }
        
        // Save to Chrome storage
        await chrome.storage.sync.set(storageData);
        
        // Update UI
        if (apiKey) {
            apiKeyInput.value = '';
            apiKeyInput.placeholder = '••••••••• (Guardada)';
            apiKeyInput.dataset.hasKey = 'true';
        }
        
        // Show success message
        showSuccess();
        
    } catch (error) {
        console.error('Error saving configuration:', error);
        btn.innerHTML = '❌ Error';
        
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '💾 Guardar';
        }, 2000);
    }
}

async function testConfiguration() {
    const btn = document.getElementById('test');
    btn.disabled = true;
    btn.innerHTML = '🔬 Probando...';
    
    try {
        const { apiKey } = await chrome.storage.sync.get(['apiKey']);
        
        if (!apiKey) {
            throw new Error('No API Key configured');
        }
        
        // Test the API key with a simple request
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Test' }] }]
                })
            }
        );
        
        if (response.ok) {
            btn.innerHTML = '✅ API OK';
            btn.style.background = '#10b981';
        } else {
            throw new Error('Invalid API Key');
        }
        
    } catch (error) {
        btn.innerHTML = '❌ Error';
        btn.style.background = '#ef4444';
        
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '🧪 Test Config';
            btn.style.background = '';
        }, 3000);
    }
}

async function resetStats() {
    if (confirm('¿Estás seguro de resetear las estadísticas?')) {
        await chrome.storage.sync.set({
            stats: { analyzed: 0, qualified: 0 }
        });
        await loadStats();
        showSuccess('Estadísticas reseteadas');
    }
}

function showSuccess(message = '✅ Configuración guardada exitosamente') {
    const successMsg = document.getElementById('successMessage');
    successMsg.textContent = message;
    successMsg.classList.add('show');
    
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

// Listen for stats updates from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'statsUpdated') {
        loadStats();
    }
});
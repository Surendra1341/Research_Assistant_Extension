// Global variables
let currentPageInfo = { title: '', url: '' };
let isProcessing = false;

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
    initializeExtension();
    setupEventListeners();
    checkBackendStatus();
    loadCurrentPageInfo();
});

// Initialize extension with saved data
function initializeExtension() {
    chrome.storage.local.get(['researchNotes'], function(result) {
        if (result.researchNotes) {
            document.getElementById('notes').value = result.researchNotes;
        }
    });
}

// Setup all event listeners
function setupEventListeners() {
    document.getElementById('summarizeBtn').addEventListener('click', handleSummarize);
    document.getElementById('saveNotesBtn').addEventListener('click', handleSaveNotes);
    document.getElementById('clearNotesBtn').addEventListener('click', handleClearNotes);
    document.getElementById('clearBtn').addEventListener('click', handleClearResults);
    document.getElementById('copyBtn').addEventListener('click', handleCopyResults);
    
    // Auto-save notes while typing
    document.getElementById('notes').addEventListener('input', debounce(autoSaveNotes, 1000));
    
    // Listen for background script messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'TAB_UPDATED') {
            updatePageInfo(message.title, message.url);
        }
    });
}

// Load current page information
async function loadCurrentPageInfo() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            updatePageInfo(tab.title, tab.url);
        }
    } catch (error) {
        console.error('Error loading page info:', error);
    }
}

// Update page information display
function updatePageInfo(title, url) {
    currentPageInfo = { title, url };
    const pageInfo = document.getElementById('pageInfo');
    const pageTitle = pageInfo.querySelector('.page-title');
    const pageUrl = pageInfo.querySelector('.page-url');
    
    pageTitle.textContent = title || 'No title';
    pageUrl.textContent = url || 'No URL';
}

// Check backend status
async function checkBackendStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    
    try {
        const response = await fetch('http://localhost:8080/health', {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'Online';
        } else {
            throw new Error('Backend not responding');
        }
    } catch (error) {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Offline';
    }
}

// Handle summarize button click
async function handleSummarize() {
    if (isProcessing) return;
    
    const summarizeBtn = document.getElementById('summarizeBtn');
    const originalText = summarizeBtn.innerHTML;
    
    try {
        isProcessing = true;
        summarizeBtn.disabled = true;
        summarizeBtn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; margin-right: 8px;"></div>Processing...';
        
        showLoadingIndicator(true);
        
        // Get selected text from the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                const selection = window.getSelection().toString().trim();
                return selection;
            }
        });
        
        if (!result) {
            showNotification('Please select some text on the webpage first', 'warning');
            return;
        }
        
        if (result.length > 5000) {
            showNotification('Selected text is too long. Please select a shorter passage.', 'warning');
            return;
        }
        
        // Call backend API
        const response = await fetch('http://localhost:8080/api/research/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: result,
                operation: 'summarize'
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const summary = await response.text();
        displayResult(summary, result.substring(0, 100) + '...');
        showNotification('Summary generated successfully!', 'success');
        
    } catch (error) {
        console.error('Summarization error:', error);
        showNotification(`Error: ${error.message}`, 'error');
    } finally {
        isProcessing = false;
        summarizeBtn.disabled = false;
        summarizeBtn.innerHTML = originalText;
        showLoadingIndicator(false);
    }
}

// Display summarization result
function displayResult(summary, originalText) {
    const results = document.getElementById('results');
    const copyBtn = document.getElementById('copyBtn');
    
    const timestamp = new Date().toLocaleString();
    const resultHTML = `
        <div class="result-item">
            <div class="result-content">
                <strong>Summary:</strong><br>
                ${summary.replace(/\n/g, '<br>')}
            </div>
            <div class="result-timestamp">
                Generated: ${timestamp} | Source: ${currentPageInfo.title}
            </div>
        </div>
    `;
    
    results.innerHTML = resultHTML;
    copyBtn.style.display = 'block';
    copyBtn.onclick = () => copyToClipboard(summary);
}

// Handle save notes
async function handleSaveNotes() {
    const notes = document.getElementById('notes').value;
    const saveBtn = document.getElementById('saveNotesBtn');
    const originalText = saveBtn.innerHTML;
    
    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; margin-right: 8px;"></div>Saving...';
        
        await chrome.storage.local.set({ 'researchNotes': notes });
        
        showNotification('Notes saved successfully!', 'success');
        
        // Reset button after delay
        setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }, 1000);
        
    } catch (error) {
        console.error('Error saving notes:', error);
        showNotification('Error saving notes', 'error');
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// Handle clear notes
function handleClearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        document.getElementById('notes').value = '';
        chrome.storage.local.set({ 'researchNotes': '' });
        showNotification('Notes cleared', 'success');
    }
}

// Handle clear results
function handleClearResults() {
    const results = document.getElementById('results');
    const copyBtn = document.getElementById('copyBtn');
    
    results.innerHTML = `
        <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
            </svg>
            <p>Select text on any webpage and click "Summarize Selection" to get AI-powered summaries</p>
        </div>
    `;
    copyBtn.style.display = 'none';
    showNotification('Results cleared', 'success');
}

// Handle copy results to clipboard
async function handleCopyResults() {
    const resultContent = document.querySelector('.result-content');
    if (!resultContent) return;
    
    // Extract text content without HTML tags
    const textContent = resultContent.innerText.replace('Summary:\n', '');
    
    try {
        await navigator.clipboard.writeText(textContent);
        showNotification('Copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Error copying to clipboard', 'error');
    }
}

// Auto-save notes function
async function autoSaveNotes() {
    const notes = document.getElementById('notes').value;
    try {
        await chrome.storage.local.set({ 'researchNotes': notes });
        console.log('Notes auto-saved');
    } catch (error) {
        console.error('Error auto-saving notes:', error);
    }
}

// Copy text to clipboard utility
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Error copying to clipboard', 'error');
    }
}

// Show loading indicator
function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = show ? 'flex' : 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${getNotificationIcon(type)}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-size: 13px;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
        error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
    };
    return icons[type] || icons.info;
}

// Get notification color based on type
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check backend status periodically
setInterval(checkBackendStatus, 30000); // Check every 30 seconds

// Add CSS for notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-icon {
        flex-shrink: 0;
    }
    
    .notification-message {
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);
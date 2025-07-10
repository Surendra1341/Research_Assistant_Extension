console.log('AI Research Assistant Service Worker Loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Research Assistant Extension Installed');
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  
  // Initialize default settings
  chrome.storage.local.set({
    'researchNotes': '',
    'apiEndpoint': 'http://localhost:8080/api/research/process'
  });
});

// Handle side panel opening
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for tab updates to refresh context
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.runtime.sendMessage({
      type: 'TAB_UPDATED',
      url: tab.url,
      title: tab.title
    }).catch(() => {
      // Ignore errors if side panel is not open
    });
  }
});
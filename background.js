const activeTradeTabs = new Set();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.includes('pathofexile.com/trade2/search/poe2')) {
    if (changeInfo.status === 'complete') {
      activeTradeTabs.add(tabId);
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  activeTradeTabs.delete(tabId);
});
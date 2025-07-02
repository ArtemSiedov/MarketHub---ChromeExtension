chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'open_market_hub_modal' });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "search-on-rozetka",
    title: "Искать на Rozetka",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "search-on-rozetka" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText.trim());
    const url = `https://rozetka.com.ua/search/?text=${query}`;
    chrome.tabs.create({ url });
  }
}); 
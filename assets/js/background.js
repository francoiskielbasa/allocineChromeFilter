chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.match(/https?:\/\/www\.allocine\.fr\/seance\/.*/)) {
        chrome.pageAction.show(tabId);
    }
});

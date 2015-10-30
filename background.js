chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.match(/https?:\/\/www\.allocine\.fr\/seance\/.*/)) {
        chrome.pageAction.show(tabId);
    }
});


/*
 chrome.storage.onChanged.addListener(function (changes, namespace) {
 var storageChange = changes[key];
 console.log('Storage key "%s" in namespace "%s" changed. ' +
 'Old value was "%s", new value is "%s".',
 key,
 namespace,
 storageChange.oldValue,
 storageChange.newValue);

 });
 */

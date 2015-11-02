/**
 * Created by francois on 28/10/15.
 */
var switchButton = document.getElementById('unShowedButton');
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('hide', function (result) {
        switchButton.checked = result.hide;
    });
});

switchButton.addEventListener('click', function () {
    chrome.storage.local.set({'hide': this.checked});
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {reload: true});
    })
});

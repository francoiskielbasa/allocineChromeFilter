/**
 * Created by francois on 28/10/15.
 */
function reload () {
	chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {reload: true});
    })
}

var unShowedButton = document.getElementById('unShowedButton');
var fromButton = document.getElementById('fromButton');
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['unShowed', 'timeFrom'], function (result) {
        unShowedButton.checked = result.unShowed;
        fromButton.value = result.timeFrom;
    });
});

unShowedButton.addEventListener('click', function () {
    chrome.storage.local.set({'unShowed': this.checked});
    reload();
    
});

fromButton.addEventListener('change', function () {
	chrome.storage.local.set({'timeFrom' : this.value});
	reload();
});

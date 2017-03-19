/**
 * Created by francois on 28/10/15.
 */
var allFilters = document.getElementById('allFilters');
var activeFilters = document.getElementById('activeFilters');
var displayUnShowedButton = document.getElementById('displayUnShowedButton');
var fromButton = document.getElementById('fromButton');
var toButton = document.getElementById('toButton');

function reload() {

    if (activeFilters.checked) {
        allFilters.style.display = 'block';
    } else {
        allFilters.style.display = 'none';
    }

    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {reload: true});
    })
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['filtersAreActive', 'hideUnShowed', 'startTimeFrom', 'startTimeTo'], function (result) {
        displayUnShowedButton.checked = result.hideUnShowed;
        fromButton.value = result.startTimeFrom;
        toButton.value = result.startTimeTo;
        activeFilters.checked = result.filtersAreActive;
        reload();
    });
});

activeFilters.addEventListener('click', function () {
    chrome.storage.local.set({'filtersAreActive': this.checked});
    reload();
});

displayUnShowedButton.addEventListener('click', function () {
    chrome.storage.local.set({'hideUnShowed': this.checked});
    reload();
});

fromButton.addEventListener('change', function () {
    debugger;
    chrome.storage.local.set({'startTimeFrom': this.value});
    reload();
});

toButton.addEventListener('change', function () {
    chrome.storage.local.set({'startTimeTo': this.value});
    /*
    if (this.valueAsDate < fromButton.valueAsDate) {
        document.getElementById('error_message').style.display = "block";
    } else {
        document.getElementById('error_message').style.display = "none";
    }
    */
    reload();
});

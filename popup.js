/**
 * Created by francois on 28/10/15.
 */
var switchButton = document.getElementById('switchButton');
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('hide', function (result) {
        switchButton.checked = result.hide;
    });
});

switchButton.addEventListener('click', function () {
    chrome.storage.local.set({'hide': this.checked});
//    chrome.tabs.executeScript(null, {file : 'alcChromeFilter.js'});
});

/* global chrome */

function navigateToOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open('?page=Options');
  }
}

export default navigateToOptionsPage;

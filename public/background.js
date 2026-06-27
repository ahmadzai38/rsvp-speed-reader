// When the user clicks the extension toolbar icon, open the reader in a
// full browser tab. index.html is the built app (Vite copies it to the root
// of dist, and public/ files like this one sit next to it).
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html"),
  });
});


chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "parent",
    title: "Highlight Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "yellow",
    parentId: "parent",
    title: "Yellow",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "lightgreen",
    parentId: "parent",
    title: "Light Green",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "pink",
    parentId: "parent",
    title: "Pink",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "lightblue",
    parentId: "parent",
    title: "Light Blue",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "add_note",
    parentId: "parent",
    title: "Add Note",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add_note") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getSelectedTextAndPromptNote
    }, (results) => {
      if (results && results[0].result) {
        const { note } = results[0].result;
        chrome.storage.local.set({ highlightColor: 'yellow', note: note }, () => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          });
        });
      }
    });
  } else {
    let clr = info.menuItemId;
    chrome.storage.local.set({ highlightColor: clr, note: '' }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    });
  }
});

function getSelectedTextAndPromptNote() {
  const selectedText = window.getSelection().toString();
  const note = prompt("Enter your note:");
  return { selectedText, note };
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});





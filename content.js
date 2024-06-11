window.addEventListener('load', () => {
  restoreHighlights();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const color = message.clr || 'yellow';
  const note = message.note || '';
  highlight(color, note);
});
      
    
 

 function highlight(color, note) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;
  const startOffset = range.startOffset;
  const endOffset = range.endOffset;
  const url = window.location.href;
  const title = document.title ; 
  const date = new Date().toISOString();
  const key = `${Date.now()}`;

  const highlight = {
    startContainerXPath: getXPath(startContainer),
    endContainerXPath: getXPath(endContainer),
    startOffset,
    endOffset,
    selectedText: selection.toString(),
    color,
    date,
    note,
    url,title
  };

  const span = document.createElement('span');
  span.style.backgroundColor = color||"yellow";
  span.style.color = 'black';
  span.title = note;

  span.appendChild(range.extractContents());
  range.insertNode(span);

  chrome.storage.local.set({ [key]: highlight }, () => {
    console.log('Highlight saved');
  });
}

function restoreHighlights() {
  chrome.storage.local.get(null, (items) => {
    let highlights = Object.entries(items).filter(([key, value]) => value.url === window.location.href);

    highlights.forEach(([key, highlight]) => {
      const startContainer = getElementByXPath(highlight.startContainerXPath);
      const endContainer = getElementByXPath(highlight.endContainerXPath);

      if (startContainer && endContainer) {
        const range = document.createRange();
        range.setStart(startContainer, highlight.startOffset);
        range.setEnd(endContainer, highlight.endOffset);

        const span = document.createElement('span');
        span.style.backgroundColor = highlight.color;
        span.style.color = 'black';
        span.title = highlight.note;
        range.surroundContents(span);
      }
    });
  });
}


//all this x path code has been taken from stack overflow / some other sites . 
function getXPath(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return getXPath(node.parentNode) + '/text()[' + getTextNodeIndex(node) + ']';
  }
  if (node.id) {
    return `//*[@id="${node.id}"]`;
  }
  const parts = [];
  while (node && node.nodeType === Node.ELEMENT_NODE) {
    let index = 0;
    let sibling = node.previousSibling;
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === node.nodeName) {
        index++;
      }
      sibling = sibling.previousSibling;
    }
    const tagName = node.nodeName.toLowerCase();
    const part = `${tagName}[${index + 1}]`;
    parts.unshift(part);
    node = node.parentNode;
  }
  return parts.length ? `/${parts.join('/')}` : null;
}

function getTextNodeIndex(node) {
  let index = 1;
  while ((node = node.previousSibling)) {
    if (node.nodeType === Node.TEXT_NODE) index++;
  }
  return index;
}

function getElementByXPath(xpath) {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return result.singleNodeValue;
}

function getTextNode(element, text) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      return node.data.includes(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  return walker.nextNode();
}

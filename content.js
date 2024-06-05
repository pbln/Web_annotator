chrome.storage.local.get(['highlightColor' , 'note'], (data) => {
    const color = data.highlightColor || 'yellow'; 
    const note = data.note || '';
    highlight(color,note);

  });
  
  function highlight(color,note) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = color;
    span.style.color = 'black';
    span.title = note

    span.appendChild(range.extractContents());
    range.insertNode(span);
    
    const selectedText = span.textContent;
    const date =  new Date().toISOString()
    const key = `${Date.now()}`; 
    
    chrome.storage.local.set({ [key]: { selectedText, color,date,note } });
  }
  
  
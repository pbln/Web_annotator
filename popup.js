document.addEventListener('DOMContentLoaded', () => {
    const sortOptions = document.getElementById('sortOptions');
    sortOptions.addEventListener('change', renderSortedHighlights);
    
    renderSortedHighlights(); 
});

function renderSortedHighlights() {
    chrome.storage.local.get(null, (items) => {
    const sortOption = sortOptions.value ; // by default its date
    let highlights = Object.entries(items).filter(([key, value]) => value.selectedText); // convert to array of key and value , like my key was date.now , unique for all , and value will basically be an object with properties like text , color etc
    //know by console.log(items)       
    
    
    //sorting logic
    if(sortOption === 'date'){
    highlights.sort(([,a],[,b]) =>{
        const dateA = new Date(a.date); // a is basically the complete value object , and we will acess its date property
        const dateB = new Date(b.date);
        return dateA - dateB;
    })
    }
    else if(sortOption === 'color'){
    highlights.sort(([, a], [, b]) => {
     const colorA = a.color || '';
     const colorB = b.color || '';
     return colorA.localeCompare(colorB);
    });
    }

    //rendering part ; 
    const highlightsContainer = document.getElementById('highlights');

    highlightsContainer.innerHTML = ''; 
    
    highlights.forEach(([key,value])=>{
        const highlight = document.createElement('div');
        highlight.className='highlight'
        highlight.style.backgroundColor = value.color ; 
        highlight.textContent = value.selectedText ;

        if(value.note){
            const comment = document.createElement('p');
            comment.textContent = `Note: ${value.note}`;
            highlight.appendChild(comment);  
        }
        
        
        const btn = document.createElement('button');
        btn.className = 'delete-button';
        btn.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome icon

        btn.dataset.storageKey = key;

        btn.addEventListener('click', () => {
            highlightsContainer.removeChild(highlight);
            chrome.storage.local.remove(btn.dataset.storageKey, () => {
                console.log(`Item with key "${btn.dataset.storageKey}" removed.`);
            });
        });

        highlight.appendChild(btn);
        highlightsContainer.appendChild(highlight);

    })


})}
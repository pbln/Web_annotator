
document.addEventListener('DOMContentLoaded', () => {
    const sortOptions = document.getElementById('sortOptions');
    sortOptions.addEventListener('change', () => renderSortedHighlights(sortOptions));
    
    const dlt_all = document.getElementById('dltall')
    dlt_all.addEventListener('click' ,  delete_all) ;

    renderSortedHighlights(sortOptions); 
});


function delete_all(){
chrome.storage.local.clear(() => {
    console.log('All items cleared from chrome.storage.local');
    });
    render([])
}

function renderSortedHighlights(sortOptions) {
    chrome.storage.local.get(null, (items) => {
    const sortOption = sortOptions.value ; 
    let highlights = Object.entries(items).filter(([key, value]) => value.selectedText); // convert to array of key and value , like my key was date.now , unique for all , and value will basically be an object with properties like text , color etc
    //know by console.log(items)       
    
    
    //sorting logic
    if(sortOption === 'date'){
    highlights.sort(([,a],[,b]) =>{
        const dateA = new Date(a.date); // a is basically the complete value object , and we will acess its date property
        const dateB = new Date(b.date);
        return dateB - dateA; //newer first
    })
    }
    else if(sortOption === 'color'){
    highlights.sort(([, a], [, b]) => {
     const colorA = a.color || '';
     const colorB = b.color || '';
     return colorA.localeCompare(colorB);
    });
    }
    
    const highlightsContainer = document.getElementById('highlights');

    highlightsContainer.innerHTML = ''; 
    
    highlights.forEach(([key,value])=>{
        const highlight = document.createElement('div');
        highlight.className='highlight'
        highlight.style.backgroundColor = value.color ; 
        highlight.textContent = value.selectedText ;

        const dateElement=document.createElement('p')

        dateElement.innerText= new Date(value.date).toDateString() ;

        if(value.note){
            const comment = document.createElement('p');
            comment.className='comment'
            comment.textContent = `Note: ${value.note}`;
            highlight.appendChild(comment);  
        }
        
        
        const btn = document.createElement('button');
        btn.className = 'delete-button';
        btn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>'; 

        btn.dataset.storageKey = key;

        btn.addEventListener('click', () => {
            highlightsContainer.removeChild(highlight);
            chrome.storage.local.remove(btn.dataset.storageKey, () => {
            console.log(`Item with key "${btn.dataset.storageKey}" removed.`);
            });
        });

        const savebtn = document.createElement('button')
        savebtn.className = 'save-btn';
        savebtn.innerHTML = '<i class="fa-solid fa-circle-down"></i>'; 


        savebtn.addEventListener('click',()=>{
        save_to_pdf(value.url , value.selectedText )
        })


        highlight.appendChild(dateElement);
        highlight.appendChild(btn);
        highlight.appendChild(savebtn) ;
        highlightsContainer.appendChild(highlight);

    })


})}
  
   
    


  function save_to_pdf(url,selectedText){
    const text = `
Site URL : ${url}
 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

Highlighted Text :
${selectedText}
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
        
-By SimplyHighlight.
            
 `;


        const blob = new Blob([text] , {type:'text/plain'});
        const anchor = document.createElement('a');
        anchor.download = 'highlight.txt';
        anchor.href = window.URL.createObjectURL(blob);
        anchor.click();
  }
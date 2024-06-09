let arr= {};
document.addEventListener('DOMContentLoaded' , ()=>{
    const sortOptions = document.getElementById('sortOptions');
    sortOptions.addEventListener('change', () => render_highlights(sortOptions));
})

function render_highlights(sortOptions){
    const sortOption = sortOptions.value || "date";
    chrome.storage.local.get(null , (items)=>{
    let highlights = Object.entries(items).filter(([key, value]) => value.selectedText);

    if(sortOption === 'date'){
        highlights.sort(([,a],[,b]) =>{
            const dateA = new Date(a.date); // a is basically the complete value object , and we will acess its date property
            const dateB = new Date(b.date);
            return dateB - dateA; //newer first
        })
        }
    
        const highlightsContainer = document.getElementById('highlights');
        highlightsContainer.innerHTML = ''; 

       
 
     highlights.forEach(([key,value])=>{
        const highlight = document.createElement('div');
        highlight.className='highlight'
        if(!arr[value.url]){
        arr[value.url] = []
        render_unique_url(value.url , value.date , value.title,highlight,highlightsContainer);
        }
       
        
    }); 
})
}

  
render_highlights('')

function render_unique_url(url,date , title ,highlight ,highlightsContainer ){
    const dateElement = document.createElement('h2')
    dateElement.textContent = new Date(date).toDateString() ;
     
    const urlelement = document.createElement('h2')
    urlelement.textContent = title;

    const url_link = document.createElement('p')
    url_link.innerHTML = `<a href='${url}' , target="_blank"><i class="fa fa-link"></i>${url}</a>`;

    highlight.appendChild(urlelement);
    highlight.appendChild(url_link);
    
    console.log(arr)
   
   
    highlight.appendChild(dateElement);
   
    highlightsContainer.appendChild(highlight);
}
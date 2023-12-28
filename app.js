const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const searchResults = document.getElementById('search-results')

async function searchWikipedia(query){
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

  const response = await fetch(endpoint);

  if(!response.ok){
    throw new Error("Failed!");
  }

  const json = await response.json();
  return json;

}
function displayResults(results){
    searchResults.innerHTML=''

    results.forEach((result) => {
        const url = `https://en.wikipedia.org/?curid=${results.pageid}`;
        const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title}</a>`;
        const urlLink = `<a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>`;

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
        <h3 class="result-title">${titleLink}</h3>
        ${urlLink}
        <p class="result-snippet">${result.snippet}</p>`;

        searchResults.appendChild(resultItem);
    })
}
searchForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const query = searchInput.value.trim();

    if(!query){
        searchResults.innerHTML="<p>Please enter valid search term.</p>"
        return;
    }
    searchResults.innerHTML = "<div class='spinner'>Loading...</div>";

    try{
        const results = await searchWikipedia(query);

        if(results.query.searchinfo.totalhits === 0){
            searchResults.innerHTML="<p>No results found.</p>"

        }else{
            displayResults(results.query.search);
        }
    }catch (e){
        console.error(e);
        searchResults.innerHTML="<p>An error occured! Please try again..</p>"
    }
})

// Theme toggler
const themeToggler = document.getElementById('theme-toggler');
const body = document.body;

themeToggler.addEventListener("click", ()=>{
    body.classList.toggle("dark-theme");
    if(body.classList.contains("dark-theme")){
        themeToggler.textContent="Light";
        themeToggler.style.background = "#fff";
        themeToggler.style.color = "#333";
    }else{
        themeToggler.textContent="Dark";
        themeToggler.style.border = "2px solid #ccc";
        themeToggler.style.color = "#333";
    }
})
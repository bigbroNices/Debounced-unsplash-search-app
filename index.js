import { showMore } from "./utils.js/scripts.js";
import { accessKey } from "./accessKey.js";

//const accessKey = "YOUR_UNSPLASH_API_KEY";

let pageCount = 1;
let lastQuery;
const serchRow = document.querySelector('.js-search-results-row');
const inputBar = document.querySelector('.js-input-bar');

serchRow.addEventListener('click', (event) => {
    if (
      !event.target.matches('.tool-tip-button-style-download')
    ) return;

    if (event.target.matches('.tool-tip-button-style-download')) {

    console.log(event.target.dataset.imgLink);
    console.log(event.target.dataset.imgDescription);

    fetch(event.target.dataset.imgLink)
        .then((results) => {
          return results.blob()
        })
        .then((blobedResult) => {
          const imgUrl = URL.createObjectURL(blobedResult);
          const link = document.createElement('a');
          link.href = imgUrl;
          link.download =  event.target.dataset.imgDescription ||'image';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => {
            URL.revokeObjectURL(imgUrl);
          }, 100);
        })
    }
});

function renderPage(data) {
  let resultArray = data;

  if (resultArray.results.length === 0) {
    serchRow.innerHTML  = `<img src="pics/error_pic.png">`
    serchRow.classList.toggle("error-stye");
    throw new Error("results haven't been found");
  }
  if(serchRow.classList.contains("error-stye")) serchRow.classList.remove("error-stye");

  let htmlResult = '';
  resultArray.results.forEach( (result, index) => {
    htmlResult += `
      <div class="img-container">
        <img class="img" src="${result.urls.small}">
        <div class="img-tooltip">
          <div class="tooltip-container">
            <button class="tool-tip-button-style-download button-id-${index} tool-tip-button-style" data-img-link="${result.urls.full}" data-img-description="${result.alt_description}">
                Download
            </button>

            <a class="tool-tip-button-style" target="_blank" href="${result.urls.full}">
                See in full
            </a>
          </div> 
        </div>
      </div>
    `
  });
  serchRow.innerHTML += htmlResult;
};

export function fotoRequest(query, page = 1) {
  return fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}`)
  .then((responce) => {
    return responce.json()
  })
  .then((data) => {
    renderPage(data);
    //console.log(data);
    return data;
  })
  .catch((error) => {
    console.log(error);
    serchRow.innerHTML  = `<img src="pics/error_pic.png">`
    serchRow.classList.toggle(".error-stye");
  });
}

inputBar.addEventListener('input', (event) => {
  const query = event.target.value;
  if(lastQuery !== query) {
    //console.log(query);
    serchRow.innerHTML = "";
    if (query.trim() === '') return;
    pageCount = 1;
    debouncedFotoRequest(query, pageCount);
  };
  lastQuery = query;
})

const debouncedFotoRequest = debounce(fotoRequest, 1500);


function debounce(fn, delay) {
  let timeoutId;
  function returnedFn(...args) {
    clearTimeout(timeoutId);
    inputBar.classList.remove('input-bar-active');
    timeoutId = setTimeout(() => {
      fn(...args);
      inputBar.classList.add('input-bar-active');
    }, delay);
  };
  return returnedFn
}

document.querySelector('.js-show-more-button').addEventListener
('click', () => {  
  pageCount ++  
  showMore(pageCount);
});

document.querySelector('.js-show-much-more-button').addEventListener
('click', async () => {   
  for (let i = 0; i < 5; i ++ ) {
    pageCount ++ 
    await showMore(pageCount);
  } 
});


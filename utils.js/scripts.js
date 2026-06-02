import { fotoRequest } from "../index.js";

export function showMore(pageCount) {
  const container = document.querySelector('.search-results-row');
  if (container.children.length === 0) {
    return
  }
  const query = document.querySelector('.js-input-bar').value

  return fotoRequest(query, pageCount);

  console.log(query)
} 

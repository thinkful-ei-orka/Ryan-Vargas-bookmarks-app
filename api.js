//will eventually add universal error handling here

'use strict';
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/kieran-v';

function getBookmarks() {
  return fetch(`${BASE_URL}/bookmarks`);
}

//universal bookmark entity? one param
function createBookmark(title, url, rating, desc) {
  let newBookmark = {
    'title': title,
    'url': url,
    'rating': rating,
    'desc': desc,
  };
  let bookmarkString = JSON.stringify(newBookmark);
  return fetch (`${BASE_URL}/bookmarks`, {method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: bookmarkString});
}

function updateBookmark(id, updateData) {
  let updateString = JSON.stringify(updateData);
  return fetch (`${BASE_URL}/bookmarks/${id}`, {method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: updateString});
}

function removeBookmark(id) {
  return fetch(`${BASE_URL}/bookmarks/${id}`, {method: 'DELETE'});
}

export default {
    getBookmarks,
    createBookmark,
    updateBookmark,
    removeBookmark,
}
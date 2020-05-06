import store from './store.js';
import api from './api.js'
import core from './core.js'

const main = function() {
    api.getBookmarks()
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            store.errorMessage = res.statusText;
            store.error = 1;
            renderContent()
            throw new Error(store.errorMessage);
        })
        .then((list) => {
            store.error = 0;
            list.forEach((bookmark) => store.addBookmark(bookmark));
            core.renderContent();
        });
    core.bindEventListeners();
};

$(main);
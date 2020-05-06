import store from './store.js';
import api from './api.js';

function generateMainContentStructure(bookmarks) {
    let bookmarkStructure = '';
    let description = ''
    let rating = ''
    let filteredBookmarks = [];

    if(store.filter !== 0) {
        filteredBookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);
    } else {
        filteredBookmarks = bookmarks;
    }
    
    filteredBookmarks.forEach(bookmark => {
        if(bookmark.desc !== null) {
            description = bookmark.desc; 
            } else {
                description = 'Description not available.'
            }
            
            let ratingStructure = '';
            if(bookmark.rating !== null) {
                rating = bookmark.rating;
                for(let i = 1; i <= rating; i++) {
                    ratingStructure += `<div class="rating-display"</div>`
                }
            } else {
                ratingStructure = `<div class="null-rating">No Rating</div>`;
            }

            if(bookmark.expanded) {
                bookmarkStructure += `
                <div class="main-container">
                    <div class="bookmark-container">
                        <div class="title-container">${bookmark.title}</div>
                        <div class="rating-container">${ratingStructure}</div>
                    </div>
                    <div class="info-container" data-bookmark-id="${bookmark.id}">
                        <div class="top-info">
                            <div class="top-info-url-container">
                                <button onclick="window.location.href = '${bookmark.url}';" class="info-button">Visit Site</button>
                            </div>
                            <div class="info-controls">
                                <button class="info-edit-button">Edit</button>
                                <button class="info-delete-button">Delete</button>
                            </div>
                        </div>
                        <div class="bottom-info">
                            ${description}
                        </div>
                    </div>
                </div>
                `;
            } else {
                bookmarkStructure += `
                <div class="main-container">
                    <div class="bookmark-container">
                        <div class="title-container">${bookmark.title}</div>
                        <div class="rating-container>${ratingStructure}</div>
                    </div>
                    <div class="info-container" data-bookmark-id="${bookmark.id}"</div>
                </div>
                `;
            }
        });

    let mainStructure = `
        <div class="primary-container">
            <div class="upper-container">
                <button class="new-bookmark-button">Add Bookmark</button>
                <select name="filter-menu" class="bookmark-filter-menu">
                    <option disabled selected>Filter By:</option>
                    <option value="0">Display All</option>
                    <option value="1">1 Star Minimum</option>
                    <option value="2">2 Star Minimum</option>
                    <option value="3">3 Star Minimum</option>
                    <option value="4">4 Star Minimum</option>
                    <option value="5">5 Star Minimum</option>
                </select>
            </div>
            <div class="lower-container">
                ${bookmarkStructure}
            </div>
        </div>
        `
    return mainStructure;   
}

function generateCreatorControls(bookmark) {
    let header = 'Add New Bookmark:';
    let title = '';
    let url = '';
    let description = '';
    let rating = -1;
    let ratingValue = '';
    let buttonString = `<button type="submit" class="create-button">Create</button>`;
    let formString = '<form class="submission-form">';

    if(store.edit) {
        header = 'Edit Bookmark';
        title = `value="${bookmark.title}"`;
        url = `value="${bookmark.url}"`;
        rating = bookmark.rating;
        buttonString = `<button type="submit" class="edit-button">Save</button>`;
        formString = '<form class="edit-form">';

        if(bookmark.desc === null) {
            description = '';
        } else {
            description = bookmark.desc;
        }
    }

    for(let i = 1; i <= 5; i++) {
        let checked = '';
        if(i === Number(rating) && store.edit) {
            checked = 'checked';
        }
        ratingValue += `<input type="radio" name="rating" class="add-rating" id="rating${i}" value="${i}" ${checked}>
        <label class="rating-count" for="rating${i}"> <p>${i}</p> </label>`
    }

    let generateStructure = `
    <div class="primary-container">
        ${formString}
            <div class="creator-upper-container">
                <label for "creator-input">${header}</label>
                <input type="url" name="url" class="creator-page-url" placeholder="https://www.your-site.com" ${url} required>
            </div>
            <div class="creator-lower-container">
                <div class="lower-top">
                    <input type="text" name="title" class="creator-page-title" placeholder="Title" ${title} required>
                </div>
                <div class="lower-bottom">
                    <div class="creator-rating">
                        ${ratingValue}
                    </div>
                    <textarea name="description" class="creator-description" placeholder="Description" required>${description}</textarea>
                </div>
                </div>
                <div class="creator-error-message" hidden>Error! ${store.errorMessage}</div>
                <div class="creator-button-container">
                    <button class="cancel-button">Cancel</button>
                    ${buttonString}
                </div>
            </form>
        </div>
        `;
    return generateStructure;
}

function generatePageString(data) {
    let pageString = '';
    let bookmark = store.findById(store.tempId);
    if(store.adding) {
        pageString = generateCreatorControls(bookmark);
    } else {
        pageString = generateMainContentStructure(data);
    }
    return pageString;
}

function renderContent() {
    const pageString = generatePageString(store.bookmarks);
    $('main').html(pageString);
    if(store.error === 1) {
        $('.creator-error-message').removeClass('hidden');
    } else if(store.error === 0) {
        $('.creator-error-message').addClass('hidden');
    }
}

//event listeners

function acquireId(target) {
    return $(target)
        .closest('.main-container')
        .find('.info-container')
        .data('bookmark-id');
}

function handleExpandBookmark() {
    $('main').on('click', '.bookmark-container', event => {
        const id = acquireId(event.currentTarget);
        const item = store.findById(id);
        const itemConfig = {expanded: !item.expanded};
        store.findAndUpdate(id, itemConfig);
        renderContent();
    });
}

function handleNewButtonClicked() {
    $('main').on('click', '.new-bookmark-button', event => {
        store.adding = true;
        store.edit = false;
        renderContent();
    });
}

function handleCancelButtonClicked() {
    $('main').on('click', '.cancel-button', event => {
        store.error = 0;
        store.adding = false;
        store.edit = false;
        renderContent();
    });
}

function handleCreateButtonClicked() {
    $('main').on('submit', '.submission-form', event => {
        event.preventDefault();
        const bookmarkTitle = $('.creator-page-title').val();
        const bookmarkUrl = $('.creator-page-url').val();
        const bookmarkDescription = $('.creator-description').val();
        const bookmarkRating = $('input[name="rating"]:checked').val();

        api.createBookmark(bookmarkTitle, bookmarkUrl, bookmarkRating, bookmarkDescription)
            .then(res => {
                if(res.ok) {
                    return res.json();
                }
                if(bookmarkTitle === '' || bookmarkUrl === '' || bookmarkDescription === '') {
                    store.errorMessage = 'You must provide a title, URL, and description.';
                } else {
                    store.errorMessage = res.statusText;
                } 
                store.error = 1;
                renderContent();
                throw new Error(store.errorMessage);
            })
            .then((response) => {
                store.error = 0;
                store.adding = false;
                store.addBookmark(response);
                renderContent();
            }).catch(error => console.error(error))
    });
}

function handleDeleteButtonClicked() {
    $('main').on('click', '.info-delete-button', event =>{
        const id = acquireId(event.currentTarget);
        api.removeBookmark(id)
            .then(res => {
                if(res.ok) {
                    return res.json();
                }
                store.errorMessage = res.statusText;
                store.error = 1;
                renderContent();
                throw new Error(store.errorMessage);
            })
            .then((response) => {
                store.error = 0;
                store.findAndDelete(id);
                renderContent();
            }).catch(err => console.error(err.message));
    });
}

function handleEditButtonClicked() {
    $('main').on('click', '.info-edit-button', event => {
        console.log('edit button clicked')
        store.edit = true;
        store.adding = true;
        const id = acquireId(event.currentTarget);
        store.tempId = id;
        renderContent();
    });
}

function handleEditSubmission() {
    $('main').on('submit', '.edit-form', event => {
        event.preventDefault();
        const bookmarkTitle = $('.creator-page-title').val();
        const bookmarkUrl = $('.creator-page-url').val();
        const bookmarkDescription = $('.creator-description').val();
        const bookmarkRating = $('input[name="rating"]:checked').val();
        const id = store.tempId;

        const updatedBookmark = {
            'title': bookmarkTitle,
            'url': bookmarkUrl,
            'rating': bookmarkRating,
            'desc': bookmarkDescription
        }
        api.updateBookmark(id, updatedBookmark)
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            if(bookmarkTitle === '' || bookmarkUrl === '' || bookmarkDescription === '') {
                store.errorMessage = 'You must provide a title, URL, and description.';
            } else {
                store.errorMessage = res.statusText;
            } 
            store.error = 1;
            renderContent();
            throw new Error(store.errorMessage);
        })
        .then((response) => {
            store.findAndUpdate(id, updatedBookmark);
            store.error = 0;
            store.adding = false;
            store.edit = false;
            store.tempId = 0;
            renderContent();
        }).catch(err => console.error(err))
    });
}

function handleFiltering() {
    $('main').on('change', '.bookmark-filter-menu', event => {
        const filteredRating = $('.bookmark-filter-menu option:selected').val();
        store.filter = Number(filteredRating);
        renderContent();
    });
}

function bindEventListeners() {
    handleNewButtonClicked();
    handleCreateButtonClicked();
    handleEditButtonClicked();
    handleEditSubmission();
    handleDeleteButtonClicked();
    handleCancelButtonClicked();
    handleExpandBookmark();
    handleFiltering();
}

export default {
    bindEventListeners,
    renderContent
}
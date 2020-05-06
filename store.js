const bookmarks = [];
const adding = false; 
const error = 0;
const errorMessage = "";
const filter = 0;
const edit = false;
const tempId = 0;

function findById(id) {
    return this.bookmarks.find(currentItem => currentItem.id === id);
};

function addBookmark (item) {
    let expandedObject = {
        expanded: false
    }; 

    Object.assign(item, expandedObject);
    this.bookmarks.push(item);
}

function findAndUpdate (id, newData) {
    let newItem = this.findById(id);

    Object.assign(newItem, newData);
}

function findAndDelete (id) {
    this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};


export default {
    bookmarks,
    adding,
    error,
    errorMessage,
    filter,
    edit,
    tempId,
    addBookmark,
    findById,
    findAndUpdate,
    findAndDelete
}
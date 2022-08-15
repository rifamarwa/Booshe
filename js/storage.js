const SAVED_EVENT = 'saved-book';

function findBook(bookID){
    for (const bookItem of books){
        if (bookItem.id === bookID){
            return bookItem;
        }
    }
    return null;
}


function findBookIndex(bookID){
    for (const index in books){
        if(books[index].id === bookID){
            return index;
        }
    }
    return -1;
}


function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveBookData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


function isStorageExist(){
    if(typeof (Storage) === undefined){
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
})
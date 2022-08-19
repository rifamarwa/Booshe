const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener(RENDER_EVENT, function() {
    const recentlyBookList = document.getElementById("recentBook");
    recentlyBookList.innerHTML = '';

    const recentBooks = books.sort((a,b) => b.id - a.id).filter((book, index) => index < 6 && book);

    for (const bookItem of recentBooks){
        const recentBookElement = makeRecentBooks(bookItem);
        recentlyBookList.append(recentBookElement);
    }
    
   
    const unfinishedBook = document.getElementById('unfinished-book');
    unfinishedBook.innerHTML = '';

    const finishedBook = document.getElementById('finished-book');
    finishedBook.innerHTML = '';

    for (const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(bookItem.isCompleted){
            finishedBook.append(bookElement);
        } else {
            unfinishedBook.append(bookElement);
        }
    }
})


function generateBookID(){
    return +new Date();
}


function generateBookObject(id, title, author, year, cover, isCompleted){
    return {
        id,
        title,
        author,
        year,
        cover,
        isCompleted
    }
}


function addBook() {
    const bookTitle = document.getElementById('addBookTitle').value;
    const bookAuthor = document.getElementById('addBookAuthor').value;
    const bookPublishedYear = document.getElementById('addPublishedYear').value;
    const bookCover = document.getElementById('addBookCover').value;
    const bookStatus = document.getElementById('addIsCompleted');
    const bookID = generateBookID();

    console.log(bookCover);

    if (bookStatus.checked){
        const bookObject = generateBookObject(
            bookID,
            bookTitle,
            bookAuthor,
            bookPublishedYear,
            bookCover,
            true
           );
        books.push(bookObject);
    } else {
        const bookObject = generateBookObject(
            bookID,
            bookTitle,
            bookAuthor,
            bookPublishedYear,
            bookCover,
            false
           );
        books.push(bookObject);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
}


function makeBook(bookObject){
    const newBookCover = document.createElement('img');
    newBookCover.classList.add('book-cover');
    newBookCover.srcset = bookObject.cover;

    const newBookTitle = document.createElement('h6');
    newBookTitle.setAttribute('id', 'bookTitle');
    newBookTitle.innerText = bookObject.title;

    const newBookAuthor = document.createElement('h7');
    newBookAuthor.innerText = bookObject.author;

    const newBookPublished = document.createElement('h8');
    newBookPublished.innerText = bookObject.year;

    const removeButton = document.createElement('button');
    removeButton.classList.add('btn');
    removeButton.className += ' trash-button';
    removeButton.style = "background-color: #E83D30; color: white;"
    removeButton.innerText = 'Remove';
    
    removeButton.addEventListener('click', function () {
        removeBookFromFinished(bookObject.id);
    });

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    textContainer.append(newBookTitle, newBookAuthor, newBookPublished); 
    
    const buttonOverlay = document.createElement('div');
    buttonOverlay.classList.add('button-overlay');

    if (bookObject.isCompleted){
        const unfinishedButton = document.createElement('button');
        unfinishedButton.setAttribute('type', 'submit');
        unfinishedButton.setAttribute('id', 'unfinishedButton');
        unfinishedButton.classList.add('btn');
        unfinishedButton.style = "background-color: #F0F423; color: black; width: fit-content";
        unfinishedButton.innerText = 'Unfinished';

        unfinishedButton.addEventListener('click', function(){
            undoBookFromFinished(bookObject.id);
        })
        buttonOverlay.append(unfinishedButton, removeButton);    
        

    } else {
        const finishedButton = document.createElement('button');
        finishedButton.setAttribute('type', 'submit');
        finishedButton.setAttribute('id', 'unfinishedButton');
        finishedButton.classList.add('btn');
        finishedButton.style = "background-color: #29A714; color: white;"
        finishedButton.innerText = 'Finished';

        finishedButton.addEventListener('click', function(){
            addBookToFinished(bookObject.id);
        })

        buttonOverlay.append(finishedButton, removeButton);   
    }

    const coverContainer = document.createElement('div');
    coverContainer.classList.add('cover-container');
    coverContainer.append(newBookCover, buttonOverlay);

    const container = document.createElement('div');
    container.classList.add('item-card');
    container.className += ' col';
    container.append(coverContainer, textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    return container;
}


function searchBook(keyword){
    const filter = keyword.toUpperCase();
    const judul = document.getElementsByTagName('h6');

    for (let i = 0; i < judul.length; i++){
        const judulItem = judul[i].textContent || judul[i].innerText;
        if (judulItem.toUpperCase().indexOf(filter) > -1){
            judul[i].closest(".item-card").style.display = "block";
        } else {
            judul[i].closest(".item-card").style.display = "none";
        }
    }
}


function addBookToFinished(bookID){
    const bookTarget = findBook(bookID);
    if (bookTarget == null) {
        return;
    }
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
}


function removeBookFromFinished(bookID){
    const bookTarget = findBookIndex(bookID);
    const deleteConfirm = window.confirm("Delete this book?");

    if (deleteConfirm){
        if(bookTarget === -1){
            return
        }
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveBookData();
        alert("Successfully deleted.");
    } 
}


function undoBookFromFinished(bookID){
    const bookTarget = findBook(bookID);
    if (bookTarget == null) {
        return;
    }
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
}


function makeRecentBooks(bookObject){
    const recentBookCover = document.createElement('img');
    recentBookCover.classList.add('book-cover');
    recentBookCover.srcset = bookObject.cover;

    const recentBookTitle = document.createElement('h6');
    recentBookTitle.setAttribute('id', 'bookTitle');
    recentBookTitle.innerText = bookObject.title;

    const recentBookAuthor = document.createElement('h7');
    recentBookAuthor.innerText = bookObject.author;

    const recentBookPublished = document.createElement('h8');
    recentBookPublished.innerText = bookObject.year; 

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    textContainer.append(recentBookCover, recentBookTitle, recentBookAuthor, recentBookPublished); 

    const container = document.createElement('div');
    container.classList.add('item-card');
    container.className += ' col';
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    return container;
}

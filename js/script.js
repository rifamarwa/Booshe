document.addEventListener('DOMContentLoaded', function(){

    const menu = document.getElementById('menu');
    menu.addEventListener('click', function(){
        const x = document.getElementById('nav');
            if (x.className === "navigation"){
                x.className += " responsive";
            } else {
                x.className = "navigation";
            }
    })

    const submitForm = document.getElementById('addBookForm');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
        submitForm.reset();
    })

    const searchForm = document.getElementById('searchBookForm');
    searchForm.addEventListener('submit', function(event){
        event.preventDefault();
        const inputSearch = document.getElementById('searchBookByTitle').value;
        console.log(inputSearch);
        searchBook(inputSearch);
    })

    if (isStorageExist()){
        loadDataFromStorage();
    }
})











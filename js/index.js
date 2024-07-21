document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');

    
    function fetchBooks() {
        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(books => displayBookTitles(books));
    }

   
    function displayBookTitles(books) {
        books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = book.title;
            li.addEventListener('click', () => showBookDetails(book));
            bookList.appendChild(li);
        });
    }

   
    function showBookDetails(book) {
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.thumbnailUrl}" alt="${book.title}">
            <p>${book.description}</p>
            <ul>${book.users.map(user => `<li>${user.username}</li>`).join('')}</ul>
            <button id="like-button">LIKE</button>
        `;

        document.getElementById('like-button').addEventListener('click', () => likeBook(book));
    }

    
    function likeBook(book) {
        const currentUser = { "id": 1, "username": "pouros" };
        const userHasLiked = book.users.some(user => user.id === currentUser.id);

        if (userHasLiked) {
            
            book.users = book.users.filter(user => user.id !== currentUser.id);
        } else {
            
            book.users.push(currentUser);
        }

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: book.users })
        })
        .then(response => response.json())
        .then(updatedBook => {
            showBookDetails(updatedBook); 
        });
    }

    
    fetchBooks();
});


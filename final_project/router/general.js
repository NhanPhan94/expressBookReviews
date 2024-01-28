const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop by using promise 
const getBook = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/')
      .then(respone => {
        resolve(respone.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// getBook().then(books => {
//   console.log('List of Books: ', books);
// }).catch(error => {
//   console.error('Error fetching books: ', error);
// })

public_users.get('/', function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});


});

// Get book details based on ISBN by using promise
const getBookDetail = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(respone => {
        resolve(respone.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
const isbn = 1;
getBookDetail(isbn).then(books => {
  console.log('List of Books: ', books);
}).catch(error => {
  console.error('Error fetching books: ', error);
});
//Get book details based on author by using promise
const getBookAuthor = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/author/${author}`)
      .then(respone => {
        resolve(respone.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
const author = "Chinua Achebe";
getBookAuthor(author).then(books => {
  console.log('List of Books: ', books);
}).catch(error => {
  console.error('Error fetching books: ', error);
})
// Get book detail based on title using promise

const getBookTitle = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/title/${title}`)
      .then(respone => {
        resolve(respone.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
const title = "Things Fall Apart";
getBookTitle(title).then(books => {
  console.log('List of Books: ', books);
}).catch(error => {
  console.error('Error fetching books: ', error);
})

public_users.get('/', function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});


});
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author

public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookFilter = Object.values(books).filter((book) => book.author === author);
  
  if (bookFilter.length > 0) {
    return res.status(200).json(bookFilter);
  }
  else {
    return res.status(404).json({ message: `Author not found` });
  }
  //return res.send(books[author]);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here

  const title = req.params.title;
  const titleFilter = Object.values(books).filter((book) => book.title === title);
  if (titleFilter.length > 0) {
    return res.status(200).json(titleFilter);
  } else {
    return res.status(404).json({ message: `Title not found` });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const isbnBook = books[isbn];
  if (isbnBook) {
    const reviews = isbnBook.reviews;
    if (Object.keys(reviews).length > 0) {
      return res.status(200).json(reviews);
    } else {
      return res.status(404).json({ message: `Not review found this book` });
    }
  } else {
    return res.send(`Book Not Found`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

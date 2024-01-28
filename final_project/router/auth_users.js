const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
  //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  console.log("Username: ", username);
  console.log("Password: ", password);

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    req.session.username = username;
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  //return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  
  if (book !== undefined) {
    const newReview = req.body.review;
    const username = req.session.username;

    if (newReview) {
      // Check if the book already has a reviews object or initialize it
      if (!book.reviews) {
        book.reviews = {};
      }

      // Set the new review with the username as a property
      book.reviews[username] = newReview;

      // Update the book in the 'books' object
      books[isbn] = book;

      return res.status(200).json({ message: `Review for book with ISBN ${isbn} updated` });
    } else {
      return res.status(400).json({ message: "Invalid review data" });
    }
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
  //Write your code here

  //return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; 
  console.log('ISBN:', isbn);
  console.log('Session Username:', username);
  // Assuming you have the session middleware configured

  // Check if the book with the given ISBN exists
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    console.log('Book:', book);

    // Check if the book has reviews and the session username matches the review's username
    console.log('Reviews:', book.reviews);
    console.log("Return: ", book.reviews.hasOwnProperty(username));
    console.log("Book user name:", book.reviews[username])
    if (book.reviews && book.reviews.hasOwnProperty(username)) {
      // Delete the review for the specified ISBN and username
      delete book.reviews[username];

      // Update the book in the 'books' object
      books[isbn] = book;
      console.log('Reviews:', book.reviews);

      return res.status(200).json({ message: `Review for book with ISBN ${isbn} deleted` });
    } else {
      return res.status(404).json({ message: `Review not found for the specified ISBN and username` });
    }
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

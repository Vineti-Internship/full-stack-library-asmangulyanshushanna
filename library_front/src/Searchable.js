import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export class Searchable extends Component {
    render() {
      const books = this.props.booksList;
      const bookItems = books.map((book) =>
        <li key={book.item.id}>
        {book.item.title + ". Rating: " + book.item.rating + book.authorName}
        </li>
      );
      return (
        <div >
            <ul>{bookItems}</ul>
        </div>
  
      );
    }
  }
  
  export default Searchable;
  
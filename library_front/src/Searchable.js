import React, { Component } from 'react';
import {ThemeContext} from './theme';
import logo from './logo.svg';
import './App.css';

export class Searchable extends Component {

    render() {
      let theme = this.context;
      const books = this.props.booksList;
      const bookItems = books.map((book) =>
      <li key={book.item.id} ><a href={book.item.url} style= {{color: theme.background}}>
      {`Book: ${book.item.title} | Rating: ${book.item.rating } |  
      Author: ${book.authorName}  `}
        </a>
        <button className="remove" id = {book.item.id} 
        onClick={this.props.deleteObjects}>delete</button>
        </li>
      );
      return (
        <div >
            {bookItems}
        </div>
  
      );
    }
  }
  Searchable.contextType=ThemeContext;
  
  export default Searchable;
  
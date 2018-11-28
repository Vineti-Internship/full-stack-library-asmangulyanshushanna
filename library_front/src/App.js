import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  Searchable  from './Searchable';

class App extends Component {
  constructor (props){
    super(props);
    this.state = {books: [], filteredBooksWithAuthors: [], authors: {}, loading: true}
  }
  componentDidMount(){
    Promise.all([
      fetch("http://localhost:3000/books"),
      fetch("http://localhost:3000/authors")
  ])
  .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
  .then(([data1, data2]) => this.setState({
    books: data1, 
    authors: this.convertToMap(data2),
    loading: false
  }));
  }

  convertToMap = (authors) => {
    
    return authors.map(function(item) {
      let authorMap = {id: item.id, name: item.name}
      return authorMap;
    });
  }
  filterBooks = (e) => {
    const text = e.target.value;
    this.changeFilteredBooks(text);
  }

  changeFilteredBooks = (text) => {
    const filteredBooks = this.state.books.filter(book => book.title.startsWith(text))
    console.log(filteredBooks)
    if (text) {this.setState({
      filteredBooksWithAuthors: filteredBooks.map(function(book){
        let allInfo = {item: book, authorName: this.state.authors[book.author_id]}
        console.log(this.state.filteredBooksWithAuthors)
        return allInfo;})
    });
  }else{
    this.setState({
      filteredBooksWithAuthors: []
    });

  }
}
  render() {
    if(this.state.loading===true){
      return ( 
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
        </div>
  
      );
    } else {
      return ( 
        <div>
          <input className="search" onChange={this.filterBooks}></input>
          <Searchable booksList = {this.state.filteredBooksWithAuthors}/>

        </div>
  
      );
    }

  }
}

export default App;

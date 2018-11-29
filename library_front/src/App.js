import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  Searchable  from './Searchable';

class App extends Component {
  constructor (props){
    super(props);
    this.state = {books: [], filteredBooksWithAuthors: [], authors: [], loading: true, 
      newBookTitle: "" , newBookRating: "",  newAuthorName: "", newAuthorName: "", 
      newAuthorEmail: ""}
  }
  componentDidMount(){
    Promise.all([
      fetch("http://localhost:3000/books"),
      fetch("http://localhost:3000/authors")
  ])
  .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
  .then(([data1, data2]) => this.setState({
    books: data1, 
    authors: data2,
    loading: false
  }));
  }

  filterBooks = (e) => {
    const text = e.target.value;
    this.changeFilteredBooks(text);
  }
  setBookTitle = (e) => {
    const text = e.target.value;
    this.setState({
      newBookTitle: text, 
    })
  }

  setBookRating = (e) => {
    const text = e.target.value;
    this.setState({
      newBookRating: text, 
    })
  }

  setAuthorName = (e) => {
    const text = e.target.value;
    this.setState({
      newAuthorName: text, 
    })
  }

  setAuthorEmail = (e) => {
    const text = e.target.value;
    this.setState({
      newAuthorEmail: text, 
    })
  }

  changeFilteredBooks = (text) => {
    const filteredBooks = this.state.books.filter(book => book.title.startsWith(text))
    console.log(filteredBooks)
    if (text) {this.setState({
      filteredBooksWithAuthors: filteredBooks.map(book => {
        let id = book.author_id;
        let rightAuthor = this.state.authors.filter(author => author.id === id);
        console.log(rightAuthor[0].name, 'namenamename')
        let allInfo = {item: book, authorName: rightAuthor[0].name}
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
          <input className="search" onChange={this.filterBooks} placeholder="Search">
          </input>
          <input className="data" onChange={this.setBookTitle} placeholder="Book title">
          </input>
          <input className="data" onChange={this.setBookRating} placeholder="Book rating">
          </input>
          <input className="data" onChange={this.setAuthorName} placeholder="Author name">
          </input>
          <input className="data" onChange={this.setAuthorEmail} placeholder="Author email">
          </input>
          <button className="add">Add book</button>
          <Searchable booksList = {this.state.filteredBooksWithAuthors}/>

        </div>
  
      );
    }

  }
}

export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  Searchable  from './Searchable';

class App extends Component {
  constructor (props){
    super(props);
    this.state = {books: [], filteredBooksWithAuthors: [], authors: [], loading: true, 
      newBookTitle: "" , newBookRating: "",  newAuthorName: "", newAuthorEmail: "", 
      newLink: ""}
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
  setLink = (e) => {
    const text = e.target.value;
    this.setState({
      newLink: text, 
    })
  }

  addRecord = () => {
    this.validateFields();
    let data = {
      "name": this.state.newAuthorName,
      "email": this.state.newAuthorEmail
   }
   
   fetch("http://localhost:3000/authors", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify(data)
   })
   .then(function(response){ 
    return response.json();   
   })
   .then(data => { 
   return fetch("http://localhost:3000/books", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body:  JSON.stringify({
      "title": this.state.newBookTitle,
      "rating": this.state.newBookRating,
      "url": this.state.newLink,
      "author_id": data.id
   })
 });
   }).then(function(response){ 
    console.log(response.json());   
   });
  }
  

  validateFields = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(this.state.newAuthorEmail) === false) {
      alert("Email is Not Correct");
    }
    if(this.state.newAuthorName === "" || 
    this.state.newBookTitle === "" || this.state.newLink === "") {
      alert("Please fill the fields");
    }
  }

  changeFilteredBooks = (text) => {
    const filteredBooks = this.state.books.filter(book => book.title.startsWith(text))
    if (text) {this.setState({
      filteredBooksWithAuthors: filteredBooks.map(book => {
        let id = book.author_id;
        let rightAuthor = this.state.authors.filter(author => author.id === id);
        let allInfo = {item: book, authorName: rightAuthor[0].name}
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
          <input className="data" type = "text" onChange={this.setBookTitle} placeholder="Book title">
          </input>
          <input className="data" type = "number" min="0" max="10"
          onChange={this.setBookRating} 
          placeholder="Book rating">
          </input>
          <input className="data" type = "text" onChange={this.setAuthorName} placeholder="Author name">
          </input>
          <input className="data" type = "text" onChange={this.setAuthorEmail} placeholder="Author email">
          </input>
          <input className="data" type = "text" onChange={this.setLink} placeholder="Link">
          </input>
          <button className="add" onClick = {this.addRecord}>Add book</button>
          <Searchable booksList = {this.state.filteredBooksWithAuthors}/>

        </div>
  
      );
    }

  }
}

export default App;

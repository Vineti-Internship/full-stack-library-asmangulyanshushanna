import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  Searchable  from './Searchable';
import {ThemeContext, themes} from './theme';


class App extends Component {
  constructor (props){
    super(props);
    this.state = {books: [], filteredBooksWithAuthors: [], authors: [], loading: true, 
      newBookTitle: "" , newBookRating: "",  newAuthorName: "", newAuthorEmail: "", 
      newLink: "", theme: themes.dark}
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
  })).catch(err => {
    console.log(err.message);
  });
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

  addRecord = async () => {
    this.validateFields();
    let data = {
      "name": this.state.newAuthorName,
      "email": this.state.newAuthorEmail
   }
   try {
   const responce = await fetch("http://localhost:3000/authors", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify(data)
   });
   if(responce.ok) {
     const jsonAuthor = await responce.json();
     this.addBookRecord(jsonAuthor);
     return jsonAuthor;
   } else {
     throw new Error("Failed to add author")
   }
  } catch(error) {
    console.log(error);
  }
  }

  addBookRecord =  async (author) => {
  try{
  const responce = await fetch("http://localhost:3000/books", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body:  JSON.stringify({
      "title": this.state.newBookTitle,
      "rating": this.state.newBookRating,
      "url": this.state.newLink,
      "author_id": author.id
   })
 });
  if(responce.ok) {
    const jsonBook = await responce.json();
    alert("Your Book is successfully added!")
    this.clearInputFields();
    return jsonBook;
  } else {
   throw new Error("Failed to add book")
  }
    } catch(error) {
      console.log(error);
  }
}
  
  clearInputFields = () => {
    this.setState({
      newLink: "", 
      newBookTitle: "", 
      newBookRating: "",  
      newAuthorName: "", 
      newAuthorEmail: "",
    })

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

deleteObjects = async (e) => {
  const bookID = e.target.id;
  try {
    const response  = await fetch("http://localhost:3000/books/" + bookID , {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
   });

    if(response.ok) {
      const updatedList = this.state.books.filter(book => book.id != bookID);
      const updatedListWithAuthors = this.state.filteredBooksWithAuthors.filter(
      book => book.item.id != bookID);
      this.setState({
      books: updatedList,
      filteredBooksWithAuthors: updatedListWithAuthors,
      });
  } else {
    throw new Error("Failed to delete book")
  }
} catch(error) {
  console.log(error);
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
          <div className="general">
          <input className="data" type = "text" onChange={this.setBookTitle}
          placeholder="Book title" value = {this.state.newBookTitle}>
          </input>
          <input className="data rating" type = "number" min="0" max="10"
          onChange={this.setBookRating} 
          placeholder="Book rating" value = {this.state.newBookRating}>
          </input>
          <input className="data" type = "text" onChange={this.setAuthorName} 
          placeholder="Author name" value = {this.state.newAuthorName}>
          </input>
          <input className="data" type = "text" onChange={this.setAuthorEmail} 
          placeholder="Author email" value = {this.state.newAuthorEmail}>
          </input>
          <input className="data" type = "text" onChange={this.setLink} 
          placeholder="Link" value = {this.state.newLink}>
          </input>
          
          <button className="add" onClick = {this.addRecord}>Add book</button>
          </div>
          <ThemeContext.Provider value={this.state.theme}>
          <Searchable booksList = {this.state.filteredBooksWithAuthors}
           deleteObjects = {this.deleteObjects} />
          </ThemeContext.Provider>
        </div>
  
      );
    }

  }
}

export default App;

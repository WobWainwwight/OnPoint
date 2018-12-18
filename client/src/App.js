import React, { Component } from 'react';
import {
  BrowserRouter as Router, 
  Route,
  Link,
} from "react-router-dom"
import "./css/main.css"

import ArticleCreation from "./ArticleCreation"

// Onpoint will always have the header and the footer
// So app will always render the header and footer components
// The body will be change depending on what the user is doing
export default class App extends Component {
  state = {
    data: null
  }
  componentDidMount(){
    this.callBackendAPI()
      .then(res => this.setState({data: res.express }))
      .catch(err => console.log(err))
  }
  callBackendAPI = async () => {
    const response = await fetch('/backend')
    const body = await response.json()
    
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    } 

    return body
  }
  render() {
    return (
      <Router>
        <div>
          <Header/>
          <p>{this.state.data}</p>
          <Route path='/create-article' component={ArticleCreation}/>
        </div>
      </Router>
    );
  }
}
// The header, is always there, contains links to login and menu
function Header (props) {
  return(
      <header>
          <ul id = "headerLinks">
              <li><Link to='/menu'><h1>Menu</h1></Link></li>
              <li><Link to ='/'><h1>OnPoint</h1></Link></li>
              <li><Link to='/create-article'><h1>Create Article</h1></Link></li>
              <li><Link to='/login'><h1>Login</h1></Link></li>
          </ul>
      </header>        
  )
}



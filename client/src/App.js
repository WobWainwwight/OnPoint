import React, { Component } from 'react';
import {
  BrowserRouter as Router, 
  Route,
  Link,
} from "react-router-dom"
import "./css/main.css"

import ProtectedRoute from './ProtectedRoute'
import ArticleCreation from "./ArticleCreation"
import LoginPage from "./Login"
import Home from "./Home"

// Onpoint will always have the header and the footer
// So app will always render the header and footer components
// The body will be change depending on what the user is doing
export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isAuthenticated: false,
    }
    this.authenticate = this.authenticate.bind(this)
  }
  // sets whether the user is authorised or not
  authenticate(trueOrFalse){
    this.setState({
      isAuthenticated: trueOrFalse,
    })
  }
  render() {
    return (
      <Router>
        <div>
          <Header isAuthenticated = {this.state.isAuthenticated}/>
          <Route exact path='/' component={Home} />
          <ProtectedRoute path='/create-article' component={ArticleCreation} isAuthenticated={this.state.isAuthenticated}/>
          <Route path='/login' 
            render={(routeProps) => (
              <LoginPage {...routeProps} authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated}/>
            )}
          />
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



import React, { Component } from 'react';
import {
  BrowserRouter as Router, 
  Route,
  Link,
} from "react-router-dom"
import "./css/main.css"

import ProtectedRoute from './ProtectedRoute'
import ArticleCreation from "./components/ArticleCreation"
import LoginPage from "./components/Login"
import Home from "./components/Home"
import Signup from "./components/Signup"
import ProfilePage from "./components/ProfilePage"

// Onpoint will always have the header and the footer
// So app will always render the header and footer components
// The body will be change depending on what the user is doing
export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isAuthenticated: false,
      userInfo: null,
    }
    this.authenticate = this.authenticate.bind(this)
  }
  
  // sets whether the user is authorised or not
  authenticate(trueOrFalse){
    const userInfo = JSON.parse(localStorage.getItem("OPuserInfo"))
    console.log("Userinfo",userInfo)
    this.setState({
      isAuthenticated: trueOrFalse,
      userInfo: userInfo
    })
    console.log("STATE u info",this.state.userInfo)
  }
  render() {
    return (
      <Router>
        <div>
          <Header isAuthenticated = {this.state.isAuthenticated} userInfo = {this.state.userInfo}/>
          <Route exact path='/' component={Home} />
          <ProtectedRoute path='/create-article' component={ArticleCreation} isAuthenticated={this.state.isAuthenticated}/>
          <Route path='/signup' component={Signup}/>
          <Route path='/login' 
            render={(routeProps) => (
              <LoginPage {...routeProps} authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated}/>
            )}
          />
          <ProtectedRoute path='/profile/:userId' component={ProfilePage} isAuthenticated={this.state.isAuthenticated}/>
        </div>
      </Router>
    );
  }
}
// The header, is always there, contains links to login and menu
function Header (props) {
  if(props.isAuthenticated === true){
    return(
      <header>
          <ul id = "headerLinks">
              <li><Link to='/menu'><h1>Menu</h1></Link></li>
              <li><Link to ='/'><h1>OnPoint</h1></Link></li>
              <li><Link to={`/profile/${props.userInfo.id}`}><h1>{props.userInfo.firstname}</h1></Link></li>
          </ul>
      </header>        
    )
  }
  else{
    return(
      <header>
          <ul id = "headerLinks">
              <li><Link to='/menu'><h1>Menu</h1></Link></li>
              <li><Link to ='/'><h1>OnPoint</h1></Link></li>
              <li><Link to='/login'><h1>Login</h1></Link></li>
          </ul>
      </header>   
    )
  }
  
}



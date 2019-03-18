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
import Feed from "./components/Feed"
import Signup from "./components/Signup"
import ProfilePage from "./components/ProfilePage"
import Article from "./components/ArticlePage"

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
    if(trueOrFalse === true){
      const userInfo = JSON.parse(localStorage.getItem("OPuserInfo"))
      console.log("Userinfo",userInfo)
      this.setState({
        isAuthenticated: trueOrFalse,
        userInfo: userInfo
      })
      console.log("STATE u info",this.state.userInfo)
    }
    else{
      // delete cookie and local storage
      document.cookie = "OPtoken; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      localStorage.removeItem('OPuserInfo')
      this.setState({
        isAuthenticated: false, 
      })
    }
    
  }
  render() {
    return (
      <Router>
        <div className="wrapper">
          <Header isAuthenticated = {this.state.isAuthenticated} userInfo = {this.state.userInfo}/>
          <Route exact path='/' 
            render={(routeProps) =>(
              <Feed {...routeProps} className='feed'/>
            )} 
          />
          <ProtectedRoute path='/create-article/:userId' component={ArticleCreation} isAuthenticated={this.state.isAuthenticated}/>
          <Route path='/signup' component={Signup}/>
          <Route path='/login' 
            render={(routeProps) => (
              <LoginPage {...routeProps} authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated}/>
            )}
          />
          <ProtectedRoute path='/profile/:userId' component={ProfilePage}
            isAuthenticated={this.state.isAuthenticated} 
            authenticate={this.authenticate}
          />
          <Route
            path='/article/:articleId'
            component={Article}
          />
        </div>
      </Router>
    );
  }
}

// The header, is always there, contains links to login and menu
function Header (props) {
  if(props.isAuthenticated === true){
    return(
      <header className='header'>
        <ul>
          <li><Link to ='/' style={{textDecoration:'none',color:'black'}}><h1>Shouter</h1></Link></li>
          <li className='loginButton'><Link to={`/profile/${props.userInfo.id}`}>{props.userInfo.firstname}</Link></li>
        </ul>
        
      </header>        
    )
  }
  else{
    return(
      <header className='header'>
        <div></div>
        <ul>
          <li><Link to ='/'style={{textDecoration:'none', color:'black'}}><h1>Shouter</h1></Link></li>
          <li className='loginButton'><Link to='/login'>Login</Link></li>
        </ul>
        
      </header>   
    )
  }
  
}




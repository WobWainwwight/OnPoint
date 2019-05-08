import React, { Component } from 'react';
import {
  BrowserRouter as Router, 
  Route,
  Link,
} from "react-router-dom"
import "./css/main.css"
import logo from "./images/shouter-logo.svg"
import ProtectedRoute from './ProtectedRoute'
import ArticleCreation from "./components/ArticleCreation"
import LoginPage from "./components/Login"
import Feed from "./components/Feed"
import Signup from "./components/Signup"
import ProfilePage from "./components/ProfilePage"
import Article from "./components/ArticlePage"
import getCookie from "./getCookie"

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
    this.tokenToApi = this.tokenToApi.bind(this)
  }
  componentDidMount(){
    //check for cookie
    var cookies = getCookie()
    console.log("Cookie",cookies)
    if(cookies !== null){
      // extract token from cookie
      const regex = /OPtoken=([A-Za-z.\-_0-9]*)/
      let match = cookies.match(regex)
      if(match !== null){
        console.log(match)
        let token = match[1]
        // send to API
        const tokenObj = { token: token }
        this.tokenToApi(tokenObj)
        .then(res => {
          if(res.accepted === true){
            // set local storage
            var userInfoString = JSON.stringify(res.OPuserInfo)
            localStorage.setItem('OPuserInfo',userInfoString)
            // authenticate
            this.authenticate(true)
          }
        })
      }
    }   
  }
  tokenToApi = async (tokenObj) => {
    const response = await fetch('/check-token',{
      method: 'POST',
      headers: {
        'Accept':'application/json, text/plain, */*',
        'Content-type':'application/json'
      },
      body: JSON.stringify(tokenObj)
    })
    const body = await response.json()
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    } 
    return body
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
          <li><Link to ='/' style={{textDecoration:'none',color:'black'}}><img src={logo} alt='Shouter'/></Link></li>
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
          <li><Link to ='/'style={{textDecoration:'none', color:'black'}}><img src={logo} alt='Shouter'/></Link></li>
          <li className='loginButton'><Link to='/login'>Login</Link></li>
        </ul>
      </header>   
    )
  }  
}
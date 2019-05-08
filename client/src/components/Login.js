import React from "react"
import { Redirect, Link } from 'react-router-dom'

export default class LoginPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      enteredEmail: '',
      enteredPassword: '',
      submitted: false,
      accepted: false,
      message: 'Enter your Email and password',
      isAuthenticated: this.props.isAuthenticated,
      secretNumber: ''
    }
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.validate = this.validate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitToAPI = this.submitToAPI.bind(this)
    this.handleSecret = this.handleSecret.bind(this)
  }
  handleEmail(value){
    this.setState({
      enteredEmail: value
    })
  }
  handlePassword(value){
    this.setState({
      enteredPassword: value
    })
  }
  // calls API after quick validation, changes message and accepted depending
  // on result from API call
  handleSubmit(){
    if (this.validate() !== true){
      this.setState({
        message: 'Try agin'
      })   
    }
    else {
      console.log('State',this.state)
      const email = this.state.enteredEmail
      const password = this.state.enteredPassword
      const data = {
        email: email,
        password: password,
      }
      console.log("Here",data)
      this.submitToAPI(data)
      .then(res => {
        console.log("res",res)
        this.setState({ 
          message: res.message,
          accepted: res.accepted
        })
        if(this.state.accepted === true){
          // put JWT in cookie, first deleting an already existing one
          document.cookie = "OPtoken; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          // expiry date is set as one day later
          var expiryDate = new Date()
          expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000))
          document.cookie = "OPtoken=" + res.OPtoken + "; expires=" + expiryDate.toUTCString() + ";path=/"
          // store info in local storage
          console.log("res",res)
          console.log("USERINGo",res.OPuserInfo)
          var userInfoString = JSON.stringify(res.OPuserInfo)
          localStorage.setItem('OPuserInfo',userInfoString)
          setTimeout(() => {
            this.props.authenticate(true) 
            // calling setState re renders the component causing a redirect since isAuthenticated is now true
            this.setState({
              isAuthenticated: this.props.isAuthenticated
            })// reset to time once development is done
          }, 1400)
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({
          message: 'There was a problem, try again later'
        })
      })
    }
  }
  // POSTs email and password to API
  submitToAPI = async (uAndE) => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Accept':'application/json, text/plain, */*',
        'Content-type':'application/json'
      },
      body: JSON.stringify(uAndE)
    })
    const body = await response.json()
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    } 
    return body
  }
  
  validate(){
    if( this.state.enteredEmail.length > 0 && this.state.enteredPassword.length > 0 && this.state.secretNumber === '10987'){
      return true
    } else { return false }
  }
  handleSecret(value){
    this.setState({
      secretNumber: value
    })
  }

  
  render(){
    if(this.state.isAuthenticated){
      return(
        <Redirect to='/'/>
      )
    }
    return(
      <div className='login'>
        <h2>Login</h2>
        <input 
          type="text" 
          placeholder="Email" 
          value={this.state.enteredEmail} 
          onChange={(e) => this.handleEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => this.handlePassword(e.target.value)}
        />
        <input
          type='password'
          placeholder='Secret code = 10987'
          onChange={(e) => this.handleSecret(e.target.value)}
        />
        <button onClick={() => this.handleSubmit()}>Submit</button>
        <h3>{this.state.message}</h3>
        
        <p>or...</p>
        <Link to='/signup'>Sign Up!</Link>
      
      </div>
    )  
  }
}
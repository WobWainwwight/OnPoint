import React from "react"

export default class LoginPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      enteredEmail: '',
      enteredPassword: '',
      submitted: false,
      accepted: false,
      message: 'Enter your Email and password',
    }
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.validate = this.validate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitToAPI = this.submitToAPI.bind(this)
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
      this.submitToAPI(data)
      .then(res => {
        this.setState({ 
          message: res.message,
          accepted: res.accepted
        })
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
    if( this.state.enteredEmail.length > 0 && this.state.enteredPassword.length > 0 ){
      return true
    } else { return false }
  }
  render(){
    return(
      <div>
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
        <button onClick={() => this.handleSubmit()}>Submit</button>
        <h3>{this.state.message}</h3>
      </div>
    )  
  }
}
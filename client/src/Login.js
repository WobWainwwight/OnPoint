import React from "react"

export default class LoginPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      enteredUsername: '',
      enteredPassword: '',
      submitted: false,
      message: 'Enter your username and password',
    }
    this.handleUsername = this.handleUsername.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.validate = this.validate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleUsername(value){
    this.setState({
      enteredUsername: value
    })
  }
  handlePassword(value){
    this.setState({
      enteredPassword: value
    })
  }
  handleSubmit(){
    if (this.validate() !== true){
      this.setState({
        message: "Try again"
      })   
    }
    else {
      console.log('State',this.state)
      const username = this.state.enteredUsername
      const password = this.state.enteredPassword
      console.log(username,password)
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-type':'application/json'
        },
        //some problem here
        body: JSON.stringify({
          password: password,
          username: username,
        })
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
    }
  }
  
  validate(){
    if( this.state.enteredUsername.length > 0 && this.state.enteredPassword.length > 0 ){
      return true
    } else { return false }
  }
  render(){
    return(
      <div>
        <input 
          type="text" 
          placeholder="Username" 
          value={this.state.enteredUsername} 
          onChange={(e) => this.handleUsername(e.target.value)}
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
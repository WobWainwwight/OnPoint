import React from "react"
import { Redirect } from 'react-router-dom'

export default class Signup extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      message: "",
      formData:{
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        secret: '',
      },
      accepted: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTyping = this.handleTyping.bind(this)
    this.checkEmpty = this.checkEmpty.bind(this)
    this.signupToApi = this.signupToApi.bind(this)
  }

  checkEmpty(){
    // create an array of the values in formData
    const values = Object.values(this.state.formData)
    //loop through to check a value is provided for each
    for(var x of values){
      if(x === ""){
        return true
      }
    }
    return false
  }
  handleSubmit(){
    if(this.checkEmpty() === false && this.state.secret === "10987"){
      //connect to backend
      this.signupToApi(this.state.formData)
      .then(res => {
        console.log(res)
        this.setState({
          message: res.message,
        })
        //Once they've succesfully signed up they're redirected to the login page
        setTimeout(() => {
          // calling setState re renders with accepted = true so that they are redirected
          this.setState({
            accepted: res.accepted,
          })
        }, 2000)
      })
    }
    else{
      this.setState({
        message: "You must provide all details"
      })
    }
    
  }
  //sends form data to server
  signupToApi = async (formData) => {
    const response = await fetch('/signup',{
      method: 'POST',
      headers: {
        'Accept':'application/json, text/plain, */*',
        'Content-type':'application/json'
      },
      body: JSON.stringify(formData)
    })
    const body = await response.json()
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    } 
    return body
  }
  handleTyping(value, property){
    let formObj = this.state.formData
    formObj[property] = value
    this.setState({
      formData: formObj,
    })
  }
  render(){
    if(this.state.accepted === true){
      return(
        <Redirect to='/login'/>
      )
    }
    return(
      <div>
        <h1>Sign Up</h1>
        First Name: <br/>
        <input
          type="text"
          value={this.state.formData.firstname}
          onChange={(e) => this.handleTyping(e.target.value,"firstname")}
        />
        <br/>Second Name: <br/>
        <input
          type="text"
          value={this.state.formData.lastname}
          onChange={(e) => this.handleTyping(e.target.value,"lastname")}
        />
        <br/>Email: <br/>
        <input
          type="text"
          value={this.state.formData.email}
          onChange={(e) => this.handleTyping(e.target.value,"email")}
        />
        <br/>Password: <br/>
        <input
          type="password"
          onChange={(e) => this.handleTyping(e.target.value,"password")}
        />
        <input
          type="password"
          onChange={(e) => this.handleTyping(e.target.value,"secret")}
        />
        <br/>
        <button onClick={() => this.handleSubmit()}>Submit</button>
        <h3>{this.state.message}</h3>
      </div>
    )
  }
}
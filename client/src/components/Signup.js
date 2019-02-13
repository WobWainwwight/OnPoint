import React from "react"
import SignupForm from "./SignupForm"

export default class Signup extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      message: "",
    }
  }

  render(){
    return(
      <div>
        <h1>Sign Up</h1>
        <SignupForm/>
        <h3>{this.state.message}</h3>
      </div>
    )
  }
}
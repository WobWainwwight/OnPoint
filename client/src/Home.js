import React, { Component } from 'react'

export default class Home extends Component{
  constructor(props){
    super(props)

    this.state = {
      welcome:"Welcome"
    }
  }

  render(){
    return(
      <div>
        <h1>{this.state.welcome}</h1>
      </div>
    )
  }
}
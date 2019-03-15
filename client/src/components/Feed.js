import React, { Component } from 'react'

export default class Home extends Component{
  constructor(props){
    super(props)

    this.state = {
      welcome: "WELCOME"
    }
  }
  componentDidMount(){
    fetchArticles()
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
  // makes a get request for the articles
  fetchArticles = async (request) => {

  }
  render(){
    return(
      <div>
        <h1>{this.state.welcome}</h1>
      </div>
    )
  }
}
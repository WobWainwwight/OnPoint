import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Feed extends Component{
  constructor(props){
    super(props)
    this.state = {
      filters: '',
      feed: []
    }
    this.fetchFeed = this.fetchFeed.bind(this)
    
  }
  componentDidMount(){
    // TODO: add filters so that they can be sent and a different feed is returned
    this.fetchFeed(this.state)
    .then((result) => {
      const usableArr = Array.from(result.result)
      this.setState({
        feed: usableArr
      },() => console.log(this.state))
    })
  }
  // makes a get request for the articles
  fetchFeed = async (request) => {
    const response = await fetch('/get-feed', {
      method: 'POST',
      headers: {
        'Accept':'application/json, text/plain, */*',
        'Content-type':'application/json'
      },
      body: JSON.stringify(request)
    })
    const body = await response.json()
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    } 
    return body
  }
  
  render(){
    const feedArr = this.state.feed
    console.log(feedArr)
    const feedRender = feedArr.map((articleInfo) => 
      <ArticleHead key={articleInfo.ArticleID} {...articleInfo} />
    )
    return(
      <div>
        {feedRender}
      </div>
    )
  }
}

const ArticleHead = (props) => {
  // each article head will render the image and title, and
  // it will be a link to the article page
  return(
    <div>
      <img src={props.HeadImage} alt=''/>
      <Link to={`/articles/${props.ArticleID}`}><h3>{props.Title}</h3></Link>
    </div>
  )
}
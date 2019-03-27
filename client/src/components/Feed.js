import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Feed extends Component{
  constructor(props){
    super(props)
    this.state = {
      filters: '',
      feed: [],
      selectedArticle: [],
    }
    this.fetchFeed = this.fetchFeed.bind(this)
    
  }
  componentDidMount(){
    // TODO: add filters so that they can be sent and a different feed is returned
    this.fetchFeed(this.state)
    .then((result) => {
      if(result.articleData !== false){
        const usableArr = Array.from(result.result)
        this.setState({
          feed: usableArr
        },() => console.log(this.state))
      }
      else{
        this.setState({
          feed: false,
        })
      }
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
    if(this.state.feed !== false){
      const feedArr = this.state.feed
      // add a className to the first three elements
      const feedRender = feedArr.map((articleInfo) => 
        <ArticleHead key={articleInfo.ArticleID} {...articleInfo} click={this.handleArticleClick} />
      )
      console.log("feedrender",feedRender)
      return(
        <div className='feed'>
          {feedRender}
        </div>
      )
    }
    else{
      return(
        <div>
          Sorry, couldn't retrieve articles
        </div>
      )
    }
  }
}

const ArticleHead = (props) => {
  // each article head will render the image and title, and
  // it will be a link to the article page
  console.log("AHEad props", props)
  const urlString = props.HeadImage
  return(
    <div className='articleHeads'>
      <Link to={`/article/${props.ArticleID}`}>
        <img class='resize' src={urlString} alt=''/>
        <h3>{props.Title}</h3>
      </Link>
    </div>
  )
}


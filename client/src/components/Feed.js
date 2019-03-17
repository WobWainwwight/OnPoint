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
    this.handleArticleClick = this.handleArticleClick.bind(this)
    
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
  
  handleArticleClick(chosenArticle){
    // change clicked to chosen article
    console.log(chosenArticle)
    /*this.setState({
      selectedArticle: chosenArticle
    })*/

  }
  
  render(){
    const feedArr = this.state.feed
    console.log(feedArr)
    const feedRender = feedArr.map((articleInfo) => 
      <ArticleHead key={articleInfo.ArticleID} {...articleInfo} click={this.handleArticleClick} />
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
  console.log("AHEad props", props)
  return(
    <div>
      <img src={props.HeadImage} alt=''/>
      <Link to={`/article/${props.ArticleID}`}><h3>{props.Title}</h3></Link>
    </div>
  )
}


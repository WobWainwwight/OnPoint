import React, {Component} from 'react'

export default class ArticlePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      initialRender: true,
      articleData: [],
      writerData: [],
    }
    this.fetchArticle = this.fetchArticle.bind(this)
  }
  componentDidMount(){
    // call API, get the article stuff
    console.log(this.props.match.params)
    this.fetchArticle(this.props.match.params)
    .then((res) => {
      this.setState({
        articleData: res.articleData,
        writerData: res.writerData,
        initialRender: false
      })
    })
  }
  fetchArticle = async (request) => {
    const response = await fetch('/get-article', {
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
    if(this.state.initialRender === true){
      return <div></div>
    }
    else if(this.state.articleData !== false){
      return(
        <div>
          <Article data={this.state.articleData}/>
          <WriterFooter data={this.state.writerData}/>  
        </div>
      )
    }
    else{
      return(
        <h2>Sorry couldn't retrieve the article</h2>
      )
    }
    
  }
}

const Article = (props) => {
  console.log("C",props.data.Content)
  console.log("type", typeof props.data.Content)
  // props.data.Content is a string but can't be parsed with 
  // JSON.parse because it is an array of objects eg. [{},{}...]
  let content = parseContentString(props.data.Content)
    const articleBody = content.map((element) => {
      console.log(element.order)
      return element.type === "text" ?
        <p key={element.order}>{element.content}</p>
      : 
        <img key={element.order} src={element.content} alt=''/>
    })
  return(
    <div className='article'>
      <div className='articleTop'>
        <div className='article-title'>
          <h1>{props.data.Title}</h1>
        </div>
        <div className='article-head-image'>
          <img src={props.data.HeadImage} alt='Could not retrieve'/>
        </div>
      </div>
      <div className='article-main'>
        <div className='article-body'>{articleBody}</div>
        <div/>  
      </div>
    </div>
  )
}

const WriterFooter = (props) => {
  const name = props.data.FirstName + " " + props.data.LastName
  return(
    <div>
      <h4>Words by {name}</h4>
      <p>{props.data.Bio}</p>
    </div>
    
  ) 
}

const parseContentString = (string) => {
  // content is stored as a stringified array of objects
  // the objects must be matched with regex, parsed and sent back as 
  // an array of objects
  let contentArr = []
  let stringed = String(string)
  const objRegex = /\{.*?\}/g
  let match = stringed.match(objRegex)
  match.forEach((element) => {
    let obj = JSON.parse(element)
    contentArr.push(obj)
  })
  console.log("type",typeof contentArr)
  return(contentArr)
}
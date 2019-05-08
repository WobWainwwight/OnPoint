import React from "react"
import {Redirect} from "react-router-dom"

export default class ArticleCreation extends React.Component{
    // When the article creation component is created it 
    // has a state of nothing
  constructor(props){
      super(props)
      // get user info
      const userInfo = JSON.parse(localStorage.getItem("OPuserInfo"))
      var articleID = userInfo.articleCount + 1
      console.log("UserInfo AC",userInfo)
      const writerID = userInfo.id 
      this.state = {
          selectedTitle: '',
          inputContent: [],
          message: '',
          headerImgUrl: '',
          articleID: articleID,
          writerID: writerID,
          freeToAdd: true,
          submitted: false,
          published: false,
      }

      this.handleTitleChange = this.handleTitleChange.bind(this)
      this.handleAddParagraph = this.handleAddParagraph.bind(this)
      this.handleChangeParagraph = this.handleChangeParagraph.bind(this)
      this.handleAddImg = this.handleAddImg.bind(this)
      this.handleHeaderImg = this.handleHeaderImg.bind(this)
      this.imgToAPI = this.imgToAPI.bind(this)
      this.handleSubmitArticle = this.handleSubmitArticle.bind(this)
      this.publish = this.publish.bind(this)
  }
  handleTitleChange(value) {
    this.setState({
      selectedTitle: value 
    })
  }
  handleAddParagraph(){
    // only allow a paragraph to be added if the previous paragraph has some input
    // or if nothing has been added yet
    let length = this.state.inputContent.length
    if(length === 0 || this.state.inputContent[length-1].content !== ''){
        // append object to inputContent
      // object should include type (paragraph/img), the order it is displayed in and the content
      let order = this.state.inputContent.length
      console.log("order",order)
      let newParagraph = {
        "order": order,
        "type": "text",
        "content": '',
      }
      let newIC = this.state.inputContent
      newIC.push(newParagraph)
      this.setState({
        inputContent: newIC,
      },() => console.log(this.state.inputContent))
    }
    else{
      let message = "Please add some text to paragraph " + length
      this.setState({
        message
      })
    }
  }
  handleChangeParagraph(order,e){
    let newIC = this.state.inputContent
    newIC[order].content = e.target.value
    this.setState({
      inputContent: newIC 
    })
    console.log("here " + order + e.target.value )
  }
  handleAddImg(e){
    // add image to cloudinary and if successful, add to input content
    let ic = this.state.inputContent
    // there must be at least one paragraph before the image
    if(ic.length > 0 && ic[ic.length-1].type === "text" && ic[ic.length-1].content !== ''){
      // send image to api, type indicates the order of it in the content
      // to ensure that we can't try and add a paragraph, screwing up the order
      // we set state so that nothing new can be added
      this.setState({freeToAdd: false})
      const toSend = new FormData()
      toSend.append('img',e.target.files[0])
      toSend.append('type',ic.length)
      toSend.append('writerId',this.state.writerID)
      toSend.append('articleId',this.state.articleID)
      this.imgToAPI(toSend)
      .then((res) => {
        if(res.accepted === true){
          // add the image to inputContent
          let ic = this.state.inputContent
          let newImage = {
            "order": ic.length,
            "type": "img",
            "content": res.cloudinary.secure_url,
          }
          ic.push(newImage)
          this.setState({
            inputContent: ic,
            freeToAdd:true
          })
        }
        else{
          this.setState({message: "Couldn't upload image, try again later"})
        }
      })
    }
    else{
      this.setState({message: "A paragraph must precede an image"})
    }
  }

  handleHeaderImg(e){
    // make an API call sending the image file, articleID and WriterID
    const toSend = new FormData()
    toSend.append('img',e.target.files[0])
    toSend.append('type','header')
    toSend.append('writerId',this.state.writerID)
    toSend.append('articleId',this.state.articleID) 
    console.log('header obj to be sent is assembled')
    this.imgToAPI(toSend)
    .then((res) => {
      console.log(res)
      if(res.accepted === true){
        // save URL of headerImg
        console.log(res.cloudinary.secure_url)
        this.setState({
          headerImgUrl: res.cloudinary.secure_url,
          freeToAdd: true,
        })
      }
      else{ this.setState({message: "Couldn't upload image, try again later"})}
    })
  }
  imgToAPI = async (data) => {
    const response = await fetch('/upload-img',{
      method: 'POST',
      body: data
    })
    const body = await response.json()
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    }
    return body
  }
  handleSubmitArticle(){
    // Get rid of the current message
    this.setState({message:''})
    // first check that there is a title, a header image and at least one paragraph of text
    console.log("state",this.state)
    let ic = this.state.inputContent
    for(let i = 0; i < ic.length; i++){
      if(ic[i].type === 'text'){
        ic = true
        break
      }
    }
    if(this.state.selectedTitle !== '' && this.state.headerImgUrl !== '' && ic === true){
      // set submitted to true so user is shown a mock of how the article will look
      console.log("Correct state",this.state)
      this.setState({submitted:true})
    }
    else{this.setState({message: "You must at least enter a title, a header image and at least one paragraph of text"})}
  }
  publish = async () => {
    this.setState({message: "Sending article to be published"})
    // submit all the info to the API to be stored in the DB
    // Change local storage so that it reflects the new article has been made
    // then redirect to home screen
    //New articles in DB should have writerid, content, headerimg url, title
    const data = {
      writer_id: this.state.writerID,
      title: this.state.selectedTitle,
      header_url: this.state.headerImgUrl,
      content: this.state.inputContent
    }
    const response = await fetch('/add-article',{
      method: 'POST',
      headers: {
        'Accept':'application/json, text/plain, */*',
        'Content-type':'application/json'
      },
      body: JSON.stringify(data)
    })

    const body = await response.json()
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    }
    if(body.accepted === true){
      this.setState({message:"Thank you! Your article has been published successfully!"})
      // change local stoarage article count
      let userInfo = JSON.parse(localStorage.getItem("OPuserInfo"))
      userInfo.articleCount = this.state.articleID
      userInfo = JSON.stringify(userInfo)
      localStorage.setItem("OPuserInfo", userInfo)
      // give time so that the user knows the article has been succesfully published
      setTimeout(() =>{
         // cause redirect
        this.setState({published: true})
      }, 1500)
    }
    else{
      this.setState({
        message: "Couldn't publish, try again later",
        submitted: false,
      })
    }
  }

    render(){
      if(this.state.published === true){
        return (
          <Redirect to='/'/>
        )
      }
      if(this.state.submitted === false){
        return (
          <div className='create-article-page'>
            <div className='editor'>
              <div className='create-article-title'><h3>Create Article</h3></div>
              <div className='title-entry'>
                <h4>Article Title: </h4>
                <input 
                  type='text'
                  placeholder='Enter a title'
                  maxLength='100'
                  onChange={(e) => this.handleTitleChange(e.target.value)}
                />
              </div>
              <UploadHeaderImg handleHeaderImg={this.handleHeaderImg} imgId={this.state.headerImgUrl} writerID={this.state.writerID} articleID={this.state.articleID}/>
              <InputContent contentArr={this.state.inputContent} handleChangeParagraph={this.handleChangeParagraph}/>
              <AddToContentButtons handleAddParagraph={this.handleAddParagraph} inputContent={this.state.inputContent} handleAddImg={this.handleAddImg} freeToAdd={this.state.freeToAdd}/>
              <button className='submit-art-button' onClick={() => this.handleSubmitArticle()}>Submit Article</button>
              <p>{this.state.message}</p>
            </div>
            <div className='editor-help'>
              <h4>Help</h4>
              <p>Add images and paragraphs in the order that you'd like them to appear in your article.</p>
              <p>Make sure to add at least a header image, a title and at least one paragraph.</p>
              <p>Click 'Submit Article' to see a preview of how your article will look.</p>
            </div>
          </div>
        )
      }
      else{
        return(
          <div>
            <MockArticle selectedTitle={this.state.selectedTitle} headerImgUrl={this.state.headerImgUrl} inputContent={this.state.inputContent}/>
            <div className='ed-pub-buttons'> 
              <button onClick={() => this.setState({submitted:false})}>Edit</button>
              <button className='create-button' onClick={() => this.publish()}>Publish</button>
            </div>
            
            <p>{this.state.message}</p>
          </div>  
          
        )
      }
      
    }
}


const UploadHeaderImg = (props) => {
  var label
  if(props.status === ''){
    label = "Add header image:"
    return(
      <div className='head-image-entry'>
        <div className='head-label-input'>
          <h4 className='himg-label'>{label}</h4>
          <input
            className='himg-adder'
            type='file'
            id='headImage'
            accept="image/png, image/jpeg"
            onChange={(e) => props.handleHeaderImg(e)}
          />
        </div>
        
      </div>
    )
  }
  else {
    label = "Change header image:"
    return(
      <div className='head-image-entry'>
        <img src={props.imgId} alt={props.imgId}/>
        <div className='head-label-input'>
          <h4 className='himg-label'>{label}</h4>
          <input
            className='himg-adder'
            type='file'
            id='headImage'
            accept="image/png, image/jpeg"
            onChange={(e) => props.handleHeaderImg(e)}
          />
        </div>
      </div>
    )
  }
}
const InputContent = (props) => {
  const content = props.contentArr
  // go through each element in the array, create an image tag for images and a textarea for paragraphs
  const textAreaList = content.map((element) => {
    return element.type === "text" ?
      <textarea key={element.order} onChange={(e) => props.handleChangeParagraph(element.order,e)} value={element.content}/>
    : 
      <img src={element.content} alt=''/>
  })

  return (
    <div className='content-entry'>
      <ul>
        {textAreaList.map((element) => (
          <li key={element.key}>{element}</li>
        ))}
      </ul>
    </div>
  )
}

const AddImageButton = (props) => {
  if(props.inputContent.length > 0 && props.inputContent[props.inputContent.length-1].content !== ''){
    return(
      <div className='add-image'>
        <label htmlFor='image'>Add Image</label>
        <input
          type='file'
          id='image'
          placeholder='Add Image'
          accept="image/png, image/jpeg"
          onChange={(e) => props.handleAddImg(e)}
        />
      </div>
      
    )
  }       //return nothing
  else{return(<div></div>)}
}

const AddToContentButtons = (props) => {
  if(props.freeToAdd === true){
    return(
      <div className='add-buttons'>
        <button onClick={() => props.handleAddParagraph()}>Add Paragraph</button>
        <AddImageButton inputContent={props.inputContent} handleAddImg={props.handleAddImg}/>
      </div>
    )
  }   //return nothing
  else{return(<div></div>)}
}

const MockArticle = (props) => {
  // MockArticle just takes the article info and displays it
  const userInfo = JSON.parse(localStorage.getItem("OPuserInfo"))
  const writerName = userInfo.firstname + " " + userInfo.lastname
  const articleBody = props.inputContent.map((element) => {
    return element.type === "text" ?
      <p key={element.order}>{element.content}</p>
    : 
      <img key={element.order} src={element.content} alt=''/>
  })
  return(
    <div className='article'>
      <div className='articleTop'>
        <div className='article-title'>
          <h1>{props.selectedTitle}</h1>
        </div>
        <div className='article-head-image'>
          <img src={props.headerImgUrl} alt=''/>
        </div>
      </div>
      <div className='article-main'>
        <div className='article-body'>
          {articleBody}
        </div>
      </div>
      
      <h4>Words by {writerName}</h4>
      <p>{userInfo.bio}</p>
    </div>
  )
}
import React from "react"
//import {Image} from "cloudinary-react"

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
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleAddParagraph = this.handleAddParagraph.bind(this)
        this.handleChangeParagraph = this.handleChangeParagraph.bind(this)
        this.handleAddImg = this.handleAddImg.bind(this)
        this.handleHeaderImg = this.handleHeaderImg.bind(this)
        this.imgToAPI = this.imgToAPI.bind(this)
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
      this.imgToAPI(toSend)
      .then((res) => {
        console.log(res)
        if(res.accepted === true){
          // save URL of headerImg
          console.log(res.cloudinary.secure_url)
          this.setState({headerImgUrl: res.cloudinary.secure_url})
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

    render(){
      return (
        <div>
          <input 
            type='text'
            placeholder='Enter title'
            maxLength='100'
            onChange={(e) => this.handleTitleChange(e.target.value)}
          />
          <UploadHeaderImg handleHeaderImg={this.handleHeaderImg} imgId={this.state.headerImgUrl} writerID={this.state.writerID} articleID={this.state.articleID}/>
          <InputContent contentArr={this.state.inputContent} handleChangeParagraph={this.handleChangeParagraph}/>
          <AddToContentButtons handleAddParagraph={this.handleAddParagraph} inputContent={this.state.inputContent} handleAddImg={this.handleAddImg} freeToAdd={this.state.freeToAdd}/>
          <p>{this.state.message}</p>
        </div>
      )
    }
}

const UploadHeaderImg = (props) => {
  var label
  if(props.status === ''){
    label = "Add header image"
    return(
      <div>
        <label htmlFor='headImage'>{label}</label>
        <input
          type='file'
          id='headImage'
          accept="image/png, image/jpeg"
          onChange={(e) => props.handleHeaderImg(e)}
        />
      </div>
    )
  }
  else {
    label = "Change header"
    return(
      <div>
        <img src={props.imgId} alt={props.imgId}/>
        <label htmlFor='headImage'>{label}</label>
        <input
          type='file'
          id='headImage'
          accept="image/png, image/jpeg"
          onChange={(e) => props.handleHeaderImg(e)}
        />
      </div>
    )
  }
}
const InputContent = (props) => {
  const content = props.contentArr
  const textAreaList = content.map((element) =>
    <textarea key={element.order} onChange={(e) => props.handleChangeParagraph(element.order,e)} value={element.content}/>
  ); 
  return (
    <div>
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
      <input
        type='file'
        id='image'
        placeholder='Add image'
        accept="image/png, image/jpeg"
        onChange={(e) => props.handleAddImg(e)}
      />
    )
  }       //return nothing
  else{return(<div></div>)}
}

const AddToContentButtons = (props) => {
  if(props.freeToAdd === true){
    return(
      <div>
        <button onClick={() => props.handleAddParagraph()}>Add Paragraph</button>
        <AddImageButton inputContent={props.inputContent} handleAddImg={props.handleAddImg}/>
      </div>
    )
  }   //return nothing
  else{return(<div></div>)}
}
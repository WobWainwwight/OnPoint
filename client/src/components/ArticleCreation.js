import React from "react"

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
            hImgAdded: false,
            articleID: articleID,
            writerID: writerID
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
      
    }
    handleHeaderImg(e){
      console.log("ArticleID",this.state.articleID)
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
          // work out src
          const re = /.jpg|.jpeg|.png/
          console.log(res.oldName)
          const fileType = re.exec(res.oldName)
          console.log(fileType)
          this.setState({hImgAdded: true})
        }
        else{this.setState({hImgAdded: false})}
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
          <UploadHeaderImg handleHeaderImg={this.handleHeaderImg} status={this.state.hImgAdded} writerID={this.state.writerID} articleID={this.state.articleID}/>
          <InputContent contentArr={this.state.inputContent} handleChangeParagraph={this.handleChangeParagraph}/>
          <button onClick={() => this.handleAddParagraph()}>Add Paragraph</button>
          <input
            type='file'
            id='image'
            placeholder='Add image'
            accept="image/png, image/jpeg"
            onChange={(e) => this.handleAddImg(e)}
          />
          <p>{this.state.message}</p>
        </div>
      )
    }
}

const UploadHeaderImg = (props) => {
  var label
  if(props.status === false){
    label = "Add header image"
    return(
      <div>
        <input
          type='file'
          id='headImage'
          placeholder={label}
          accept="image/png, image/jpeg"
          onChange={(e) => props.handleHeaderImg(e)}
        />
      </div>
    )
  }
  else {
    label = "Change header"
    const imgName = "wid" + props.writerID + "aid" + props.articleID + "theader" 
    const imgURL = "https://res.cloudinary.com/wob/image/fetch/shouterImg/" + props.writerID + "/" + props.articleID + "/" + imgName
    return(
      <div>
        <img src={imgURL + ".jpg"} alt={imgURL}/>
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

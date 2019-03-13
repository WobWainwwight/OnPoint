import React from "react"
//import ImageUploader from "react-images-upload"

export default class ArticleCreation extends React.Component{
    // When the article creation component is created it 
    // has a state of nothing
    constructor(props){
        super(props)
        this.state = {
            selectedTitle: '',
            inputContent: [],
            message: '',
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleAddParagraph = this.handleAddParagraph.bind(this)
        this.handleChangeParagraph = this.handleChangeParagraph.bind(this)
        this.handleAddImg = this.handleAddImg.bind(this)
        this.handleHeaderImg = this.handleHeaderImg.bind(this)
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
    handleAddImg(){

    }
    handleHeaderImg(){
      
    }
    // Swapped below out for image uploader class
    //<input type='file' onChange={(e) => this.handleHeaderImageChange(e.target.value)}/>
    render(){
      return (
        <div>
          <input 
            type='text'
            placeholder='Enter title'
            maxLength='100'
            onChange={(e) => this.handleTitleChange(e.target.value)}
          />
          <label for="headImage">Add head image</label>
          <input
            type='file'
            id='headImage'
            placeholder='Add head image'
            accept="image/png, image/jpeg"
          />
          <InputContent contentArr={this.state.inputContent} handleChangeParagraph={this.handleChangeParagraph}/>
          <button onClick={() => this.handleAddParagraph()}>Add Paragraph</button>
          <button onClick={() => this.handleAddImg()}>Add Image</button>
          <p>{this.state.message}</p>
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

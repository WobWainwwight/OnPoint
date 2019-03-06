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
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleHeaderImageChange = this.handleHeaderImageChange.bind(this)

    }
    handleTitleChange(value) {
      this.setState({
        selectedTitle: value 
      })
    }
    handleAddParagraph(){
      // append object to inputContent
      // object should include type (paragraph/img), the order it is displayed in and the content
      var order = this.state.inputContent.length
      var newParagraph = {
        order: order,
        type: "text",
        content: ''
      }
      var newIC = this.state.inputContent.push(newParagraph)
      this.setState({
        inputContent: newIC
      })
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
          <InputContent content={this.state.content}/>
          <button onChange={() => this.handleAddParagraph()}>Add Paragraph</button> 
        </div>
      )
    }
}

const InputContent = (props) => {
  return (
    <div>
      {this.props.content}
    </div>
  )
}

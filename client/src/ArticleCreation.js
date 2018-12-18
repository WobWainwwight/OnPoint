import React from "react"
import ImageUploader from "react-images-upload"

export default class ArticleCreation extends React.Component{
    // When the article creation component is created it 
    // has a state of nothing
    constructor(props){
        super(props)
        this.state = {
            selectedTitle: '',
            selectedHeaderImage: [],
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleHeaderImageChange = this.handleHeaderImageChange.bind(this)

    }
    handleTitleChange(value) {
      this.setState({
        selectedTitle: value 
      })
    }
    handleHeaderImageChange(value){
      this.setState({
        selectedHeaderImage: this.state.selectedHeaderImage.concat(value),
    });
    }
    // Swapped below out for image uploader class
    //<input type='file' onChange={(e) => this.handleHeaderImageChange(e.target.value)}/>
    render(){
      return (
        <div>
          <input 
            type='text'
            placeholder='enter title'
            maxLength='100'
            onChange={(e) => this.handleTitleChange(e.target.value)}
          />
          <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                onChange={this.handleHeaderImageChange}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
          />   
          <br/>
          <p>Upload header Image:</p>
                      
          <hr/>
          <Preview 
            currTitle={this.state.selectedTitle}
            currHeaderImg={this.state.selectedHeaderImage}
          />
        </div>
      )
    }
}

function Preview (props){
  
  
  return (
    <div>
      <h1>Preview</h1>
        <h2>title : {props.currTitle}</h2>
        <h2>Header Image</h2><img src={props.currHeaderImg} alt="Upload a header"/>
    </div>
  )
}
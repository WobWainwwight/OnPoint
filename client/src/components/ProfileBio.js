import React from 'react'

export default class ProfileBio extends React.Component {
  constructor(props){
    super(props)
    // storing bio as null is problematic with textarea below
    // therefore setting bio in state to empty string instead
    if(props.bio === null){
      var initialBio = ''
    }
    else{initialBio = props.bio}
    this.state = {
      editing: false,
      bio: initialBio,
      message: '',
    }
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleBioChange = this.handleBioChange.bind(this)
    this.submitToAPI = this.submitToAPI.bind(this)
  }
  handleEditClick(){
    this.setState({
      editing: true,
    })
  }
  handleBioChange(value){
    this.setState({
      bio: value
    })
  }
  handleBioSubmit(){
    // connect to API and if successful, update local state
    const bioObj = {
      bio: this.state.bio,
      id: this.props.id,
    }
    console.log(bioObj)
    this.submitToAPI(bioObj)
    .then(res => {
      if(res.accepted === true){
        // update local storage with new bio
        var userObj = localStorage.getItem(JSON.parse('OPuserInfo'))
        userObj.bio = this.state.bio
        localStorage.removeItem('OPuserInfo')
        localStorage.setItem('OPuserInfo',JSON.stringify(userObj))
      }
      this.setState({
        message: res.message,
        editing: false,
      })
    })
  }
  submitToAPI = async (obj) => {
    const response = await fetch('/updateBio', {
      method: 'POST',
      headers: {
        'Accept':'application/json, text/plain, */*',
        'Content-type':'application/json'
      },
      body: JSON.stringify(obj)
    })
    const body = await response.json()
    // 200 is the http code signalling the request is successful
    if (response.status !== 200){
      throw Error(body.messsage)
    } 
    return body
  } 
  render(){
    if(this.state.bio === '' && this.state.editing === false){
      return (
        <div>
          <label>Your Bio</label>
          <p>-- Your bio is undefined, select 'Edit' below to add a bio --</p>
          <button onClick={() => this.handleEditClick()}>Edit</button>
        </div>
      )
    }
    else {
      if(this.state.editing === false){
        return(
          <div>
            <label>Your Bio</label>
            <p>{this.state.bio}</p>
            <button onClick={() => this.handleEditClick()}>Edit</button>
            <p>{this.state.message}</p>
          </div>
        )
      }
      else{
        return(
          <div>
            <label>Your Bio</label>
            <br/>
            <textarea
              cols="50"
              rows="5"
              maxLength="1000"
              value={this.state.bio} 
              onChange={(e) => this.handleBioChange(e.target.value)}
            />
            <button onClick={() => this.handleBioSubmit()}>Submit</button>
          </div>
        )
      }
    }
  }
  
}
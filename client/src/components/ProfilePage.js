import React from 'react'
import {Link} from "react-router-dom"
import ProfileBio from './ProfileBio'


export default class ProfilePage extends React.Component {
  constructor(props){
    super(props)
    const userInfo = JSON.parse(localStorage.getItem("OPuserInfo"))
    this.state = {
      userInfo: userInfo,
    }
    this.handleLogout = this.handleLogout.bind(this)
  } 
  handleLogout(){
    // delete cookie and local storage
    // set auth to false
    // redirect?
    this.props.authenticate(false)
    console.log("props",this.props)
  }
  render(){
    return(
      <div>
        <h1>{this.state.userInfo.firstname} {this.state.userInfo.lastname}</h1>
        <ProfileBio bio = {this.state.userInfo.bio} id={this.state.userInfo.id}/>
        <button><Link to={`/create-article/${this.state.userInfo.id}`}>Create Article</Link></button>
        <button onClick={() => this.handleLogout()}>Logout <b>{this.state.userInfo.email}</b></button>
      </div>
    )
  }
}


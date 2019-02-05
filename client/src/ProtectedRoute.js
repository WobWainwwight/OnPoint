import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default ({ component: Component, isAuthenticated: isAuthenticated, ...rest }) =>{
  <Route {...rest} render={(props) =>(
    isAuthenticated === true
    ? <Component {...props}/>
    : <Redirect to='/login'/>
  )}/>
}
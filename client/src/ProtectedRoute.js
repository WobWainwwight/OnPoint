import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default ({ component: Component, isAuthenticated, ...rest }) =>{
  return(
    <Route {...rest} render={(props) =>(
      isAuthenticated === true
      ? <Component {...props} {...rest}/>
      : <Redirect to='/login'/>
    )}/>
  )
  
}
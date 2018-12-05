import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router, 
    Route
} from "react-router-dom";

import Home from "./Home";
const Login = <h1>Login</h1>;

export default class App extends React.Component{
    render(){
        return(
            <div>
                <Home/>
            </div>
        )
    }
}

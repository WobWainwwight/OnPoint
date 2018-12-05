import React from "react";

import Title from "./Header/Title";
import Menu from "./Header/Menu";
import Login from "./Header/Login";

export default class Header extends React.Component{
    render(){
        return(
            <ul id = "header">
                <li><Menu/></li>
                <li><Title/></li>
                <li><Login/></li>
            </ul>
                
        );
    }
}
import React from "react"
import { CSSTransition } from "react-transition-group";
export const SlideTransition = (props) => (
    <CSSTransition
        {...props}
        classNames="noticia"
        timeout={{ enter: 1000, exit: 500 }} 
    />
);

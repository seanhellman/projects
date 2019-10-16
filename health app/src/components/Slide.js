import React from "react";

const Slide = (props) => 
    <div className={"fullscreen slide-" + props.slideStatus} classID={"slide-" + props.slideId}>
        {props.children}
    </div>

export default Slide;
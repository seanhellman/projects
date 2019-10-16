import React from "react";

const SlideIndicator = (props) => 
    <button className="indicator" onClick={(event) => props.click(event, Number(props.slideID))}  aria-label="slide-indicator">
        <div className={"circle indicator-" + props.slideStatus}></div>
    </button>


export default SlideIndicator;
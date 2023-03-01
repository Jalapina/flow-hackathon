import React from "react";
import "./AudioPlayer.css";

export default function AudioPlayer (props) {
    return(
        <div style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            backgroundColor: "#000",
            padding: "10px",
            boxShadow: "0 -2px 5px rgb(0 0 0 / 25%)"
        }} className="AudioPlayer">
            
            <div
                >
                <audio controls style={{width:"50%"}}/>
            </div>
        </div>
        
    )
}
import React from "react";
import { Canvas } from '@react-three/fiber'
import "./AudioPlayer.css";

export const StandardModalHeader = (props) => {
    return(
        <div className="AudioPlayer">
            
            <div
                style={{
                height: 80,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
            }}>
            
                <input type="file" accept="audio/*" />
                <audio controls style={{width:"50%"}}/>
            </div>
        </div>
        
    )
}
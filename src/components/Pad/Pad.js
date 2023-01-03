import React, {useContext} from 'react';
import {Context} from '../../contexts/SamplerContext';
import {handlePadTrigger} from '../../actions'
import Colors from '../../Config/ColorScheme';
import touchCTRL from '../../Config/touchControls';
import './Pad.css';

export default (props) => {
    const context = useContext(Context);
    let currentPad = context.gridPadsArr[props.id];
     let borderColor =  Colors.black;
     let backgroundColor =  Colors.black;
     let isLoaded = false
     if(currentPad){
    //     borderColor = currentPad.grey
        isLoaded = currentPad.source ? true : false
    //     backgroundColor = currentPad.color
     }

     const handleTouchStart = (padId) => {
        if(!touchCTRL[padId].hold){

            touchCTRL[padId].hold = true;
            handlePadTrigger(context, padId);

        }
    }

    const handleTouchEnd = (padId) => {
        touchCTRL[padId].hold = false;
    }

    const handleMouseClick = (padId) => {
        if(!context.touchEnabled){
            handlePadTrigger(context, padId)
        }
    }

    return <button 
        className="pad" 
        id={props.id}
        style={{
            // background: isLoaded ? currentPad.color: Colors.black,
            color: isLoaded ? "#000" : Colors.white,
            fontSize: isLoaded ? "1.3em" : "1em",
            transition: "0.5s linear",
            width: ""
        }}
        onClick={() => {handleMouseClick(props.id)}}
        onDoubleClick={(e) => e.preventDefault()}
        onTouchStart={(e) => {handleTouchStart(props.id, e)}}
        onTouchEnd={(e) => {handleTouchEnd(props.id, e)}}
        >
            <span className="pad-text">{props.name}</span>
    </button>

}

import React, {useContext} from 'react';
import {Context} from '../../contexts/SamplerContext';
import './Hud.css';
import Colors from '../../Config/ColorScheme';
import WaveformDisplay from '../WaveformDisplay/WaveformDisplay';
import Controls from '../Controls/Controls';
import icon from "./settingsIcon.png";

export default ({sessionOwner,isMinted, setIsLoading}) => {

    const context = useContext(Context);
    const currentPadId = context.selectedPad;

    let isLoaded = false

    const clearSelectedPad = () => {
        let sources = {...context.sources};
        sources[currentPadId] = {buffer: null, name: "", isPlaying: false};
        let gridPadsArr = [...context.gridPadsArr];
        gridPadsArr[currentPadId].source = null;
        context.dispatch({type: CLEAR_SELECTED_PAD, payload: {sources, gridPadsArr}});
    }

    if(context.gridPadsArr.length>0){
        isLoaded = context.gridPadsArr[currentPadId].source ? true : false;
    }

    let editToggleMode = context.editMode ? '◀️' : <img style={{width:"65px"}} src={icon}/>;
    
    return(
        <div className="hud-wrapper" style={{textAlign:"left", margin:"auto", width:"45%" , color: Colors.white, textAlign:"center"}}>

            {/* {isLoaded? 
                <div>
                    <WaveformDisplay /> waveform
                </div>
            : "" } */}

            <Controls props={{editToggleMode, sessionOwner,isMinted,setIsLoading}}/>

            {isLoaded && context.editMode ?
                <button className="ctl-btn" onClick={() => clearSelectedPad()}>UNLOAD LOOP</button>:""
            }
        </div>
    )
}
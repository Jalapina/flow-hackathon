import React, {useEffect} from 'react';
import Header from '../Header/Header';

import Home from '../../pages/Home/Home';
import midiMap from '../../Config/midiMap';
import './SamplerGrid.css';
import cryptoLogosPolygon from "./flow-logo.png"

const SamplerGrid = () => {
    
    return (
        <div 
        className="grid-wrapper" 
        >
            
            <Header title={"Sessions"} button={true}/>
            <Home />
            
            <div className="OnTheChain">
                <h3> ON THE CHAIN </h3>
                <img className="cryptoLogosPolygon" src={cryptoLogosPolygon} />
            </div>



        </div>
    )
}

export default SamplerGrid
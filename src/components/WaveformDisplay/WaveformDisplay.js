import React, {useContext, useRef, useEffect} from 'react';
import {Context} from '../../contexts/SamplerContext';
import Colors from '../../Config/ColorScheme';
import Controls from '../Controls/Controls';

export default () => {
    const context = useContext(Context);
    const canvasRef = useRef(null)
    const draw = () => {
        let canvas = canvasRef.current;
        let c = canvas.getContext('2d');
        c.clearRect(0, 0, canvas.width, canvas.height);
        let sourceAvailable = context.sources[context.selectedPad];
        if(!sourceAvailable || !sourceAvailable.waveformData) return;
        let data = sourceAvailable.waveformData;
        let step = Math.ceil(data.length / canvas.width);
        let amp = canvas.height / 2;
        c.fillStyle = Colors.black;
        for(var i=0; i < canvas.width; i++){
            var min = 1.0;
            var max = -1.0;
            for (var j=0; j<step; j++) {
                var datum = data[(i*step)+j]; 
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            c.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
        }
    }
    useEffect(() => {
            draw()
    })
    let editToggleText = context.editMode ? '◄' : '☼';
    let selectedSource = context.sources[context.selectedPad] ? context.sources[context.selectedPad] : 'Empty'
    return <div>
            <canvas 
            id="waveformDisplay" 
            ref={canvasRef} 
            style={{backgroundColor: Colors.blue, width: "100%", height: "10vh", position: "absolute", left: 0}}
            />
            <h5 style={{position: "relative", top: 0, margin: 0}} className="pad-name">{context.selectedPad + 1}: {selectedSource.name}</h5>
            <Controls editToggleText={editToggleText} />
        </div>
}
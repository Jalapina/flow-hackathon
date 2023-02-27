import * as types from '../reducers/types'
import Colors from '../Config/ColorScheme';
import * as Tone from 'tone'
import {db} from '../functions/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {arrayUnion} from "firebase/firestore"


import firebase from 'firebase/compat/app';

export const setCTX = async (context) => {
    let ctx = !context.ctx ? new (window.AudioContext || window.webkitAudioContext)() : null;
    createAnalyser(context, ctx)
}

export const createAnalyser = (context, ctx) =>{
    let analyser = ctx.createAnalyser();
    analyser.connect(ctx.destination);
    context.dispatch({type: types.CREATE_ANALYSER, payload: {ctx, analyser}})
}

export const uploadLoop = async (context,currentPad,sessionId, collabData,user,setIsLoading) => {

    if (!db && user.user) return;
    const uploadedFile = collabData.file;
    if (!uploadedFile) return;
    let sessionDocRef = db.firestore().doc("/session/"+sessionId+"/")

    const gridPadsArr = context.gridPadsArr;
    const storage = db.storage();
    const storageRef = storage.ref();
    let stemURL = null;

    try {

        const loopURL  = await storageRef.child(uploadedFile.name).put(uploadedFile);
        stemURL = await loopURL.ref.getDownloadURL()
        alert("Successfully uploaded loop!");


        const response = db.firestore().collection("collaboration")
        .add({
            loopName: collabData.loopName,
            instrument: collabData.instrument,
            loop: stemURL,
            tempo: collabData.tempo? collabData.tempo : null,
            key: collabData.key? collabData.key : null,
            padId: currentPad.id,
            artist: user.user.addr,
            padColor: "#F2EDEA",
            sampledOn: sessionDocRef.id,
            createdAt : firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt : firebase.firestore.FieldValue.serverTimestamp()
        }).then((data)=>{

            let collabDocRef = db.firestore().doc("/collaboration/"+data.id+"/")
            
            const arrayToUpdate = arrayUnion(collabDocRef);


            const session = db.firestore().collection("session").doc(sessionDocRef.id).update({
                stems: arrayToUpdate,
                updatedAt : firebase.firestore.FieldValue.serverTimestamp(),
                collaborators: arrayUnion(user.user.addr)
            });
            console.log(stemURL);
            setIsLoading(true);
            gridPadsArr[currentPad].source = stemURL
            gridPadsArr[currentPad].isLoaded = true
            gridPadsArr[currentPad].name = currentPad.id
            gridPadsArr[currentPad].isLooping = false
            gridPadsArr[currentPad].color = Colors.lightorange
            gridPadsArr[currentPad].editToggleText = true
            

            context.dispatch({type: types.UPDATE_SOURCES, payload: {gridPadsArr,stateChange}});
            
        }).catch(e=>{console.log(e)});

    } catch (error) {
        return console.log("error", error);
    }
}



export const updateSources = (context, file) => {

    // const setLoop = async() => {
        
    //             const response = db.collection('collaboration')
    //             .add({
    //                 name: data,
    //                 loop:data,
    //                 padId: data,
    //                 instrument:data,
    //                 keyword:data,
    //                 owner: data,
    //                 sampledOn: data,
    //                 tempo: data,
    //               })
    //               .then(() =>{
    //                 context.gridPadsArr[padId].Player = true;
    //               });
              
    //                 return () => unsubscribe();
        
    //             console.log(users)
    //         };
    // }
    
    // let fileSource = GetURI(file)
    // console.log(file)
    // let reader = new FileReader();
    // const buffer = file;
    // reader.onload = e => {
    //     context.ctx.decodeAudioData(e.target.result, (buffer) => {
    //         let sources = {...context.sources}
    //         // let name = file.name.split('.')[0]
    //         let waveformData = buffer.getChannelData(0)
    //         sources[context.selectedPad] = {buffer: buffer, name, isPlaying: false, waveformData}
    //         let gridPadsArr = context.gridPadsArr;
    //         let newSource = context.ctx.createBufferSource();
    //         newSource.buffer = buffer;
    //         gridPadsArr[context.selectedPad].source = newSource;
    //         gridPadsArr[context.selectedPad].source.start()
    //         gridPadsArr[context.selectedPad].sampleEnd = buffer.duration;
    //         gridPadsArr[context.selectedPad].gainNode = context.ctx.createGain();
    //         gridPadsArr[context.selectedPad].gainNode.connect(context.ctx.destination);
    //         context.dispatch({type: types.UPDATE_SOURCES, payload: {sources, gridPadsArr}});
    //     })
    // }
    // reader.readAsArrayBuffer(buffer);
}

export const handlePadTrigger = async(context, padId, velocity = 127) => {
        let selectedSource =  context.gridPadsArr[padId].source;
        
        Tone.context.resume();
        
        
        let selectedPad = padId;
        if(selectedSource && !context.gridPadsArr[padId].isPlaying){
            // if(context.gridPadsArr[padId].player && context.gridPadsArr[padId].isPLaying){
            //     //     let Player = context.gridPadsArr[padId].player
            //     //     // let Loop = context.gridPadsArr[padId].loop;
            //     let Player = context.gridPadsArr[padId].player;
            //     let Loop = context.gridPadsArr[padId].loop;
            //     context.gridPadsArr[padId].isPlaying = false;
            //     context.gridPadsArr[padId].isLooping = true;
        
            //     Player.stop();
            //     Loop.stop();
                
            //     //     Player.stop();
            //     //     // Loop.stop();
            // }
            let gridPadsArr = context.gridPadsArr;
            // let newSource = context.ctx.createBufferSource();
            // newSource.buffer = context.sources[padId].buffer;
            // gridPadsArr[padId].source = newSource;
            // if(context.selectedPad !== padId){
                // context.dispatch({type: types.HANDLE_PAD_TRIGGER, payload: {gridPadsArr, selectedPad}});
            // }
            // newSource.connect(context.gridPadsArr[padId].gainNode);
            // newSource.detune.value = context.gridPadsArr[padId].detune;
    
            // let currentGain = velocity !== 127 ? Math.pow(velocity, 2) / Math.pow(127, 2) : context.gridPadsArr[padId].currentGain;
            let length = null;
            let loop = null;
            // let length = gridPadsArr[padId].source.buffer.duration;
    
            // console.log(context.ctx.decodeAudioData(gridPadsArr[padId].source.buffer));
            // console.log(gridPadsArr[padId].source);
            
            let Players = new Tone.Players({
                [gridPadsArr[selectedPad].name]:selectedSource
            }).toDestination();
            
            let Player = Players.player(gridPadsArr[selectedPad].name);

            const getDuration = async() => {
                const buff0 = new Tone.ToneAudioBuffer(Player.buffer);
                await Tone.ToneAudioBuffer.loaded();
                length = buff0.duration;
            }
            
            const dur = await getDuration();
            
            loop = new Tone.Loop(function(){
                //triggered every eighth note.
                Player.start();
            },length).start(0);
            
            Tone.Transport.start();
            Tone.start();

            context.gridPadsArr[selectedPad].loop = loop;
            context.gridPadsArr[selectedPad].player = Player;
            context.gridPadsArr[selectedPad].isPlaying = true;
            context.gridPadsArr[selectedPad].isLooping = true;
            // const event = clock.setTimeout(function() { 
            // context.gridPadsArr[padId].source.start(context.ctx.currentTime, context.gridPadsArr[padId].sampleStart);
            
            // const time = Tone.Time(length).toSeconds();
            // const time = Tone.Time(length).toTicks();
            // const time = Tone.Time(length).toNotation();
            // let time = Tone.Time(length).toSamples();
            // let time = Tone.Time(length).toBarsBeatsSixteenths();
            // const node = new Tone.Gain();
            // console.log(node.numberOfInputs);
    
            // console.log(time);
    
            // const loop = new Tone.Loop((time) => {
            //     // triggered every eighth note.
            //     const player = new Tone.Player(newSource.buffer).toDestination();
            //     Tone.loaded().then(() => {
                    
            //         player.start();
        
            //     });
    
            // }, "0n").start(0);
            
            // }, 2)
            // context.gridPadsArr[padId].source.stop(context.ctx.currentTime + context.gridPadsArr[padId].sampleEnd);
    } else {
        if(context.selectedPad !== padId){
            context.dispatch({type: types.HANDLE_PAD_TRIGGER, payload: {selectedPad}});
        }
    }
}

export const handlePadStop = (padId, gridPadsArr,context) => {
    if(context.gridPadsArr[padId].source && context.gridPadsArr[padId].isPlaying){

        let Player = context.gridPadsArr[padId].player;
        let Loop = context.gridPadsArr[padId].loop;
        context.gridPadsArr[padId].isPlaying = false;
        context.gridPadsArr[padId].isLooping = true;

        Player.stop();
        Loop.stop();
    }
}

export const updateEditorData = ({context, cmd, val}) => {
    
    let newPadsArr = context.gridPadsArr;
    let selectedPad = context.selectedPad;
    if(cmd === "start"){
        if(val >= newPadsArr[context.selectedPad].sampleEnd) return;
        newPadsArr[context.selectedPad].sampleStart = Number(val);
    }
    if(cmd === "end"){
        if(val <= newPadsArr[context.selectedPad].sampleStart) return;
        newPadsArr[context.selectedPad].sampleEnd = Number(val);
    }
    if(cmd === "gain"){
        newPadsArr[context.selectedPad].currentGain = val;
    }
    if(cmd === "detune" && val !== "Current"){
        newPadsArr[context.selectedPad].detune = val;
    }
    if(cmd === "play"){
        handlePadTrigger(context, context.selectedPad);
    }
    if(cmd === "stop"){
        handlePadStop(context.selectedPad, newPadsArr,context);
    }
    if(cmd === "color"){
        newPadsArr[context.selectedPad].color = Colors[val];
    }
    let payload = {gridPadsArr: newPadsArr, selectedPad}
    context.dispatch({type: types.UPDATE_EDITOR_DATA, payload });
}
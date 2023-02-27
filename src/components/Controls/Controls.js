import React, {useContext,useState} from 'react';
import {TOGGLE_REC_MODE, CLEAR_SELECTED_PAD, TOGGLE_EDIT_MODE} from '../../reducers/types';
import Modal from "../Modal/Modal.js";
import {uploadLoop} from '../../actions'
import './Controls.css';
import {Context} from '../../contexts/SamplerContext';
import MidiControls from '../MidiControls/MidiControls';
import {db} from '../../functions/firebase';
import {
    useLocation
  } from "react-router-dom";
import { useCookies } from 'react-cookie';
  
const Controls = (props) => {

    let initialState = {instrument:"", key:"", loopName:"",tempo:"",file:null};    
    const context = useContext(Context);
    const [user, setUser] = useCookies(['user']);    
    let currentPad = context.gridPadsArr[context.selectedPad];
    let location =  useLocation();
    let sessionID = location.pathname.split("/").pop();
    const [isOpen, setIsOpen] = useState(false);
    const [fileLoad, setFileLoad] = useState();
    const [collabData, setCollabData] = useState(initialState);

    // const [session, setSession] = useState(); 
    // const CreateCollab = () => {
        
    //     const response = db.collection('collaboration')
    //     .add({
    //         name:  collabData.sessionName,
    //         address: sessionState.sessionArtistName,
    //         address:  userAddress,
    //         description: sessionState.sessionDescription,
    //         needs: sessionNeed,
    //         genre: sessionState.sessionGenre
    //         })
    //         .then(() =>
    //             setSessionState(initialState)

    //         );

    // };
        
    // useEffect(()=>{
    // getSessionData();
    // },[])

    const validateSelectedFile = (file) => {
        if(!file) return console.log("No file...")
        let ext = file.name.split('.')[1]
        let validExt = /mp3|wav|m4a/.test(ext)
        if(!validExt) return console.error("Unable to load selected file")
        setFileLoad(file)
        setCollabData({...collabData, file:file})
    }
    // const toggleRecMode = () => {
    //     let recMode = !context.recMode
    //     context.dispatch({type: TOGGLE_REC_MODE, payload: {recMode}})
    // }
    const toggleEditMode = () => {
        let editMode = !context.editMode;
        let recMode = false;
        context.dispatch({type: TOGGLE_EDIT_MODE, payload: {editMode, recMode} });
    }

    const handelLoopUnload = (e) =>{
        e.preventDefault();
        setCollabData({...collabData, file:null})        
    }

    const handelLoopUpload = (e) =>{
        e.preventDefault();
        uploadLoop(context,currentPad,sessionID,collabData,user,props.props.setIsLoading);
        setIsOpen(false);
    }
    // const clearSelectedPad = () => {
    //     let sources = {...context.sources}
    //     sources[context.selectedPad] = {buffer: null, name: "", isPlaying: false}
    //     let gridPadsArr = [...context.gridPadsArr];
    //     gridPadsArr[context.selectedPad].source = null
    //     context.dispatch({type: CLEAR_SELECTED_PAD, payload: {sources, gridPadsArr}})
    // }
    // const renderRecButton = () => {
    //     if(context.editMode && currentPad && !currentPad.source){
    //         if(!context.recMode){
    //             return(
    //                 <div className="file-selector-wrapper">
    //                     <button
    //                     onClick={() => { toggleRecMode() }}
    //                     className="ctl-btn"
    //                     >REC</button>
    //                 </div>
    //             )
    //         } else {
    //             return(
    //                 <div className="file-selector-wrapper">
    //                     <button
    //                     onClick={() => { toggleRecMode() }}
    //                     className="ctl-btn"
    //                     >EDIT</button>
    //                 </div>
    //             )
    //         }
            
    //     }
    // }

    const renderFileUpload = () => {

        const openFileSelector = (e) => {
            e.preventDefault();
            let fileSelector = document.getElementById("fileSelector");
            fileSelector.click();
        }

        return (
            <div className="file-selector-wrapper">
            { props.props.isMinted == false?
                <div style={{display:"inline-block",cursor:"pointer"}}  onClick={() => setIsOpen(!isOpen)}>LOAD A LOOP</div>
                :""
            }

            <Modal
            isOpen={isOpen}
            onHide={() => setIsOpen(!isOpen)}
            headerCaption={"COLLAB"}
            >
                <form>
                    {collabData.file == null ?
                    <div>
                        <button 
                        className="ctl-btn" 
                        onClick={(e) => openFileSelector(e)}>UPLOAD FILE</button>
                        <input 
                        type="file" 
                        style={{display:"none"}}
                        id="fileSelector"
                        onChange={(e) => validateSelectedFile(e.target.files[0])} 
                        accept="audio/*" multiple={false}/>
                    </div>:
                    <div>
                        <p style={{
                            display:"inline-block",
                            margin:"10px"
                        }}>File uploaded</p>

                        <button 
                        style={{
                            background: "red",
                            color:"#000"
                        }}
                        onClick={handelLoopUnload}>
                            X
                        </button>
                    </div>
                    }
                    <input type="text" placeholder="loop name" value={collabData.loopName} className="ghost-input" onChange={(e)=> setCollabData({...collabData, loopName:e.currentTarget.value})} required/>
                    <input type="text" placeholder="instrument" value={collabData.instrument} className="ghost-input" onChange={(e)=> setCollabData({...collabData, instrument:e.currentTarget.value})} required/>
                    <input type="text" placeholder="key" value={collabData.key} className="ghost-input" onChange={(e)=> setCollabData({...collabData, key:e.currentTarget.value})} />
                    <input type="number" placeholder="tempo" value={collabData.tempo} className="ghost-input" onChange={(e)=> setCollabData({...collabData, tempo:e.currentTarget.value})} />
                    <button 
                        onClick={handelLoopUpload}
                        className="ghost-input"
                        style={{
                            background: collabData.loopName.length == 0 || collabData.instrument.length == 0 || collabData.file == null ? "#000000":"#353535",
                            color: collabData.loopName.length == 0 || collabData.instrument.length == 0 || collabData.file == null ? "#4f4f4f":"#fff"
                        }}
                        disabled={collabData.loopName.length == 0 || collabData.instrument.length == 0 || collabData.file == null ? true:false}
                        >
                        submit
                    </button>

                </form>
                    
                </Modal>

            </div>    
        )
    }

    const renderSourceLoadUnload = () => {
        // if(!user.hasOwnProperty()) return [];
        if(currentPad && !currentPad.source && user.user) return renderFileUpload();
        if(currentPad && currentPad.source && user.user){
            if(user.user.addr == props.props.sessionOwner) {
                return <div><div onClick={() => toggleEditMode()}>{props.props.editToggleMode}</div></div>
            }
        }
        if(context.editMode && currentPad && !currentPad.source) return renderFileUpload()
    }
    // const renderMidiControls = () => {
    //     if(!context.midiEnabled) return
    //     return <MidiControls />
    // }
    
    return (
        <div className="controls-wrapper">

            <p style={{fontFamily: 'Simple', fontSize:"2em"}}>
                loop {currentPad ? currentPad.id+1:""}
            </p>

            {renderSourceLoadUnload()}

        </div>
    )
}

export default Controls
import React, {useState,useContext,useEffect} from 'react';
import { useOutletContext } from "react-router-dom";
import Colors from '../../Config/ColorScheme';
import midiMap from '../../Config/midiMap';
import Pad from '../../components/Pad/Pad';
import * as types from '../../reducers/types';
import "./sessions.css"
import placeholder from "../placeholder.png";
import firebase from 'firebase/compat/app';
import {Context} from '../../contexts/SamplerContext';
import { useCookies } from 'react-cookie';
import { useLocation } from "react-router-dom";
import {db} from '../../functions/firebase';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
// import INITIAL_STATE from '../../contexts/Config/AudioInitialState';

const Sessions = () =>{

    const [sessions, setSessions] = useState([])
    const array = ["",""]
    const context = useContext(Context);
    let location =  useLocation();
    let locationPath = location.pathname.split("/").pop();
    const [isLoading, setIsLoading] = useState(true);

    const sliptAddressText = (address) =>{
        return address.split("").splice(-10);
    }

    const getSessions = async() => {
        
        const count = locationPath == "sessions" ? 20 : 6;
        const timeStamp = firebase.firestore.Timestamp.now();

        const snapshot = db.firestore().collection('session').limit(count).orderBy("createdAt", "desc").get()
        
        const sessionsData = snapshot.then(snapshot => {
            const sessions = snapshot.docs.map(doc => ({
                id: doc.id,
              ...doc.data(),
            }));
        setSessions(sessions);
        setIsLoading(false)
        context.dispatch({type: types.UPDATE_SOURCES, payload: {sessions}});
        
        // (()=>{
        //     return sessionsData
        // })
    });
};

    const setPad = (stemId) =>{

        const stems = db.firestore().collection('collaboration').doc(stemId.id).get()
        .then(snapshot => {
            
            let stem = snapshot.data()
            const padId = stem.padId

            let gridPadsArr = context.sessions;
            gridPadsArr[padId].source = stem.loop
            gridPadsArr[padId].isLoaded = true
            gridPadsArr[padId].isLooping = false
            
        })
        .catch(err => {return console.error(err)});
                
    }
        
    const renderPad = (sourceId,id) => {
        // const source = setPad(sourceId);
        const midiNote = midiMap[id + 36].note;
        let backgroundColor = Colors.black
        if(id) backgroundColor = Colors.green;

        return <Pad
        midiNote={midiNote}
        key={id} 
        id={id} 
        backgroundColor={backgroundColor}
        />
        
    }   

    useEffect(()=>{
        if(db != undefined && sessions.length == 0){
            getSessions();
        }
    },[])

    useEffect(()=>{
        return () => {
            let gridPadsArr = []
            context.dispatch({type: types.UPDATE_SOURCES, payload: {gridPadsArr}});            
          };
    },[])

    const rendercontent = (sessionKey) => {
        return <div className="previewSession">{array.map((item,key) => { return renderPad("",sessionKey+key) })} </div>
    }

    return(
        <div className="sessionsComponent">
            <h1 style={{fontFamily:"Zombie",fontSize:"5em",transform: "rotate(7deg)",padding:"50px 0px 50px 0px"}}>
                JUMP IN
            </h1>

            <div className="sessionsContainer">
                {sessions?(
                    sessions.map((session,key)=>(
                        <div className="sessionHomeContainer">
                            
                            <div className="sessionSpecInfo">
                                <div className="backgroundSpec">
                                </div>
                                <Link to={"/session/"+session.id} style={{textDecorationColor:"cyan",fontFamily:"Beary",order:"1"}}><h3 style={{fontSize:"3em"}}>{session.name}</h3></Link>
                                <Link to={"/profile/"+session.address} style={{textDecoration:"none",fontSize:"1.2em"}}><p style={{display:"block",fontFamily:"'Beary'",order:"2"}} className="specs">ARTIST: {session.artist?session.artist:sliptAddressText(session.address)}</p></Link>
                                <p style={{display:"block",fontFamily:"'Beary'",order:"3"}} className="specs">TEMPO: {session.tempo}</p>
                                
                                {isLoading?
            
                                    "LOADING...":            
                                    
                                    <div style={{display:"inline-block",order:"4",textAlign:"left",width:"50%"}} >
                                                                        
                                        <p style={{fontFamily:"Beary", fontSize:"1em",display:"inline-block"}}>
                                            NEEDS: 
                                        </p>

                                        {session.needs.length>0?(
                                            session.needs.map(needItem =><p style={{display:"inline-block",margin:"10px",padding:"10px",background:"#5b00ba"}}>{needItem}</p> )
                                        ):" N/A"}
                                    
                                    </div>
                                }
                            </div>
                            
                            <div className="sessionsItemArt">
                                <Link to={"/session/"+session.id}><img style={{width:"100%"}} src={session.sessionArt? session.sessionArt:placeholder} /></Link>
                            </div>

                            {/* {rendercontent(key)} */}

                        </div>
                    ))
                    ):"Loading..."
                }
            </div>
            
            { locationPath != "sessions" ? 

                <Link to="/sessions" style={{
                    padding: "25px",
                    fontFamily: "Zombie",
                    margin: "40px",
                    fontSize: "3em",
                    display:"inline-block"
                }}>
                    SEE MORE
                </Link>:

                <Link to="/" style={{
                    padding: "25px",
                    fontFamily: "Zombie",
                    margin: "40px",
                    fontSize: "3em",
                    display:"inline-block"
                }}>
                    GO BACK
                </Link>

            }

        </div>
    )
}

export default Sessions

import React, {useState,useContext,useEffect,useRef} from 'react';
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Context} from '../../contexts/SamplerContext';
import * as types from '../../reducers/types';
import GridPad from '../../contexts/Config/PadGrid';
import Colors from '../../Config/ColorScheme';
import Hud from '../../components/Hud/Hud';
import PadEditor from '../../components/PadEditor/PadEditor';
import Pad from '../../components/Pad/Pad';
import {updateSources} from '../../actions'
import {db} from '../../functions/firebase';
import { useLocation } from "react-router-dom";
import sessionContract from "../../contracts/Sessions.json"
import Header from '../../components/Header/Header';
import placeholder from "../placeholder.png";
import "./session.css";
import midiMap from '../../Config/midiMap';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useCookies } from 'react-cookie';
import INITIAL_STATE from '../../contexts/Config/AudioInitialState';
import {mintNFT} from "../../contracts/transactions/mint_nft.js";

fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org").put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

const Session = () =>{

    const [session, setSession] = useState([]); //useState() hook, sets initial state to an empty array
    const [loops, setLoops] = useState(); //useState() hook, sets initial state to an empty array
    const context = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const gridArr = context.gridPadsArr;
    let getLoops = loops ? true:false;
    let location =  useLocation();
    let sessionID = location.pathname.split("/").pop();
    const [user, setUser] = useCookies(['user']);
    const [isOwner, setIsOwner] = useState(false);
    
    const getSessionData = async() => {

        const response = db.firestore().collection('session').doc(sessionID).get()
        .then(snapshot =>{
            const data = snapshot.data();
            setSession(data);
            setIsOwner(user.hasOwnProperty() && data.address ? true:false)
            if(data.stems.length>0){
                data.stems.map((stemId)=>{
                    setPad(stemId);
                });
                setIsLoading(false);
            }else{
                setIsLoading(false);
            }
        });
        
    };

    const setPad = (stemId) =>{

        const stems = db.firestore().collection('collaboration').doc(stemId.id).get()
        .then(snapshot => {
            
            let stem = snapshot.data()
            
            const padId = stem.padId

            gridArr[padId].source = stem.loop
            gridArr[padId].name = stem.loopName
            gridArr[padId].isLoaded = true
            gridArr[padId].color = stem.padColor
            gridArr[padId].isLooping = false

            context.dispatch({type: types.UPDATE_SOURCES, payload: {gridPadsArr}});
            
        })
        .catch(err => console.error(err));
        
    }

    // useEffect(()=>{
    //     console.log("on unmount")
    //     return () => {
    //         let gridPadsArr = []
    //         context.dispatch({type: types.UPDATE_SOURCES, payload: {gridPadsArr}});            
    //       };
    // },[])

    useEffect(()=>{
        if(db != undefined || gridArr.length > 16){
            getSessionData();
        }
    },[gridArr,sessionID, isLoading])

    useEffect(() => { 
        if(context.gridPadsArr.length < 1 && isLoading) generateGrid();
    }, [session,isLoading]);
    
    // useEffect(() => { 
    //     return () => {
    //         // Clean up the audio player
    //         const Player = context.gridPadsArr.player;
    //         Player.dispose();
    //         console.log(Player)
    //       };
    // },[]);

    const renderPad = (item) => {
        let backgroundColor = Colors.black
        let isLoaded = item.isLoaded
        const midiNote = midiMap[item.id + 36].note;
        if(isLoaded)  backgroundColor = context.gridPadsArr[context.selectedPad].color;
        
        return <Pad 
            midiNote={midiNote}
            key={item.id} 
            name={item.name}
            id={item.id} 
            name={item.name}
            backgroundColor={backgroundColor}
            />
        
    }   

    const rendercontent = () => {
        if(!context.editMode) return <div style={{maxWidth: "700px",margin: "auto",textAlign:"center"}}>{gridArr.map((item) => { return renderPad(item) })}</div>
        return <PadEditor />
    }
    const testForTouchDevice = () => {
        return 'ontouchstart' in window;
    }
    
    // const testForMidiAPI = () => {
        // return "requestMIDIAccess" in navigator;
    // }

    const generateGrid = () => {
        
        // let midiEnabled = testForMidiAPI();
        let touchEnabled = testForTouchDevice();
        let gridPadsArr = [];
        for(let i = 0; i < context.numPads; i++){
            let newPad = new GridPad({id: i });
            gridPadsArr.push(newPad);
        }
        let payload = {gridPadsArr, touchEnabled}
        context.dispatch({ type: types.GENERATE_GRID, payload });

    }

    const mint = async () =>{
    
        try{
        const transactionID = await fcl.send([
            fcl.transaction(mintNFT),
            fcl.args([fcl.arg("https://sessions-e4f78.web.app/session/"+sessionID, fcl.t.String)]),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(9999)
          ]).then(fcl.decode)

            if(transactionID != undefined){

                const sessionResponse = db.firestore().collection("session").doc(sessionID).update({
                    isMinted: true,
                    mintData: {
                        contractHash: "0x9a2479063c4c25bf",
                        mintHash: transactionID
                    }
                });
                
                setSession({...session,minted:true});
            }
                console.log(transactionID)
        
            }catch(e){console.log(e)}


    }


    return(

        <div className="sessionComponent">

            <Header title={"Sessions"} button={false}/>

            <div className="sessionContentTop">

                <div className="sessionArt">
                    {session.sessionArt?
                        <img src={session.sessionArt}/>
                        :""
                    }
                </div>

                <div className="sessionOptions">

                    <div className="sessionSpecs">
                        <h3 className="sessionTitle">
                            {isLoading? "Loading...":session.name}
                        </h3>
                        <p>
                            version: 1.0.0
                        </p>
                        <p>
                            tempo: {isLoading? "loading...":session.tempo}bpm
                        </p>

                    </div>

                    <div className="optionsWrapper">
                    {isLoading?(
                        <p>
                            LOADING...
                        </p>
                        ):
                        <p>
                            {session.description}
                        </p>
                    }
                    </div>
                    <div className="sessionNeedsWrapper">

                    {isLoading?
            
                        "LOADING...":            
                        
                        <div className="sessionNeedsContainer">
                                                
                            <h3>
                                Needs
                            </h3>

                            {session.needs.length>0?(
                                session.needs.map(needItem =><p>{needItem}</p> )
                            ):""}
                            
                        </div>
                    }
                    </div>

            </div>

            </div>

            <div style={{
                textAlign:"center"
            }}>
                {isLoading?
                        "":
                    session.isMinted ?
                    <div className="isMinted">
                                            
                        <h3>
                            THIS SESSION IS MINTED ON THE CHAIN!
                        </h3>
                        <a href={"https://testnet.flowscan.org/transaction/"+session.mintData.mintHash+"/script"}>
                            FLOWSCAN LINK
                        </a>

                        <h3>Session collaborators:</h3>
                        {session.collaborators.length>0?(
                            session.collaborators.map(collaborator =><p>{collaborator}</p> )
                        )
                        
                        :""}

                    </div>:""
                }
            </div>

            <div className="grid">
                {isLoading? "" : <Hud sessionOwner={session.address} setIsLoading={setIsLoading} isMinted={session.isMinted} />}

                {user.user && session ?(
                    user.user.addr == session.address && !session.isMinted ? <button className="mintButton"  onClick={mint}>mint</button>:""
                ):""
                }
                {isLoading ? "LOADING...." : rendercontent()}
            </div>
           

        </div>
    )
}

export default Session

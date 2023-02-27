import React, {useState,useEffect,useRef} from 'react';
import Header from '../../components/Header/Header';
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import firebase from 'firebase/compat/app';
import {db} from '../../functions/firebase';
import { useCookies } from 'react-cookie';
import imageUpload from '../upload.png';
import "../Register/register.css";
import "./create.css";
import { useAuthState } from "../../components/Auth/auth-context";

const Create = () =>{

    const [isLoading, setIsLoading] = useState(false);    
    let navigate = useNavigate();    
    let initialState = {sessionName:"", sessionArtistName:"", sessionDescription:"", sessionGenre:"",tempo:null};
    let genresList = ["rap","hip-hop","pop","indie","rock","edm","country","corridos","house","funk","other"];
    let [genre, setGenre] = useState("⬇️ Select a Genre ⬇️");    
    let sessionNeedsIndex = 0;
    let [need,setNeed] = useState("");
    const [sessionState, setSessionState] = useState(initialState);
    const [sessionNeeds, setSessionNeeds] = useState([]);
    const [sessionArt, setSessionArt] = useState(null);
    const [cookies, setCookie] = useCookies(['user']);
    const userAddress = null;

    const authState = useAuthState()

    const CreateSession = async(e) => {
        
        e.preventDefault();
        setIsLoading(true)
        
        if (cookies.user == null) return alert("Not Singed In");

        const storage = db.storage();
        const storageRef = storage.ref();
        let sessionArtURL = null;

        try {
            
            if(sessionArt){
                const fileRef = await storageRef.child(sessionArt.file.name).put(sessionArt.file);
                sessionArtURL = await fileRef.ref.getDownloadURL();
            }

            const response = db.firestore().collection('session')
            .add({
                name:  sessionState.sessionName,
                sessionArt: sessionArtURL != null ? sessionArtURL:"",
                artist: sessionState.sessionArtistName,
                address:  cookies["user"].addr,
                description: sessionState.sessionDescription,
                needs: sessionNeeds,
                genre: genre,
                stems: [],
                tempo: sessionState.tempo,
                isMinted:false,
                public:true,
                createdAt : firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt : firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(data =>{
                    setSessionState(initialState);
                    navigate(`/session/${data.id}`);
                    }
                );

        }catch(e){console.log(e)}


    };

    const onFileHomeImageChange = async(e) => {

        const file = e.target.files[0]
        setSessionArt({
            url:URL.createObjectURL(file),
            file:file
        })
        
    }        

    const onAddSessionNeed = (e) => {
        
        e.preventDefault();

        setSessionNeeds(sessionNeed=>[...sessionNeeds,need]);
        setNeed("");
        
    };
    
    let handleGenreChange = (e) => {
        setGenre(e.target.value)
    }
    
    return(
        <div className="Create">
            <div className="container">
                <form style={{width:"90%",margin:"auto",textAlign:"center"}} onSubmit={CreateSession}>
                    {sessionArt?(
                        <img style={{width:"120px"}} src={sessionArt.url}/>
                    ):
                        <div class="image-upload">
                            
                            <label for="file-input">
                                <img style={{width:"100px"}} src={imageUpload}/>
                                <p style={{marginTop:"0px"}}>
                                    session cover art
                                </p>
                            </label>
                            
                            <input id="file-input" accept="image/*" type="file" onChange={e=>{onFileHomeImageChange(e)}}/>
                            
                        </div>

                    }
                    <input type="text" className="ghost-input" value={sessionState.sessionName} placeholder="session title" onChange={(e)=> setSessionState({...sessionState, sessionName:e.currentTarget.value})} required/> 
                    <textarea type="text" className="ghost-input" value={sessionState.sessionDescription} placeholder="description" onChange={(e)=> setSessionState({...sessionState, sessionDescription: e.currentTarget.value})}> </textarea>
                    {/* <input type="text" className="ghost-input" value={sessionState.sessionArtistName} placeholder="Artist Name" onChange={(e)=> setSessionState({...sessionState, sessionArtistName:e.currentTarget.value})} required/>  */}
                    <select onChange={handleGenreChange} className="ghost-input" > 
                        <option value="⬇️ Select a Genre ⬇️">select a genre</option>
                        {genresList.map((genre)=> <option key={genre.key} value={genre}>{genre}</option> )}
                    </select>
                <input type="text" className="ghost-input" value={sessionState.tempo} placeholder="tempo" onChange={(e)=> setSessionState({...sessionState,tempo:e.currentTarget.value})} /> 
                    <div class="session-needs">

                        <input type="text" style={{fontSize:"1.2em"}} className="ghost-input" placeholder="this session needs" value={need} onChange={(e)=>setNeed(e.target.value)} />

                        <button 
                        disabled={need.length<1?true:false}
                        style={{
                            background: "#4c08ff"
                        }}
                        className="ghost-input"
                        onClick={onAddSessionNeed}>
                            add 
                        </button>
                        
                    </div>


                    <div style={{display:"block",textAlign:"left"}}>
                        {sessionNeeds.length>0 ? (
                            sessionNeeds.map((need)=>
                                <p
                                    style={{
                                        background: "#9871ff",
                                        color: "black",
                                        fontSize:"1em",
                                        padding:"10px",
                                        display:"inline-block",
                                        margin:"5px"
                                    }}
                                >{need}</p>
                            )
                            ):""
                        }
                    </div>

                    <input 
                        style={{marginTop:"60px"}}
                        disabled={isLoading || sessionState.sessionName.length == 0 ? true : false}
                        type="submit"
                        value="CREATE SESSION"
                        className="ghost-button"
                        />

                </form>
            </div>
        </div>

    )
}
    

export default Create

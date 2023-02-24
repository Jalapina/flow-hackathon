import React, { useState } from 'react';
import { useAuthDispatch } from "../../components/Auth/auth-context";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {db} from '../../functions/firebase';
import { useCookies } from 'react-cookie';
import * as fcl from "@onflow/fcl"

import "./Settings.css"

const Settings = () => {
  const [artistName, setArtistName] = useState('');
  const [userData,setUserData,isOwner] = useOutletContext();  
  const [user, removeCookie] = useCookies(['user']);  
  const dispatch = useAuthDispatch();
  let navigate = useNavigate();    

  const initialState = {
    status: "idle",
    user: null,
    error: null
  };

  const handleUserUpdate = () => {

    db.firestore().collection('user').doc(userData.id).update({
      artistName: artistName
    }).then(()=>{
      
      setArtistName('')
      setUserData({...userData,artistName: artistName})

    }).catch(err => {return console.error(err)});

  };

  const signOut = () => {
    dispatch(initialState);
    removeCookie("user",{path:'/'});
    fcl.currentUser.unauthenticate();
    navigate(`/`);        
}

  return (
    <div className="settings-container">

      <label>
        <h3>Update Artist Name</h3>
        <input type="text" value={artistName} onChange={(e)=>setArtistName(event.target.value)} />
      </label>

      {isOwner?
        <p>Your current artist name is: {userData.artistName}</p>
        :"YOU'RE NAMELESS"
      }

      <button disabled={artistName.length<1?true:false} onClick={handleUserUpdate}>
        update
      </button>

      {isOwner? <button style={{display:"inline-block"}} onClick={signOut}>sign out</button>:""}

    </div>
  );
}

export default Settings;



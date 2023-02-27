import React, {useState,useEffect,useContext,useRef,Fragment} from 'react';
import { signInWithMoralis as signInWithMoralisByEvm } from '@moralisweb3/client-firebase-evm-auth';
import * as fcl from "@onflow/fcl"
import Header from '../../components/Header/Header';
import "../Register/register.css"
// import { httpsCallable } from '@firebase/functions';
// import { User } from '@firebase/auth';
import { auth, functions, moralisAuth } from '../../functions/firebase.js';
import { useNavigate } from "react-router-dom";
import {db} from '../../functions/firebase';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Web3Provider } from '@ethersproject/providers';
import { useAuthState, useAuthDispatch } from "../../components/Auth/auth-context";
import firebase from 'firebase/compat/app';
import { useCookies } from 'react-cookie';

fcl.config({  
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/testnet/authn"
})
.put("app.detail.title", "Sessions")
.put("app.detail.icon", "https://firebasestorage.googleapis.com/v0/b/sessions-e4f78.appspot.com/o/apple-touch-icon.png?alt=media&token=054b8262-9a89-49d2-97e7-19f8dc3ebac3")
.put("accessNode.api", "http://localhost:3000")
.put("accessNode.api", "https://sessions-e4f78.web.app")
.put("discovery.wallet", "http://localhost:8701/fcl/authn")
.put("accessNode.api", "https://access-testnet.onflow.org")
.put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

const Login = () =>{

  const { user: loggedUser, status, error } = useAuthState();
  const dispatch = useAuthDispatch();
  const [user, setUser] = useState();
  const [cookies, setCookie] = useCookies(['user']);    
  const [isNewUser, setisNewUser] = useState(false);
  let navigate = useNavigate();

  const createNewUser = (userAddress) =>{

    try {
        
      const response = db.firestore().collection('user')
      .add({
          address:  userAddress,
          createdAt : firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt : firebase.firestore.FieldValue.serverTimestamp()
          }).then(()=>{
            navigate(`/profile/`+userAddress);
          })

    }catch(e){console.log(e)}

  }

  const userExist = async(userAddress) =>{
    console.log(userAddress)
    const getUser= db.firestore().collection('user');
    
    const userSnapshot = getUser.where("address","==",userAddress).get()
    .then(snapshot => {

      const userJSON = snapshot.docs.map(doc => ({
            id: doc.id,
          ...doc.data(),
        }));

      console.log("userJSON[0]",userJSON[0]);
      if (userJSON[0]==undefined){
        createNewUser(userAddress)
      }
      
    }).catch(err => {return console.error(err)});
      
  }


  const Auth =  async (currentUser) => {
    const user = userExist(currentUser.addr);    
    console.log("The Current User", currentUser)

    dispatch({
      status: "resolved",
      user: currentUser,
      error: null
    });

    setCookie('user',currentUser);

    console.log(currentUser);
  }

  const logIn =  async () => {
    // log in through Blocto
    fcl.authenticate();
    
    const unsubscribe = fcl.currentUser.subscribe(currentUser => {
      
        currentUser.addr ? Auth(currentUser) : "";
    
    });
    
  }

  const signInWithMetamask = async() =>{
        
        let result = null

        try {

          dispatch({ status: "pending" });
          result = await signInWithMoralisByEvm(moralisAuth);
          const user = await userExist(result.credentials.user.addr);

          dispatch({
            status: "resolved",
            user: result.credentials.user,
            error: null
          });

          setCookie('user',result.credentials.user);
          
        } catch (error) {
          dispatch({ status: "rejected", error });
        }
        
  }
    
  return(
        <div className="loginContainer">

            <div className="signInContainer">
              <div className="metamaskSignIn">
            <button style={{width:"100%"}} onClick={() => logIn()}>FLOW SIGN IN</button>
              </div>
              
            </div>
      
      </div>

  )
}
    

export default Login

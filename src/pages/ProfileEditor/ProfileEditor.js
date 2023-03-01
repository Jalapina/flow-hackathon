import React, {useState,useEffect,useRef} from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useNavigate } from "react-router-dom";
import {db} from '../../functions/firebase';
import { useCookies } from 'react-cookie';
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useLocation } from "react-router-dom";
import { useAuthDispatch } from "../../components/Auth/auth-context";
import SessionsFeed from '../../components/SessionsFeed/SessionsFeed';
import placeholder from "../placeholder.png";
import "./profile.css";
import "../Create/create.css";

const ProfileEditor = () =>{
    let navigate = useNavigate();    
    const [userData, setUserData] = useState([]);   
    const [user, setUser,removeCookie] = useCookies(['user']);
    const [sessions, setSessions] = useState()
    const [isOwner, setIsOwner] = useState(false)
    const dispatch = useAuthDispatch();
    let location =  useLocation();
    let locationPath = location.pathname.split("/",3).pop();
    const [imageFile, setImageFile] = useState(null);

      // Handle selecting a new image file
    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };
    
    const sliptAddressText = (address) =>{
        return address.split("").splice(-10);
    }
    

    const handleImageUpload = () => {
        if (imageFile) {
          // Create a storage reference
          const storage = db.storage();
          const storageRef = storage.ref(imageFile.name);
          
          // Upload the file to storage
          storageRef.put(imageFile).then(() => {
            // Get the URL of the uploaded file
            storageRef.getDownloadURL().then((downloadURL) => {
              // Save the download URL to the user's document in Firestore
              db.firestore().collection('user').doc(userData.id).update({
                imageUrl: downloadURL
              });
              setImageFile(null)
              setUserData({...useData,imageUrl:downloadURL})
            });

          });
        }
      };

    const getUserData = async() => {

        const userData = db.firestore().collection('user')

        const userSnapshot = userData.where("address","==",locationPath).get().then(snapshot => {
            
            const userJSON = snapshot.docs.map(doc => ({
                id: doc.id,
              ...doc.data(),
            }));

            setIsOwner(userJSON[0].address == user.user.addr? true:false)
                
            setUserData(userJSON[0]);
                
            }).catch(err => {return console.error(err)});
            
        };
        
        const signOut = () => {
            dispatch(initialState);
            removeCookie("user",{path:'/'});
            navigate(`/`);        
        }
        
        useEffect(()=>{  
            getUserData();
        },[])
        
    return(
        <div className="profile">
        
        <Header title={"Sessions"}/>

            <div className="container">
                <div className="leftSideBar">
                        <div className="profilePicture image-upload">
                            <label for="file-input">
                                <img className="profilePicture" alt="profilePic" src={userData.imageUrl? userData.imageUrl : placeholder}/>
                            </label>
                            <input id="file-input" accept="image/*" type="file" onChange={e=>{handleImageChange(e)}}/>
                            {imageFile != null && isOwner?(
                                <button onClick={handleImageUpload}>
                                    update
                                </button>
                            ):""}
                            
                        </div>
                        <div className='specs'>
                            <h2>{userData ? userData.artistName: "Loading..."}</h2>
                            <h4>Sessions: {sessions?sessions.length:"1"}</h4>
                            <h4>collabs: 3</h4>
                        </div>
                </div>
                <div className="mainContentArea">
                    <h2>
                        {sliptAddressText(locationPath)}
                    </h2>
                    <div className='bio'>
                        Welcome to the website. If you're here, you're likely looking to find random words. Random Word Generator is the perfect tool to help you do this. While this tool isn't a word creator, it is a word generator that will generate random words for a variety of activities or uses. 
                    </div>
                    <div className="profileNavigation">
                        
                        {isOwner?  
                            <Link to={"settings/"}>
                                <div>
                                    <p>
                                        SETTINGS
                                    </p>
                                </div>
                            </Link>
                            :""}

                        <Link to={"sessions/"}>
                            <div>
                                <p>
                                    SESSIONS
                                </p>
                            </div>
                        </Link>

                        <Link to={"collabs/"}>
                            <div>
                                <p>
                                    COLLABS
                                </p>
                            </div>
                        </Link>
  
                    </div>
                </div>

                <div className="profile-route-container">
                    <Outlet context={[userData,setUserData,isOwner]}/>
                </div>
                
            </div>
            {/* {newUser? <div style={{width:"100%",display:"inline-block",textAlign:"center"}}>Welcome</div>:""} */}
        </div>

    )
}
    

export default ProfileEditor

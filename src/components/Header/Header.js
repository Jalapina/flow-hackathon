import React,{useState,useRef} from 'react';
import logo from "../../pages/record.svg";
import padIntro from "../../pages/padIntro.png";
import "./header.css";
import createButton from "./plus-sign.png";
import profileButton from "./user.png";
import { Link } from 'react-router-dom';
import Modal from "../Modal/Modal.js";
import Register from "../../pages/Register/Register";
import Login from "../../pages/Login/Login";
import Create from "../../pages/Create/Create";
import { useAuthState } from "../../components/Auth/auth-context";
import { useCookies } from 'react-cookie';

export default ({title,button}) => {
    
    const modalRef = useRef
    const [cookies, setCookie] = useCookies(['user']);    
    const [isOpen, setIsOpen] = useState(false);
    const [loginOrSignIn, setLoginOrSignIn]=useState(false);
    const { user: loggedUser, status, error } = useAuthState();

    return (
    <div className="header">
        <div className="artBackground">
        </div>
        
        <div className="logoWrapper">
            <h1 style={{fontFamily:"Zombie !important"}} >{title}</h1>
        </div>


        {button ?
            <div  className="buttonWrapepr">
            
                <div>
                    {cookies["user"] == undefined || cookies["user"] == "undefined"?(

                        <div style={{display:"inline-block"}}  onClick={() => setIsOpen(!isOpen)}>
                            <img style={{width:"3em"}} src={profileButton}/>
                        </div>
                    ):
                     <div>
                        <Link to={"/profile/"+cookies["user"].addr}>
                            <img style={{width:"3em", marginRight:"50px"}} src={profileButton}/>
                        </Link>
                        <div style={{display:"inline-block"}}  onClick={() => setIsOpen(!isOpen)}>
                            <img className="createButton" src={createButton}/>
                        </div>
                    </div>
        
                    }
                </div>


                <Modal
                    isOpen={isOpen}
                    onHide={() => setIsOpen(!isOpen)}
                    headerCaption={cookies["user"] == undefined || cookies["user"] == "undefined" ? "Sing In":"Create Session"}
                >

                    {cookies["user"] == undefined || cookies["user"] == "undefined"?(

                        <Login/>
                        
                    ):(
                        <Create/>
                        )
                    }
                    
                </Modal>
            </div>
            :
            <div className="buttonWrapepr">
                <Link to="/">
                    <img style={{width:"100px"}} src={padIntro}/>
                </Link>
            </div>
        }
        </div>
    );

}

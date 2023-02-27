import React, {useContext,useState,useRef} from 'react';
import {Context} from '../../contexts/SamplerContext';
import {handlePadTrigger} from '../../actions'
import keyCTRL from '../../Config/keyboardControls';
import SamplerGrid from '../SamplerGrid/SamplerGrid';
import StartScreen from '../StartScreen/StartScreen';
import './App.css';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import ProfileEditor from "../../pages/ProfileEditor/ProfileEditor"
import Create from "../../pages/Create/Create"
import Session from "../../pages/Session/Session"
import Settings from "../Settings/Settings"
import Sessions from "../../pages/Sessions/Sessions"
import SessionsPreview from "../SessionsPreview/SessionsPreview"
import Collabs from "../Collabs/Collabs"
import Modal from "../Modal/Modal"
import AudioPlayer from "../AudioPlayer/AudioPlayer"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "../Auth/auth-context";
import { CookiesProvider } from 'react-cookie';

import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function App () {
    const [accountAddress, setAccountAddress] = useState();
    const [contractState, setContractState] = useState(undefined);
    const context = useContext(Context);
    
    const renderAppContent = () => {
        if(!context.ctx) return <StartScreen />
        return (
        <BrowserRouter>
            <CookiesProvider>
                <AuthProvider>
                    
                        <div className="app-wrapper">
                            <Routes>
                                <Route path="/" element={<SamplerGrid />} exact />
                                <Route path="profile/:id" element={<ProfileEditor />} >
                                    <Route index element={<SessionsPreview />} />
                                    <Route path="settings" element={<Settings/>} />
                                    <Route path="sessions" element={<SessionsPreview/>} />
                                    <Route path="collabs" element={<Collabs/>} />
                                </Route>
                                <Route path="session/:id" element={<Session />} />
                                <Route path="sessions" element={<Sessions />} exact/>
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                            {/* <AudioPlayer /> */}
                        </div>

                </AuthProvider>
            </CookiesProvider>
        </BrowserRouter>
        )
    };

    return(
        <div className="app-wrapper" 
        style={{height: "100vh"}}
        tabIndex="0">
            {renderAppContent()}
        </div>
    )
}
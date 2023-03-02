import React, {useState,useEffect,useRef} from 'react';
import TextTransition, { presets } from "react-text-transition";
import Sessions from "../Sessions/Sessions"
import "./Home.css";
import record from "../record.svg";
import padIntro from "../padIntro.png";
import soundwave from "../sound-wave.png";
import pad from "../pad.png";
import PurpleArrow from "./purple-arrow.png";
import PinkArrow from "./pink-arrow.png";
import Illustration from "./illustration-sessions.png";
import GreenArrow from "./green-arrow.png";
import Wave from "./wave.png";
import LogoWhite from "./logo-white.png";

const Home = () =>{
    const [index, setIndex] = useState(0);    
    const names = ["Drums", "Reverd Vocals", "snare", "SYNTH BASS", "Piano in C#"];    

    const TEXTS = [
        "Collaborate",
        "CREATE",
        "INOVATE",
        "LISTEN"
      ];
    const TEXTSPARAGRAPH = [
        "collaborate with friends and artist around the world",
        "create great music with anyone, anywhere",
        "grow the catelogue of stems, and sample others to find the sound of the future",
        "listen to what others are making and collab"
    ];

    useEffect(() => {
        
        const intervalId = setInterval(() =>
          setIndex(index => index + 1),
          6000 // every 3 seconds
        );
        return () => clearTimeout(intervalId);
      }, []);
      
    return(
        <div className="home">
    
            <div className="intro">

                <div className="element left">

                    <div className="padIntroContainer">
                        <img className="record" src={Illustration}/>
                    </div>

                </div>

                <div className="element right">

                    <div className="textAnimation">
                        <div className="animationwrapper">
                            <TextTransition  delay={5000}  springConfig={presets.slow}>
                            <h2>
                                {TEXTS[index % TEXTS.length]}
                            </h2>
                            <p>
                                {TEXTSPARAGRAPH[index % TEXTSPARAGRAPH.length]}
                            </p>
                            </TextTransition>
                        </div>
                    </div>


                </div>

                <div className="element bottom">
                    <h3>Need help finishing a track ?</h3>

                    <div className="stepOne">
                        <p>upload your stems</p>
                        <img src={Wave}/>
                    </div>
                    <div className="stepTwo">
                        <h2>ask the community what you need</h2>
                        <h3 style={{display:"inline-block",padding:"10px", testDecoration:"underline"}}> I'm looking for ...</h3>
                        <div className="needsAnimation">
                        <TextTransition  inline={true} delay={2} direction={"down"} springConfig={presets.stiff}>
                            <h2>
                                {names[index % names.length]}
                            </h2>
                            </TextTransition>
                        </div>   
                    </div>
                    <p style={{padding:"30px"}}>watch the magic happen</p>
                    <img style={{width:"10%", minWidth:"200px"}} src={LogoWhite}/>
                </div>

            </div>
            <Sessions/>
            
            <div className="about">
                <div className="aboutTextHomeContainer">
                    <h2>Find that sound in your head</h2>
                    <p>
                        Collaborate with others online, looking for some vocals | a bass or some cool drums for your track? start a session, upload your stems (mp3/wav) , and share with others to help you finish your track or create &#9632;&#9632;&#9632;&#9632;&#9632;!
                    </p>
                </div>

                <div className="imageHomeContainer">
                    <img src={soundwave}/>
                </div>
            </div>
            <div className="about">
            <div className="imageHomeContainer">
                    <img src={pad}/>
                </div>
                <div style={{padding:"0px 0px 0px 20px"}} className="aboutTextHomeContainer">
                    <h2>MINT YOUR COLLABS</h2>
                    <p>
                        When your track is finished you have the option of write royalties on the blockchain. Hit mint and anyone who collaborated on the final session will have solidified part on the track.
                    </p>
                </div>

         
            </div>

        </div>  
            
    )
}

export default Home
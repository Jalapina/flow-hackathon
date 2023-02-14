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
import GreenArrow from "./green-arrow.png";

const Home = () =>{

    const TEXTS = [
        "Collaborate",
        "CREATE",
        "INOVATE",
        "LISTEN"
      ];
    const TEXTSPARAGRAPH = [
        "collaborate with friends and artist around the world",
        "create great music with anyone, anywhere",
        "find the sound of the future",
        "listen to others creations"
      ];

    const [index, setIndex] = useState(0);
      
    useEffect(() => {
        const intervalId = setInterval(() =>
          setIndex(index => index + 1),
          3000 // every 3 seconds
        );
        return () => clearTimeout(intervalId);
      }, []);
      
    return(
        <div className="home">
    
            <div className="intro">

                <div className="element left">

                    <div className="illustrationWrapper">
                        <div className="collaType">
                            <h2 className="nameOfInstrument">DRUMS</h2>
                        </div>
                        <img className="arrow green" src={GreenArrow}/>
                        <div className="collaType">
                            <h2 className="nameOfInstrument">VOCALS</h2>
                        </div>
                        <img className="arrow pink" src={PinkArrow}/>
                        <div className="collaType">
                            <h2 className="nameOfInstrument">SYNTHS</h2>
                        </div>
                        <img className="arrow purple" src={PurpleArrow}/>

                    </div>
                    
                    <div className="padIntroContainer">
                        <img className="record" src={padIntro}/>
                    </div>

                </div>

                <div className="element right">
                    <div className="textAnimation">
                        <div className="animationwrapper">
                            <TextTransition springConfig={presets.wobbly}>
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
import { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own , SenderLang , ReceiverPP}) {
    ;
    console.log("Text Messager : " , message , " Own : " , own , " SenderLang : " , SenderLang , " ReceiverID : " , ReceiverPP)
   const [newTextMessage , setNewTextMessage] = useState("");
    useEffect(() => {
        if (own) {
            setNewTextMessage(typeof message.text === "object" ? message.text[SenderLang] : message.text )
        } else {
            setNewTextMessage(typeof message.text === "object" ? message.text[SenderLang] : message.text )
        }
    }, [message])
    console.log("NewTextMessage ::: ", newTextMessage)
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img
                    className="messageImg"
                    src={own ? window.location.origin + JSON.parse(localStorage.getItem("user")).profilePicture : window.location.origin + ReceiverPP}
                    alt=""
                />
                <p className="messageText">{newTextMessage}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    );
}
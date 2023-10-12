import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
    ;
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img
                    className="messageImg"
                    src={window.location.origin + "/images/person/6.jpeg"}
                    alt=""
                />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    );
}
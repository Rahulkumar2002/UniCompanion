import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.css';

export default function Conversation({ conversation, currentUser }) {
    ;
    const [user, setUser] = useState("");

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);
        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getUser();
    }, [currentUser, conversation])

    return (
        <div className="conversation">
            <img src={user?.profilePicture ? window.location.origin + user.profilePicture : window.location.origin + "/images/person/noAvatar.png"} alt="" className="conversationImg" />
            <span className="conversationName">{user.username}</span>
        </div>
    )
}
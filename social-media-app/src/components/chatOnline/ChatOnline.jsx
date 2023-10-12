import './chatOnline.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {

    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);


    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId);
            setFriends(res.data);
        };

        getFriends();
    }, [currentId]);

    const isFriendOnline = (friends , onlineUsers) => {
        console.log("Friends : ", friends)
        console.log("oU : " , onlineUsers)
        let oF = [];
        
        let i = 0 ; 
        while(i < friends.length){
            let j = 0 ; 
            while( j < onlineUsers.length){
                if (String(onlineUsers[j].userId).localeCompare(String(friends[i]._id))){
                    console.log("Entered Friend :: " , friends[i]);
                    oF.push(friends[i]);
                    break ;
                }
                j++ ; 
            }
            i++ ; 
        }

        console.log("OF : ", oF)
        return oF
    }



    useEffect(() => {
        setOnlineFriends(isFriendOnline(friends , onlineUsers));
    }, [friends, onlineUsers]);
    console.log("Online Friends : ", onlineFriends)
    
    const handleClick = async (user) => {
        try {
            const res = await axios.get(
                `/conversations/find/${currentId}/${user._id}`
            );
            if (res.data != null) {
                setCurrentChat(res.data);
            } else {
                const res = await axios.post(
                    `/conversations/${currentId}/${user._id}`
                    );
                    
                    console.log("Response data for conversation :: " , res.data);
                    setCurrentChat({})
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="chatOnline">
            {onlineFriends.map((o) => (
                <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
                    <div className="chatOnlineImgContainer">
                        <img src={
                            o?.profilePicture
                                ? window.location.origin + o.profilePicture
                                : window.location.origin + "/images/person/noAvatar.png"
                        } alt="" className="chatOnlineImg" />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <div className="chatOnlineName">{o?.username}</div>
                </div>
            ))}
        </div>
    )
}
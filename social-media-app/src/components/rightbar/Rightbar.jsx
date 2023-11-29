import './rightbar.css';
import { Users } from '../../dummyData';
import Online from '../online/Online';
import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

export default function Rightbar({ user }) {
    ;
    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(
        currentUser.followings.includes(user?._id)
    );

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get("/users/friends/" + user._id);
                setFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, [user]);
    const handleClick = async () => {
        try {
            if (followed) {
                await axios.put(`/users/${user._id}/unfollow`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "UNFOLLOW", payload: user._id });
            } else {
                await axios.put(`/users/${user._id}/follow`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "FOLLOW", payload: user._id });
            }
            setFollowed(!followed);

        } catch (err) {
            console.log(err)
        }
    };

    const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer" >
                    <img className="birthdayImg" src="assets/gift.png" alt="" />
                    <span className="birthdayText" >
                        <b>Pola Foster</b> and <b>3 other friends </b> have a birthday today .
                    </span>
                </div>
                <img src="assets/ad.png" className="rightbarAd" alt="" />
                <h4 className="rightbarTitle" >Online Friends</h4>
                <ul className="rightbarFriendList" >
                    {
                        Users.map((u) => (
                            <Online key={u.id} user={u} />
                        ))
                    }
                </ul>
            </>
        )
    }

    const changeLang = async (langValue) => {
        // Change local storage 
       let tempUser =  JSON.parse(localStorage.getItem("user"))
       tempUser.lang = langValue 
       localStorage.setItem("user" , JSON.stringify(tempUser) )

        // Change DB 
        let _id = user._id 
        try {
            const response =  await axios.patch('/users/changeLang', {
                _id : _id  , 
                lang : langValue
              })
              console.log("Changed the Language value in the db :: " , response);
          } catch (error) {
            console.log("Error in Updating the Language value in DB :: ", error);
          }

        //   window.location.reload(true);
    }

    const ProfileRightbar = () => {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className="rightbarTitle">User Information</h4>
                < div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City : </span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From : </span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship </span>
                        <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend) => (
                        <Link
                            to={"/profile/" + friend.username}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="rightbarFollowing">
                                <img
                                    src={
                                        friend.profilePicture
                                            ? window.location.origin + friend.profilePicture
                                            : window.location.origin + "/images/person/noAvatar.png"
                                    }
                                    alt=""
                                    className="rightbarFollowingImg"
                                />
                                <span className="rightbarFollowingName">{friend.username}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="rightbarInfo"> 
                <h4 className="rightbarTitle">Language</h4>
                <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Current Language </span>
                        <span className="rightbarInfoValue">{user.lang}</span>
                </div>
                <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Change Language</span>
                        <span className="rightbarInfoValue">
                            <select name="language" id="language" onChange={ () => changeLang(document.getElementById("language").value)}>
                                <option value="0" >Hindi</option>
                                <option value="1" >English</option>
                            </select>
                        </span>
                </div>                      
                </div>
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
};
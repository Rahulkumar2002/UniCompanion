import './online.css';

export default function Online({ user }) {
    ;
    return (
        <li className="rightbarFriend" >
            <div className="rightbarProfileImgContainer">
                <img className="rightbarProfileImg" src={window.location.origin + user.profilePicture} alt="" />
                <span className="rightbarOnline" ></span>
            </div>
            <span className="rightbarUsername">{user.username}</span>
        </li>
    )
}
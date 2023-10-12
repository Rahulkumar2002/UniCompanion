import './closefriend.css'


export default function Closefriend({ user }) {
    ;
    return (
        <>
            < li className="sidebarFriend">
                <img className="sidebarFriendImg" src={window.location.origin + user.profilePicture} alt="" />
                <span className="sidebarFriendName">{user.username}</span>
            </li>
        </>
    )
}

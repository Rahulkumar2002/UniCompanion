import './topbar.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import Chat from '@mui/icons-material/Chat';
import Notifications from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Topbar() {

    ;
    const { user } = useContext(AuthContext);

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">UniCompanion</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar" >
                    <SearchIcon className="searchIcon" />
                    <input placeholder="search for friend , post or video" className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks" >
                    <span className="topbarLink">Homepage</span>
                    <span className="topbarLink">Timeline</span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <PersonIcon />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <Link to="/messenger">
                        <div className="topbarIconItem">
                            <Chat />
                            <span className="topbarIconBadge">2</span>
                        </div>
                    </Link>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <Link to={`/profile/${user.username}`}>
                        <img src={
                            user.profilePicture !==" "
                                ? window.location.origin + user.profilePicture
                                : window.location.origin + "/images/person/noAvatar.png"
                        } alt="profile" className="topbarImg" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
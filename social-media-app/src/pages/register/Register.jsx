import './register.css';
import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Regsiter() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate();


    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Password don't match");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value
            };
            try {
                await axios.post("/auth/register", user);
                navigate("/login");
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Social-App</h3>
                    <span className="loginDesc">Connect with friends and the world around with Social-App .</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Username" type="text" required ref={username} className="loginInput" />
                        <input placeholder="Email" type="email" ref={email} className="loginInput" />
                        <input placeholder="Password" type="password" minLength="6" required ref={password} className="loginInput" />
                        <input placeholder="Password Again" type="password" required ref={passwordAgain} className="loginInput" />
                        <button className="loginButton" type="submit">Sign Up</button>
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <button className="loginRegistrationButton">
                                Log in to Account
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
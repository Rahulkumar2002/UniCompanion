import './login.css';
import { useContext, useRef } from 'react';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch);
    };
    console.log(error);

    console.log(user);
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">UniCompanion</h3>
                    <span className="loginDesc">Connect with friends and the world around with UniCompanion.</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Email" type="email" required className="loginInput" ref={email} />
                        <input placeholder="Password" minLength="6" type="password" required className="loginInput" ref={password} />
                        <button className="loginButton" type="submit" disabled={isFetching}>{isFetching ? <CircularProgress color="secondary" size="20px" /> : "Log In"}</button>
                        <span className="loginForgot">Forgot Password</span>
                        <button className="loginRegistrationButton" disabled={isFetching}>
                            {isFetching ? <CircularProgress color="secondary" size="20px" /> : "Create New Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Messenger from './pages/messenger/Messenger';



function App() {
    const { user } = useContext(AuthContext);
    return (
        <Router >
            <Routes>
                < Route path="/" exact element={
                    user ? <Home /> : <Register />} />
                <Route path="/login" exact element=
                    {user ? <Navigate to="/" /> : <Login />} />
                <Route path="/Register" exact element={user ? <Navigate to="/" /> : <Register />} />
                <Route path="/messenger" exact element={!user ? <Navigate to="/" /> : <Messenger />} />
                <Route path="/profile/:username" exact element={
                    <Profile />} />
            </Routes>
        </Router>
    )
}

export default App;
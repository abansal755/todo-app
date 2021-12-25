import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const authCtx = useContext(AuthContext);

    const logoutBtnClickHandler = () => {
        authCtx.logOut();
    }
    
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to='/'>Todo-App</Link>
                <div>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
                        <li className="nav-item">
                            {authCtx.isLoggedIn && (
                                <button className="btn btn-dark" onClick={logoutBtnClickHandler}>Logout</button>
                            )}
                            {!authCtx.isLoggedIn && (
                                <Link className="btn btn-dark" to='/auth'>Login</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
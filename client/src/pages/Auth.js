import {useContext, useState} from 'react';
import AuthContext from '../context/AuthContext';

const Auth = () => {
    const [username,setUsername] = useState('');
    const usernameInputHandler = e => setUsername(e.target.value);

    const [password,setPassword] = useState('');
    const passwordInputHandler = e => setPassword(e.target.value);

    const [isLoggingIn,setIsLoggingIn] = useState(true);
    const modeSwitchClickHandler = e => {
        e.preventDefault();
        setUsername('');
        setPassword('');
        setIsLoggingIn(prev => !prev);
    }

    const authCtx = useContext(AuthContext);

    const formSubmitHandler = e => {
        e.preventDefault();
        if(isLoggingIn) authCtx.logIn(username,password);
        else authCtx.register(username,password);
    }

    return (
        <div className="row">
            <div className="col col-lg-6 ms-auto me-auto">
                <div className="card">
                    <form className="card-body" onSubmit={formSubmitHandler}>
                        <div className="mb-2">
                            <label className='form-label' htmlFor="username">Username</label>
                            <input className="form-control" id="username" placeholder="Enter username" value={username} onInput={usernameInputHandler}/>
                        </div>
                        <div className='mb-2'>
                            <label className='form-label' htmlFor="password">Password</label>
                            <input className="form-control" id="password" placeholder="Enter password" type='password' value={password} onInput={passwordInputHandler}/>
                        </div>
                        <a href='' onClick={modeSwitchClickHandler}>
                            {isLoggingIn ? 'Click here to register instead' : 'Click here to login instead'}
                        </a>
                        <div className='d-flex justify-content-center mt-2'>
                            {isLoggingIn && (
                                <button className='btn btn-primary'>Login</button>
                            )}
                            {!isLoggingIn && (
                                <button className='btn btn-primary'>Register</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Auth;
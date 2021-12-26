import { createContext, useContext, useEffect, useState } from "react";
import useHttp from "../hooks/useHttp";
import ErrorContext from "./ErrorContext";

const AuthContext = createContext({
    user: {},
    isLoggedIn: false,
    logIn: (username,password) => {},
    logOut: () => {},
    register: (username,password) => {}
});

export const AuthContextProvider = props => {
    const [user,setUser] = useState(null);
    const isLoggedIn = !!user;
    const http = useHttp();
    const errCtx = useContext(ErrorContext);

    const logIn = (username,password) => {
        http.sendRequest({
            url: '/api/users/login',
            method: 'POST',
            data: {
                username,
                password
            }
        },
        data => {
            setUser(data);
        },
        data => {
            errCtx.addError(data.error.message);
        });
    }

    const logOut = () => {
        http.sendRequest({
            url: '/api/users/logout',
            method: 'POST'
        },
        () => {
            setUser(null);
        },
        data => {
            errCtx.addError(data.error.message);
        })
    }

    const register = (username,password) => {
        http.sendRequest({
            url: '/api/users',
            method: 'POST',
            data: {
                username,
                password
            }
        },
        data => {
            setUser(data);
        },
        data => {
            errCtx.addError(data.error.message);
        })
    }

    useEffect(() => {
        http.sendRequest({
            url: '/api/users'
        },
        data => {
            setUser(data);
        })
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            logIn,
            logOut,
            register
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
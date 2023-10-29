import React, {useContext} from 'react'
import {Link, useLocation} from "react-router-dom";
import {AuthContext} from "../../helpers/AuthContext.jsx";
import {BASE_URL} from "../../helpers/url.jsx";
import {getConfig} from "../../helpers/Config.js";
import axios from "axios";
export default function Header(){
    const {accessToken, setAccessToken , currentUser , setCurrentUser} = useContext(AuthContext)
    const location = useLocation();

    const logout =async ()=>{
        try {
            await axios.post(`${BASE_URL}/user/logout`,{},getConfig(accessToken));
            localStorage.removeItem('accessToken');
            setCurrentUser(null)
            setAccessToken('')
        }catch(error){
            console.log("error" , error)
        }
    }
    return <>
        <nav className="navbar navbar-expand-lg  navbar-dark bg-dark">
            <div className="container-fluid ">
                <Link className="navbar-brand" to="#"><i className="fas fa-parking mx-1 fa-3x"></i></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/"?"active ":""}`} aria-current="page" to="/">
                              <i className="fas fa-home"></i>  Home
                            </Link>
                        </li>
                        {
                            !currentUser ?
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname==="/register"?"active":""}`} to="/register">
                                            <i className="fas fa-user-plus"></i>
                                            Registration
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname==="/login"?"active":""}`} to="/login">
                                            Login
                                            <i className="fas fa-sign-in mx-1"> </i>
                                        </Link>
                                    </li>
                                </>
                                :
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname==="/profile"?"active":""}`} to="/profile">
                                            {currentUser.name}
                                            <i className="fas fa-user  mx-2"> </i>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="#" onClick={()=>logout()} >
                                            Logout
                                            <i className="fas fa-sign-out  mx-2"> </i>
                                        </Link>
                                    </li>
                                </>
                        }
                    </ul>

                </div>
            </div>
        </nav>
    </>
}
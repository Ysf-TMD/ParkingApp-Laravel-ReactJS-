import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios";
import {BASE_URL} from "../../helpers/url.jsx";
import {renderValidationErrors} from "../../helpers/Validation.jsx";
import Spinner from "../Layouts/Spinner";
import {AuthContext} from "../../helpers/AuthContext.jsx";

export default function Register(){
    const [name , setName]=useState("")
    const [email , setEmail]=useState("")
    const [password , setPassword]=useState("")
    const [errors , setErrors]=useState({})
    const navigate = useNavigate();
    const [loading , setLoading ] = useState(false);
    const {accessToken, setAccessToken , currentUser , setCurrentUser} = useContext(AuthContext)
    useEffect(()=>{
        if(accessToken) navigate("/");
    },[accessToken , navigate])
    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrors({})
        setLoading(true);
        const data = {name , email  , password};
        try {
            const response = await axios.post(`${BASE_URL}/user/register`,data);
            localStorage.setItem("accessToken",JSON.stringify(response.data.access_token))
            setAccessToken(response.data.access_token);
            // the api route return user as response ->json() .... in laravel
            setCurrentUser(response.data.user);
            setLoading(false);
            setName("")
            setEmail("")
            setPassword("")
            navigate("/")
        }catch (error){
            setLoading(false)
            if(error.response.status === 422){
                setErrors(error.response.data.errors)
            }
            console.log("your error is " , error);
        }
    }
    return <>
        <div className="container">
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header bg-white p-3 text-center">
                            <h4>Create Account</h4>
                        </div>
                        <div className="card-body">
                            <form  onSubmit={(e)=>handleSubmit(e)}>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div className="form-group">
                                            <input type="text" name="name" value={name}
                                                   className={"form-control mb-2 rounded-0"}
                                                   placeholder={"Name"}
                                                   onChange={(e)=>setName(e.target.value)}
                                                   id=""/>
                                            {renderValidationErrors(errors,"name")}
                                        </div>
                                        <div className="form-group">
                                            <input type="text" name="email" value={email}
                                                   className={"form-control mb-2 rounded-0"}
                                                   placeholder={"email"}
                                                   onChange={(e)=>setEmail(e.target.value)}
                                                   id=""/>
                                            {renderValidationErrors(errors,"email")}
                                        </div>
                                        <div className="form-group">
                                            <input type="password" name="password" value={password}
                                                   className={"form-control mb-2 rounded-0"}
                                                   placeholder={"password"}
                                                   onChange={(e)=>setPassword(e.target.value)}
                                                   id=""/>
                                            {renderValidationErrors(errors,"password")}
                                        </div>
                                        <div className="">
                                            {loading ?
                                                <Spinner/> :
                                                <button className="btn btn-primary btn-sm mb-4 rounded-0">
                                                    Submit
                                                </button>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
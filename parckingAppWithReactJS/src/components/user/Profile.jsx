import React, {useContext, useEffect, useState} from 'react'
import {renderValidationErrors} from "../../helpers/Validation.jsx";
import Spinner from "../Layouts/Spinner.jsx";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../helpers/AuthContext.jsx";
import axios from "axios";
import {BASE_URL} from "../../helpers/url.jsx";
import {getConfig} from "../../helpers/Config.js";
import {toast} from "react-toastify";
export default function Profile(){
    const [name , setName ] = useState("");
    const [password , setPassword ]=useState("");
    const [currentPassword , setCurrentPassword ]=useState("");
    const [errors , setErrors] = useState({})
    const navigate = useNavigate();
    const [loading , setLoading ] = useState({updatingName  : false , updatingPassword : false});
    const {accessToken  , setCurrentUser} = useContext(AuthContext)
    const updateProfile = async (e)=>{
        e.preventDefault()
        setErrors({})
        setLoading({
            ...loading ,
            updatingName: true ,
        });
        const data = {name};
        try {
            const response = await axios.put(`${BASE_URL}/user/update/profile`,data , getConfig(accessToken));

            // the api route return user as response ->json() .... in laravel
            setCurrentUser(response.data.user);
            setLoading({
                ...loading ,
                updatingName: false ,
            });
            setName("")
            navigate("/")
        }catch (error){
            setLoading({
                ...loading ,
                updatingName: false ,
            });
            if(error.response.status === 422){
                setErrors(error.response.data.errors)
            }
            console.log("your error is " , error);
        }
    }

    useEffect(()=>{
        if(!accessToken) navigate("/login")
    },[accessToken])

    const updatePassword = async (e)=>{
        e.preventDefault()
        setErrors({})
        setLoading({
            ...loading ,
            updatingPassword: true ,
        });
        const data = {current_password: currentPassword , password};
        try {
            const response = await axios.put(`${BASE_URL}/user/update/password`,data , getConfig(accessToken));

            // the api route return user as response ->json() .... in laravel

            setLoading({
                ...loading ,
                updatingPassword: false ,
            });
            setPassword("") ;
            setCurrentPassword("") ;
            toast.success(response.data.message,{
                position  : toast.POSITION.TOP_RIGHT,
            })
            // navigate("/")
        }catch (error){
            setLoading({
                ...loading ,
                updatingName: false ,
            });
            if(error.response.status === 422){
                setErrors(error.response.data.errors)
            }
            console.log("your error is " , error);
        }
    }
    return <>
        <div className="container">
            <div className="row my-5">
                <div className="col-md-6 ">
                    <div className="card">
                        <div className="card-header bg-white text-center">
                            <h4 className="mt-2">
                                Update Your Name
                            </h4>
                        </div>
                        <div className="card-body">
                            <form  onSubmit={(e)=>updateProfile(e)}>
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
                                        <div className="">
                                            {loading.updatingNam ?
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
                <div className="col-md-6 ">
                    <div className="card">
                        <div className="card-header bg-white text-center">
                            <h4 className="mt-2">
                                Update Your Name
                            </h4>
                        </div>
                        <div className="card-body">
                            <form  onSubmit={(e)=>updatePassword(e)}>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div className="form-group">
                                            <input type="password" name="currentPassword"
                                                   value={currentPassword}
                                                   className={"form-control mb-2 rounded-0"}
                                                   placeholder={"currentPassword"}
                                                   onChange={(e)=>setCurrentPassword(e.target.value)}
                                                   id=""/>
                                            {renderValidationErrors(errors,"current_password")}
                                        </div>
                                        <div className="form-group">
                                            <input type="password" name="password" value={password}
                                                   className={"form-control mb-2 rounded-0"}
                                                   placeholder={"newPassword"}
                                                   onChange={(e)=>setPassword(e.target.value)}
                                                   id=""/>
                                            {renderValidationErrors(errors,"password")}
                                        </div>
                                        <div className="">
                                            {loading.updatingPassword ?
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
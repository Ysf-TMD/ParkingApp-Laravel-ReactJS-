import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from "../helpers/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../helpers/url.jsx";
import {getConfig} from "../helpers/Config.js";
import {toast} from "react-toastify";
import Spinner from "./Layouts/Spinner";
import Stripe from "./payments/Stripe";

export default function Home(){
    const [sectors , setSectors ]=useState([]);
    const {accessToken , currentUser} = useContext(AuthContext)
    const navigate = useNavigate();
    const [loading , setLoading] = useState({id : null , status : false})
    const [amount , setAmount] = useState(JSON.parse(localStorage.getItem("amount")||0))
    useEffect(()=>{
        if(!accessToken) navigate("/login");
        const fetchSectors = async ()=>{
            try {
                const response =await axios.get(`${BASE_URL}/sectors`,getConfig(accessToken));
                setSectors(response.data.data);

            }catch(error){
                console.log("error Home Page Get All Sectors ") ;
            }
        }
        if(accessToken) {
            fetchSectors();
        }
    },[accessToken]);


    const startParkin = async(place_id)=>{
        setLoading({
            ...loading ,
            id : place_id ,
            status: true ,
        })
        const data = {user_id : currentUser ?.id} ;
        try{
            const response = await axios.put(`${BASE_URL}/parking/${place_id}/start`,data,getConfig(accessToken))
            //if you send error from controller ... by The API route
            if(response.data.error){
                toast.error(response.data.error,{
                    position  : toast.POSITION.TOP_RIGHT,
                })
            }
            let updatedPlace = response.data.data ;
            const updatedSectors = [...sectors];
            const sector = updatedSectors.find(sector =>sector.id === updatedPlace.sector_id);
            sector.places = sector.places.map(place =>place.id === place_id ?{...place,...updatedPlace} : place ) ;
            setSectors(updatedSectors);
            //toast.error(response.data.error,{
            //  position : toast.POSITION.TOP_RIGHT
            //})
            setLoading({
                ...loading ,
                id : place_id ,
                status: false ,
            })
        }catch(error){
            setLoading({
                ...loading ,
                id : place_id ,
                status: false ,
            })
            console.log("updatin place error ....")
        }
    }




    const endParkin = async(place_id)=>{
        setLoading({
            ...loading ,
            id : place_id ,
            status: true ,
        })
        const data = {user_id : currentUser ?.id} ;
        try{
            const response = await axios.put(`${BASE_URL}/parking/${place_id}/end`,data,getConfig(accessToken))

            let updatedPlace = response.data.data ;
            const updatedSectors = [...sectors];
            const sector = updatedSectors.find(sector =>sector.id === updatedPlace.sector_id);
            sector.places = sector.places.map(place =>place.id === place_id ?{...place,...updatedPlace} : place ) ;
            setSectors(updatedSectors);
            // amount to pay ....
            localStorage.setItem("amount",JSON.stringify(updatedPlace.total_price))
            setAmount(updatedPlace.total_price)
            toast.success("Parking Ended Please Check the Amount To Pay",{
                postion:toast.POSITION.TOP_RIGHT
            })
            setLoading({
                ...loading ,
                id : place_id ,
                status: false ,
            })
        }catch(error){
            setLoading({
                ...loading ,
                id : place_id ,
                status: false ,
            })
            console.log("updatin place error ....")
        }
    }

    return <>
        <div className="container">
            <div className="row my-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="card-header bg-white text-center">
                                <div className="mt-2">
                                    <h4>Sectors</h4>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {
                                        sectors?.map(sector =>(
                                            <div className="col-md-4" key={sector.id}>
                                                <div className="card border my-2 p-1 border-dark">
                                                    <div className="text-center ">
                                                        <h5 className="mt-3">
                                                            {sector.name} {""}(${sector.hourly_price}/h)
                                                        </h5>
                                                        <p className="text-muted">
                                                            <span className="text-danger">*</span>
                                                            <i>Price For 1 Hour</i>
                                                        </p>
                                                    </div>
                                                    <div className="card-body">
                                                        {
                                                            sector.places?.map(place =>(
                                                                    <div className="card border my-2 p-1 border-dark" key={place.id}>
                                                                        <div className="text-center ">
                                                                            <h6 className="mt-2 ">
                                                                                {place.name}
                                                                            </h6>
                                                                        </div>
                                                                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                                                            {
                                                                                place.availlable ?
                                                                                    <>
                                                                                        <span className="mb-2">
                                                                                            <i className="fas fa-car fa-2x"></i>
                                                                                        </span>
                                                                                        {
                                                                                            loading.id=== place.id && loading.status  ?
                                                                                                <Spinner/>
                                                                                                :
                                                                                        <button
                                                                                            disabled={amount > 0 }
                                                                                            className="btn btn-danger btn-sm text-capitalize"
                                                                                            onClick={()=>startParkin(place.id)}
                                                                                        >
                                                                                            Park Here
                                                                                        </button>
                                                                                        }
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <span className="mb-2">

                                                                                            <i className="text-muted">
                                                                                                {place.start_time}
                                                                                            </i>
                                                                                        </span>
                                                                                        <span className="mb-2">
                                                                                            <i className="fa-solid fa-ban fa-2x text-danger"></i>
                                                                                        </span>
                                                                                        {
                                                                                            loading.id=== place.id && loading.status  ?
                                                                                                <Spinner/>
                                                                                                :
                                                                                                place.user_id=== currentUser ?.id && <button
                                                                                                    onClick={()=>endParkin(place.id)}
                                                                                                    className="btn btn-warning btn-sm text-capitalize">
                                                                                                    End Parking
                                                                                            </button>
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                        </div>
                        </div>
                    </div>
                </div>
                {
                    amount > 0 &&
                    <div className={"col-md-4"}>
                        <div className="card">
                            <div className="card-header bg-white">
                                <h5 className="text-center my">
                                    Amount To Pay :
                                    {""}
                                    <span className="text-danger fw-bo">
                                        ${amount}
                                    </span>
                                </h5>
                            </div>
                            <div className="card-body">
                                <Stripe amount={amount} setAmount={setAmount}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    </>
}

import React, {useContext, useEffect, useState} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';
import { BASE_URL } from '../../Helpers/Url';
import {AuthContext} from "../../helpers/AuthContext.jsx";
import {getConfig} from "../../helpers/Config.js";

export default function Stripe({amount , setAmount}) {
    const stripePromise = loadStripe('pk_test_51O6LJuEptk0JHvy6Dueaxfx8zLkH35E3gFi1dF5v0KSYcR7tJHkELjHPiNipWhMDhO4G8wwWsTXoppWYv243VfjK00plW9RlYc');
    const [clientSecret, setClientSecret] = useState("");
    const {accessToken } = useContext(AuthContext)


    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await axios.post(`${BASE_URL}/parking/pay`, {amount} , getConfig(accessToken));
                console.log("your secret client is : " , response.data.clientScret)
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.log(error);
            }
        }
        if(accessToken){
            fetchClientSecret();
        }

    }, []);



    return (
        <>
            {
                stripePromise && clientSecret && <Elements stripe={stripePromise} options={{clientSecret}}>
                    <CheckoutForm setAmount={setAmount}/>
                </Elements>
            }
        </>
    );
}



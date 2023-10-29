import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/user/Profile";
import Header from "./components/Layouts/Header";
import {useEffect , useState} from "react";
import {getConfig} from "./helpers/Config.js";
import axios from "axios";
import {BASE_URL} from "./helpers/url.jsx";
import {AuthContext} from "./helpers/AuthContext";

function App() {
    const [accessToken , setAccessToken ] = useState(JSON.parse(localStorage.getItem("accessToken")));
    const [currentUser , setCurrentUser] = useState(null);
    useEffect(()=>{
       const fetchCurrentUser = async ()=>{
           try {
               const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken)) ;
               //route api(auth senctum ) return user + accessToken
               setCurrentUser(response.data.user);
               //console.log(response)

           }catch(error){
               // unauthenticated user ....
               if(error.response.status === 401){
                   //expired token
                   localStorage.removeItem("accessToken");
                   setCurrentUser(null);
                   setAccessToken('');
               }
               console.log(error);

           }
       }
       // to avoid calling the function for the first time .... no user are loged in ... thats why
       if(accessToken){
           fetchCurrentUser()
       }
    },[accessToken]);
    console.log(currentUser)

   return (
  <>
      <AuthContext.Provider value={{accessToken, setAccessToken , currentUser , setCurrentUser}}>
          <BrowserRouter>
              <Header />
              <Routes>
                  <Route path={"/"} element={<Home />} />
                  <Route path={"/register"} element={<Register />}/>
                  <Route path={"/login"} element={<Login />}/>
                  <Route path={"/profile"} element={<Profile />}/>
              </Routes>
          </BrowserRouter>
      </AuthContext.Provider>

  </>
  )
}

export default App

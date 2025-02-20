import React, {useState, useEffect, createContext, useContext} from 'react'
import './main.css';
import Logo from './google.png';
import {useNavigate } from 'react-router-dom';
import axios from 'axios'

// export const {UserContext} = createContext(null);


function Container () {
     const [signIn, setSignIn] = useState(false);
     const [signUp, setSignUp] = useState(false);
     const [linkClicked, setlinkClicked] = useState(false);
     const [errorMgt, setErrorMgt] = useState("");
     const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: ''
     })

     let userInfo;

     let errorM;



    // function UserContextProvider (props) {
    //   const contextValue = userInfo;

    //   return (
    //   <UserContext.Provider value={contextValue} >
    //     {props}
    //     </UserContext.Provider>)

    //  }

     const navigate = useNavigate();


     function handleClick (event) {
      setlinkClicked (true)
      const name = event.target.name
        if (name === "login") {
          setSignIn(true)
        }
        if (name === "sign-up") {
          setSignUp(true)
        }
      



      // setEndPoint(url);

      // axios.get("/auth/google")
      //   .then (response => {
      //       console.log(response)  
      //       console.log("Successful")  
      //       setisLoggedIn(true)
      //   })
      //   .catch(error => {
      //   // Handle errors
      //   console.log('Error fetching data:', error);
      // });

      // // event.preventDefault();
     }
     function handleFormData (event) {
      const fieldName = event.target.name;
      const fieldValue = event.target.value;
      setFormData ({...formData, [fieldName]:fieldValue})


     }
     
     async function handleSignin (){
       await axios.post("/login",  formData)
        .then (response => {
            console.log(response.data) 
            console.log("Successful")  
            localStorage.setItem("token", response.data.token);   
            localStorage.setItem("User", response.data.user.username); 
            localStorage.setItem("UserId", response.data.user.id);   


            userInfo =  response.data.user;

          

            navigate("/dashboard", {userInfo} )        // setisLoggedIn(true)
        }
        
      )
    
        .catch(error => {
        // Handle errors
        setErrorMgt(error.error)
        console.log('Error fetching data:', error);
      });

      // event.preventDefault();

     }
     async function handleSignup (){
      await axios.post("/signup",  formData)
        .then (response => {
            console.log(response.data) 
            console.log("Successful")  
            localStorage.setItem("token", response.data.token);   
            
            setFormData ({
              username: '',
              email: '',
              password: ''

            }) 
            navigate("/")        // setisLoggedIn(true)
        }
        
      )
        .catch(error => {
        // Handle errors
        setErrorMgt(error.data.error)
        console.log('Error fetching data:', error);
      });

      // event.preventDefault();

     }
    

     const controlSubmit = (event) => {
      event.preventDefault();

     }
        
      
    

  return (
    <div className='container'>
     <div className={linkClicked?"localauth":null}>
     {linkClicked ?
     <div className='log-field'>
      <form className='input-form'onSubmit={controlSubmit}>
      <h2>{signIn ? "Sign In Account": "Rigister Account"}</h2>
        {/* <p>{errorMgt}</p> */}
      <input type='text' onChange={handleFormData} value={formData.username} name='username' placeholder='User Name' required></input>
      {signUp ? <input onChange={handleFormData} type='email' value={formData.email} name='email' placeholder='Email Address' required></input>:null}
      <input type='text' onChange={handleFormData} value={formData.password} name='password' placeholder='Password' required></input>
      <button  onClick={signIn?handleSignin:handleSignup} type='submit' >  {signIn?"Login":"Register"}</button>
      {signIn?<p>Don't have an Account? <span onClick={() => {setSignUp(true); setSignIn(false) }} className='quick-link'>Sign-Up</span></p>:<p>Already have an Account? <span className='quick-link' onClick={() => {setSignUp(false); setSignIn(true) }}>Sign-In</span></p>}
      </form>
     </div> :
    <div className="auth">
    <div className="google-login">
     <button  onClick={handleClick}  name="login" className='auth-link'>  Sign In</button>
    
    </div>
    <hr/>
    <div className="google-login">
    <button  onClick={handleClick}  name="sign-up" className='auth-link'>  Sign Up</button>
    </div>

    </div>
      }
      </div>
    </div>
  )
}

export default Container

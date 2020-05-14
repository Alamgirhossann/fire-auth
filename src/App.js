import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './FirebaseConfig/FirebaseConfig';


firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSignedIn : false,
    name: "",
    email: "",
    photo: ""
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(result =>{
      const {displayName, email, photoURL} = result.user
     const signedInUser = {
       isSignedIn: true,
       name: displayName,
       email: email,
       photo: photoURL

      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignOut = ()=>{
    firebase.auth().signOut()
    .then(res=>{
      const signedOutUser={
        isSignedIn: false,
        displayName:'',
        email:'',
        photo: '',
        password:'',
        error: '',
        existingUser: false,
        isValid: false
      }
      setUser(signedOutUser)
    })
    .catch(error =>{

    })
  }
  const is_valid_email = email => /(.+)@(.+){2}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  
  const switchForm = e =>{
    const createdUser = {...user}
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
    
  }
  const handleChange = event=>{
    const newUserInfo = {
      ...user
    };

    //perform validation
    let isValid = true;
    if(event.target.name === "email"){
     isValid = is_valid_email(event.target.value);
    }
    if(event.target.name === "password"){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount = (event)=>{
    if(user.isValid){
     firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
     .then(response =>{
       console.log(response);
       const createdUser = {...user}
       createdUser.isSignedIn = true;
       createdUser.error = '';
       setUser(createdUser);
     })
     .catch(error =>{
       console.log(error);
       const createdUser = {...user}
       createdUser.isSignedIn = false;
       createdUser.error = error.message;
       setUser(createdUser);
     })
    }
    
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(response =>{
        console.log(response);
        const createdUser = {...user}
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(error =>{
        console.log(error);
        const createdUser = {...user}
        createdUser.isSignedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
     }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
     {user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>:
       <button onClick={handleSignIn}>Sign in</button>
     }
      {
        user.isSignedIn &&  <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div> 
      }
      <h1>Our Own Authentication</h1>
      <input type="checkbox" name='switchForm' onChange={switchForm} id='switchForm' />
      <label htmlFor="switchForm">Returning User</label>

      <form style={{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
      <input type="text" onBlur={handleChange} name='email' placeholder="Your Email" required/>
      <br/>
      <input type="password" onBlur={handleChange} name='password'  placeholder='Your password' required />
      <br/>
      <input type="submit" value='SignIN'/>
      </form>

      <form style={{display: user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
      <input type="text" onBlur={handleChange} name='name' placeholder="Your Name" required/>
      <br/>
      <input type="text" onBlur={handleChange} name='email' placeholder="Your Email" required/>
      <br/>
      <input type="password" onBlur={handleChange} name='password'  placeholder='Your password' required />
      <br/>
      <input type="submit" value='Create Account'/>
      </form>
      {
        user.error && <p>{user.error}</p>
      }
    </div>
  );
}

export default App;

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

let lgi = false
let infouser =""

export default function Login(){
    const [input,setInput] = useState({
        user:"",
        password:" "
    })
    const navigate = useNavigate()

    async function HandleSubmit(e){
        e.preventDefault();
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 30000*86400;
        now.setTime(expireTime);
        document.cookie = `userEmail=${input.email};expires=${now.toUTCString()}; path=/`
        const check = await axios.get(`http://localhost:4000/users/email/${input.email}`)
        if(check.data==null){
            document.querySelector(".non-existing-email").style.setProperty("--show","block")
            document.querySelector("#email-input").style.borderColor="red"
        }
        else{
            if(check.data.password==input.password){
                lgi=true
                infouser = check
                navigate("/")
                return
            }
            document.querySelector(".wrong-input-password").style.setProperty("--show","block")
            document.querySelector("#password-input").style.borderColor="red"
        }
    }

    function HandleInput(e){
        const {name,value} = e.target
        setInput((prev)=>({
            ...prev,
            [name] :value,
        }))
    }

    return (
        <>
            <img src="images__4_-removebg-preview.png" alt="" className="signup-logo"/>
            <div className="logindiv">
                <form className="signup_form" onSubmit={HandleSubmit}>
                    <h1 className="signuptitle">Log in</h1>
                    <div className="formControl">
                        <label htmlFor="email" className="formfor">Email</label>
                        <input type="email" name="email" id="email-input" onChange={HandleInput} className="defaultInputType"/>
                        <small className="wrong-input wrong-input-email">*incorrect input</small>
                        <small className="wrong-input non-existing-email">*account does not exist</small>
                    </div>
                    <div className="formControl">
                            <label htmlFor="password" className="formfor" >Password</label> 
                            <input type="password" name="password" id="password-input" onChange={HandleInput} className="defaultInputType"/>
                            <small className="wrong-input wrong-input-password">*incorrect input</small>
                    </div>
                    <button className="signupsubmit">Continue</button>
                    <p className="terms">By creating an account, you agree to this sites <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Conditions of Use</a> and <a href="">Privacy Notice.</a> </p>
                </form>
                <h3 className="newto" aria-level={5}>New to this site?</h3>
                <a href="/signup" className="tosignup">Create your account</a>
            </div>
            
            
        </>
    )
}

export {lgi,infouser}
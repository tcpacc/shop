import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

let su = false
let accountinf = ""

export default function Signup(){
    const [input,setInput] = useState({
        username: "",
        email:"",
        password:"",
        password2:""
    })
    const navigate = useNavigate()

    async function HandleSubmit(e) {
        e.preventDefault();
        let submitted=true
        let special,uppercase,lowercase,number=false
        input.password.split("").forEach(character => {
            if(!Number.isNaN(character)){
                number=true
            }
            else if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(character)){
                special=true
            }
            else if(character.toUpperCase()==character){
                uppercase=true
            }
            else if(character.toLowerCase()==character){
                lowercase=true
            }
        });

        if(input.email == ""){
            submitted=false
            document.querySelector(".wrong-input-email").style.setProperty("--show","block")
            document.querySelector("#email-input").style.borderColor="red"
        }
        if(input.username.length < 3){
            submitted=false
            document.querySelector(".wrong-input-username").style.setProperty("--show","block")
            document.querySelector("#username-input").style.borderColor="red"
        }
        if(input.password.length < 8){
            submitted=false
            document.querySelector(".wrong-input-password").style.setProperty("--show","block")
            document.querySelector("#password-input").style.borderColor="red"
        }
        if(special==false||lowercase==false||uppercase==false||number==false){
            submitted=false
            document.querySelector(".invalid-password").style.setProperty("--show","block")
            document.querySelector("#password-input").style.borderColor="red"
        }
        if(input.password != input.password2){
            submitted=false
            document.querySelector(".wrong-input-password2").style.setProperty("--show","block")
            document.querySelector("#password2-input").style.borderColor="red"
        }
        

        if (submitted){
            var now = new Date();
            var time = now.getTime();
            var expireTime = time + 30000*86400;
            now.setTime(expireTime);
            document.cookie = `userEmail=${input.email};expires=${now.toUTCString()}; path=/`
            const res = await axios.get(`http://localhost:4000/users/email/${input.email}`)
            if(res.data==null){
                await axios.post('http://localhost:4000/users',{
                    username: input.username,
                    email: input.email,
                    password: input.password,
                    cart:{},
                    list:[],
                    savedforlater:{},
                    history:[],
                    gift:[]
                })
                su=true
                accountinf = await axios.get(`http://localhost:4000/users/email/${input.email}`)
                navigate('/')
            }
            else{
                document.querySelector(".existing-email").style.setProperty("--show","block")
                document.querySelector("#email-input").style.borderColor="red"
            }
            
        }

    }

    function HandleInput(e){
        const {name,value} = e.target
        setInput((prev)=>({
            ...prev,
            [name] :value,
        }))
        if (name=="password"){
            if(value!= input.password2){
                document.querySelector(".wrong-input-password2").style.setProperty("--show","block")
                document.querySelector("#password2-input").style.borderColor="red"
            }
            else{
                document.querySelector(".wrong-input-password2").style.setProperty("--show","none")
                document.querySelector("#password2-input").style.borderColor="light-grey"
            }
        }
        else if (name=="password2"){
            if(value!= input.password){
                document.querySelector(".wrong-input-password2").style.setProperty("--show","block")
                document.querySelector("#password2-input").style.borderColor="red"
            }
            else{
                document.querySelector(".wrong-input-password2").style.setProperty("--show","none")
                document.querySelector("#password2-input").style.borderColor="grey"
            }
        }
    }

    return (
        <>
            <img src="images__4_-removebg-preview.png" alt="" className="signup-logo"/>
            <form className="signup_form" onSubmit={HandleSubmit}>
                <h1 className="signuptitle">Create account</h1>
                <div className="formControl">
                    <label htmlFor="email" className="formfor">Email</label>
                    <input type="email" name="email" id="email-input" onChange={HandleInput} className="defaultInputType"/>
                    <small className="wrong-input wrong-input-email">*incorrect input</small>
                    <small className="wrong-input existing-email">*account already exists</small>
                </div>
                <div className="formControl">
                    <label htmlFor="username" className="formfor">Username</label>
                    <input type="username" name="username" id="username-input" placeholder="At least 3 characters" onChange={HandleInput} className="defaultInputType"/>
                    <small className="wrong-input wrong-input-username">*incorrect input</small>
                </div>
                <div className="formControl">
                    <label htmlFor="password" className="formfor" >Password</label> 
                    <input type="password" name="password" id="password-input" placeholder="At least 8 characters" onChange={HandleInput} className="defaultInputType"/>
                    <small className="wrong-input wrong-input-password">*password must be at least 8 characters long</small>
                    <small className="wrong-input invalid-password">*password must have at least one uppercase letter, one lowercase letter, a number, ans one special character(eg. /,~,`,!,#,$,%,\,^,&,*,+,=,\,-,\)</small>
                </div>
                <div className="formControl">
                    <label htmlFor="password" className="formfor">Re-enter password</label>
                    <input type="password" name="password2" id="password2-input" onChange={HandleInput} className="defaultInputType"/>
                    <small className="wrong-input wrong-input-password2">*passwords must match</small>
                </div>
                <button className="signupsubmit">Create account</button>
                <p className="terms">By creating an account, you agree to this sites <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Conditions of Use</a> and <a href="">Privacy Notice.</a> </p>
                <p className="switchtologin">Already have an account? <a href="/login">Log in</a></p>
            </form>    
        </>
    )
}

export {su, accountinf}
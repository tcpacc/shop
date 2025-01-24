import { useEffect, useState } from "react";
import { loggedIn, loggedInInfo } from "../src/App";
import { infouser, lgi } from "./login";
import { accountinf, su } from "./signup";

export default function Cart({items}){
    const [usersInfo,setUsersInfo] = useState()
    useEffect(()=>{
        if(loggedIn){
            setUsersInfo(loggedInInfo)
        }
        else if(lgi){
            setUsersInfo(infouser)
        }
        else if(su){
            setUsersInfo(accountinf)
        }
        else{
            setUsersInfo("no account found")
        }
    },[])

    return (
        <>
        <div className="cartPage contentOne">
            {
                usersInfo == "no account found" ? 
                <>
                    <h1>no account</h1>
                </> :
                <>
                    <h1>has account</h1>
                </>
            }
        </div>
        </>
    )
}
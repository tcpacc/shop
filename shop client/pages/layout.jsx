import { useEffect, useState } from "react"
import {Outlet, Link, useNavigate} from "react-router-dom"
import { su,accountinf } from "./signup"
import {infouser, lgi} from "./login"
import {DeleteFromHistory, getCookie, loggedIn, loggedInInfo, SaveToHistory } from "../src/App"
import axios from "axios"
import logoImg from '../public/images__4_-removebg-preview.png'

// async function AccountCheck(){
//     if(loggedIn){
//         const logass =await axios.get(`http://localhost:4000/users/email/${getCookie("userEmail")}`)
//         return logass
//     }
// }
// const logassss = AccountCheck()
// console.log(logassss)

export default function Layout({items})
{
    const navigate= useNavigate()
    const [infoaccount,setInfoAcoount] = useState({});
    const [searchInput,setSearchInput] = useState('');
    const [infoHistory,setInfoHistory] = useState([])
    const [infoHistoryFilter,setInfoHistoryFilter] = useState()

    document.querySelector(".colorFilter").classList.remove("colorFilterOn")
    document.querySelector(".colorFilter").classList.add("colorFilterOff")
    document.body.classList.remove("scrollable")

    useEffect(()=>{
        if(su){
            // infoaccount = accountinf.data
            setInfoAcoount(accountinf.data)
        }
        else if(lgi){
            // infoaccount = infouser.data
            setInfoAcoount(infouser.data)
        }
        else if(loggedIn){
            // infoaccount = logassss.data
            setTimeout(() => {
                setInfoAcoount(loggedInInfo.data)
            }, 10);
        }
        setInfoHistory(infoaccount.history)
    })
    
    const [filteredItems,setFilteredItems]=useState([])

    function SearchFilter(e) {
        setSearchInput(e)
        if(e==""){
            setFilteredItems([])
            return
        }
        setFilteredItems(items.filter(item => FilterCheck(item.title,e)))
        setInfoHistoryFilter(infoHistory.filter(item => FilterCheck(item,e)))
    }

    function FilterCheck(item,searchTerm){
        if(searchTerm.length> item.length){
            return false
        }
        for (let index = 0; index < searchTerm.length; index++) {
            if(item[index].toUpperCase()!= searchTerm[index].toUpperCase()){
                return false
            }
        }
        return true
    }

    function CheckPressedKey(e){
        if(e.key=="Enter"){
            if(searchInput!=""){
                setFilteredItems([])
                GoToSearchPage(searchInput)
            }
        }
    }

    function GoToSearchPage(search){
        if(search.length > 2 && !infoHistory.includes(search)){
            SaveToHistory(search)
        }
        window.location.href = `/search/${search}`
    }

    function SelectSearch(title){
        document.querySelector('.searchBar').value =title
        SearchFilter(title)
        GoToSearchPage(title)
    }

    // useEffect(()=>{
    //     document.querySelector('.searchBar').addEventListener("keypress", function (e) {
    //         if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
    //             // navigate(`/search/${searchInput}`)
    //             console.log(searchInput)
    //         }
    //     },[]);
    // })

    function LogOutAccount(inputEmail){
        document.cookie = `userEmail=${inputEmail};expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        window.location.reload()
    }

    function DeleteItemHistory(key){
        DeleteFromHistory(key)
        window.location.reload()
    }
    
    return (
        <>
            <nav className="header">
                <a href="/" className="logo">
                    <img src={logoImg} alt=""/>
                </a>
                <div className="search">
                    <input type="text" placeholder="Search.." className="searchBar" onChange={(e)=>SearchFilter(e.target.value)} onKeyDown={(e)=>CheckPressedKey(e)} ></input>
                    {searchInput.length<=0&&
                        <>
                            <div className="searchHistory">
                                {infoHistory!=undefined&&infoHistory.map((item,key)=>(
                                    <div className="searchDownHistory" key={key}>
                                    <div className="searhDownHistoryLeft" onClick={()=>SelectSearch(item)}>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="searchDownElImg" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.61061 4 7.46589 5.04751 6 6.70835C5.91595 6.80358 5.83413 6.90082 5.75463 7M12 8V12L14.5 14.5M5.75391 4.00391V7.00391H8.75391" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                        <p className="historyTitle">{item}</p>
                                    </div>
                                        <p className="removeHistory" onClick={()=>DeleteItemHistory(key)}>&#x2716;</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    <div className="searchDown">
                        {infoHistoryFilter!=undefined&&infoHistoryFilter.map((item,key)=>(
                            <div className="searchDownHistory" key={key}>
                                <div className="searhDownHistoryLeft" onClick={()=>SelectSearch(item)}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="searchDownElImg" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.61061 4 7.46589 5.04751 6 6.70835C5.91595 6.80358 5.83413 6.90082 5.75463 7M12 8V12L14.5 14.5M5.75391 4.00391V7.00391H8.75391" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    <p className="historyTitle">{item.slice(0,searchInput.length)}<span className="boldSearchDownEl">{item.slice(searchInput.length)}</span></p>
                                </div>
                                <p className="removeHistory" onClick={()=>DeleteItemHistory(key)}>&#x2716;</p>
                            </div>
                        ))}
                        {filteredItems.map((item,key)=>(
                            <div className="searchDownEl" key={key} onClick={()=>SelectSearch(item.title)}>
                                <img className="searchDownElImg" src={item.image} alt="" />
                                <p>{item.title.slice(0,searchInput.length)}<span className="boldSearchDownEl">{item.title.slice(searchInput.length)}</span></p>
                            </div>
                        ))}
                    </div>
                    <button className="searchButton" onClick={()=>GoToSearchPage(searchInput)}>
                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-48.84 -48.84 586.08 586.08" xml:space="preserve" stroke="rgba(0,0,255)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"></path> </g> </g> </g></svg>
                    </button>
                </div>
                <div className="right-nav">
                    <Link to={'/cart'} className="cart">
                        <svg fill="rgba(255,255,255" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 902.86 902.86" xml:space="preserve" stroke="rgba(0,0,255"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path> <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path> </g> </g> </g></svg>
                    </Link>
                    {su||lgi||loggedIn ? <>
                    <div className="profile-image-div">
                        <img src={infoaccount.profilePicture==undefined? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiLp4JVcnUNcHcBofrZOiYcWZv4bAm-tF8DQ&s": infoaccount.profilePicture} alt="" className="profile-image"/>
                        <div className="accountSettingsDropDown">
                            <h3 className="accountSettingsOption" onClick={()=>LogOutAccount(infoaccount.email)}>Log out</h3>
                        </div>
                    </div>
                    </> : <>
                        <Link to={'/signup'} className="signupButton">signup</Link>
                        <Link to={'/login'} className="signupButton">login</Link>
                    </>}
                    
                </div> 
            </nav>

            <Outlet />
            <footer>
                <ul className="footerContent">
                    <li>All departments</li>
                    <li>Store Directory</li>
                    <li>Careers</li>
                    <li>Our Company</li>
                    <li>Sell</li>
                    <li>Help</li>
                    <li>Product Recalls</li>
                    <li>Accessibility</li>
                    <li>Tax Exempt Program</li>
                    <li>Get The App</li>
                    <li>Sign-up for Email</li>
                    <li>Terms of Use</li>
                    <li>Privacy and Security</li>
                    <li>Your Privacy Choices</li>
                    <li>Notice at Collection</li>
                    <li>AdChoices</li>
                    <li>Consumer Health Data Privacy Notice</li>
                    <li>Request My Personal Information</li>
                    <li>Brand Shop Directory</li>
                    <li>Business</li>
                    <li>Delete Account</li>
                </ul>
                <p>© 2025 Shop. All Rights Reserved.</p>
            </footer>
        </>
    )
}
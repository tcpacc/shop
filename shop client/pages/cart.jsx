import { useEffect, useState } from "react";
import {AddOrRemoveToGift, AddToSaveForLaterOrCart, DecreaseItem, DeleteFromCart, DeleteItem, IncreaseItem, loggedIn, loggedInInfo, RedirectToCategory } from "../src/App";
import { infouser, lgi } from "./login";
import { accountinf, su } from "./signup";
import { Link } from "react-router-dom";
import axios from "axios";
import errorImg from '../public/error.png'

export default function Cart({items}){
    const [cartItems,setCartItems] = useState()
    const [savedForLaterItems,setSavedForLaterItems] = useState()
    const [userInfo,setUserInfo] = useState()
    const [itemAmount,setItemAmount] = useState()
    const [subtotalPrice,setSubtotalPrice] = useState()
    const [saveForLaterItemAmount,setSaveForLaterItemAmount] = useState()
    const [saveForLaterSubtotalPrice,setSaveForLaterSubtotalPrice] = useState()
    
    //account info
    useEffect(()=>{
        if(su){
            setCartItems(items.filter(item => Object.keys(accountinf.data.cart).includes(item._id)))
            setSavedForLaterItems(items.filter(item=>Object.keys(accountinf.data.savedforlater).includes(item._id)))
            setUserInfo(accountinf)
        }
        else if(lgi){
            setCartItems(items.filter(item => Object.keys(infouser.data.cart).includes(item._id)))
            setSavedForLaterItems(items.filter(item=>Object.keys(infouser.data.savedforlater).includes(item._id)))
            setUserInfo(infouser)
        }
        else if(loggedIn){
                if(loggedInInfo !=undefined&& loggedInInfo!=null){
                setCartItems(items.filter(item => Object.keys(loggedInInfo.data.cart).includes(item._id)))
                setSavedForLaterItems(items.filter(item=>Object.keys(loggedInInfo.data.savedforlater).includes(item._id)))
                setUserInfo(loggedInInfo)}
        }
        else{
            setCartItems("no account found")
        }
    },[])

    //counting totals
    useEffect(()=>{
        setItemAmount(CountAmount())
        setSubtotalPrice(CountSubtotal())
        setSaveForLaterItemAmount(CountSaveForLaterAmount())
        setSaveForLaterSubtotalPrice(CountSaveForLaterSubtotal())
    })

    //gift item checks
    useEffect(()=>{
        if(cartItems != "no account found"){
            if(cartItems!=undefined){
                cartItems.forEach(element => {
                    if(userInfo.data.gift.includes(element._id)){
                        document.querySelector(`.checkBoxGift${element._id}`).checked=true
                    }
                });
            }
        }
    },[cartItems])

    function DecreaseItemValue(itemId){
        const decrease = userInfo.data.cart[itemId]-1
        setUserInfo({...userInfo,data:{...userInfo.data,cart:{...userInfo.data.cart,[itemId]:decrease}}})
        DecreaseItem(itemId)
    }

    function IncreaseItemValue(itemId){
        const increase = userInfo.data.cart[itemId]+1
        setUserInfo({...userInfo,data:{...userInfo.data,cart:{...userInfo.data.cart,[itemId]:increase}}})
        IncreaseItem(itemId)
    }

    function RemoveItemValue(itemId){
        const cartKeys = Object.keys(userInfo.data.cart).filter(item=>!item.includes(itemId))
        setCartItems(items.filter(item=>cartKeys.includes(item._id)))
        DeleteItem(itemId,"cart")
    }

    function RemoveItemValueFromSaveForLater(itemId){
        const savedForLaterKeys = Object.keys(userInfo.data.savedforlater).filter(item=>!item.includes(itemId))
        setSavedForLaterItems(items.filter(item=>savedForLaterKeys.includes(item._id)))
        DeleteItem(itemId,"savedforlater")
    }

    function CountAmount(){
        if(userInfo!=undefined){
        let count = 0
        Object.values(userInfo.data.cart).forEach(element => {
            count+=element
        });
        return count}
        }

    function CountSaveForLaterAmount(){
        if(userInfo!=undefined){
        let count = 0
        Object.values(userInfo.data.savedforlater).forEach(element => {
            count+=element
        });
        return count
        }
    }

    function CountSubtotal(){
        if(cartItems!= undefined && cartItems!= "no account found" && userInfo!=undefined){
            let subtotal = 0
            cartItems.forEach(element => {
                if(element.discount == undefined){
                    subtotal += element.price * userInfo.data.cart[element._id]
                }else{
                    subtotal += Math.floor((element.price*element.discount/100)*100)/100 * userInfo.data.cart[element._id]
                }
            })
            return Math.floor(subtotal*100)/100
            };
    }

    function CountSaveForLaterSubtotal(){
        if(savedForLaterItems!= undefined && userInfo!=undefined){
            let subtotal = 0
            savedForLaterItems.forEach(element => {
                if(element.discount == undefined){
                    subtotal += element.price * userInfo.data.savedforlater[element._id]
                }else{
                    subtotal += Math.floor((element.price*element.discount/100)*100)/100 * userInfo.data.savedforlater[element._id]
                }
            })
            return Math.floor(subtotal*100)/100
            };
    }

    function SaveForLater(itemId){
        if(Object.keys(userInfo.data.savedforlater).includes(itemId)){
            RemoveItemValue(itemId)
        }else{
        const movedItem = cartItems.filter(item=>item._id==itemId)[0];
        setSavedForLaterItems([...savedForLaterItems,movedItem])
        AddToSaveForLaterOrCart(itemId,"savedforlater","cart")
        RemoveItemValue(itemId)
    }
    }

    function MoveToCart(itemId){
        if(Object.keys(userInfo.data.cart).includes(itemId)){
            RemoveItemValueFromSaveForLater(itemId)
        }else{
            const movedItem = savedForLaterItems.filter(item=>item._id==itemId)[0]
            setCartItems([...cartItems,movedItem])
            AddToSaveForLaterOrCart(itemId,"cart","savedforlater")
            RemoveItemValueFromSaveForLater(itemId)
        }
    }

    function CheckCheckedGift(e,itemId){
        if(e.target.checked){
            AddOrRemoveToGift(itemId,true)
        }else{
            AddOrRemoveToGift(itemId,false)
            const newGift = userInfo.data.gift.slice(userInfo.data.gift.indexOf(itemId),1)
            setUserInfo({...userInfo,data:{...userInfo.data,gift:[...newGift]}})
        }
    }

    function CompletePurchase(e){
        setCartItems([])
        setUserInfo({...userInfo,data:{...userInfo.data,cart:{}}})
        DeleteFromCart()
    }

    return (
        <>
            {
                cartItems == "no account found" ? 
                <>
                <div className="cartPageEmpty contentOne">
                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 231.523 231.523" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M107.415,145.798c0.399,3.858,3.656,6.73,7.451,6.73c0.258,0,0.518-0.013,0.78-0.04c4.12-0.426,7.115-4.111,6.689-8.231 l-3.459-33.468c-0.426-4.12-4.113-7.111-8.231-6.689c-4.12,0.426-7.115,4.111-6.689,8.231L107.415,145.798z"></path> <path d="M154.351,152.488c0.262,0.027,0.522,0.04,0.78,0.04c3.796,0,7.052-2.872,7.451-6.73l3.458-33.468 c0.426-4.121-2.569-7.806-6.689-8.231c-4.123-0.421-7.806,2.57-8.232,6.689l-3.458,33.468 C147.235,148.377,150.23,152.062,154.351,152.488z"></path> <path d="M96.278,185.088c-12.801,0-23.215,10.414-23.215,23.215c0,12.804,10.414,23.221,23.215,23.221 c12.801,0,23.216-10.417,23.216-23.221C119.494,195.502,109.079,185.088,96.278,185.088z M96.278,216.523 c-4.53,0-8.215-3.688-8.215-8.221c0-4.53,3.685-8.215,8.215-8.215c4.53,0,8.216,3.685,8.216,8.215 C104.494,212.835,100.808,216.523,96.278,216.523z"></path> <path d="M173.719,185.088c-12.801,0-23.216,10.414-23.216,23.215c0,12.804,10.414,23.221,23.216,23.221 c12.802,0,23.218-10.417,23.218-23.221C196.937,195.502,186.521,185.088,173.719,185.088z M173.719,216.523 c-4.53,0-8.216-3.688-8.216-8.221c0-4.53,3.686-8.215,8.216-8.215c4.531,0,8.218,3.685,8.218,8.215 C181.937,212.835,178.251,216.523,173.719,216.523z"></path> <path d="M218.58,79.08c-1.42-1.837-3.611-2.913-5.933-2.913H63.152l-6.278-24.141c-0.86-3.305-3.844-5.612-7.259-5.612H18.876 c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h24.94l6.227,23.946c0.031,0.134,0.066,0.267,0.104,0.398l23.157,89.046 c0.86,3.305,3.844,5.612,7.259,5.612h108.874c3.415,0,6.399-2.307,7.259-5.612l23.21-89.25C220.49,83.309,220,80.918,218.58,79.08z M183.638,165.418H86.362l-19.309-74.25h135.895L183.638,165.418z"></path> <path d="M105.556,52.851c1.464,1.463,3.383,2.195,5.302,2.195c1.92,0,3.84-0.733,5.305-2.198c2.928-2.93,2.927-7.679-0.003-10.607 L92.573,18.665c-2.93-2.928-7.678-2.927-10.607,0.002c-2.928,2.93-2.927,7.679,0.002,10.607L105.556,52.851z"></path> <path d="M159.174,55.045c1.92,0,3.841-0.733,5.306-2.199l23.552-23.573c2.928-2.93,2.925-7.679-0.005-10.606 c-2.93-2.928-7.679-2.925-10.606,0.005l-23.552,23.573c-2.928,2.93-2.925,7.679,0.005,10.607 C155.338,54.314,157.256,55.045,159.174,55.045z"></path> <path d="M135.006,48.311c0.001,0,0.001,0,0.002,0c4.141,0,7.499-3.357,7.5-7.498l0.008-33.311c0.001-4.142-3.356-7.501-7.498-7.502 c-0.001,0-0.001,0-0.001,0c-4.142,0-7.5,3.357-7.501,7.498l-0.008,33.311C127.507,44.951,130.864,48.31,135.006,48.311z"></path> </g> </g></svg>
                    <h1>Log in to see items in cart</h1>
                    <Link to={'/login'} className="signupButtonCart">login</Link>
                </div>
                </> :
                <>
                <div className="contentOne contentOneCart">
                    <div className="cartPageFilledLeft">
                        <div className="cartPageFilledLeftCart">
                            <div className="cartTitle">
                                <h1>Shopping Cart</h1>
                                <h4>Price</h4>
                            </div>
                            {cartItems != undefined?
                                cartItems.length>0?
                                <>
                            <div className="cartContent">
                                
                                {cartItems.map(item=>(
                                    <div className="cartItemContainerContainer">
                                        <div className="cartItemContainer">
                                            <Link className="cartImgContainer" to={`../products/${item._id}`}>
                                                <img src={item.image} alt="" width={160} height={160}/>
                                            </Link>
                                            <div className="cartInfo">
                                                <h3 className="cartItemTitle">{item.title}</h3>
                                                <div className="starsss">
                                                {item.rating.rate>=1? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=0.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=2? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=1.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=3? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=2.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=4? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=3.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=5? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=4.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                                </div>
                                                    {item.stock>3?
                                                    <>
                                                        <h5 className="inStockText">In Stock</h5>
                                                    </>
                                                    :item.stock>0?
                                                    <>
                                                        <h5 className="limitedStockText">{item.stock} left! buy soon!</h5>
                                                    </>:
                                                    <>
                                                        <h5 className="outOfStockText">Out of Stock</h5>
                                                    </>
                                                    }
                                                    <div className="checkBoxDiv">
                                                        <input type="checkBox" className={`checkBoxGift checkBoxGift${item._id}`} id="checkBox" onClick={(e)=>CheckCheckedGift(e,item._id)}/>
                                                        <label className="checkBoxText" htmlFor="checkBox">This is a gift</label>
                                                    </div>
                                                    <div className="itemManagement">
                                                        <div className="addSubtractAmount">
                                                            {userInfo.data.cart[item._id]>1?
                                                            <h3 className="addSubtractButton" onClick={()=>DecreaseItemValue(item._id)}>-</h3>
                                                            :
                                                            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485 485" xml:space="preserve" className="thrashcan" onClick={()=>RemoveItemValue(item._id)}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <rect x="67.224" width="350.535" height="71.81"></rect> <path d="M417.776,92.829H67.237V485h350.537V92.829H417.776z M165.402,431.447h-28.362V146.383h28.362V431.447z M256.689,431.447 h-28.363V146.383h28.363V431.447z M347.97,431.447h-28.361V146.383h28.361V431.447z"></path> </g> </g> </g></svg>
                                                            }
                                                            <h3>{userInfo.data.cart[item._id]}</h3>
                                                            {userInfo.data.cart[item._id]==item.stock ?
                                                            <h3 className="greyedOutAddSubtractButton">+</h3>:
                                                            <h3 className="addSubtractButton" onClick={()=>IncreaseItemValue(item._id)}>+</h3>
                                                            }
                                                        </div> 
                                                        <div className="borderLeftApplyaForItemManagement">
                                                            <a onClick={()=>RemoveItemValue(item._id)}>Delete</a>
                                                        </div>
                                                        <div className="borderLeftApplyaForItemManagement">
                                                            <a onClick={()=>SaveForLater(item._id)}>Save for later</a>
                                                        </div>
                                                        <div className="borderLeftApplyaForItemManagement">
                                                            <a onClick={()=>RedirectToCategory(item.category)}>See more like this</a>
                                                        </div>
                                                    </div>
                                                    
                                                </div>  
                                        </div>
                                        <div className="cartItemPrice">
                                                    {item.discount!=undefined?
                                                    <>
                                                    <div className="cartItemPriceDiscounted">
                                                        <h2 className="discountedItemPrice">${Math.floor((item.price*item.discount/100)*100)/100}</h2>
                                                        <div className="discountFrom">
                                                            <h4 className="discountedItemPercent">Save {item.discount}%</h4>
                                                            <h4 className="cartItemPriceDiscountedCrossedOut">${item.price}</h4>
                                                        </div>
                                                    </div>
                                                    </>
                                                    :
                                                    <>
                                                        <h2>${item.price}</h2>
                                                    </>
                                                    }
                                                </div>
                                    </div>
                                ))}
                            </div>
                            <div className="subTotalDiv">
                                <h3>Subtotal({itemAmount} item{itemAmount != 1 &&"s"}) : ${subtotalPrice}</h3>
                            </div>
                            </>:
                            <>
                                <div className="emptyCart">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 90 112.5" enable-background="new 0 0 90 90" xml:space="preserve" className="emptyCartSVG"><path d="M50.325,35.745c4.385,0,8.703,1.914,12.391,5.44c0.975,0.851,1.041,2.348,0.15,3.281c-0.895,0.939-2.391,0.939-3.281,0.005  c-3.01-2.884-6.172-4.189-9.26-4.189c-3.084,0-6.24,1.305-9.25,4.189c-0.432,0.428-1.025,0.662-1.635,0.646  c-2.031-0.052-2.98-2.545-1.49-3.933C41.632,37.658,45.944,35.745,50.325,35.745z M59.772,26.792c1.813,0,3.287,1.477,3.287,3.292  c0,1.816-1.475,3.287-3.287,3.287s-3.281-1.471-3.281-3.287C56.491,28.269,57.96,26.792,59.772,26.792z M40.888,26.792  c1.813,0,3.281,1.477,3.281,3.292c0,1.816-1.469,3.287-3.281,3.287c-1.818,0-3.287-1.471-3.287-3.287  C37.601,28.269,39.069,26.792,40.888,26.792z M10.497,5.274c-4.422,0.125-5.125,6.797-0.844,7.961l5.584,1.972l6.568,34.257  c0.785,4.1,2.088,7.809,3.904,11.001c2.672,4.701,7.313,8.17,13.037,8.17h28.428c5.129,0.093,5.129-8.118,0-8.024H38.747  c-4.047-0.516-5.725-2.555-7.209-5.545H69.06c3.443,0,5.365-3.057,6.213-6.593l8.209-27.93c0.438-4.591-1.994-5.498-6.25-5.498  l-53.906,0.041l-1.447-4.429c-0.391-1.319-1.391-2.337-2.646-2.691L10.497,5.274z"/><path d="M64.925,72.724c-3.355,0-6.078,2.729-6.078,6.088c0,3.364,2.723,6.092,6.078,6.092c3.359,0,6.082-2.728,6.082-6.092  C71.007,75.453,68.284,72.724,64.925,72.724z M40.685,72.724c-3.359,0-6.084,2.729-6.084,6.088c0,3.364,2.725,6.092,6.084,6.092  s6.078-2.728,6.078-6.092C46.763,75.453,44.044,72.724,40.685,72.724z"/></svg>
                                    <h2>Your Cart is Empty</h2>
                                    <Link to={"/"} className="browseProducts">Browse for Products</Link>
                                </div>
                            </>
                            :
                            <>
                                <div className="errorCart">
                                    <img src={errorImg} alt="" className="errorCartIMG"/>
                                    <h2>Error occured loading page</h2>
                                    <h3 className="reloadCartPage">please <span onClick={()=>window.location.reload()} className="reloadCartPageReload">reload</span></h3>
                                </div>
                            </>}
                            
                        </div>
                        {savedForLaterItems!= undefined && savedForLaterItems.length>0&&
                        <div className="cartPageFilledLeftSavedForLater">
                        <div className="cartTitle">
                            <h1>Saved for Later</h1>
                            <h4>Price</h4>
                        </div>
                        <div className="cartContent">
                                {savedForLaterItems != undefined?
                                <>
                                {savedForLaterItems.map(item=>(
                                    <div className="cartItemContainerContainer">
                                        <div className="cartItemContainer">
                                            <Link className="cartImgContainer" to={`../products/${item._id}`}>
                                                <img src={item.image} alt="" width={160} height={160}/>
                                            </Link>
                                            <div className="cartInfo">
                                                <h3 className="cartItemTitle">{item.title}</h3>
                                                <div className="starsss">
                                                {item.rating.rate>=1? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=0.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=2? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=1.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=3? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=2.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=4? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=3.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                    {item.rating.rate>=5? 
                                    <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : item.rating.rate >=4.5?
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                                    <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                                                </div>
                                                    {item.stock>3?
                                                    <>
                                                        <h5 className="inStockText">In Stock</h5>
                                                    </>
                                                    :item.stock>0?
                                                    <>
                                                        <h5 className="limitedStockText">{item.stock} left! buy soon!</h5>
                                                    </>:
                                                    <>
                                                        <h5 className="outOfStockText">Out of Stock</h5>
                                                    </>
                                                    }
                                                    <div className="checkBoxDiv">
                                                        <input type="checkBox" className={`checkBoxGift checkBoxGift${item._id}`} id="checkBox" onClick={CheckCheckedGift}/>
                                                        <label className="checkBoxText" htmlFor="checkBox">This is a gift</label>
                                                    </div>
                                                    <div className="itemManagement">
                                                        <div className="addSubtractAmount">
                                                            {userInfo.data.cart[item._id]>1?
                                                            <h3 className="addSubtractButton" onClick={()=>DecreaseItemValue(item._id)}>-</h3>
                                                            :
                                                            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485 485" xml:space="preserve" className="thrashcan" onClick={()=>RemoveItemValue(item._id)}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <rect x="67.224" width="350.535" height="71.81"></rect> <path d="M417.776,92.829H67.237V485h350.537V92.829H417.776z M165.402,431.447h-28.362V146.383h28.362V431.447z M256.689,431.447 h-28.363V146.383h28.363V431.447z M347.97,431.447h-28.361V146.383h28.361V431.447z"></path> </g> </g> </g></svg>
                                                            }
                                                            <h3>{userInfo.data.savedforlater[item._id]}</h3>
                                                            {userInfo.data.savedforlater[item._id]==item.stock ?
                                                            <h3 className="greyedOutAddSubtractButton">+</h3>:
                                                            <h3 className="addSubtractButton" onClick={()=>IncreaseItemValue(item._id)}>+</h3>
                                                            }
                                                            {/* fix the add and sub */}
                                                        </div> 
                                                        <div className="borderLeftApplyaForItemManagement">
                                                            <a onClick={()=>RemoveItemValueFromSaveForLater(item._id)}>Delete</a>
                                                        </div>
                                                        <div className="borderLeftApplyaForItemManagement">
                                                            <a onClick={()=>MoveToCart(item._id)}>Move to Cart</a>
                                                        </div>
                                                        <div className="borderLeftApplyaForItemManagement">
                                                            <a onClick={()=>RedirectToCategory(item.category)}>See more like this</a>
                                                        </div>
                                                    </div>
                                                    
                                                </div>  
                                        </div>
                                        <div className="cartItemPrice">
                                                    {item.discount!=undefined?
                                                    <>
                                                    <div className="cartItemPriceDiscounted">
                                                        <h2 className="discountedItemPrice">${Math.floor((item.price*item.discount/100)*100)/100}</h2>
                                                        <div className="discountFrom">
                                                            <h4 className="discountedItemPercent">Save {item.discount}%</h4>
                                                            <h4 className="cartItemPriceDiscountedCrossedOut">${item.price}</h4>
                                                        </div>
                                                    </div>
                                                    </>
                                                    :
                                                    <>
                                                        <h2>${item.price}</h2>
                                                    </>
                                                    }
                                                </div>
                                    </div>
                                ))}
                                </>
                                :
                                <>
                                <h1>Oops... we encounred a problem, please reload</h1>
                                </>
                                }
                            </div>
                            <div className="subTotalDiv">
                                <h3>Subtotal({saveForLaterItemAmount} items) : ${saveForLaterSubtotalPrice}</h3>
                            </div>
                    </div>
                        }
                    </div>
                    <div className="cartPageFilledRight">
                        <div className="subTotalPurchase">
                            <h4>Subtotal({itemAmount} items) : ${subtotalPrice}</h4>
                        </div>
                        {subtotalPrice > 0?
                        <button className="complpletePurchase" onClick={CompletePurchase}>Proceed to Checkout</button>:
                        <button className="complpletePurchaseGreyedOut">Proceed to Checkout</button>
                        }
                    </div>
                </div>
                </>
            }
        </>
    )}

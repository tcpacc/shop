import { useState } from 'react'
import './App.css'
import { GlobalContext } from '../context'
import { RouterProvider } from 'react-router-dom'
import { router } from '../routes'
import "jquery"
import "slick-carousel"
import { useEffect } from 'react'
import axios from "axios";
import swal from'sweetalert'
import { infouser, lgi } from '../pages/login'
import { accountinf, su } from '../pages/signup'


export let token = "rgnjei"
export let loggedIn;
export let loggedInInfo;

async function IsLoggedIn(){
  if(getCookie("userEmail") != undefined){
    loggedIn=true
    loggedInInfo = await axios.get(`http://localhost:4000/users/email/${getCookie("userEmail")}`)
  }
  else{
    loggedIn=false
  }
}
IsLoggedIn()

let timeoutPopup

  export function ClosePopupError(){
    clearTimeout(timeoutPopup)
    $('.popupError').css("transform","translate3d(0,80px,0)")
    setTimeout(() => {
        $('.popupError').css("display","none")
    }, 500);
  }

function DisplayError(){
    clearTimeout(timeoutPopup)
    $('.popupError').css("display","inline-flex")
    timeoutPopup = setTimeout(() => {
        $('.popupError').css("transform","translate3d(0,0,0)")
    }, 1);
    setTimeout(() => {
        $('.popupError').css("transform","translate3d(0,80px,0)")
    }, 5000);
    setTimeout(() => {
        $('.popupError').css("display","none")
    }, 5500);
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function PostToList(productId,productName){
  if(su==false&&lgi==false&&loggedIn==false){
    DisplayError()
  }
  else{
    let accountInfoUser;
    if(su){
      accountInfoUser = accountinf
    }
    else if(lgi){
      accountInfoUser = infouser
    }
    else if(loggedIn){
      accountInfoUser = loggedInInfo
    }
    const getuser = await axios.get(`http://localhost:4000/users/id/${accountInfoUser.data._id}`)
    if(getuser.data.list.includes(productId)){
      swal("Failed to Add to List",`${productName} already in list`,"warning")
    }
    else{
      swal("Added to List!", `${productName} has been added to your list`, "success");
      let listArr= getuser.data.list
      listArr.push(productId)
      axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
          list:listArr
      })
    }
  }
}

export async function PostToCart(productId,productName){
  if(su==false&&lgi==false&&loggedIn==false){
      DisplayError()
  }
  else{
      swal("Added to Cart!", `${productName} has been added to your cart`, "success");
      let accountInfoUser;
      if(su){
        accountInfoUser = accountinf
      }
      else if(lgi){
        accountInfoUser = infouser
      }
      else if(loggedIn){
        accountInfoUser = loggedInInfo
      }
      const getuser = await axios.get(`http://localhost:4000/users/id/${accountInfoUser.data._id}`)
      if(productId in getuser.data.cart){
          let cartArr = getuser.data.cart
          cartArr[productId]+=1
          axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
              cart:cartArr
          })
      }
      else{
          let cartArr = {}
          cartArr[productId] = 1
          for(const [key,value] of Object.entries(getuser.data.cart)){
              cartArr[key] = value
          }
          axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
              cart:cartArr
          })
      }
  }
}

function App() {
  return (
    <>
    <GlobalContext.Provider value={"da"}>
      <RouterProvider router={router}/>
    </GlobalContext.Provider>

    </>
  )
}

export default App

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
import Swal from 'sweetalert2'

export let loggedIn;
export let loggedInInfo;

export async function IsLoggedIn(){
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
      Swal.fire( {icon: "error",
                  title: "Failed to Add to List",
                  text: `${productName} already in list`});
    }
    else{
      Swal.fire( {icon: "success",
                  title: "Added to List!",
                  text: `${productName} has been added to your list`});
      let listArr= getuser.data.list
      listArr.push(productId)
      axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
          list:listArr
      })
    }
  }
}

export async function PostToCart(productId,productName,productStock,quantity){
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
  quantity = parseInt(quantity) ||1
  if(su==false&&lgi==false&&loggedIn==false){
      DisplayError()
  }
  else if(productStock<=0){
    Swal.fire({
      title:"Out of Stock",
      text:"",
      html:"<h4>Your item is not currently available.</h4><h4>Please check again later</h4>",
      icon:"warning"
    })
  }
  else if(productStock == accountInfoUser.data.cart[productId]){
    Swal.fire({
      title:"Warning!",
      text:"Maximum amount in cart reached.",
      icon:"warning",
      footer:"<a href='/cart'>Go to Cart</a>"
    })
  }
  else{
      Swal.fire( {icon: "success",
            title: "Added to Cart!", 
            test: `${productName} has been added to your cart`,
            footer:"<a href='/cart'>Go to Cart</a>"});
      const getuser = await axios.get(`http://localhost:4000/users/id/${accountInfoUser.data._id}`)
      if(productId in getuser.data.cart){
          let cartArr = getuser.data.cart
          cartArr[productId]+=quantity
          axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
              cart:cartArr
          })
      }
      else{
          let cartArr = {}
          cartArr[productId] = quantity
          for(const [key,value] of Object.entries(getuser.data.cart)){
              cartArr[key] = value
          }
          axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
              cart:cartArr
          })
      }
  }
}

export async function DecreaseItem(itemId){
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
  accountInfoUser.data.cart[itemId]-=1
  await axios.patch(`http://localhost:4000/users/cart/${accountInfoUser.data.email}`,{
    cart:{...accountInfoUser.data.cart}
  })
}

export async function IncreaseItem(itemId){
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
  accountInfoUser.data.cart[itemId]+=1
  await axios.patch(`http://localhost:4000/users/cart/${accountInfoUser.data.email}`,{
    cart:{...accountInfoUser.data.cart}
  })
}

export async function DeleteItem(itemId,deletedFrom){
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
  delete accountInfoUser.data[deletedFrom][itemId]
  axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
    [deletedFrom]:accountInfoUser.data[deletedFrom]
})
}

export async function DeleteFromHistory(index){
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
  const newHistory = getuser.data["history"]
  newHistory.splice(index,1)
  axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
    history:newHistory
  })
}

export function RedirectToCategory(categoryName){
  window.location.href = `${window.location.origin}/search/*?categoryFilter=${categoryName[0].toUpperCase() + categoryName.slice(1).replace(" ","").replace("'","")}`
}

export function AddToSaveForLaterOrCart(itemId,moveTo,moveFrom){
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

  let newSaveForLater = accountInfoUser.data[moveTo]
  newSaveForLater[itemId] = accountInfoUser.data[moveFrom][itemId]
  axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
    [moveTo]:newSaveForLater
  })
}

export async function AddOrRemoveToGift(productId,add) {
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
    if(su==false&&lgi==false&&loggedIn==false){
        return
    }
    const getuser = await axios.get(`http://localhost:4000/users/id/${accountInfoUser.data._id}`)
    const newGift = getuser.data["gift"]
    add?newGift.push(productId):newGift.splice(newGift.indexOf(productId),1)
    axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
      gift:newGift
    })
}

export async function SaveToHistory(searchInput){
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
  if(su==false&&lgi==false&&loggedIn==false){
      return
  }
  const getuser = await axios.get(`http://localhost:4000/users/id/${accountInfoUser.data._id}`)
  const newHistory = getuser.data["history"]
  newHistory.unshift(searchInput)
  axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
    history:newHistory
  })
}

export async function DeleteFromCart(){
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
  if(su==false&&lgi==false&&loggedIn==false){
      return
  }
  Swal.fire( {icon: "success",
    title: "Purchase Complete!"});
  axios.patch(`http://localhost:4000/users/addto/${accountInfoUser.data._id}`,{
    cart:{}
  })
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

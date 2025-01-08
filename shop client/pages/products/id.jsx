import axios from "axios"
import React, { useEffect, useState } from "react"
import { ClosePopupError, PostToCart, PostToList } from "../../src/App"

const Product = function (items){
    const product = items.items.filter(item => item._id==window.location.href.split('/')[4])
    const rating = product[0].rating.rate

    useEffect(()=>{
        imageZoom("myimage", "myresult");
    },[])

    function SelectDeliveryMethod(classname){
        var divs = document.querySelectorAll('.deliverybutton');
        for (var i = 0; i < divs.length; i++) {
            divs[i].classList.remove('selectedProductDeliveryMethod');
        }
        // document.getElementsByClassName('deliverybutton').classList.add()
        document.querySelector(`.${classname}`).classList.add("selectedProductDeliveryMethod")
    }

    function imageZoom(imgID, resultID) {
        var img, lens, result, cx, cy;
        img = document.getElementById(imgID);
        result = document.getElementById(resultID);
        /* Create lens: */
        lens = document.createElement("DIV");
        lens.setAttribute("class", "img-zoom-lens");
        /* Insert lens: */
        img.parentElement.insertBefore(lens, img);
        /* Calculate the ratio between result DIV and lens: */
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;
        /* Set background properties for the result DIV */
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        /* Execute a function when someone moves the cursor over the image, or the lens: */
        lens.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);
        /* And also for touch screens: */
        lens.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);
        function moveLens(e) {
          var pos, x, y;
          /* Prevent any other actions that may occur when moving over the image */
          e.preventDefault();
          /* Get the cursor's x and y positions: */
          pos = getCursorPos(e);
          /* Calculate the position of the lens: */
          x = pos.x - (lens.offsetWidth / 2);
          y = pos.y - (lens.offsetHeight / 2);
          /* Prevent the lens from being positioned outside the image: */
          if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
          if (x < 0) {x = 0;}
          if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
          if (y < 0) {y = 0;}
          /* Set the position of the lens: */
          lens.style.left = x + "px";
          lens.style.top = y + "px";
          /* Display what the lens "sees": */
          result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        }
        function getCursorPos(e) {
          var a, x = 0, y = 0;
          e = e || window.event;
          /* Get the x and y positions of the image: */
          a = img.getBoundingClientRect();
          /* Calculate the cursor's x and y coordinates, relative to the image: */
          x = e.pageX - a.left;
          y = e.pageY - a.top;
          /* Consider any page scrolling: */
          x = x - window.pageXOffset;
          y = y - window.pageYOffset;
          return {x : x, y : y};
        }
      }

    return (
            <>
                <div className="productPage">
                    <div className="img-container">
                        <img src={product[0].image} alt="" id="myimage" className="productImage"/>
                        <div id="myresult" className="img-zoom-result"></div>
                    </div>
                    <div className="productInfo">
                        <div className="productTags">
                        {product[0].discount>0 && 
                            <p className="productTag">Sale</p>
                        }
                        {
                            product[0].rating.count>300 && 
                            <p className="productTag">Best Seller</p>
                        }
                        </div>
                        <a href="/" className="productCategory">{product[0].category}</a>
                        <h2 className="productTitle">{product[0].title}</h2>
                        <div className="starRating">
                            <h5>{rating}</h5>
                            <div className="starsss">
                            {rating>=1? 
                            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : rating >=0.5?
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                            {rating>=2? 
                            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : rating >=1.5?
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                            {rating>=3? 
                            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : rating >=2.5?
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                            {rating>=4? 
                            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : rating >=3.5?
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                            {rating>=5? 
                            <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg> : rating >=4.5?
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 276.901 276.901" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M275.922,105.676c-2.353-7.24-8.612-12.517-16.146-13.611l-71.441-10.381l-31.95-64.737 c-3.369-6.826-10.322-11.148-17.935-11.148c-7.613,0-14.565,4.322-17.935,11.148L88.566,81.684L17.125,92.065 c-7.533,1.095-13.793,6.371-16.146,13.611s-0.391,15.188,5.062,20.502l51.695,50.391l-12.203,71.153 c-1.287,7.504,1.798,15.087,7.956,19.562c6.159,4.475,14.326,5.065,21.063,1.521l63.898-33.594l63.899,33.594 c2.927,1.539,6.121,2.298,9.305,2.298c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.204-71.153 l51.696-50.39C276.312,120.864,278.274,112.916,275.922,105.676z M183.715,155.264c-4.714,4.595-6.865,11.215-5.752,17.703 l7.131,41.575l-37.337-19.629c-2.913-1.532-6.11-2.298-9.306-2.298V70.99l18.669,37.826c2.913,5.902,8.545,9.994,15.059,10.94 l41.743,6.065L183.715,155.264z"></path> </g></svg>:
                            <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>}
                            <h5 className="ratingCount">{product[0].rating.count} ratings</h5>
                            </div>
                        </div>
                        <hr className="descDivider"/>
                        <h2 className="aboutitem">About this item</h2>
                        <p>{product[0].description}</p>
                    </div>
                    <div className="purchaseProduct">
                        {product[0].discount>0 ?<>
                            <h4 className="pricediscounted">Save ${Math.round(product[0].price-(Math.floor((product[0].price*product[0].discount/100)*100)/100))}</h4>
                            <div className="priceDiscountProduct">
                                <h3 className="priceshowdiscounted">${Math.floor((product[0].price*product[0].discount/100)*100)/100}</h3>
                                <h4 className="crossedOut">${product[0].price}</h4>
                            </div>
                        </>:
                        <>
                            <h3>${product[0].price}</h3>
                        </>
                        }
                        <button className="addToCartButton" onClick={()=>PostToCart(product[0]._id,product[0].title)}>Add To Cart</button>
                        <hr className="productPriceHR"/>
                        <h4>How do you want your item?</h4>
                        <div className="deliveryOptions">
                            {product[0].deliverymethod['delivery']?
                            <a className="deliverybutton methoddelivery" onClick={()=>{SelectDeliveryMethod('methoddelivery')}}>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdsX-9Atsjk1lYyZpuyg7qMyc9Hok7Rvj31Q&s" alt="" />
                                <h4>delivery</h4>
                            </a>:
                            <a className="deliverybutton">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdsX-9Atsjk1lYyZpuyg7qMyc9Hok7Rvj31Q&s" alt="" className="greyscaled"/>
                                <h4>delivery</h4>
                                <h6>Not available</h6>
                            </a>
                            }
                            {product[0].deliverymethod['pickup']?
                            <a className="deliverybutton methodpickup" onClick={()=>{SelectDeliveryMethod('methodpickup')}}>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUw1aHRhIA8n_sXcNnySZpJ7wfkzpUkbAvqg&s" alt="" />
                                <h4>pickup</h4>
                            </a>:
                            <a className="deliverybutton">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUw1aHRhIA8n_sXcNnySZpJ7wfkzpUkbAvqg&s" alt="" className="greyscaled"/>
                                <h4>pickup</h4>
                                <h6>Not available</h6>
                            </a>
                            }
                            {product[0].deliverymethod['shipping']?
                            <a className="deliverybutton methodshipping" onClick={()=>{SelectDeliveryMethod('methodshipping')}}>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtRxR5FEw0uDR5fGx1sDOTPaUyoRLkBjrO4RteBmGUg4hKdCVZgM3XMGJakcPHmfklcxs&usqp=CAU" alt="" />
                                <h4>shipping</h4>
                            </a>:
                            <a className="deliverybutton">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtRxR5FEw0uDR5fGx1sDOTPaUyoRLkBjrO4RteBmGUg4hKdCVZgM3XMGJakcPHmfklcxs&usqp=CAU" alt="" className="greyscaled"/>
                                <h4>shipping</h4>
                                <h6>Not available</h6>
                            </a>
                            }
                        </div>
                    </div>
                </div>
                <div className="popupError">
                    <p>You must be logged in to do this action</p>
                    <p className="closePopupError" onClick={()=>ClosePopupError()}>x</p>
                </div>
            </>
        )
}

export default Product
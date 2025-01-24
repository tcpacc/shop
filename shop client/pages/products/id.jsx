import axios from "axios"
import React, { useEffect, useState } from "react"
import { ClosePopupError, PostToCart, PostToList } from "../../src/App"
import "slick-carousel"
import"jquery"

const Product = function (items){
    const product = items.items.filter(item => item._id==window.location.href.split('/')[4])
    const rating = product[0].rating.rate
    const [quantity,setQuantity] = useState(1)
    const [zoomMode,setZoomMode] = useState(false)

    useEffect(()=>{
        if(zoomMode){
            if(product[0].images == undefined){
                imageZoom("myimage","myresult")
            }else{
                const getImage = document.querySelector(".slick-current").childNodes[0].getAttribute("id")||document.querySelector(".slick-current").childNodes[1].getAttribute("id")
                const getResult = document.querySelector(".slick-current").childNodes[1].getAttribute("id")||document.querySelector(".slick-current").childNodes[2].getAttribute("id")
                imageZoom(getImage,getResult);}
    }
    },[zoomMode])

    useEffect(()=>{
        const stock =product[0].stock <=1?0: product[0].stock<30 ? product[0].stock : 30
        for (let index = 1; index <= stock; index++) {
            const number = document.createElement("p")
            number.className = "selectQuantityNumber"
            number.onclick= SelectQuantityNumber
            number.innerHTML = index
            document.querySelector(".quantitySelectorDown").appendChild(number)
        }
    },[])

    useEffect(()=>{
        $(function(){
            $(".imagesDiv").not('.slick-initialized').slick({
                arrows:true,
                cssEase:"ease-out",
                slidesToShow: 1,
                slidesToScroll: 1,
            })});
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
        cx = result.offsetWidth / lens.offsetWidth/3;
        cy = result.offsetHeight / lens.offsetHeight/3;
        /* Set background properties for the result DIV */
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        result.style.backgroundRepeat = "no-repeat"
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

    function SelectQuantityNumber(e){
        setQuantity(e.target.innerHTML)
    }

    function ZoomModeEngage(){
        document.querySelector(".imageZoom").classList.toggle("imageZoomOn")
        if(product[0].images == undefined){
            document.querySelector(".productImage").classList.toggle("productImageZoomMode")
            setZoomMode(zoomMode?false:true)
        }else{
        const getImage = document.querySelector(".slick-current").childNodes[0].getAttribute("id")||document.querySelector(".slick-current").childNodes[1].getAttribute("id")
        document.getElementById(getImage).classList.toggle("productImageZoomMode")
        document.getElementById("imagesDivID").classList.toggle("imagesDiv")
        document.getElementById("imagesDivID").classList.toggle("arrowOff")
        if(zoomMode){
            setZoomMode(false)
            document.querySelector(".img-zoom-lens").remove()
            $(".imagesDiv").slick("slickSetOption", "accessibility", true);
            $(".imagesDiv").slick("slickSetOption", "draggable", true);
            $(".imagesDiv").slick("slickSetOption", "swipe", true);
            $(".imagesDiv").slick("slickSetOption", "touchMove", true);
        }else{
            setZoomMode(true)
            $(".arrowOff").slick("slickSetOption", "accessibility", false);
            $(".arrowOff").slick("slickSetOption", "draggable", false);
            $(".arrowOff").slick("slickSetOption", "swipe", false);
            $(".arrowOff").slick("slickSetOption", "touchMove", false);
        }}
    }

    function ExpandModeFull(){
        ExpandModeEngage()
        ExpendModeEngageSelect()
    }

    function ExpendModeEngageSelect(){
        if(product[0].images != undefined){
            document.querySelectorAll(".expandedImageImage").forEach(element => {
                element.classList.add("expandedImageImageInactive")
            });
            const activeElement = document.querySelector(".slick-current").childNodes[0].getAttribute("id").split(" ")[1]
            document.querySelector(`.${activeElement}`).classList.add("expandedImageImageActive")
            document.querySelector(`.${activeElement}`).classList.remove("expandedImageImageInactive")
        }
    }

    function FindActiveExpandedImage(){
        let activeImage = -1
        document.querySelectorAll(".expandedImageImage").forEach((element,key) => {
            if(element.classList.value.includes("expandedImageImageActive")){
                console.log(key)
                activeImage = key
            }
        });
        return activeImage
    }

    function ExpandModeEngage(){

        document.querySelector(".colorFilter").classList.toggle("colorFilterOn")
        document.querySelector(".colorFilter").classList.toggle("colorFilterOff")
        document.querySelector(".expandedImage").classList.toggle("expandedImageOff")
        document.querySelector(".expandedImage").classList.toggle("expandedImageOn")
        document.body.classList.toggle("scrollable")
    }

    function ButtonLeftClick(){
        const activeImage = FindActiveExpandedImage()-1
        const prevImage = activeImage < 0 ? document.querySelector(".expandedImageBox").childNodes[document.querySelector(".expandedImageBox").childNodes.length-1] : document.querySelector(".expandedImageBox").childNodes[activeImage]
        document.querySelectorAll(".expandedImageImage").forEach(element => {
            element.classList.add("expandedImageImageInactive")
            element.classList.remove("expandedImageImageActive")
        });
        prevImage.classList.add("expandedImageImageActive")
        prevImage.classList.remove("expandedImageImageInactive")
        console.log(activeImage,prevImage)
    }

    function ButtonRightClick(){
        const activeImage = FindActiveExpandedImage() + 1
        console.log(activeImage,document.querySelector(".expandedImageBox").childNodes.length-1)
        const prevImage = activeImage > document.querySelector(".expandedImageBox").childNodes.length-1 ? document.querySelector(".expandedImageBox").childNodes[0] : document.querySelector(".expandedImageBox").childNodes[activeImage]
        document.querySelectorAll(".expandedImageImage").forEach(element => {
            element.classList.add("expandedImageImageInactive")
            element.classList.remove("expandedImageImageActive")
        });
        prevImage.classList.add("expandedImageImageActive")
        prevImage.classList.remove("expandedImageImageInactive")
    }

    function ExpandExpandedImage(){
        document.querySelectorAll(".expandedImageImage").forEach(element => {
            element.classList.toggle("expandedImageImageExpanded")
            if(element.childNodes[0].width==600){
                element.childNodes[0].width=1200;
                element.childNodes[0].height=1200;
            }else{
                element.childNodes[0].width=600;
                element.childNodes[0].height=600;
                element.style.paddingTop = 0
                element.style.paddingBottom = 0
            }
        });
        
        
    }

    function MouseMove(e){
        if(e.target.parentElement.classList.value.includes("expandedImageImageExpanded")){
        if(e.pageY < screen.height/2){
            e.target.parentElement.style.paddingTop = e.pageY+"px"
            e.target.parentElement.style.paddingBottom = "550px"
        }else{
            e.target.parentElement.style.paddingTop = e.pageY+"px"
            e.target.parentElement.style.paddingBottom = "335px"
        }
    }
    }

    return (
            <>
                <div className="expandedImage expandedImageOff">
                    <h1 className="closeExpandedImage" onClick={ExpandModeEngage}>&times;</h1>
                    <h1 className="expandExpandedImage" onClick={ExpandExpandedImage}><svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 242.133 242.133" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_25_"> <path id="XMLID_26_" d="M89.247,131.673l-47.732,47.73l-15.909-15.91c-4.29-4.291-10.742-5.572-16.347-3.252 C3.654,162.563,0,168.033,0,174.1v53.032c0,8.284,6.716,15,15,15l53.033,0.001c0.007-0.001,0.012-0.001,0.019,0 c8.285,0,15-6.716,15-15c0-4.377-1.875-8.316-4.865-11.059l-15.458-15.458l47.73-47.729c5.858-5.858,5.858-15.355,0-21.213 C104.603,125.815,95.104,125.816,89.247,131.673z"></path> <path id="XMLID_28_" d="M227.133,0H174.1c-6.067,0-11.536,3.655-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347l15.911,15.911 l-47.729,47.73c-5.858,5.858-5.858,15.355,0,21.213c2.929,2.929,6.768,4.393,10.606,4.393c3.839,0,7.678-1.464,10.606-4.394 l47.73-47.73l15.909,15.91c2.869,2.87,6.706,4.394,10.609,4.394c1.933,0,3.882-0.373,5.737-1.142 c5.605-2.322,9.26-7.792,9.26-13.858V15C242.133,6.716,235.417,0,227.133,0z"></path> </g> </g></svg></h1>
                    <div className="expandedImageDiv">
                        <button className="buttonArrow arrowLeft" onClick={ButtonLeftClick}><svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="buttonArrowSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg></button>
                        <div className="expandedImageBox"  onMouseMove={MouseMove}>
                            <div className="expandedImageImage myimagemain">
                                <img src={product[0].image} alt="" classame="" width={600} height={600}/>
                            </div>
                            {product[0].images !=undefined &&   
                                product[0].images.map((image,index) => (
                                    <>
                                        <div className={`expandedImageImage myimage${index}`}>
                                            <img src={image} alt="" classame="" width={600} height={600}/>
                                        </div>
                                    </>
                                ))
                            }
                        </div>
                        <button className="buttonArrow arrowRight" onClick={ButtonRightClick}><svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="buttonArrowSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg></button>
                    </div>
                </div>
                <div className="productPage">
                    <div className="img-container">
                        <button className="imageZoom" onClick={ZoomModeEngage}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="imageZoomSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Magnifying_Glass_Plus"> <path id="Vector" d="M7 10H10M10 10H13M10 10V7M10 10V13M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke={"#000000"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                        </button>
                        <button className="imageExpand" onClick={ExpandModeFull}>
                            <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 242.133 242.133" xml:space="preserve" className="imageExpandSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_15_" d="M227.133,83.033c8.283,0,15-6.716,15-15V15c0-8.284-6.717-15-15-15H174.1c-8.284,0-15,6.716-15,15 s6.716,15,15,15h16.82l-69.854,69.854L51.213,30h16.82c8.284,0,15-6.716,15-15s-6.716-15-15-15H15C6.717,0,0,6.716,0,15v53.033 c0,8.284,6.717,15,15,15c8.285,0,15-6.716,15-15v-16.82l69.854,69.854L30,190.92V174.1c0-8.284-6.715-15-15-15 c-8.283,0-15,6.716-15,15v53.033c0,8.284,6.717,15,15,15h53.033c8.284,0,15-6.716,15-15c0-8.284-6.716-15-15-15h-16.82 l69.854-69.854l69.854,69.854H174.1c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h53.033c8.283,0,15-6.716,15-15V174.1 c0-8.284-6.717-15-15-15c-8.285,0-15,6.716-15,15v16.82l-69.854-69.854l69.854-69.854v16.82 C212.133,76.317,218.848,83.033,227.133,83.033z"></path> </g></svg>
                        </button>
                        {product[0].images == undefined ?
                        <>
                            <img src={product[0].image} alt="" id="myimage" className="productImage"/>
                            <div id="myresult" className="img-zoom-result"></div>
                        </> : 
                        <>
                            <div className="imagesDiv" id="imagesDivID">
                                <div className="imageBox">
                                    <img src={product[0].image} alt="" id="myimage myimagemain" className="productImage"/>
                                    <div id="myresult myresultmain" className="img-zoom-result img-zoom-resultMain"></div>
                                </div>
                                {product[0].images.map((key,index)=>(
                                    <>
                                    <div className="imageBox">
                                    <img src={product[0].images[index]} alt="" id={`myimage myimage${index}`} className="productImage" key={key}/>
                                    <div id={`myresult myresult${index}`} className="img-zoom-result"></div>
                                    </div>
                                    </>
                                ))}
                            </div>
                        </>}
                       
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
                        {product[0].stock <= 0 ? 
                        <>
                            <h2 className="outOfStockText">Out of Stock</h2>
                        </> : product[0].stock == 1? 
                        <>
                            <h3 className="outOfStockText">Only One Left In Stock! Get It Now!</h3>
                        </> : product[0].stock<30 ?
                        <>
                            <h2 className="inStockText">In Stock</h2>
                            <div className="itemQuantitySelector" tabIndex={0}>
                                <button className="itemQuantitySelectorButton">Quantity : {quantity}<svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSelectQuantity"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg></button>
                                <div className="quantitySelectorDown">

                                </div>
                            </div>
                        </> :
                        <>
                            <h2 className="inStockText">In Stock</h2>
                            <div className="itemQuantitySelector" tabIndex={0}>
                                <button className="itemQuantitySelectorButton">Quantity : {quantity}<svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSelectQuantity"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg></button>
                                <div className="quantitySelectorDown">
                                    
                                </div>
                            </div>
                        </>}
                        {product[0].stock<=0?
                        <button className="addToCartButtonOutOfStock">Add To Cart</button>
                        :
                        <button className="addToCartButton" onClick={()=>PostToCart(product[0]._id,product[0].title,quantity)}>Add To Cart</button>}
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
                        <div className="addTo">
                            <hr className="productPriceHR"/>
                            <div className="addToBottom">
                                <div className="forPageAdd addTocartButtonForPage" onClick={()=>PostToCart(product[0]._id,product[0].title)}>
                                    <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 902.86 902.86" xml:space="preserve" className="cartSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path> <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path> </g> </g> </g></svg>
                                    <h5>Add One to Cart</h5>
                                </div>
                                <div className="forPageAdd addTolistButtonForPage" onClick={()=>{PostToList(product[0]._id,product[0].title)}}>
                                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 471.701 471.701" xml:space="preserve" className="cartSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3 C444.801,187.101,434.001,213.101,414.401,232.701z"></path> </g> </g></svg>
                                    <h5>Add to List</h5>
                                </div>
                            </div>
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
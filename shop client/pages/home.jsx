import { useEffect, useState } from "react";
import "slick-carousel"
import"jquery"
import { Link } from "react-router-dom";
// import { infouser, lgi } from "./login";
// import { accountinf, su } from "./signup";
// import axios from "axios";
// import swal from'sweetalert'
import { ClosePopupError, PostToCart, PostToList, RedirectToCategory } from "../src/App";

export default function Home({items}){
    let categoryCount = {}
    const [includedCategories,setIncludedCategories] =useState([])
    let categorykeys=[]
    const [categoryKeysReal,setCategoryKeysReal]= useState({})
    const [fashionItems,setFashionItems]= useState(ShuffleArray(items.filter((item)=>["men's clothing","women's clothing","jewelery"].includes(item.category))).slice(0,10))
    const itemsSortBestSeller = items.slice().sort((a,b)=>a.rating.count-b.rating.count).reverse()

    console.log(fashionItems)

    function ShuffleArray(array){
        let currentIndex = array.length;

        while (currentIndex != 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
            return array
        }
    }

    useEffect(()=>{
        items.forEach(item => {
            if(categorykeys.includes(item.category)){
                categoryCount[item.category]+=1
            }
            else{
                categoryCount[item.category]=1
                setIncludedCategories(prev=>[...prev,item])
                categorykeys.push(item.category)
            }
        });
        setCategoryKeysReal(categoryCount)


        $(function(){
            $('.grid-best-selling').not('.slick-initialized').slick({
                arrows:true,
                cssEase:"ease-out",
                slidesToShow: 5,
                slidesToScroll: 5,
            })});

        $(function(){
            $('.posters').not('.slick-initialized').slick({
                arrows:true,
                dots:true,
                cssEase:"ease-out",
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay:true,
                autoplaySpeed:2000,
            })});
    },[])

    

    return (
        <>
        <div className="contentOne">
            <div className="posters">
                <div>
                    <img src="https://t4.ftcdn.net/jpg/04/86/53/23/360_F_486532393_IZOMHnhTFf7d88iDT8YCNAhSq6FRjd5u.jpg" alt="" />
                </div>
                <div>
                    <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/christmas-special-sale-ads-design-template-00c9c49a819b84b14b33ec26a8c5a2f8_screen.jpg?ts=1671076980" alt="" />
                </div>
                <div>
                    <img src="https://static.vecteezy.com/system/resources/previews/002/147/267/non_2x/clearance-sale-banner-design-marketing-poster-template-shopping-day-discount-holiday-deal-vector.jpg" alt="" />
                </div>
                <div>
                    <img src="https://www.shutterstock.com/image-vector/hot-sale-price-offer-deal-600nw-1956790807.jpg" alt="" />
                </div>
            </div>
            <div className="heroOne">
                <div className="bestsellingproducts sorting">
                    <h1 className="title">-Best Selling-</h1>
                    <div className="grid-best-selling">
                        {itemsSortBestSeller.slice(0,10).map((item,key)=>(
                                    <div className="card-best-selling">
                                        <div className="buttonsTop">
                                            <button className="add-cart" onClick={()=>PostToCart(item._id,item.title,item.stock)}>Add</button>
                                            <button className="addToList" onClick={()=>PostToList(item._id,item.title)}><svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 471.701 471.701" xml:space="preserve" className="addToListSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3 C444.801,187.101,434.001,213.101,414.401,232.701z"></path> </g> </g></svg></button>
                                        </div>
                            <Link to={`products/${item._id}`} key={key} className="productlink">
                                        <img src={item.image} alt="" className="card-img"/>
                                        <h1 className="card-title">{item.title}</h1>
                                        {item.discount==0||item.discount==undefined ? 
                                        <h2 className="priceshow">${item.price}</h2>:
                                        <>
                                        <div className="discountprice">
                                            <h2 className="priceshow priceshowdiscounted">${Math.floor((item.price*item.discount/100)*100)/100}</h2>
                                            <div className="priceold">
                                                <h2 className="crossedOut">${item.price}</h2>
                                                <p className="discount">-{item.discount}%</p>
                                            </div>
                                        </div>   
                                        </>
                                }
                                <div className="card-bottom">
                                    <div className="rating">
                                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="blank-star"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                                        {item.rating.rate}
                                    </div>
                                    <p className="bought">{item.rating.count}</p>
                                </div>
                            </Link>

                            </div>
                        ))}
                    </div>
                </div>
                <hr />
                <div className="gridBanners sorting">
                    <div className="gridBanner gridBanner1"></div>
                    <div className="gridBanner gridBanner2"></div>
                    <div className="gridBanner gridBanner3"></div>
                    <div className="gridBanner gridBanner4"></div>
                    <div className="gridBanner gridBanner5"></div>
                </div>
                <hr />
                <div className="productcategories sorting">
                    <h1 className="title">-By Categories-</h1>
                    <div className="productcategoriesgrid">
                        {includedCategories.map((item,key)=>(
                            <button className="categorycard" key={key}  onClick={()=>{RedirectToCategory(item.category)}}>
                                <img src={item.image} alt="" className="categoryproductimage"/>
                                <div className="categoryIdentity">
                                    <h3>{item.category}</h3>
                                    <h5>{Math.ceil(categoryKeysReal[item.category]/2)} products</h5>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <hr />
                <div className="bestsellingproducts sorting">
                    <h1 className="title">-Fashion & Beauty-</h1>
                    <div className="grid-best-selling">
                        {fashionItems.map((item,key)=>(
                                    <div className="card-best-selling">
                                        <div className="buttonsTop">
                                            <button className="add-cart" onClick={()=>PostToCart(item._id,item.title,item.stock)}>Add</button>
                                            <button className="addToList" onClick={()=>PostToList(item._id,item.title)}><svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 471.701 471.701" xml:space="preserve" className="addToListSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3 C444.801,187.101,434.001,213.101,414.401,232.701z"></path> </g> </g></svg></button>
                                        </div>
                            <Link to={`products/${item._id}`} key={key} className="productlink">
                                        <img src={item.image} alt="" className="card-img"/>
                                        <h1 className="card-title">{item.title}</h1>
                                        {item.discount==0||item.discount==undefined ? 
                                        <h2 className="priceshow">${item.price}</h2>:
                                        <>
                                        <div className="discountprice">
                                            <h2 className="priceshow priceshowdiscounted">${Math.floor((item.price*item.discount/100)*100)/100}</h2>
                                            <div className="priceold">
                                                <h2 className="crossedOut">${item.price}</h2>
                                                <p className="discount">-{item.discount}%</p>
                                            </div>
                                        </div>   
                                        </>
                                }
                                <div className="card-bottom">
                                    <div className="rating">
                                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="blank-star"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                                        {item.rating.rate}
                                    </div>
                                    <p className="bought">{item.rating.count}</p>
                                </div>
                            </Link>

                            </div>
                        ))}
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
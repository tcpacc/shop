import { Link, useSearchParams } from "react-router-dom"
import { ClosePopupError, PostToCart, PostToList } from "../../src/App"
import { useEffect, useState } from "react"
import nothingFoundimg from '../../public/empty_state-removebg-preview.png'
import MultiRangeSlider from "../../src/components/multiRangeSlider/multiRangeSlider"

export default function SearchPage({items}){
    const url = new URL(window.location.href)
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = window.location.href.split('/')[4].replaceAll('%20',' ').split('?')[0]
    const [filteredItems,setFilteredItems] = useState(items.filter(item => item.title.toUpperCase().includes(searchTerm.toUpperCase())))

    if(searchParams.get('min_price')!=null){
        console.log('hi')
    }

    let pricesArray =[]

    for (let index = 0; index < filteredItems.length; index++) {
        if(filteredItems[index].discount != undefined){
            pricesArray.push(parseInt(Math.floor((filteredItems[index].price*filteredItems[index].discount/100)*100)/100))
        }
        else{
            pricesArray.push(parseInt(filteredItems[index].price))
        }
    }

    const maxPrice = Math.max(...pricesArray)

    function ShowMore(event){
        const thisClass =document.querySelector(`.${event.currentTarget.className.split(' ')[1]}`)
        if(thisClass.querySelector('.arrowSearchSVGDown')==null){
            thisClass.querySelector('.arrowSearchSVG').classList.add('arrowSearchSVGDown')
            thisClass.nextElementSibling.style.display = 'block'
        }
        else{
            thisClass.querySelector('.arrowSearchSVG').classList.remove('arrowSearchSVGDown')
            thisClass.nextElementSibling.style.display = 'none'
        }
    }

    return(
        <>
            <div className="searchContainer">
                <div className="searchFilters">
                    <div className="searchCategory searchCategoryPrice" onClick={ShowMore}>
                        <h2 className="searchFilter">Price</h2>
                        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSearchSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg>
                    </div>
                    <div className="searchCategoryContent">
                        <MultiRangeSlider
                        min={0}
                        max={maxPrice}
                        onChange={()=>{}}
                        />
                    </div>
                    <hr className="searchFilterSeparator"/>
                    <div className="searchCategory searchCategorySpecialOffer" onClick={ShowMore} >
                        <h2 className="searchFilter">Special Offer</h2>
                        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSearchSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg>
                    </div>
                </div>
                {filteredItems.length<=0
                ?(
                    <>
                        <div className="emptySearchResults">
                            <img src={nothingFoundimg} alt="" className="emptySearchResultsimg"/>
                            <h1 className="emptySearchResultsh1">There were no results for {searchTerm}</h1>
                            <h3>please check your spelling</h3>
                        </div>
                    </>)
                :
                <div className="searchResults">
                    {
                        (filteredItems.map((filtered,key)=> (
                            <div className="card-best-selling">
                                <div className="buttonsTop">
                                    <button className="add-cart" onClick={()=>PostToCart(filtered._id,filtered.title)}>Add</button>
                                    <button className="addToList" onClick={()=>PostToList(filtered._id,filtered.title)}><svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 471.701 471.701" xml:space="preserve" className="addToListSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3 C444.801,187.101,434.001,213.101,414.401,232.701z"></path> </g> </g></svg></button>
                                </div>
                    <Link to={`../products/${filtered._id}`} key={key} className="productlink">
                                <img src={filtered.image} alt="" className="card-img"/>
                                <h1 className="card-title">{filtered.title}</h1>
                                {filtered.discount==0||filtered.discount==undefined ? 
                                <h2 className="priceshow">${filtered.price}</h2>:
                                <>
                                <div className="discountprice">
                                    <h2 className="priceshow priceshowdiscounted">${Math.floor((filtered.price*filtered.discount/100)*100)/100}</h2>
                                    <div className="priceold">
                                        <h2 className="crossedOut">${filtered.price}</h2>
                                        <p className="discount">-{filtered.discount}%</p>
                                    </div>
                                </div>   
                                </>
                        }
                        <div className="card-bottom">
                            <div className="rating">
                                <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="blank-star"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                                {filtered.rating.rate}
                            </div>
                            <p className="bought">{filtered.rating.count}</p>
                        </div>
                    </Link>

                    </div>
                )))}
                </div>}
            </div>
            <div className="popupError">
                <p>You must be logged in to do this action</p>
                <p className="closePopupError" onClick={()=>ClosePopupError()}>x</p>
            </div>
        </>
    )
}
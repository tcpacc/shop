import { Link, useSearchParams } from "react-router-dom"
import { ClosePopupError, PostToCart, PostToList } from "../../src/App"
import { useEffect, useState } from "react"
import nothingFoundimg from '../../public/empty_state-removebg-preview.png'
import MultiRangeSlider from "../../src/components/multiRangeSlider/multiRangeSlider"

export default function SearchPage({items}){
    const url = new URL(window.location.href)
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = window.location.href.split('/')[4].replaceAll('%20',' ').split('?')[0]
    const [filteredItems,setFilteredItems] = useState(searchTerm == "*" ? items : items.filter(item => item.title.toUpperCase().includes(searchTerm.toUpperCase())))
    const [filteredItemsCopy,setFilteredItemsCopy] = useState(searchTerm == "*" ? items : items.filter(item => item.title.toUpperCase().includes(searchTerm.toUpperCase())))
    const [filterCheckOrder,setFilterCheckOrder] = useState('')
    const [onSaleFilteredItems, setOnsaleFilteredItems] = useState(filteredItems.filter(item => item.discount!=undefined))
    const [customerRatingFilterValue,setCustomerRatingFilterValue] = useState(searchParams.get("customerRatingFilter")||0)
    const [sortBy,setSortBy] = useState(searchParams.get("sortBy")||"featured")
    const [sortByName,setSortByName] = useState()

    let pricesArray =[]
    let categoryCountDict = {}

    for (let index = 0; index < filteredItemsCopy.length; index++) {
        if(filteredItemsCopy[index].discount != undefined){
            pricesArray.push(parseInt(Math.floor((filteredItemsCopy[index].price*filteredItemsCopy[index].discount/100)*100)/100))
        }
        else{
            pricesArray.push(parseInt(filteredItemsCopy[index].price))
        }
    }

    filteredItemsCopy.forEach(item => {
        if(categoryCountDict[item.category] >= 1){
            categoryCountDict[item.category] +=1
        }else{
            categoryCountDict[item.category] =1
        }
    });

    const maxPrice = Math.max(...pricesArray)

    useEffect(()=>{
        setFilterCheckOrder('checkPrice')
    },[])

    useEffect(()=>{
        if(filterCheckOrder=="checkPrice"){
            if(searchParams.get('min_price')!=null|| searchParams.get('max_price')!=null){
                const min_price =searchParams.get('min_price')!= null ? searchParams.get('min_price'):0
                const max_price =searchParams.get('max_price')!=null ? searchParams.get('max_price'):maxPrice

                let maxedPrice=false
                if(max_price==maxPrice){
                    maxedPrice=true
                }

                CreateFilterCat('Price',min_price,max_price,maxedPrice)

                setFilteredItems(filteredItems.filter(item =>{
                    if(maxedPrice){
                        if(item.discount!=undefined){
                            if((Math.floor((item.price*item.discount/100)*100)/100) > min_price){
                                return true
                            }
                        }else{
                            if(item.price > min_price){
                                return true
                            }
                        } 
                    }else{
                    if(item.discount!=undefined){
                        if((Math.floor((item.price*item.discount/100)*100)/100) > min_price && (Math.floor((item.price*item.discount/100)*100)/100) < max_price){
                            return true
                        }
                    }else{
                        if(item.price > min_price&&item.price < max_price){
                            return true
                        }
                    }}
                }))
            }
            setFilterCheckOrder('checkSpecialOffer')
        }
    },[filterCheckOrder])

    useEffect(()=>{
        if(filterCheckOrder == "checkSpecialOffer"){
            const specialOfferFilters = searchParams.getAll("specialOfferFilter")
            let specialOfferItems = []
            specialOfferFilters.forEach(filter => {
                if(filter == "OnSale"){
                    CreateFilterCat("OnSale")

                    specialOfferItems = specialOfferItems.concat(filteredItems.filter(item => item.discount!=undefined))
                }
                setFilteredItems(specialOfferItems)
            });
            setFilterCheckOrder("checkCategory")
        }
    },[filterCheckOrder])

    useEffect(()=>{
        if(filterCheckOrder == "checkCategory"){
            const categoryFilters = searchParams.getAll("categoryFilter")
            let categoryItems = []
            categoryFilters.forEach(filter => {
                if(filter == "Jewelery"){
                    CreateFilterCat("Jewelery")

                    categoryItems = categoryItems.concat(filteredItems.filter(item => item.category == "jewelery"))
                }
                if(filter == "Mensclothing"){
                    CreateFilterCat("Mensclothing")

                    categoryItems = categoryItems.concat(filteredItems.filter(item => item.category == "men's clothing"))
                }
                if(filter == "Electronics"){
                    CreateFilterCat("Electronics")

                    categoryItems = categoryItems.concat(filteredItems.filter(item => item.category == "electronics"))
                }
                if(filter == "Womensclothing"){
                    CreateFilterCat("Womensclothing")

                    categoryItems = categoryItems.concat(filteredItems.filter(item => item.category == "women's clothing"))
                }
                setFilteredItems(categoryItems)
            })
            setFilterCheckOrder("checkCustomerRating")
        }
    },[filterCheckOrder])

    useEffect(()=>{
        if(filterCheckOrder == "checkCustomerRating"){
            if(customerRatingFilterValue > 0){
                StarHoverOut()
                CreateFilterCat("CustomerRating")
            }
        setFilterCheckOrder('checkSortBy')
        }
    },[filterCheckOrder])

    useEffect(()=>{
        if(filterCheckOrder == "checkSortBy"){
            document.getElementById(`${sortBy}`).classList.add("selectedSortBy")
            setSortByName(document.getElementById(`${sortBy}`).innerHTML)
            if(sortBy == "priceLowToHigh"){
                filteredItems.sort((a,b)=>PriceSort(a,b))
            }
            else if(sortBy == "priceHighToLow"){
                filteredItems.sort((a,b)=>PriceSort(a,b)).reverse()
            }
            else if(sortBy == "ratingLowToHigh"){
                filteredItems.sort((a,b)=>a.rating.rate-b.rating.rate)
            }
            else if(sortBy == "ratingHighToLow"){
                filteredItems.sort((a,b)=>a.rating.rate-b.rating.rate).reverse()
            }
            else if(sortBy== "bestSellers"){
                filteredItems.sort((a,b)=>a.rating.count-b.rating.count).reverse()
            }
        }
    },[filterCheckOrder])

    function PriceSort(a,b){
        const one = a.discount != undefined ? Math.floor((a.price*a.discount/100)*100)/100 : a.price
        const two = b.discount != undefined ? Math.floor((b.price*b.discount/100)*100)/100 : b.price

        if(one< two){
            return -1
        }
        else if(one>two){
            return 1
        }
        return 0
    }

    function CreateFilterCat(filterName,min_price,max_price,maxedPrice){
        max_price=max_price||maxPrice
        min_price=min_price||0
        maxedPrice = maxedPrice||null
        document.querySelector(".searchCaterogrySetFiltersDiv").style.display='block'

        const newFilterDiv = document.createElement('div')
        newFilterDiv.className = `filterCatDiv removeFilterCat${filterName}Div`
        document.querySelector(".searchCatergoryFiltersBottom").appendChild(newFilterDiv)

        const newFilter = document.createElement('p')
        newFilter.className = "filterCat"

        if(filterName=='Price'){
            newFilter.innerHTML = maxedPrice?`$${min_price} - $${max_price}+`:`$${min_price} - $${max_price}`
        }
        else if(filterName=='CustomerRating'){
            const starFilterSelected = document.querySelector(".starFilterFull").cloneNode(true)
            starFilterSelected.classList.add("starSelectedFilter")
            starFilterSelected.classList.remove("starFilter")
            newFilter.innerHTML = customerRatingFilterValue
            newFilter.appendChild(starFilterSelected)
            newFilter.innerHTML += " & up"
        }
        else{
            newFilter.innerHTML = filterName
            document.querySelector('.filterCheckBox'+filterName).checked = true
        }

        document.querySelector(`.removeFilterCat${filterName}Div`).appendChild(newFilter)

        const removeFilterButton = document.createElement("p")
        removeFilterButton.className = `removeFilterCat removeFilterCat${filterName}`
        removeFilterButton.innerHTML = `&times;`
        document.querySelector(`.removeFilterCat${filterName}Div`).appendChild(removeFilterButton)
        removeFilterButton.onclick = RemoveFilterCat
    }

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

    function RemoveFilterCat(e){
        document.querySelector(`.${e.target.classList[1]}Div`).remove()
        if(e.target.classList[1] == "removeFilterCatPrice"){
            url.searchParams.delete("min_price")
            url.searchParams.delete("max_price")
            window.location.href = url.href
        }
        else{
            url.searchParams.delete("customerRatingFilter")
            url.searchParams.delete("specialOfferFilter",e.target.classList[1].slice(15))
            url.searchParams.delete("categoryFilter",e.target.classList[1].slice(15))
            window.location.href = url.href
        }
    }

    function ClearAllFitlers(){
        window.location.href = window.location.href.substring(0,window.location.href.lastIndexOf('?'))
    }

    function CheckBocCheckChecked(e){
        if(e.target.checked){
            if(e.target.parentElement.classList[1]=="searchCategoryContentLeftSpecialOffer"){
                url.searchParams.append("specialOfferFilter",e.target.classList[1].slice(14))
                window.location.href = url
            }
            else if(e.target.parentElement.classList[1]=="searchCategoryContentLeftCategory"){
                url.searchParams.append("categoryFilter",e.target.classList[1].slice(14))
                window.location.href = url
            }
        }else{
            url.searchParams.delete("categoryFilter",e.target.classList[1].slice(14))
            url.searchParams.delete("specialOfferFilter",e.target.classList[1].slice(14))
            window.location.href = url
        }}

    function StarHover(e){
        const element = e.target.parentElement.classList[1].slice(35)
        for (let index = 1; index <= 5; index++) {
            if(index<=element){
                document.querySelector(`.searchCategoryContentTypeStarRating${index}`).classList.replace("searchCategoryContentTypeStarRatingBlankStar","searchCategoryContentTypeStarRatingFullStar")
            }else{
                document.querySelector(`.searchCategoryContentTypeStarRating${index}`).classList.replace("searchCategoryContentTypeStarRatingFullStar","searchCategoryContentTypeStarRatingBlankStar")
            }
            
            
        }
    }

    function StarHoverOut(){
        for (let index = 1; index <= 5; index++) {
            if(index <= customerRatingFilterValue){
                document.querySelector(`.searchCategoryContentTypeStarRating${index}`).classList.remove("searchCategoryContentTypeStarRatingBlankStar")
            document.querySelector(`.searchCategoryContentTypeStarRating${index}`).classList.add("searchCategoryContentTypeStarRatingFullStar")
            }else{
            document.querySelector(`.searchCategoryContentTypeStarRating${index}`).classList.remove("searchCategoryContentTypeStarRatingFullStar")
            document.querySelector(`.searchCategoryContentTypeStarRating${index}`).classList.add("searchCategoryContentTypeStarRatingBlankStar")}
            
        }
    }

    function StarClick(e){
        const value = e.target.parentElement.parentElement.parentElement.classList[1].slice(35)
        url.searchParams.set("customerRatingFilter",value)
        window.location.href = url
    }

    function SortByClicked(e){
        url.searchParams.set("sortBy",e.target.id)
        window.location.href = url
    }

    return(
        <>
        
        <div className="searchCategoryTop">
            <h4>{filteredItems.length} results found for <span>"{searchTerm}"</span></h4>
            <div className="sortByDiv">
                <button className="sortByButton">Sort by : {sortByName}</button>
                <div className="sortByDropDown">
                    <h4 className="sortByDropDownButton" onClick={SortByClicked} id="featured">Featured</h4>
                    <h4 className="sortByDropDownButton" onClick={SortByClicked} id="priceHighToLow">Price : High to Low</h4>
                    <h4 className="sortByDropDownButton" onClick={SortByClicked} id="priceLowToHigh">Price : Low to High</h4>
                    <h4 className="sortByDropDownButton" onClick={SortByClicked} id="ratingHighToLow">Rating : High to Low</h4>
                    <h4 className="sortByDropDownButton" onClick={SortByClicked} id="ratingLowToHigh">Rating : Low to High</h4>
                    <h4 className="sortByDropDownButton" onClick={SortByClicked} id="bestSellers">Best Sellers</h4>
                </div>
            </div>
        </div>
        <div className="superCategory">
        <div className="searchFilters">
                    {/* selected fitlers */}
                    <div className="searchCaterogrySetFiltersDiv">
                        <div className="searchCategory searchCategorySetFiltersTop">
                            <h2 className="searchFilter">Selected Filters</h2>
                            <a href="#" className="clearAllSearchCategory" onClick={ClearAllFitlers}>clear all</a>
                        </div>
                        <div className="searchCatergoryFiltersBottom">

                        </div>
                        <hr className="searchFilterSeparator"/>
                    </div>
                    {/* category price fitler */}
                    <div className="searchCategory searchCategoryPrice" onClick={ShowMore}>
                        <h2 className="searchFilter">Price</h2>
                        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSearchSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg>
                    </div>
                    {/* content of price fitler */}
                    <div className="searchCategoryContent">
                        <MultiRangeSlider
                        min={0}
                        max={maxPrice}
                        onChange={()=>{}}
                        />
                    </div>
                    <hr className="searchFilterSeparator"/>
                    {/* category special offers filter*/}
                    <div className="searchCategory searchCategorySpecialOffer" onClick={ShowMore} >
                        <h2 className="searchFilter">Special Offer</h2>
                        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSearchSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg>
                    </div>
                    {/* content of special offers filter*/}
                    <div className="searchCategoryContent">
                        <div className="searchCategoryContentTypeCheckbox">
                            <div className="searchCategoryContentLeft searchCategoryContentLeftSpecialOffer">
                                <input type="checkbox" id="onSale" className="filterCheckBox filterCheckBoxOnSale" onChange={CheckBocCheckChecked}/>
                                <label htmlFor="onSale" className="filterCheckBoxLabel">On Sale</label>
                            </div>
                            <p className="searchCategoryContentAmount">{onSaleFilteredItems.length}</p>
                        </div>
                    </div>
                    <hr className="searchFilterSeparator"/>
                    {/* category filter */}
                    <div className="searchCategory searchCategoryCategory" onClick={ShowMore} >
                        <h2 className="searchFilter">Category</h2>
                        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSearchSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg>
                    </div>
                    <div className="searchCategoryContent">
                        {Object.keys(categoryCountDict).map((key,index) => (
                            <>
                            <div className="searchCategoryContentTypeCheckbox">
                                <div className="searchCategoryContentLeft searchCategoryContentLeftCategory">
                                    <input type="checkbox" id={key} className={"filterCheckBox filterCheckBox"+key.charAt(0).toUpperCase() + key.replace(" ","").replace("'","").slice(1)} onChange={CheckBocCheckChecked}/>
                                    <label htmlFor={key} className="filterCheckBoxLabel">{key}</label>
                                </div>
                                <p className="searchCategoryContentAmount">{categoryCountDict[key]}</p>
                            </div>
                            </>
                        ))
                    }
                    </div>
                <hr className="searchFilterSeparator"/>
                {/* customer rating filter */}
                <div className="searchCategory searchCategoryCustomerRating" onClick={ShowMore} >
                    <h2 className="searchFilter">Customer Rating</h2>
                    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" className="arrowSearchSVG"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg>
                </div>
                <div className="searchCategoryContent">
                <div className="searchCategoryCustomerRating" onClick={StarClick}>
                    <div className="searchCategoryContentTypeStarRating searchCategoryContentTypeStarRating1 searchCategoryContentTypeStarRatingBlankStar" onMouseEnter={StarHover} onMouseLeave={StarHoverOut}>
                        <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starFilter starFilterBlank" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>
                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starFilter starFilterFull"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                    </div>
                    <div className="searchCategoryContentTypeStarRating searchCategoryContentTypeStarRating2 searchCategoryContentTypeStarRatingBlankStar" onMouseEnter={StarHover} onMouseLeave={StarHoverOut}>
                        <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starFilter starFilterBlank"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>
                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starFilter starFilterFull"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                    </div>
                    <div className="searchCategoryContentTypeStarRating searchCategoryContentTypeStarRating3 searchCategoryContentTypeStarRatingBlankStar" onMouseEnter={StarHover} onMouseLeave={StarHoverOut}>
                        <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starFilter starFilterBlank"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>
                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starFilter starFilterFull"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                    </div>
                    <div className="searchCategoryContentTypeStarRating searchCategoryContentTypeStarRating4 searchCategoryContentTypeStarRatingBlankStar" onMouseEnter={StarHover} onMouseLeave={StarHoverOut}>
                        <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starFilter starFilterBlank"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>
                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starFilter starFilterFull"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                    </div>
                    <div className="searchCategoryContentTypeStarRating searchCategoryContentTypeStarRating5 searchCategoryContentTypeStarRatingBlankStar" onMouseEnter={StarHover} onMouseLeave={StarHoverOut}>
                        <svg fill="#ffc800" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 278.457 278.457" xml:space="preserve" stroke="#ffc800" className="starFilter starFilterBlank"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M277.478,106.28c-2.353-7.24-8.611-12.517-16.146-13.611l-71.979-10.46l-32.19-65.224 c-3.369-6.826-10.321-11.148-17.935-11.148s-14.565,4.322-17.935,11.148l-32.19,65.224l-71.979,10.46 C9.591,93.763,3.332,99.039,0.979,106.28s-0.391,15.188,5.062,20.502l52.084,50.77L45.83,249.24 c-1.287,7.503,1.797,15.087,7.956,19.562c6.16,4.474,14.324,5.065,21.063,1.522l64.38-33.847l64.38,33.847 c2.926,1.538,6.121,2.297,9.305,2.297c4.146,0,8.273-1.288,11.758-3.819c6.159-4.475,9.243-12.059,7.956-19.562l-12.295-71.688 l52.084-50.77C277.868,121.468,279.83,113.52,277.478,106.28z M184.883,156.247c-4.714,4.594-6.865,11.214-5.752,17.702l7.222,42.11 l-37.817-19.882c-2.913-1.531-6.109-2.297-9.307-2.297s-6.394,0.766-9.307,2.297L92.104,216.06l7.222-42.11 c1.113-6.488-1.038-13.108-5.752-17.702l-30.595-29.822l42.281-6.145c6.515-0.946,12.146-5.038,15.059-10.94l18.909-38.313 l18.909,38.313c2.913,5.902,8.544,9.994,15.059,10.94l42.281,6.145L184.883,156.247z"></path> </g></svg>
                        <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve" fill="#ffc800" stroke="#ffc800" className="starFilter starFilterFull"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#ffc819"}} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> </g></svg>
                    </div>
                </div>
                </div>
                </div>
            <div className="searchContainer">
                
                {/* search content of page */}
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
                                    <button className="add-cart" onClick={()=>PostToCart(filtered._id,filtered.title,filtered.stock)}>Add</button>
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
        </div>
            <div className="popupError">
                <p>You must be logged in to do this action</p>
                <p className="closePopupError" onClick={()=>ClosePopupError()}>x</p>
            </div>
        </>
    )
}
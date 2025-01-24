import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";
import { useSearchParams } from "react-router-dom";

const MultiRangeSlider = ({ min, max, onChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const url = new URL(window.location.href)
  const [minVal, setMinVal] = useState(searchParams.get("min_price")==null?min:parseInt(searchParams.get("min_price")));
  const [maxVal, setMaxVal] = useState(searchParams.get("max_price")==null?max:parseInt(searchParams.get("max_price")));
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef(null);

  useEffect(()=>{
    document.querySelector('.priceMinInput').value =minVal
    document.querySelector('.priceMinInput').style.width = document.querySelector('.priceMinInput').value.length*10 + "px"

    document.querySelector('.priceMaxInput').value =maxVal
    document.querySelector('.priceMaxInput').style.width = document.querySelector('.priceMaxInput').value.length*10 + "px"
  },[])

  function ChangeWidth(e){
    if(e.target.value[0]==0){
      let splitCount = 0
      for (let index = 0; index < e.target.value.length; index++) {
        if(e.target.value[index]==0){
          splitCount++
        }else{
          e.target.value = e.target.value.slice(splitCount)
          break
        }
      }
    }
    if(e.target.classList[0] == "priceMinInput"){
        document.querySelector(`.${e.target.classList[0]}`).style.width = e.target.value.length*10 + "px"}
  }

  function CheckIfHandlePriceRangeChange(e){
    if(e.key=="Enter"){
      HandlePriceRangeChange(e)
    }
  }

  function HandlePriceRangeChange(e){
    if(e.target.classList[0] =="priceMaxInput"){
      if(e.target.value <= minVal || e.target.value <0||e.target.value >max){
        e.target.value=maxVal
        document.querySelector(".priceOutOfRangeError").style.display ="block"
      }
      else{
        url.searchParams.set('max_price',document.querySelector('.priceMaxInput').value)
        window.location.href = url
      }
    }else{
      if(e.target.value >=maxVal || e.target.value <0){
        e.target.value=minVal
        document.querySelector(".priceOutOfRangeError").style.display ="block"
      }
      else{
        url.searchParams.set('min_price',document.querySelector('.priceMinInput').value)
        window.location.href = url
      }
    }
  }

  function SetPriceFilter(e){
    const check = e.target.classList[1]
    if(check == "thumb--right"){
      url.searchParams.set("max_price",maxVal)
      window.location.href = url
    }
    else{
      url.searchParams.set("min_price",minVal)
      window.location.href = url
    }
  }

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    document.querySelector('.priceMinInput').value= minVal 
    document.querySelector('.priceMinInput').style.width = document.querySelector('.priceMinInput').value.length*10 + "px"

    document.querySelector('.priceMaxInput').value= maxVal 
    document.querySelector('.priceMaxInput').style.width = document.querySelector('.priceMaxInput').value.length*10 + "px"
  }, [minVal, maxVal, onChange]);

  return (
    <>
    {maxVal ==max ?
    <h4 className="priceRangeShow">$<input type="number" className="priceMinInput priceInputChange" onChange={ChangeWidth} onBlur={HandlePriceRangeChange} onKeyDown={CheckIfHandlePriceRangeChange}></input> - $<input type="number" className="priceMaxInput priceInputChange" onChange={ChangeWidth} onBlur={HandlePriceRangeChange} onKeyDown={CheckIfHandlePriceRangeChange}></input>+</h4>
    :
    <h4 className="priceRangeShow">$<input type="number" className="priceMinInput priceInputChange" onChange={ChangeWidth} onBlur={HandlePriceRangeChange} onKeyDown={CheckIfHandlePriceRangeChange}></input> - $<input type="number" className="priceMaxInput priceInputChange" onChange={ChangeWidth} onBlur={HandlePriceRangeChange} onKeyDown={CheckIfHandlePriceRangeChange}></input></h4>
    }
    <h5 className="priceOutOfRangeError">*Input out of range</h5>
    <div className="containerRangeSlider">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
        onMouseUp={SetPriceFilter}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
        onMouseUp={SetPriceFilter}
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">${min}</div>
        <div className="slider__right-value">${max}+</div>
      </div>
    </div>
  </>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;

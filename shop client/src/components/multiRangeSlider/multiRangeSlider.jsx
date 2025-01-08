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
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <>
    {maxVal ==max ?
    <h4 className="priceRangeShow">${minVal} - ${maxVal}+</h4>
    :
    <h4 className="priceRangeShow">${minVal} - ${maxVal}</h4>
    }
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

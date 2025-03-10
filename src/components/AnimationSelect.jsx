import React from 'react';

const AnimationSelect = ({ value, onChange }) => {
  return (
    <select 
      className="form-select form-select-sm animation-dropdown" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <optgroup label="Attention Seekers">
        <option value="animate__fade">fade</option>
        <option value="animate__bounce">bounce</option>
        <option value="animate__flash">flash</option>
        <option value="animate__pulse">pulse</option>
        <option value="animate__rubberBand">rubberBand</option>
        <option value="animate__shakeX">shake</option>
        <option value="animate__swing">swing</option>
        <option value="animate__tada">tada</option>
        <option value="animate__wobble">wobble</option>
        <option value="animate__jello">jello</option>
        <option value="animate__heartBeat">heartBeat</option>
      </optgroup>

      <optgroup label="Bouncing Entrances">
        <option value="animate__bounceIn">bounceIn</option>
        <option value="animate__bounceInDown">bounceInDown</option>
        <option value="animate__bounceInLeft">bounceInLeft</option>
        <option value="animate__bounceInRight">bounceInRight</option>
        <option value="animate__bounceInUp">bounceInUp</option>
      </optgroup>

      <optgroup label="Fading Entrances">
        <option value="animate__fadeIn">fadeIn</option>
        <option value="animate__fadeInDown">fadeInDown</option>
        <option value="animate__fadeInDownBig">fadeInDownBig</option>
        <option value="animate__fadeInLeft">fadeInLeft</option>
        <option value="animate__fadeInLeftBig">fadeInLeftBig</option>
        <option value="animate__fadeInRight">fadeInRight</option>
        <option value="animate__fadeInRightBig">fadeInRightBig</option>
        <option value="animate__fadeInUp">fadeInUp</option>
        <option value="animate__fadeInUpBig">fadeInUpBig</option>
      </optgroup>

      <optgroup label="Flippers">
        <option value="animate__flip">flip</option>
        <option value="animate__flipInX">flipInX</option>
        <option value="animate__flipInY">flipInY</option>
      </optgroup>

      <optgroup label="Lightspeed">
        <option value="animate__lightSpeedInRight">lightSpeedIn</option>
      </optgroup>

      <optgroup label="Rotating Entrances">
        <option value="animate__rotateIn">rotateIn</option>
        <option value="animate__rotateInDownLeft">rotateInDownLeft</option>
        <option value="animate__rotateInDownRight">rotateInDownRight</option>
        <option value="animate__rotateInUpLeft">rotateInUpLeft</option>
        <option value="animate__rotateInUpRight">rotateInUpRight</option>
      </optgroup>

      <optgroup label="Sliding Entrances">
        <option value="animate__slideInUp">slideInUp</option>
        <option value="animate__slideInDown">slideInDown</option>
        <option value="animate__slideInLeft">slideInLeft</option>
        <option value="animate__slideInRight">slideInRight</option>
      </optgroup>

      <optgroup label="Zoom Entrances">
        <option value="animate__zoomIn">zoomIn</option>
        <option value="animate__zoomInDown">zoomInDown</option>
        <option value="animate__zoomInLeft">zoomInLeft</option>
        <option value="animate__zoomInRight">zoomInRight</option>
        <option value="animate__zoomInUp">zoomInUp</option>
      </optgroup>

      <optgroup label="Specials">
        <option value="animate__jackInTheBox">jackInTheBox</option>
        <option value="animate__rollIn">rollIn</option>
      </optgroup>
    </select>
  );
};

export default AnimationSelect; 
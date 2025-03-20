import React from 'react'

function Ageform() {
  return (
    <div>
      <h2 className="">What is your age</h2>
      <select name="age" id="" className="">
        <option value="">Age</option>
        <option value="0-20">0-20</option>
        <option value="20-40">20-40</option>
        <option value="40-60">40-60</option>
        <option value="60 and above">60 and above</option>
      </select>
    </div>
  );
}

export default Ageform
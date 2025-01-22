import React from "react";

const Card = ({ name, imagen }) => {
  return (
    <div className={`w-16 h-16 bg-blue-600 mb-4 rounded-lg flex justify-center items-center`}>
      { imagen && <img src={imagen} alt={name}  /> }
    </div>
  );
};

export default Card;
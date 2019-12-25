import React from "react";

export const Image = ({img}) => {
  return (
    <div className="img-wrapper">
      <div>
        <header>
        <div></div>
        <div></div>
        <div></div>
        </header>
        <img src={`../img/${img}`} />
      </div>
    </div>
  )
}
import React from "react";

export default function WeebMode(props) {
  
  function switchScene() {
    return props.callbackParent.changeScene();
  }
  
  return (
    <div>
      In progress...
      <button onClick={switchScene}>Back</button>
    </div>
  )
}
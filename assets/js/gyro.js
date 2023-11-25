
console.log("starting")
console.log(window.DeviceOrientationEvent)
is_running = false

function updateFieldIfNotNull(fieldName, value, precision=10){
  console.log(fieldName, value)
}
function handleOrientation(event) {
    document.getElementsByTagName("body")[0].style.backgroundPositionX = Math.round(event.gamma) + "px"
    document.getElementsByTagName("body")[0].style.backgroundPositionY = Math.round(d_beta) + "px"
  }

document.addEventListener("click", function(e) {
    e.preventDefault();
    console.log(is_running)
    
    // Request permission for iOS 13+ devices
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    
    if (is_running){
      window.removeEventListener("deviceorientation", handleOrientation);
      is_running = false;
    }else{
      window.addEventListener("deviceorientation", handleOrientation);
      is_running = true;
    }
    console.log(is_running)
  })

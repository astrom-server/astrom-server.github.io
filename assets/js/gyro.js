
console.log("starting")
console.log(window.DeviceOrientationEvent)
is_running = false

function updateFieldIfNotNull(fieldName, value, precision=10){
  console.log(fieldName, value)
}
function handleOrientation(event) {
    //document.getElementsByTagName("body")[0].style.backgroundPositionX = Math.round(100*event.gamma/90) + "vw"
    //document.getElementsByTagName("body")[0].style.backgroundPositionY = Math.round(100*event.beta/90) + "vh"
}
let x = 0;
let y = 0;
let v = 0.020;
function handleMotionEvent(event) {
    x += event.rotationRate.alpha*v;
    y += event.rotationRate.gamma*v;

    document.getElementsByTagName("body")[0].style.backgroundPositionX = Math.round(x) + "vw"
    document.getElementsByTagName("body")[0].style.backgroundPositionY = Math.round(y) + "vh"
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
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener("devicemotion", handleMotionEvent, true);
      is_running = false;
    }else{
      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("devicemotion", handleMotionEvent, true);
      is_running = true;
    }
    console.log(is_running)
  })

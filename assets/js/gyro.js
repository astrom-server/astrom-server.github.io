

function updateFieldIfNotNull(fieldName, value, precision=10){
  console.log(fieldName, value)
}
function handleOrientation(event) {
    document.getElementsByTagName("body")[0].style.backgroundPositionX = Math.round(100*event.gamma/90) + "vw"
    document.getElementsByTagName("body")[0].style.backgroundPositionY = Math.round(100*event.beta/90) + "vh"
}


// Request permission for iOS 13+ devices
if (
  DeviceMotionEvent &&
  typeof DeviceMotionEvent.requestPermission === "function"
) {
  DeviceMotionEvent.requestPermission();
}

console.log("Enabling Gyro")
window.addEventListener("deviceorientation", handleOrientation);

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
let r = 0
let image_count = 20;
let lastTime = undefined;
function handleMotionEvent(event) {
    if (lastTime != undefined) {
      let deltatime = (Date.now() - lastTime)/1000


      x += event.rotationRate.beta*100*image_count/360*deltatime;
      y += event.rotationRate.alpha*100*image_count/360*deltatime;
      r += event.rotationRate.gamma*deltatime;

  
      document.getElementsByTagName("body")[0].style.setProperty("--background-x",  Math.round(x) + "vw")
      document.getElementsByTagName("body")[0].style.setProperty("--background-y",  Math.round(y) + "vh")
      document.getElementsByTagName("body")[0].style.setProperty("--background-rotation",  "rotate(" + Math.round(y) + "deg)")
    }
    
    lastTime = Date.now()
}

function enable_gyro(message) {
    console.log(message)
    console.log(is_running)
    
    // Request permission for iOS 13+ devices
    DeviceMotionEvent.requestPermission();
    
    if (!is_running) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("devicemotion", handleMotionEvent, true);
      is_running = false;
    }
    console.log(is_running)
}

document.addEventListener("click", () => enable_gyro("click"))
enable_gyro("gyro start")
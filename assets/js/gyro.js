
console.log("starting")
console.log(window.DeviceOrientationEvent)
is_running = false


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

      r += event.rotationRate.gamma*deltatime;

      const dx = event.rotationRate.beta*100*image_count/360*deltatime
      const dy = event.rotationRate.alpha*100*image_count/360*deltatime

      const cos = Math.cos(Math.PI*r/180)
      const sin = Math.sin(Math.PI*r/180)

      x += cos*dx + sin*dy;
      y += cos*dy - sin*dx;

      document.getElementsByTagName("body")[0].style.setProperty("--background-x",  Math.round(x) + "vw")
      document.getElementsByTagName("body")[0].style.setProperty("--background-y",  Math.round(y) + "vh")
      document.getElementsByTagName("body")[0].style.setProperty("--background-rotation",  "rotate(" + Math.round(r) + "deg)")
    }
    
    lastTime = Date.now()
}

function enable_gyro(message) {
    console.log(message)
    console.log(is_running)
    
    // Request permission for iOS 13+ devices
    if (DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
      DeviceMotionEvent.requestPermission();
    }
    
    if (!is_running) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("devicemotion", handleMotionEvent, true);
      is_running = false;
    }
    console.log(is_running)
}

function keypress(event) {
  let rotation_rate = {
    'alpha': 0,
    'beta': 0,
    'gamma': 0,
  }
  switch (event.key) {
    case "a":
      rotation_rate['beta'] = 10
      break;
    case "d":
      rotation_rate['beta'] = -10
      break;
    case "w":
      rotation_rate['alpha'] = 10
      break;
    case "s":
      rotation_rate['alpha'] = -10
      break;
    case "q":
      rotation_rate['gamma'] = -45
      break;
    case "e":
      rotation_rate['gamma'] = 45
      break;
  }
  handleMotionEvent({'rotationRate': rotation_rate})
}
window.addEventListener('keydown', keypress, true)

document.addEventListener("click", () => enable_gyro("click"))
enable_gyro("gyro start")
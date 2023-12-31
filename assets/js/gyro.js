
console.log("starting")
console.log(window.DeviceOrientationEvent)
is_running = false


if (typeof motion_callbacks == "undefined") {
  motion_callbacks = []
}
if (typeof orientation_callbacks == "undefined") {
  orientation_callbacks = []
}

function handleOrientation(event) {
  const coords = {
    alpha: event.alpha,
    beta:  event.beta, 
    gamma: event.gamma
  }

  console.log("handleOrientation", coords)
  console.log(orientation_callbacks)
  for (const callback of orientation_callbacks) {
    callback(coords)
  }
}
let x = 0;
let y = 0;
let alpha = 0;
let beta = 0;
let gamma = 0;
let image_count = 20;
let lastTime = undefined;
function handleMotionEvent(event) {
    if (lastTime != undefined) {
      let deltaTime = (Date.now() - lastTime)/1000

      const d_alpha = event.rotationRate.alpha*deltaTime
      const d_beta = event.rotationRate.beta*deltaTime
      const d_gamma = event.rotationRate.gamma*deltaTime

      const a_x = event.acceleration.x
      const a_y = event.acceleration.y
      const a_z = event.acceleration.z

      alpha += d_alpha
      beta += d_beta
      gamma += d_gamma

      const dx = event.rotationRate.beta*100*image_count/360*deltaTime
      const dy = event.rotationRate.alpha*100*image_count/360*deltaTime

      const cos = Math.cos(Math.PI*gamma/180)
      const sin = Math.sin(Math.PI*gamma/180)

      x += cos*dx + sin*dy;
      y += cos*dy - sin*dx;

      const coords = {
        x, y, 
        alpha, beta, gamma, 
        d_alpha, d_beta, d_gamma,
        a_x, a_y, a_z,
        deltaTime
      }

      console.log("handleMotionEvent", coords)
      console.log(motion_callbacks)
      for (const callback of motion_callbacks) {
        callback(coords)
      }
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
  console.log(event.key)
  let rotation_rate = {
    'alpha': 0,
    'beta': 0,
    'gamma': 0,
  }
  let acceleration = {
    'x': 0,
    'y': 0,
    'z': 0,
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
    case "ArrowRight":
      acceleration['x'] = 10
      break;
    case "ArrowLeft":
      acceleration['x'] = -10
      break;
    case "ArrowUp":
      acceleration['y'] = 10
      break;
    case "ArrowDown":
      acceleration['y'] = -10
      break;
    case "å":
      acceleration['z'] = -45
      break;
    case "ä":
      acceleration['z'] = 45
      break;
  }
  handleMotionEvent({'rotationRate': rotation_rate, 'acceleration': acceleration})
}
window.addEventListener('keydown', keypress, true)

document.addEventListener("click", () => enable_gyro("click"))
enable_gyro("gyro start")
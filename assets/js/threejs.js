
if (typeof motion_callbacks == "undefined") {
    motion_callbacks = []
}

let vel = new THREE.Vector3()
motion_callbacks.push(
    (coords) => {
        console.log(coords)
        const rot = camera.quaternion.clone();
        const x_ax = new THREE.Vector3(1, 0, 0).applyQuaternion(rot)
        const y_ax = new THREE.Vector3(0, 1, 0).applyQuaternion(rot)
        const z_ax = new THREE.Vector3(0, 0, 1).applyQuaternion(rot)
        console.log("old vel", vel)
        if (coords.a_x != 0) vel.add(x_ax.clone().multiplyScalar(coords.a_x * coords.deltaTime))
        console.log("new vel", vel)
        if (coords.a_y != 0) vel.add(y_ax.clone().multiplyScalar(coords.a_y * coords.deltaTime))
        console.log("new vel", vel)
        if (coords.a_z != 0) vel.add(z_ax.clone().multiplyScalar(coords.a_z * coords.deltaTime))
        console.log("new vel", vel)
        console.log("deltatime", coords.deltaTime)
        console.log("camera position", camera.position)
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(x_ax, coords.d_alpha*Math.PI/180)); 
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(y_ax, coords.d_beta*Math.PI/180)); 
        camera.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(z_ax, coords.d_gamma*Math.PI/180)); 
        camera.updateMatrix()
    }
)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.style.margin = 0

for (let i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    const pos = new THREE.Vector3(Math.random(), Math.random(), Math.random()).subScalar(0.5).normalize().multiplyScalar(5);
    cube.position.copy(pos)
    scene.add( cube );
}




const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



function raycast() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set(new THREE.Color(Math.random(), Math.random(), Math.random()))

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'click', ( event ) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycast()
});



let animation_lastTime = Date.now()
function animate() {
    deltaTime = (Date.now() - animation_lastTime) / 1000
    animation_lastTime = Date.now()
    //camera.position.add(vel.clone().multiplyScalar(deltaTime))

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()

	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
animate();

if (typeof motion_callbacks == "undefined") {
    motion_callbacks = []
}
motion_callbacks.push(
    (coords) => {
        console.log(coords)
        const rot = camera.quaternion.clone();
        const x_ax = new THREE.Vector3(1, 0, 0).applyQuaternion(rot)
        const y_ax = new THREE.Vector3(0, 1, 0).applyQuaternion(rot)
        const z_ax = new THREE.Vector3(0, 0, 1).applyQuaternion(rot)
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

function animate() {
	requestAnimationFrame( animate );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
	renderer.render( scene, camera );
}
animate();
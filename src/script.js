import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import * as dat from 'dat.gui'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()
const loader = new FBXLoader();
//loading

const textureloader = new THREE.TextureLoader()

const normaltexture = textureloader.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ91r75BDKONf7u1pKZ7wBNhtpkgeiMt9aOvg&usqp=CAU')
const layer = textureloader.load('https://static3.depositphotos.com/1000887/121/i/950/depositphotos_1215336-stock-photo-beige-rough-stone-wall-texture.jpg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const mixers=[];



// phone
// gltfLoader.load('scene.gltf' , (gltf) =>{

//   gltf.scene.scale.set(0.3, 0.3, 0.3);
//   scene.add(gltf.scene);

//   gui.add(gltf.scene.scale, 'x').min(0).max(1)
//   gui.add(gltf.scene.scale, 'y').min(0).max(1)
//   gui.add(gltf.scene.scale, 'z').min(0).max(1)
// })

// ground

const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
mesh.position.x = 0
mesh.position.y = 0
mesh.position.z = 0
mesh.rotation.x = - Math.PI / 2;
// mesh.receiveShadow = true;
scene.add( mesh );

const mesh_position = gui.addFolder('mesh_position')

mesh_position.add(mesh.position, 'x').min(0).max(100);
mesh_position.add(mesh.position, 'y').min(0).max(100);
mesh_position.add(mesh.position, 'z').min(0).max(100);




// Object Animation
loader.load('mremireh_o_desbiens.fbx', (fbx) => {
    fbx.scale.set(0.3 , 0.3 , 0.3);

    fbx.position.x = 0
    fbx.position.y = -20
    fbx.position.z = 2

    // fbx.traverse(c => {
    //   c.castShadow = true;
    // });
    const scale = gui.addFolder('scale')
    scale.add(fbx.scale, 'x').min(0).max(1)
    scale.add(fbx.scale, 'y').min(0).max(1)
    scale.add(fbx.scale, 'z').min(0).max(1)


    const position = gui.addFolder('position')

    position.add(fbx.position, 'x').min(-100).max(100)
    position.add(fbx.position, 'y').min(-100).max(100)
    position.add(fbx.position, 'z').min(-100).max(100)
  

    const anim = new FBXLoader();
    // anim.setPath('./zombie/');
      anim.load('./zombie/dance.fbx', (anim) => {
      const m = new THREE.AnimationMixer(fbx);
      mixers.push(m);
      const idle = m.clipAction(anim.animations[0]);
      idle.play();
    });
    scene.add(fbx);
  });



// Lights

  const ambient_light = new THREE.AmbientLight( 0xffffff , 1 );
  ambient_light.position.x = 2
  ambient_light.position.y = 3
  ambient_light.position.z = 4
  ambient_light.intensity = 10
  scene.add(ambient_light)

/**
 * Sizes
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 0
camera.position.y = 4
camera.position.z = -80

const camera_position = gui.addFolder('camera_position')

scene.add(camera)

camera_position.add(camera.position, 'x').min(0).max(100);
camera_position.add(camera.position, 'y').min(0).max(100);
camera_position.add(camera.position, 'z').min(0).max(100);

// Controls


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Camera Rotation Control
  const controls = new OrbitControls( camera, renderer.domElement );

  controls.rotateSpeed = 1;
  controls.zoomSpeed = 0.9;

  controls.minDistance = 3;
  controls.maxDistance = 200;

  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = Math.PI /2; // radians

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;


/**
 * Animate
 */

// document.addEventListener('mousemove', onDocumentMouseMove)

// let mouseX = 0
// let mouseY = 0

// let targetx = 0
// let targety = 0

// const windowX = window.innerWidth / 2
// const windowY = window.innerHeight / 2

// function onDocumentMouseMove(event) {
//   mouseX = event.clientX - windowX
//   mouseY = event.clientY - windowY
// }
const timeElapsed = 20;

const timeElapsedS = timeElapsed * .001;
const clock = new THREE.Clock()

const tick = () => {

  if (mixers) {
    mixers.map(m => m.update(timeElapsedS));
  }
  // targetx = mouseX * 0.001
  // targety = mouseY * 0.001

  const elapsedTime = clock.getElapsedTime()

  // Update objects
  // sphere.rotation.y = 0.5 * elapsedTime
  // sphere.rotation.y += 0.5 * (targetx - sphere.rotation.y)
  // sphere.rotation.x += 0.5 * (targetx - sphere.rotation.x)
  // sphere.rotation.z += 0.5 * (targetx - sphere.rotation.x)

  // Update Orbital Controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

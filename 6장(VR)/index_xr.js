import * as THREE from "../5장(three.js)/modules/three.module.js";
import { VRButton } from "./VRButton.js";
var gl, cube, sphere, light, camera, scene;
Init();
animate();
function Init() {
  // create context
  gl = new THREE.WebGLRenderer({ antialias: true });
  gl.setPixelRatio(window.devicePixelRatio);
  gl.setSize(window.innerWidth, window.innerHeight);
  gl.outputEncoding = THREE.sRGBEncoding;
  gl.xr.enable = true;
  document.body.appendChild(gl.document);
  document.body.appendChild(VRButton.createButton(gl));
  // create camera
  const angleOfView = 55;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const nearPlane = 0.1;
  const farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    angleOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.set(0, 8, 30);

  // create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0.3, 0.5, 0.8);
  const fog = new THREE.Fog("grey", 1.9);
  scene.fog = fog;
  // GEOMETRY
  // create the cube
  const cubeSize = 4;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  // Create the Sphere
  const sphereRadius = 3;
  const sphereWidthSegments = 32;
  const sphereHeightSegments = 16;
  const sphereGeometry = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthSegments,
    sphereHeightSegments
  );
  // Create the upright plane
  const planeWidth = 256;
  const planeHeight = 128;
  const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  // MATERIALS
  const textureLoader = new THREE.TextureLoader();
  const cubeMaterial = new THREE.MeshPhongMaterial({ color: "pink" });

  const sphereNormalMap = textureLoader.load("textures/sphere_normal.png");
  sphereNormalMap.wrapS = THREE.RepeatWrapping;
  sphereNormalMap.wrapT = THREE.RepeatWrapping;
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "tan",
    normalMap: sphereNormalMap,
  });

  // MESHES
  // LIGHTS
}

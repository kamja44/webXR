import * as THREE from "./node_modules/three/build/three.module/js";
// 전역 장면 값
var btn, gl, glCanvas, camera, scene, renderer, cube;
// 전역 xr 값
var xrSession = null;
function loadScene() {
  // WebGL 콘텍스트와 Three.js 장면의 구성 요소 설정

  // [장면 구성 요소 로드]

  // WebGL 셋업 [WebGL 콘텍스트]
  glCanvas = document.createElement("canvas");
  gl = glCanvas.getContext("webgl", { antialias: true });

  // 원근 카메라 [Three.js 장면 셋업]
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  scene = new THREE.Scene();

  // [지오메트리, 재질, 메시]
  var geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
  var material = new THREE.MeshPhongMaterial({ color: 0x89cff0 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 반구빛 [지면 색상과 조명 강도를 매개 변수로 사용하는 반구 조명 물체]
  var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  // WebGLRenderer [Three.js WebGLRenderer를 설정하는 코드]
  renderer = new THREE.WebGLRenderer({
    canvas: glCanvas,
    context: gl,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enable = true;
  document.body.appendChild(renderer.domElement);
}
function init() {
  // 스크립트 실행 시작
  navigator.xr.isSessionSupported("immersive-ar").then((supproted) => {
    if (supported) {
      // XR 호출을 위한 버튼 요소 생성
      btn = document.createElement("button");

      // 버튼에 클릭 이벤트 리스너 추가
      btn.addEventListener("click", onRequestSession);
      btn.innerHTML = "Enter XR";
      var header = document.querySelector("header");
      header.appendChild(btn);
    } else {
      // 예외 세션 생성
      navigator.xr
        .isSessionSupported("inline")
        .then((supported) => {
          if (supported) {
            console.log(`inline session supported`);
          } else {
            console.log(`inline not supported`);
          }
        })
        .catch((reason) => {
          console.log(`WebXR not supported: ${reason}`);
        });
    }
  });
}
function onRequestSession() {
  // XR 세션 요청 처리
}
function onSessionStarted() {
  // XR 세션이 생성되면 처리
}
function setupWebGLLayer() {
  // WebGL 콘텍스트를 XR 세션에 연결
}
function animate() {
  // 애니메이션 루프 시작
}
function render(time) {
  // GPU에 그리기 명령 실행
}
function endXRSession() {
  // XR 세션 종료
}
function onSessionEnd() {
  // XR 세션의 종료 이벤트 처리
}

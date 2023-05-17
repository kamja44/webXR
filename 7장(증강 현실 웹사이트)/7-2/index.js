import * as THREE from "./node_modules/three/build/three.module/js";
// 전역 장면 값
var btn, gl, glCanvas, camera, scene, renderer;
var controller, reticle;

// 전역 xr 값
var xrSession = null;
var xrViewerPose;
var hitTestSource = null;
var hitTestSourceRequested = false;

loadScene();
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

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  var geometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.2, 32).translate(
    0,
    0.1,
    0
  );
  function onSelect() {
    console.log("on select fired...");
    // 지오메트리를 위한 랜덤 색상 설정
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff * Math.random(),
    });
    // 지오메트리와 재질을 위한 메시 생성
    var mesh = new THREE.Mesh(geometry, material);
    // 레티클 위치에 지오메트리 배치
    mesh.applyMatrix4(reticle.matrix); // THIS IS A KEY FUNCTION
    // 지오메트리 크기 랜덤하게 설정
    mesh.scale.y = Math.random() * 2 + 1;
    scene.add(mesh);
  }

  reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasiMaterial({ color: "#00FF00" })
  );
  // 레티클 객체의 속성 설정
  reticle.matrixAutUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  // XR 쿼리 함수 이동
  navigator.xr
    .isSessionSupported("immersive-ar")
    .then((supported) => {
      if (supported) {
        btn = document.createElement("button");
        btn.addEventListener("click", onRequestSession);
        btn.innerHTML = "Enter XR";
        var header = document.querySelector("header");
        header.appendChild(btn);
      } else {
        navigator.xr.isSessionSupported("inline").then((supported) => {
          if (supported) {
            console.log(`inline session supported`);
          } else {
            console.log(`inline not supported`);
          }
        });
      }
    })
    .catch((reason) => {
      console.log(`WebXR not supported: ${reason}`);
    });
}

function onRequestSession() {
  // XR 세션 요청 처리
  console.log(`requesting Session`);
  navigator.xr
    .requestSession("immersive-ar", { requiredFeatures: ["viewer", "local"] })
    .then(onSessionStarted)
    .catch((reason) => {
      console.log("requiest disabled: " + reason.log);
    });
}
function onSessionStarted(session) {
  // XR 세션이 생성되면 처리
  console.log(`starting session`);

  // [버튼 요소의 상태 변경]

  // 이벤트 리스너 추가 / 삭제
  btn.removeEventListener("click", onRequestSession);
  btn.addEventListener("click", endXRSession);

  // 버튼의 텍스트 업데이트
  btn.innerHTML = "STOP AR";

  // XR 세션에 참조 저장
  xrSession = session;

  setupWebGLLayer().then(() => {
    renderer.xr.setReferenceSpaceType("local");
    renderer.xr.setSession(xrSession);
    animate();
  });
}

function setupWebGLLayer() {
  // WebGL 콘텍스트를 XR 세션에 연결
  return gl.makeXRCompatible().then(() => {
    xrSession.updateRenderState({
      baseLayer: new XRWebGLLayer(xrSession, gl),
    });
  });
}
function animate() {
  // 애니메이션 루프 시작
  renderer.setAnimationLoop(render);
}
function render(time, frame) {
  if (frame) {
    var referenceSpace = renderer.xr.getRegerenceSpace("local");
    var session = frame.session;
    xrViewerPose = frame.getViewerPose(referenceSpace);
    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then((referenceSpace) => {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then((source) => {
            hitTestSource = source;
          });
      });
      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });
    }
    if (hitTestSource) {
      var hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        var hit = hitTestResults[0];
        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPost(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }
  // GPU에 그리기 명령 실행
  renderer.render(scene, camera);
}
function endXRSession() {
  // XR 세션 종료
  if (xrSession) {
    console.log("ending session...");
    xrSession.end().then(onSessionEnd);
  }
}
function onSessionEnd() {
  // XR 세션의 종료 이벤트 처리
  xrSession = null;
  console.log("session ended");
  btn.innerHTML = "START AR";
  btn.removeEventListener("click", endXRSession);
  btn.addEventListener("click", onRequestSession);
}

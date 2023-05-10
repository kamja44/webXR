function NotFound() {
  console.log("immersive-vr mode not found");
}
function EnterVR() {
  button.innerHTML = "Enter XR";
  var currentSession = null;
  function onSessionStarted(session) {}
  button.onclick = () => {
    let sessionInit = {
      optionalFeatures: ["local-floor", "bounded-floor"],
    };
    navigator.xr
      .requestSession("immersive-vr", sessionInit)
      .then(onSessionStarted);
  };
}

if (navigator.xr) {
  var button = document.createElement("button");
  navigator.xr.isSessionSupported("immersive-vr").then(function (supported) {
    if (supported) {
      EnterVR();
    } else {
      NotFound();
    }
  });
} else {
  if (window.isSecureContext === false) {
    console.log("WebXR needs HTTPS");
  } else {
    console.log("WebXR not available");
  }
  return;
}

const main = () => {
  /*====== WebGL 콘텍스트 생성 ======*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("WebGL unavailable");
  } else {
    console.log("WebGL is good to go");
  }
  /*====== 지오메트리 정의 및 저장 ======*/
  const squares = [
    // 정면
    -0.3, -0.3, -0.3, 0.3, -0.3, -0.3, 0.3, 0.3, -0.3,

    -0.3, -0.3, -0.3, -0.3, 0.3, -0.3, 0.3, 0.3, -0.3,
    // 후면
    -0.2, -0.2, 0.3, 0.4, -0.2, 0.3, 0.4, 0.4, 0.3,

    -0.2, -0.2, 0.3, -0.2, 0.4, 0.3, 0.4, 0.4, 0.3,
  ];
  const squareColors = [
    0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,

    1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
  ];
  /*====== 전면 정점 정의 ============*/
  /*====== 전면 버퍼 정의 ============*/
  // 버퍼
  const origBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);
  /*====== 셰이더 =================*/
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(squareColors),
    gl.STATIC_DRAW
  );
  /*====== 셰이더 소스 정의 ===========*/
  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;

    varying lowp vec4 vColor;

    void main() {
        gl_Position = aPosition;
        vColor = aVertexColor;
    }
  `;
  const fsSource = `
    varying lowp vec4 vColor;

    void main(){
        gl_FragColor = vColor;
    }
  `;
  /*====== 셰이더 생성 ==============*/
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.shaderSource(fragmentShader, fsSource);
  /*====== 셰이더 컴파일 =============*/
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
        vertexShader
      )}`
    );
    gl.deleteShader(vertexShader);
    return null;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
        fragmentShader
      )}`
    );
    gl.deleteShader(fragmentShader);
    return null;
  }
  /*====== 셰이더 프로그램 생성 =========*/
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  /*====== 링크 셰이더 프로그램 =========*/
  gl.linkProgram(program);
  gl.useProgram(program);
  /*====== 속성을 정점 셰이더와 연결 ======*/
  let size = 3; // 각 정점에 대해 계산할 좌표 수 (x축, y축, z축)
  let type = gl.FLOAT; // 데이터는 32비트 floats
  let normalize = false;
  let stride = 0; // 쌍 좌표 사이의 인덱스를 건너뛰지 않는다.
  let offset = 0; // 버퍼 처음부터 시작

  const posAttribLocation = gl.getAttribLocation(program, "aPosition");
  gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
  gl.vertexAttribPointer(
    posAttribLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(posAttribLocation);

  const colorAttribLocation = gl.getAttribLocation(program, "aVertexColor");
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttribLocation);
  /*====== 그리기 ===================*/
  gl.clearColor(1, 1, 1, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // 화면에 포인트 그리기
  const mode = gl.TRIANGLES;
  //   const mode = gl.LINE_LOOP;
  const first = 0;
  const count = 12;
  gl.drawArrays(mode, first, count);
  /*====== 화면에 포인트 그리기 ==========*/
};

main();

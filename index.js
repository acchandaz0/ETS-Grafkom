"use strict";

var perspectiveExample = function(){
var canvas;
var gl;

var numPositions  = 108;

var positionsArray = [];
var colorsArray = [];

var colorIndex = 0;

var vertices = [
    vec4(-1.37638,0.,0.262866, 1.0),
    vec4(1.37638,0.,-0.262866, 1.0),
    vec4(-0.425325,-1.30902,0.262866, 1.0),
    vec4(-0.425325,1.30902,0.262866, 1.0),
    vec4(1.11352,-0.809017,0.262866, 1.0),
    vec4(1.11352,0.809017,0.262866, 1.0),
    vec4(-0.262866,-0.809017,1.11352, 1.0),
    vec4(-0.262866,0.809017,1.11352, 1.0),
    vec4(-0.688191,-0.5,-1.11352, 1.0),
    vec4(-0.688191,0.5,-1.11352, 1.0),
    vec4(0.688191,-0.5,1.11352, 1.0),
    vec4(0.688191,0.5,1.11352, 1.0),
    vec4(0.850651,0.,-1.11352, 1.0),
    vec4(-1.11352,-0.809017,-0.262866, 1.0),
    vec4(-1.11352,0.809017,-0.262866, 1.0),
    vec4(-0.850651,0.,1.11352, 1.0),
    vec4(0.262866,-0.809017,-1.11352, 1.0),
    vec4(0.262866,0.809017,-1.11352, 1.0),
    vec4(0.425325,-1.30902,-0.262866, 1.0),
    vec4(0.425325,1.30902,-0.262866, 1.0)
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(0.0, 0.0, 0.5, 1.0),  // 
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(0.0, 0.0, 0.7, 1.0),  // 
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
];



var near = 0.43923;
var far = 4.3923;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Tambahkan variabel untuk gerakan
var x = 0.0;  // Posisi awal x
var y = 1.0;  // Posisi awal y
var xDirection = 1;  // Arah gerakan x (1 untuk ke kanan, -1 untuk ke kiri)
var yDirection = -1; // Arah gerakan y (1 untuk ke atas, -1 untuk ke bawah)

function quad(a, b, c, d) {
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

function quad5(a, b, c, d, e){

    var indices = [a, b, c, a, c, d, a, d, e];
    

    for (var i = 0; i < indices.length; i++){
        positionsArray.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colorsArray.push(vertexColors[colorIndex]);
    }
    
    colorIndex++;

}


init();

function colorCube()
{
    // quad5(0, 1, 2, 3, 4);
    quad5(0, 14, 9, 8, 13);
    quad5(1, 12, 17, 19, 5);
    quad5(2, 13, 8, 16, 18);
    quad5(3, 19, 17, 9, 14);
    quad5(4, 18, 16, 12, 1);
    quad5(5, 19, 3, 7, 11);
    quad5(6, 10, 11, 7, 15);
    quad5(7, 3, 14, 0, 15);
    quad5(8, 9, 17, 12, 16);
    quad5(0, 13, 2, 6, 15);
    quad5(4, 1, 5, 11, 10);
    quad5(4, 10, 6, 2, 18);


    // quad5(1, 0, 3, 2, 5);
    // quad5(2, 3, 7, 6, 5);
    // quad5(3, 0, 4, 7, 5);
    // quad5(6, 5, 1, 2, 5);
    // quad5(4, 5, 6, 7, 5);
    // quad5(5, 4, 0, 1, 5);
}

function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect =  canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // for (var i = 0; i < vertices.length; i++) {
    //     vertices[i][0] *= 0.5;
    //     vertices[i][1] *= 0.5;
    //     vertices[i][2] *= 0.5;
    // }
    
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

// buttons for viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

    render();
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);

        // // Update posisi dodecahedron
        // x += speed * xDirection;
        // y += speed * yDirection;

        // // Batasi pergerakan dodecahedron antara -x dan x, serta y dan -y
        // if (x > 1.0) {
        //     x = 1.0;
        //     xDirection = -1;
        // } else if (x < -1.0) {
        //     x = -1.0;
        //     xDirection = 1;
        // }

        // if (y > 1.0) {
        //     y = 1.0;
        //     yDirection = -1;
        // } else if (y < -1.0) {
        //     y = -1.0;
        //     yDirection = 1;
        // }

        // // Ambil nilai kecepatan dari input pengguna
        // speed = parseFloat(document.getElementById("speed").value);

        // // Terapkan translasi ke uniform
        // gl.uniform3f(translationLoc, x, y, 0.0);

        // gl.drawArrays(gl.TRIANGLES, 0, numPositions);

        // // requestAnimFrame(render);
        // requestAnimationFrame(render);
}

}
perspectiveExample();
"use strict";

var shadedDodecahedron = function() {

    var canvas;
    var gl;

    var numPositions = 108;
    var positionsArray = [];
    var normalsArray = [];

    var scale = 0.2; // Skala dodecahedron
    var vertices = [
        vec4(-1.37638 * scale, 0.0, 0.262866 * scale, 1.0),
        vec4(1.37638 * scale, 0.0, -0.262866 * scale, 1.0),
        vec4(-0.425325 * scale, -1.30902 * scale, 0.262866 * scale, 1.0),
        vec4(-0.425325 * scale, 1.30902 * scale, 0.262866 * scale, 1.0),
        vec4(1.11352 * scale, -0.809017 * scale, 0.262866 * scale, 1.0),
        vec4(1.11352 * scale, 0.809017 * scale, 0.262866 * scale, 1.0),
        vec4(-0.262866 * scale, -0.809017 * scale, 1.11352 * scale, 1.0),
        vec4(-0.262866 * scale, 0.809017 * scale, 1.11352 * scale, 1.0),
        vec4(-0.688191 * scale, -0.5 * scale, -1.11352 * scale, 1.0),
        vec4(-0.688191 * scale, 0.5 * scale, -1.11352 * scale, 1.0),
        vec4(0.688191 * scale, -0.5 * scale, 1.11352 * scale, 1.0),
        vec4(0.688191 * scale, 0.5 * scale, 1.11352 * scale, 1.0),
        vec4(0.850651 * scale, 0.0, -1.11352 * scale, 1.0),
        vec4(-1.11352 * scale, -0.809017 * scale, -0.262866 * scale, 1.0),
        vec4(-1.11352 * scale, 0.809017 * scale, -0.262866 * scale, 1.0),
        vec4(-0.850651 * scale, 0.0, 1.11352 * scale, 1.0),
        vec4(0.262866 * scale, -0.809017 * scale, -1.11352 * scale, 1.0),
        vec4(0.262866 * scale, 0.809017 * scale, -1.11352 * scale, 1.0),
        vec4(0.425325 * scale, -1.30902 * scale, -0.262866 * scale, 1.0),
        vec4(0.425325 * scale, 1.30902 * scale, -0.262866 * scale, 1.0)
    ];

    function quad5(a, b, c, d, e) {
        var indices = [a, b, c, a, c, d, a, d, e];

        for (var i = 0; i < indices.length; i++) {
            positionsArray.push(vertices[indices[i]]);
            normalsArray.push(vertices[indices[i]]);
        }
    }

    function colorDodecahedron() {
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
    }

    var lightAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
    var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
    var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
    var materialShininess = 20.0;

    var modelViewMatrix, projectionMatrix;
    var viewerPos;
    var program;

    var thetaLoc;

    var flag = false;
    var bounceFlag = false; // Flag untuk kontrol pergerakan pantulan
    var speed = 2.0;
    var xAxis = 0;
    var yAxis = 1;
    var zAxis = 2;
    var axis = 0;
    var theta = vec3(0, 0, 0);

    // Variabel untuk posisi dan kecepatan dodecahedron
    var xPos = 0.0;
    var yPos = 0.0;
    var xSpeed = 0.01;
    var ySpeed = 0.01;

    var lightPos; // Variabel untuk posisi cahaya

    let velocityC = 0.0;
    let velocityY = 0.0;
    let initialVerticalVelocity = 0.0;
    let gravity = 9.8;
    let acceleration = 0.0;
    let elapsedTime = 0.0;
    let isMoving = false;
    let mass = 0.0;
    let force = 0.0;

    init();

    function init() {
        canvas = document.getElementById("gl-canvas");

        gl = canvas.getContext('webgl2');
        if (!gl) alert("WebGL 2.0 isn't available");

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);

        colorDodecahedron();

        var nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

        var normalLoc = gl.getAttribLocation(program, "aNormal");
        gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normalLoc);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

        var positionLoc = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);

        thetaLoc = gl.getUniformLocation(program, "theta");

        viewerPos = vec3(0.0, 0.0, -20.0);
        projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);

        var ambientProduct = mult(lightAmbient, materialAmbient);
        var diffuseProduct = mult(lightDiffuse, materialDiffuse);
        var specularProduct = mult(lightSpecular, materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"), ambientProduct);
        gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"), diffuseProduct);
        gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"), specularProduct);
        gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjectionMatrix"), false, flatten(projectionMatrix));

        document.getElementById("ButtonX").onclick = function() { axis = xAxis; };
        document.getElementById("ButtonY").onclick = function() { axis = yAxis; };
        document.getElementById("ButtonZ").onclick = function() { axis = zAxis; };
        document.getElementById("ButtonT").onclick = function() { flag = !flag; };

        document.getElementById("ButtonIncreaseSpeed").onclick = function() { speed += 0.5; };
        document.getElementById("ButtonDecreaseSpeed").onclick = function() { speed = Math.max(0.1, speed - 0.5); };

        // Event listener untuk tombol bounce
        document.getElementById("ButtonBounce").onclick = function() { bounceFlag = !bounceFlag; };

        document.getElementById("start-constant").onclick = function () {
            velocityC = parseFloat(document.getElementById("velocityC").value);
            elapsedTime = 0.0;
            isMoving = true;
        };

        document.getElementById("reset-constant").onclick = function () {
            isMoving = false;
            elapsedTime = 0.0;
            velocityC = 0;
            document.getElementById("velocity").innerText = 0;
        };

        document.getElementById("start-accelerated").onclick = function () {
            mass = parseFloat(document.getElementById("mass").value);
            force = parseFloat(document.getElementById("force").value);
            acceleration = force / mass;
            elapsedTime = 0.0;
            velocityY = 0.0;
            isMoving = true;
        };

        document.getElementById("reset-accelerated").onclick = function () {
            isMoving = false;
            elapsedTime = 0.0;
            velocityY = 0;
            document.getElementById("velocity").innerText = 0;
        };

        render();
    }

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Perbarui posisi dodecahedron jika bounceFlag aktif
        if (bounceFlag) {
            xPos += xSpeed;
            yPos += ySpeed;
        }

        // Deteksi batas canvas dan pantulkan berdasarkan posisi vertex
        for (let i = 0; i < vertices.length; i++) {
            var transformedVertex = mult(translate(xPos, yPos, 0.0), vertices[i]);

            if (transformedVertex[0] > 1.0 || transformedVertex[0] < -1.0) {
                xSpeed = -xSpeed; // Pantul pada sumbu X
                break;
            }
            if (transformedVertex[1] > 1.0 || transformedVertex[1] < -1.0) {
                ySpeed = -ySpeed; // Pantul pada sumbu Y
                break;
            }
        }

        // Update motion for accelerated mode
        if (isMoving) {
            elapsedTime += 0.01; // Simulate time step
            yPos = velocityY * elapsedTime + 0.5 * acceleration * elapsedTime * elapsedTime;
        }

        if (flag) theta[axis] += speed;

        lightPos = vec4(xPos + 1.0, yPos + 1.0, 1.0, 1.0);
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"), flatten(lightPos));

        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(xPos, yPos, 0.0)); // Translasi berdasarkan posisi
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModelViewMatrix"), false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, 0, numPositions);

        requestAnimationFrame(render);
    }
}

shadedDodecahedron();

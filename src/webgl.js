
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameters(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    console.log("Error in shader compilation:", gl.getShaderInfoLog(shader));
    gl.delateShader(shader);
}

function createProgram(gl, vertext_shader, fragment_shader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertext_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    console.log("Error in linking program:", gl.getProgramInfoLog(program));
    gl.delateProgram(program);
}


var vertext_shader = `#version 300 es

in vec4 a_pos;
void main() {
    gl_Positiion = a_pos;
}
`;
var fragment_shader = `#version 300 es

precision highp float;
out vec3 outColor;
void main() {
    outColor = vec4(1, 0, .5, 1);
}
`;
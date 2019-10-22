/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all WebAssembly.instance exports
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/gl-matrix/src/gl-matrix/common.js":
/*!********************************************************!*\
  !*** ./node_modules/gl-matrix/src/gl-matrix/common.js ***!
  \********************************************************/
/*! exports provided: EPSILON, ARRAY_TYPE, RANDOM, setMatrixArrayType, toRadian, equals */
/*! exports used: ARRAY_TYPE, EPSILON, RANDOM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return EPSILON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ARRAY_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return RANDOM; });
/* unused harmony export setMatrixArrayType */
/* unused harmony export toRadian */
/* unused harmony export equals */
/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
const EPSILON = 0.000001;
let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
const RANDOM = Math.random;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}

const degree = Math.PI / 180;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
function toRadian(a) {
  return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function equals(a, b) {
  return Math.abs(a - b) <= EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}


/***/ }),

/***/ "./node_modules/gl-matrix/src/gl-matrix/mat3.js":
/*!******************************************************!*\
  !*** ./node_modules/gl-matrix/src/gl-matrix/mat3.js ***!
  \******************************************************/
/*! exports provided: create, fromMat4, clone, copy, fromValues, set, identity, transpose, invert, adjoint, determinant, multiply, translate, rotate, scale, fromTranslation, fromRotation, fromScaling, fromMat2d, fromQuat, normalFromMat4, projection, str, frob, add, subtract, multiplyScalar, multiplyScalarAndAdd, exactEquals, equals, mul, sub */
/*! exports used: create */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* unused harmony export fromMat4 */
/* unused harmony export clone */
/* unused harmony export copy */
/* unused harmony export fromValues */
/* unused harmony export set */
/* unused harmony export identity */
/* unused harmony export transpose */
/* unused harmony export invert */
/* unused harmony export adjoint */
/* unused harmony export determinant */
/* unused harmony export multiply */
/* unused harmony export translate */
/* unused harmony export rotate */
/* unused harmony export scale */
/* unused harmony export fromTranslation */
/* unused harmony export fromRotation */
/* unused harmony export fromScaling */
/* unused harmony export fromMat2d */
/* unused harmony export fromQuat */
/* unused harmony export normalFromMat4 */
/* unused harmony export projection */
/* unused harmony export str */
/* unused harmony export frob */
/* unused harmony export add */
/* unused harmony export subtract */
/* unused harmony export multiplyScalar */
/* unused harmony export multiplyScalarAndAdd */
/* unused harmony export exactEquals */
/* unused harmony export equals */
/* unused harmony export mul */
/* unused harmony export sub */
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/src/gl-matrix/common.js");


/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create() {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](9);
  if(_common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"] != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
function clone(a) {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  let det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  out[0] = (a11 * a22 - a12 * a21);
  out[1] = (a02 * a21 - a01 * a22);
  out[2] = (a01 * a12 - a02 * a11);
  out[3] = (a12 * a20 - a10 * a22);
  out[4] = (a00 * a22 - a02 * a20);
  out[5] = (a02 * a10 - a00 * a12);
  out[6] = (a10 * a21 - a11 * a20);
  out[7] = (a01 * a20 - a00 * a21);
  out[8] = (a00 * a11 - a01 * a10);
  return out;
}

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b00 = b[0], b01 = b[1], b02 = b[2];
  let b10 = b[3], b11 = b[4], b12 = b[5];
  let b20 = b[6], b21 = b[7], b22 = b[8];

  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
function translate(out, a, v) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],
    x = v[0], y = v[1];

  out[0] = a00;
  out[1] = a01;
  out[2] = a02;

  out[3] = a10;
  out[4] = a11;
  out[5] = a12;

  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function rotate(out, a, rad) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],

    s = Math.sin(rad),
    c = Math.cos(rad);

  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;

  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;

  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1];

  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];

  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];

  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad), c = Math.cos(rad);

  out[0] = c;
  out[1] = s;
  out[2] = 0;

  out[3] = -s;
  out[4] = c;
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;

  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;

  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;

  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;

  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;

  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;

  return out;
}

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
function normalFromMat4(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  return out;
}

/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */
function projection(out, width, height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
}

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
          a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
          a[6] + ', ' + a[7] + ', ' + a[8] + ')';
}

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
}

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}



/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] &&
         a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
         a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
  return (Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
}

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
const mul = multiply;

/**
 * Alias for {@link mat3.subtract}
 * @function
 */
const sub = subtract;


/***/ }),

/***/ "./node_modules/gl-matrix/src/gl-matrix/mat4.js":
/*!******************************************************!*\
  !*** ./node_modules/gl-matrix/src/gl-matrix/mat4.js ***!
  \******************************************************/
/*! exports provided: create, clone, copy, fromValues, set, identity, transpose, invert, adjoint, determinant, multiply, translate, scale, rotate, rotateX, rotateY, rotateZ, fromTranslation, fromScaling, fromRotation, fromXRotation, fromYRotation, fromZRotation, fromRotationTranslation, fromQuat2, getTranslation, getScaling, getRotation, fromRotationTranslationScale, fromRotationTranslationScaleOrigin, fromQuat, frustum, perspective, perspectiveFromFieldOfView, ortho, lookAt, targetTo, str, frob, add, subtract, multiplyScalar, multiplyScalarAndAdd, exactEquals, equals, mul, sub */
/*! exports used: copy, create, fromTranslation, identity, invert, mul, multiply, perspective, rotateX, rotateY, rotateZ, scale, set, translate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return create; });
/* unused harmony export clone */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return copy; });
/* unused harmony export fromValues */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return identity; });
/* unused harmony export transpose */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return invert; });
/* unused harmony export adjoint */
/* unused harmony export determinant */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return multiply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return translate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return scale; });
/* unused harmony export rotate */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return rotateX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return rotateY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return rotateZ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fromTranslation; });
/* unused harmony export fromScaling */
/* unused harmony export fromRotation */
/* unused harmony export fromXRotation */
/* unused harmony export fromYRotation */
/* unused harmony export fromZRotation */
/* unused harmony export fromRotationTranslation */
/* unused harmony export fromQuat2 */
/* unused harmony export getTranslation */
/* unused harmony export getScaling */
/* unused harmony export getRotation */
/* unused harmony export fromRotationTranslationScale */
/* unused harmony export fromRotationTranslationScaleOrigin */
/* unused harmony export fromQuat */
/* unused harmony export frustum */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return perspective; });
/* unused harmony export perspectiveFromFieldOfView */
/* unused harmony export ortho */
/* unused harmony export lookAt */
/* unused harmony export targetTo */
/* unused harmony export str */
/* unused harmony export frob */
/* unused harmony export add */
/* unused harmony export subtract */
/* unused harmony export multiplyScalar */
/* unused harmony export multiplyScalarAndAdd */
/* unused harmony export exactEquals */
/* unused harmony export equals */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return mul; });
/* unused harmony export sub */
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/src/gl-matrix/common.js");


/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](16);
  if(_common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"] != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a03 = a[3];
    let a12 = a[6], a13 = a[7];
    let a23 = a[11];

    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
  out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
  out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
  out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
  out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
  out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
  return out;
}

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}

/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1], z = v[2];

  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
  a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
  a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[0]  = a[0];
    out[1]  = a[1];
    out[2]  = a[2];
    out[3]  = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[4]  = a[4];
    out[5]  = a[5];
    out[6]  = a[6];
    out[7]  = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[8]  = a[8];
    out[9]  = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromXRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = 1;
  out[1]  = 0;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = 0;
  out[2]  = -s;
  out[3]  = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = s;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {quat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */
function fromQuat2(out, a) {
  let translation = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](3);
  let bx = -a[0], by = -a[1], bz = -a[2], bw = a[3],
  ax = a[4], ay = a[5], az = a[6], aw = a[7];

  let magnitude = bx * bx + by * by + bz * bz + bw * bw;
  //Only scale if it makes sense
  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  fromRotationTranslation(out, a, translation);
  return out;
}

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
}

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];

  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

  return out;
}

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
function getRotation(out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  let trace = mat[0] + mat[5] + mat[10];
  let S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S;
    out[2] = (mat[1] - mat[4]) / S;
  } else if ((mat[0] > mat[5]) && (mat[0] > mat[10])) {
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S;
    out[2] = (mat[8] + mat[2]) / S;
  } else if (mat[5] > mat[10]) {
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S;
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S;
  } else {
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  let ox = o[0];
  let oy = o[1];
  let oz = o[2];

  let out0 = (1 - (yy + zz)) * sx;
  let out1 = (xy + wz) * sx;
  let out2 = (xz - wy) * sx;
  let out4 = (xy - wz) * sy;
  let out5 = (1 - (xx + zz)) * sy;
  let out6 = (yz + wx) * sy;
  let out8 = (xz + wy) * sz;
  let out9 = (yz - wx) * sz;
  let out10 = (1 - (xx + yy)) * sz;

  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;

  return out;
}

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;

  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;

  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
  let rl = 1 / (right - left);
  let tb = 1 / (top - bottom);
  let nf = 1 / (near - far);
  out[0] = (near * 2) * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = (near * 2) * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (far * near * 2) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = (2 * far * near) * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
  let upTan = Math.tan(fov.upDegrees * Math.PI/180.0);
  let downTan = Math.tan(fov.downDegrees * Math.PI/180.0);
  let leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0);
  let rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0);
  let xScale = 2.0 / (leftTan + rightTan);
  let yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = ((upTan - downTan) * yScale * 0.5);
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = (far * near) / (near - far);
  out[15] = 0.0;
  return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  let eyex = eye[0];
  let eyey = eye[1];
  let eyez = eye[2];
  let upx = up[0];
  let upy = up[1];
  let upz = up[2];
  let centerx = center[0];
  let centery = center[1];
  let centerz = center[2];

  if (Math.abs(eyex - centerx) < _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"] &&
      Math.abs(eyey - centery) < _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"] &&
      Math.abs(eyez - centerz) < _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function targetTo(out, eye, target, up) {
  let eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];

  let z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];

  let len = z0*z0 + z1*z1 + z2*z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;

  len = x0*x0 + x1*x1 + x2*x2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
          a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
          a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
          a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
}

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
}

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  out[9] = a[9] + (b[9] * scale);
  out[10] = a[10] + (b[10] * scale);
  out[11] = a[11] + (b[11] * scale);
  out[12] = a[12] + (b[12] * scale);
  out[13] = a[13] + (b[13] * scale);
  out[14] = a[14] + (b[14] * scale);
  out[15] = a[15] + (b[15] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] &&
         a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] &&
         a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
         a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3];
  let a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7];
  let a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11];
  let a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

  let b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3];
  let b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7];
  let b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11];
  let b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

  return (Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
          Math.abs(a9 - b9) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
          Math.abs(a10 - b10) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
          Math.abs(a11 - b11) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
          Math.abs(a12 - b12) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
          Math.abs(a13 - b13) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
          Math.abs(a14 - b14) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
          Math.abs(a15 - b15) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
}

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
const mul = multiply;

/**
 * Alias for {@link mat4.subtract}
 * @function
 */
const sub = subtract;


/***/ }),

/***/ "./node_modules/gl-matrix/src/gl-matrix/quat.js":
/*!******************************************************!*\
  !*** ./node_modules/gl-matrix/src/gl-matrix/quat.js ***!
  \******************************************************/
/*! exports provided: create, identity, setAxisAngle, getAxisAngle, multiply, rotateX, rotateY, rotateZ, calculateW, slerp, random, invert, conjugate, fromMat3, fromEuler, str, clone, fromValues, copy, set, add, mul, scale, dot, lerp, length, len, squaredLength, sqrLen, normalize, exactEquals, equals, rotationTo, sqlerp, setAxes */
/*! exports used: fromValues, getAxisAngle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export create */
/* unused harmony export identity */
/* unused harmony export setAxisAngle */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getAxisAngle; });
/* unused harmony export multiply */
/* unused harmony export rotateX */
/* unused harmony export rotateY */
/* unused harmony export rotateZ */
/* unused harmony export calculateW */
/* unused harmony export slerp */
/* unused harmony export random */
/* unused harmony export invert */
/* unused harmony export conjugate */
/* unused harmony export fromMat3 */
/* unused harmony export fromEuler */
/* unused harmony export str */
/* unused harmony export clone */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fromValues; });
/* unused harmony export copy */
/* unused harmony export set */
/* unused harmony export add */
/* unused harmony export mul */
/* unused harmony export scale */
/* unused harmony export dot */
/* unused harmony export lerp */
/* unused harmony export length */
/* unused harmony export len */
/* unused harmony export squaredLength */
/* unused harmony export sqrLen */
/* unused harmony export normalize */
/* unused harmony export exactEquals */
/* unused harmony export equals */
/* unused harmony export rotationTo */
/* unused harmony export sqlerp */
/* unused harmony export setAxes */
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/src/gl-matrix/common.js");
/* harmony import */ var _mat3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mat3.js */ "./node_modules/gl-matrix/src/gl-matrix/mat3.js");
/* harmony import */ var _vec3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vec3.js */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var _vec4_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vec4.js */ "./node_modules/gl-matrix/src/gl-matrix/vec4.js");





/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
function create() {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](4);
  if(_common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"] != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
function getAxisAngle(out_axis, q) {
  let rad = Math.acos(q[3]) * 2.0;
  let s = Math.sin(rad / 2.0);
  if (s > _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
function multiply(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateX(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateY(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let by = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateZ(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bz = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
function calculateW(out, a) {
  let x = a[0], y = a[1], z = a[2];

  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if ( cosom < 0.0 ) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ( (1.0 - cosom) > _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"] ) {
    // standard case (slerp)
    omega  = Math.acos(cosom);
    sinom  = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * Generates a random quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
function random(out) {
  // Implementation of http://planning.cs.uiuc.edu/node198.html
  // TODO: Calling random 3 times is probably not the fastest solution
  let u1 = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]();
  let u2 = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]();
  let u3 = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]();

  let sqrt1MinusU1 = Math.sqrt(1 - u1);
  let sqrtU1 = Math.sqrt(u1);

  out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
  return out;
}

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
  let invDot = dot ? 1.0/dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0*invDot;
  out[1] = -a1*invDot;
  out[2] = -a2*invDot;
  out[3] = a3*invDot;
  return out;
}

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if ( fTrace > 0.0 ) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0);  // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5/fRoot;  // 1/(4w)
    out[0] = (m[5]-m[7])*fRoot;
    out[1] = (m[6]-m[2])*fRoot;
    out[2] = (m[1]-m[3])*fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if ( m[4] > m[0] )
      i = 1;
    if ( m[8] > m[i*3+i] )
      i = 2;
    let j = (i+1)%3;
    let k = (i+2)%3;

    fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
    out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
    out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
  }

  return out;
}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */
function fromEuler(out, x, y, z) {
    let halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;

    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);

    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;

    return out;
}

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
const clone = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* clone */ "b"];

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
const fromValues = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* fromValues */ "h"];

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
const copy = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* copy */ "c"];

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
const set = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* set */ "m"];

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
const add = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* add */ "a"];

/**
 * Alias for {@link quat.multiply}
 * @function
 */
const mul = multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
const scale = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* scale */ "l"];

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
const dot = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* dot */ "e"];

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */
const lerp = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* lerp */ "j"];

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */
const length = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* length */ "i"];

/**
 * Alias for {@link quat.length}
 * @function
 */
const len = length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
const squaredLength = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* squaredLength */ "n"];

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
const sqrLen = squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
const normalize = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* normalize */ "k"];

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const exactEquals = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* exactEquals */ "g"];

/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const equals = _vec4_js__WEBPACK_IMPORTED_MODULE_3__[/* equals */ "f"];

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
const rotationTo = (function() {
  let tmpvec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* create */ "c"]();
  let xUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* fromValues */ "f"](1,0,0);
  let yUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* fromValues */ "f"](0,1,0);

  return function(out, a, b) {
    let dot = _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* dot */ "e"](a, b);
    if (dot < -0.999999) {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* cross */ "d"](tmpvec3, xUnitVec3, a);
      if (_vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* len */ "g"](tmpvec3) < 0.000001)
        _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* cross */ "d"](tmpvec3, yUnitVec3, a);
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* normalize */ "h"](tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__[/* cross */ "d"](tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
})();

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */
const sqlerp = (function () {
  let temp1 = create();
  let temp2 = create();

  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}());

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
const setAxes = (function() {
  let matr = _mat3_js__WEBPACK_IMPORTED_MODULE_1__[/* create */ "a"]();

  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return normalize(out, fromMat3(out, matr));
  };
})();


/***/ }),

/***/ "./node_modules/gl-matrix/src/gl-matrix/vec3.js":
/*!******************************************************!*\
  !*** ./node_modules/gl-matrix/src/gl-matrix/vec3.js ***!
  \******************************************************/
/*! exports provided: create, clone, length, fromValues, copy, set, add, subtract, multiply, divide, ceil, floor, min, max, round, scale, scaleAndAdd, distance, squaredDistance, squaredLength, negate, inverse, normalize, dot, cross, lerp, hermite, bezier, random, transformMat4, transformMat3, transformQuat, rotateX, rotateY, rotateZ, angle, str, exactEquals, equals, sub, mul, div, dist, sqrDist, len, sqrLen, forEach */
/*! exports used: add, copy, create, cross, dot, fromValues, len, normalize, rotateX, rotateY, scale, set, sub, transformMat4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return create; });
/* unused harmony export clone */
/* unused harmony export length */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return fromValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return add; });
/* unused harmony export subtract */
/* unused harmony export multiply */
/* unused harmony export divide */
/* unused harmony export ceil */
/* unused harmony export floor */
/* unused harmony export min */
/* unused harmony export max */
/* unused harmony export round */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return scale; });
/* unused harmony export scaleAndAdd */
/* unused harmony export distance */
/* unused harmony export squaredDistance */
/* unused harmony export squaredLength */
/* unused harmony export negate */
/* unused harmony export inverse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return normalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return dot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return cross; });
/* unused harmony export lerp */
/* unused harmony export hermite */
/* unused harmony export bezier */
/* unused harmony export random */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return transformMat4; });
/* unused harmony export transformMat3 */
/* unused harmony export transformQuat */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return rotateX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return rotateY; });
/* unused harmony export rotateZ */
/* unused harmony export angle */
/* unused harmony export str */
/* unused harmony export exactEquals */
/* unused harmony export equals */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return sub; });
/* unused harmony export mul */
/* unused harmony export div */
/* unused harmony export dist */
/* unused harmony export sqrDist */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return len; });
/* unused harmony export sqrLen */
/* unused harmony export forEach */
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/src/gl-matrix/common.js");


/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](3);
  if(_common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"] != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x*x + y*y + z*z;
}

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x*x + y*y + z*z;
}

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x*x + y*y + z*z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function hermite(out, a, b, c, d, t) {
  let factorTimes2 = t * t;
  let factor1 = factorTimes2 * (2 * t - 3) + 1;
  let factor2 = factorTimes2 * (t - 2) + t;
  let factor3 = factorTimes2 * (t - 1);
  let factor4 = factorTimes2 * (3 - 2 * t);

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function bezier(out, a, b, c, d, t) {
  let inverseFactor = 1 - t;
  let inverseFactorTimesTwo = inverseFactor * inverseFactor;
  let factorTimes2 = t * t;
  let factor1 = inverseFactorTimesTwo * inverseFactor;
  let factor2 = 3 * t * inverseFactorTimesTwo;
  let factor3 = 3 * factorTimes2 * inverseFactor;
  let factor4 = factorTimes2 * t;

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
  scale = scale || 1.0;

  let r = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]() * 2.0 * Math.PI;
  let z = (_common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]() * 2.0) - 1.0;
  let zScale = Math.sqrt(1.0-z*z) * scale;

  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
    // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
    let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    let x = a[0], y = a[1], z = a[2];
    // var qvec = [qx, qy, qz];
    // var uv = vec3.cross([], qvec, a);
    let uvx = qy * z - qz * y,
        uvy = qz * x - qx * z,
        uvz = qx * y - qy * x;
    // var uuv = vec3.cross([], qvec, uv);
    let uuvx = qy * uvz - qz * uvy,
        uuvy = qz * uvx - qx * uvz,
        uuvz = qx * uvy - qy * uvx;
    // vec3.scale(uv, uv, 2 * w);
    let w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    // vec3.scale(uuv, uuv, 2);
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    // return vec3.add(out, a, vec3.add(out, uv, uuv));
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
}

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0];
  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  r[1] = p[1];
  r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  r[2] = p[2];

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
  let tempA = fromValues(a[0], a[1], a[2]);
  let tempB = fromValues(b[0], b[1], b[2]);

  normalize(tempA, tempA);
  normalize(tempB, tempB);

  let cosine = dot(tempA, tempB);

  if(cosine > 1.0) {
    return 0;
  }
  else if(cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2];
  let b0 = b[0], b1 = b[1], b2 = b[2];
  return (Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
}

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
const sub = subtract;

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
const mul = multiply;

/**
 * Alias for {@link vec3.divide}
 * @function
 */
const div = divide;

/**
 * Alias for {@link vec3.distance}
 * @function
 */
const dist = distance;

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;

/**
 * Alias for {@link vec3.length}
 * @function
 */
const len = length;

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
const sqrLen = squaredLength;

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 3;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
    }

    return a;
  };
})();


/***/ }),

/***/ "./node_modules/gl-matrix/src/gl-matrix/vec4.js":
/*!******************************************************!*\
  !*** ./node_modules/gl-matrix/src/gl-matrix/vec4.js ***!
  \******************************************************/
/*! exports provided: create, clone, fromValues, copy, set, add, subtract, multiply, divide, ceil, floor, min, max, round, scale, scaleAndAdd, distance, squaredDistance, length, squaredLength, negate, inverse, normalize, dot, lerp, random, transformMat4, transformQuat, str, exactEquals, equals, sub, mul, div, dist, sqrDist, len, sqrLen, forEach */
/*! exports used: add, clone, copy, create, dot, equals, exactEquals, fromValues, length, lerp, normalize, scale, set, squaredLength, transformMat4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return clone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return fromValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return add; });
/* unused harmony export subtract */
/* unused harmony export multiply */
/* unused harmony export divide */
/* unused harmony export ceil */
/* unused harmony export floor */
/* unused harmony export min */
/* unused harmony export max */
/* unused harmony export round */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return scale; });
/* unused harmony export scaleAndAdd */
/* unused harmony export distance */
/* unused harmony export squaredDistance */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return length; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return squaredLength; });
/* unused harmony export negate */
/* unused harmony export inverse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return normalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return dot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return lerp; });
/* unused harmony export random */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return transformMat4; });
/* unused harmony export transformQuat */
/* unused harmony export str */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return exactEquals; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return equals; });
/* unused harmony export sub */
/* unused harmony export mul */
/* unused harmony export div */
/* unused harmony export dist */
/* unused harmony export sqrDist */
/* unused harmony export len */
/* unused harmony export sqrLen */
/* unused harmony export forEach */
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/src/gl-matrix/common.js");


/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create() {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](4);
  if(_common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"] != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
function clone(a) {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues(x, y, z, w) {
  let out = new _common_js__WEBPACK_IMPORTED_MODULE_0__[/* ARRAY_TYPE */ "a"](4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x*x + y*y + z*z + w*w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  let aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
function random(out, scale) {
  scale = scale || 1.0;

  // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;
  var v1, v2, v3, v4;
  var s1, s2;
  do {
    v1 = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]() * 2 - 1;
    v2 = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);
  do {
    v3 = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]() * 2 - 1;
    v4 = _common_js__WEBPACK_IMPORTED_MODULE_0__[/* RANDOM */ "c"]() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2], w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
function transformQuat(out, a, q) {
  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  let ix = qw * x + qy * z - qz * y;
  let iy = qw * y + qz * x - qx * z;
  let iz = qw * z + qx * y - qy * x;
  let iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return (Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__[/* EPSILON */ "b"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
}

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
const sub = subtract;

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
const mul = multiply;

/**
 * Alias for {@link vec4.divide}
 * @function
 */
const div = divide;

/**
 * Alias for {@link vec4.distance}
 * @function
 */
const dist = distance;

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;

/**
 * Alias for {@link vec4.length}
 * @function
 */
const len = length;

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
const sqrLen = squaredLength;

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 4;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
    }

    return a;
  };
})();


/***/ }),

/***/ "./node_modules/parse-dds/index.js":
/*!*****************************************!*\
  !*** ./node_modules/parse-dds/index.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

// All values and structures referenced from:
// http://msdn.microsoft.com/en-us/library/bb943991.aspx/
//
// DX10 Cubemap support based on
// https://github.com/dariomanesku/cmft/issues/7#issuecomment-69516844
// https://msdn.microsoft.com/en-us/library/windows/desktop/bb943983(v=vs.85).aspx
// https://github.com/playcanvas/engine/blob/master/src/resources/resources_texture.js

var DDS_MAGIC = 0x20534444
var DDSD_MIPMAPCOUNT = 0x20000
var DDPF_FOURCC = 0x4

var FOURCC_DXT1 = fourCCToInt32('DXT1')
var FOURCC_DXT3 = fourCCToInt32('DXT3')
var FOURCC_DXT5 = fourCCToInt32('DXT5')
var FOURCC_DX10 = fourCCToInt32('DX10')
var FOURCC_FP32F = 116 // DXGI_FORMAT_R32G32B32A32_FLOAT

var DDSCAPS2_CUBEMAP = 0x200
var D3D10_RESOURCE_DIMENSION_TEXTURE2D = 3
var DXGI_FORMAT_R32G32B32A32_FLOAT = 2

// The header length in 32 bit ints
var headerLengthInt = 31

// Offsets into the header array
var off_magic = 0
var off_size = 1
var off_flags = 2
var off_height = 3
var off_width = 4
var off_mipmapCount = 7
var off_pfFlags = 20
var off_pfFourCC = 21
var off_caps2 = 28

module.exports = parseHeaders

function parseHeaders (arrayBuffer) {
  var header = new Int32Array(arrayBuffer, 0, headerLengthInt)

  if (header[off_magic] !== DDS_MAGIC) {
    throw new Error('Invalid magic number in DDS header')
  }

  if (!header[off_pfFlags] & DDPF_FOURCC) {
    throw new Error('Unsupported format, must contain a FourCC code')
  }

  var blockBytes
  var format
  var fourCC = header[off_pfFourCC]
  switch (fourCC) {
    case FOURCC_DXT1:
      blockBytes = 8
      format = 'dxt1'
      break
    case FOURCC_DXT3:
      blockBytes = 16
      format = 'dxt3'
      break
    case FOURCC_DXT5:
      blockBytes = 16
      format = 'dxt5'
      break
    case FOURCC_FP32F:
      format = 'rgba32f'
      break
    case FOURCC_DX10:
      var dx10Header = new Uint32Array(arrayBuffer.slice(128, 128 + 20))
      format = dx10Header[0]
      var resourceDimension = dx10Header[1]
      var miscFlag = dx10Header[2]
      var arraySize = dx10Header[3]
      var miscFlags2 = dx10Header[4]

      if (resourceDimension === D3D10_RESOURCE_DIMENSION_TEXTURE2D && format === DXGI_FORMAT_R32G32B32A32_FLOAT) {
        format = 'rgba32f'
      } else {
        throw new Error('Unsupported DX10 texture format ' + format)
      }
      break
    default:
      throw new Error('Unsupported FourCC code: ' + int32ToFourCC(fourCC))
  }

  var flags = header[off_flags]
  var mipmapCount = 1

  if (flags & DDSD_MIPMAPCOUNT) {
    mipmapCount = Math.max(1, header[off_mipmapCount])
  }

  var cubemap = false
  var caps2 = header[off_caps2]
  if (caps2 & DDSCAPS2_CUBEMAP) {
    cubemap = true
  }

  var width = header[off_width]
  var height = header[off_height]
  var dataOffset = header[off_size] + 4
  var texWidth = width
  var texHeight = height
  var images = []
  var dataLength

  if (fourCC === FOURCC_DX10) {
    dataOffset += 20
  }

  if (cubemap) {
    for (var f = 0; f < 6; f++) {
      if (format !== 'rgba32f') {
        throw new Error('Only RGBA32f cubemaps are supported')
      }
      var bpp = 4 * 32 / 8

      width = texWidth
      height = texHeight

      // cubemap should have all mipmap levels defined
      // Math.log2(width) + 1
      var requiredMipLevels = Math.log(width) / Math.log(2) + 1

      for (var i = 0; i < requiredMipLevels; i++) {
        dataLength = width * height * bpp
        images.push({
          offset: dataOffset,
          length: dataLength,
          shape: [ width, height ]
        })
        // Reuse data from the previous level if we are beyond mipmapCount
        // This is hack for CMFT not publishing full mipmap chain https://github.com/dariomanesku/cmft/issues/10
        if (i < mipmapCount) {
          dataOffset += dataLength
        }
        width = Math.floor(width / 2)
        height = Math.floor(height / 2)
      }
    }
  } else {
    for (var i = 0; i < mipmapCount; i++) {
      dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes

      images.push({
        offset: dataOffset,
        length: dataLength,
        shape: [ width, height ]
      })
      dataOffset += dataLength
      width = Math.floor(width / 2)
      height = Math.floor(height / 2)
    }
  }

  return {
    shape: [ texWidth, texHeight ],
    images: images,
    format: format,
    flags: flags,
    cubemap: cubemap
  }
}

function fourCCToInt32 (value) {
  return value.charCodeAt(0) +
    (value.charCodeAt(1) << 8) +
    (value.charCodeAt(2) << 16) +
    (value.charCodeAt(3) << 24)
}

function int32ToFourCC (value) {
  return String.fromCharCode(
    value & 0xff,
    (value >> 8) & 0xff,
    (value >> 16) & 0xff,
    (value >> 24) & 0xff
  )
}


/***/ }),

/***/ "./src/SSAOState.ts":
/*!**************************!*\
  !*** ./src/SSAOState.ts ***!
  \**************************/
/*! exports provided: SSAOConfig, SSAOState */
/*! exports used: SSAOConfig, SSAOState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SSAOConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SSAOState; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

class SSAOConfig {
    constructor() {
        this.enabled = true;
        this.sampleCount = 32;
        this.noiseScale = 2;
        this.scalePower = 2;
        this.radius = 0.75;
        this.bias = 0.025;
        this.strength = 1.0;
        this.blurPositionThreshold = 0.3;
        this.blurNormalThreshold = 0.9;
    }
    isEnabled() {
        return this.enabled && this.strength > 0;
    }
    copy() {
        return Object.assign(new SSAOConfig(), this);
    }
}
class SSAOState {
    constructor(gl, config) {
        // Generate random samples.
        this.recalculate(gl, config);
    }
    recalculate(gl, config) {
        this.delete(gl);
        this.usedConfig = config.copy();
        const samples = new Array();
        for (let index = 0; index < config.sampleCount; index++) {
            const scale = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* lerp */ "e"])(Math.pow(index / config.sampleCount, config.scalePower), 0., 1., 0.1, 1.);
            samples.push(Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* randFloat */ "h"])(-1, 1) * scale);
            samples.push(Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* randFloat */ "h"])(-1, 1) * scale);
            samples.push(Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* randFloat */ "h"])(0, 1) * scale);
        }
        this.tangentSpaceSamples = new Float32Array(samples);
        const randomRotationVectors = [];
        // screen space random vector that points only in xy direction so that it's
        // orthogonal to screen-space normal vector.
        for (let i = 0; i < config.noiseScale * config.noiseScale; i++) {
            randomRotationVectors.push(Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* randFloat */ "h"])(-1, 1));
            randomRotationVectors.push(Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* randFloat */ "h"])(-1, 1));
            randomRotationVectors.push(0);
        }
        const randomRotationVectorsView = new Float32Array(randomRotationVectors);
        // Generate random rotations texture;
        this.noiseTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, config.noiseScale, config.noiseScale, 0, gl.RGB, gl.FLOAT, randomRotationVectorsView);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        return this;
    }
    delete(gl) {
        if (this.noiseTexture) {
            gl.deleteTexture(this.noiseTexture);
        }
    }
}


/***/ }),

/***/ "./src/axisAlignedBox.ts":
/*!*******************************!*\
  !*** ./src/axisAlignedBox.ts ***!
  \*******************************/
/*! exports provided: AxisAlignedBox */
/*! exports used: AxisAlignedBox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisAlignedBox; });
/* harmony import */ var _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glArrayBuffer */ "./src/glArrayBuffer.ts");
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");


class AxisAlignedBox {
    constructor() {
        this._cacheNeedsUpdate = false;
        this._vertexBufferCache = null;
        this._min = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](-1, -1, -1);
        this._max = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](1, 1, 1);
    }
    get min() {
        return this._min;
    }
    get max() {
        return this._max;
    }
    setMin(v) {
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* copy */ "b"](this._min, v);
        this._cacheNeedsUpdate = true;
        return this;
    }
    setMax(v) {
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* copy */ "b"](this._max, v);
        this._cacheNeedsUpdate = true;
        return this;
    }
    containsPoint(v) {
        return (v[0] > this._min[0] && v[0] < this._max[0]
            &&
                v[1] > this._min[1] && v[1] < this._max[1]
            &&
                v[2] > this._min[2] && v[3] < this._max[2]);
    }
    uniqueVertices() {
        const x = 0;
        const y = 1;
        const z = 2;
        const dlf = [this._min[x], this._min[y], this._max[z]];
        const dlb = [this._min[x], this._min[y], this._min[z]];
        const drf = [this._max[x], this._min[y], this._max[z]];
        const drb = [this._max[x], this._min[y], this._min[z]];
        const urf = [this._max[x], this._max[y], this._max[z]];
        const urb = [this._max[x], this._max[y], this._min[z]];
        const ulf = [this._min[x], this._max[y], this._max[z]];
        const ulb = [this._min[x], this._max[y], this._min[z]];
        return [
            dlf, dlb, drf, drb, urf, urb, ulf, ulb
        ];
    }
    asVerticesBuffer(allowCached = true) {
        if (allowCached && !this._cacheNeedsUpdate && !!this._vertexBufferCache) {
            return this._vertexBufferCache;
        }
        const params = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferDataParams */ "f"](false, false, 8, _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* ArrayBufferDataType */ "a"].POINTS);
        params.elementSize = 3;
        const data = [];
        for (const v of this.uniqueVertices()) {
            data.push(...v);
        }
        this._vertexBufferCache = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferData */ "e"](new Float32Array(data), params);
        this._cacheNeedsUpdate = false;
        return this._vertexBufferCache;
    }
    asWireFrameBuffer() {
        const params = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferDataParams */ "f"](false, false, 24, _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* ArrayBufferDataType */ "a"].LINES);
        params.elementSize = 3;
        const data = [];
        const [dlf, dlb, drf, drb, urf, urb, ulf, ulb] = this.uniqueVertices();
        // front face edges
        data.push(...dlf, ...drf, ...drf, ...urf, ...urf, ...ulf, ...ulf, ...dlf);
        // back face edges
        data.push(...dlb, ...drb, ...drb, ...urb, ...urb, ...ulb, ...ulb, ...dlb);
        // top left edge
        data.push(...ulf, ...ulb);
        // top right edge
        data.push(...urf, ...urb);
        // bootom left edge
        data.push(...dlf, ...dlb);
        // bottom right edge
        data.push(...drf, ...drb);
        return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferData */ "e"](new Float32Array(data), params);
    }
}


/***/ }),

/***/ "./src/camera.ts":
/*!***********************!*\
  !*** ./src/camera.ts ***!
  \***********************/
/*! exports provided: ProjectionMatrix, Camera */
/*! exports used: Camera, ProjectionMatrix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ProjectionMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Camera; });
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/mat4 */ "./node_modules/gl-matrix/src/gl-matrix/mat4.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



const tmpVec3 = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* create */ "c"]();
class ProjectionMatrix {
    constructor(near, far, matrix) {
        this.near = near;
        this.far = far;
        this.matrix = matrix;
    }
}
class Camera {
    constructor(aspect = 1) {
        this._right = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* create */ "c"]();
        this._camToWorldNeedsUpdate = true;
        this._worldToCamNeedsUpdate = true;
        this._projectionMatrixNeedsUpdate = true;
        this._position = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* fromValues */ "f"](0, 0, -1);
        this._forward = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* fromValues */ "f"](0, 0, 1);
        this._up = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* fromValues */ "f"](0, 1, 0);
        this._right = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* create */ "c"]();
        this.near = 0.1;
        this.far = 15.0;
        this.fov = 45.;
        this.aspect = aspect;
        this._projectionMatrix = gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* create */ "b"]();
        this._worldToCamera = gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* create */ "b"]();
        this._cameraToWorld = gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* create */ "b"]();
    }
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
        this.update();
    }
    get forward() {
        return this._forward;
    }
    set forward(value) {
        this._forward = value;
        this.update();
    }
    get up() {
        return this._up;
    }
    set up(value) {
        this._up = value;
        this.update();
    }
    setFar(v) {
        this.far = v;
        return this;
    }
    update() {
        this._camToWorldNeedsUpdate = true;
        this._worldToCamNeedsUpdate = true;
        this._projectionMatrixNeedsUpdate = true;
    }
    getWorldToCamera() {
        if (this._worldToCamNeedsUpdate) {
            this.computeWorldToCamera();
            this._worldToCamNeedsUpdate = false;
        }
        return this._worldToCamera;
    }
    getCameraToWorld() {
        if (this._camToWorldNeedsUpdate) {
            this.computeCameraToWorld();
            this._camToWorldNeedsUpdate = false;
        }
        return this._cameraToWorld;
    }
    right() {
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* cross */ "d"](this._right, this._forward, this._up);
        return this._right;
    }
    projectionMatrix() {
        if (this._projectionMatrixNeedsUpdate) {
            gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* perspective */ "h"](this._projectionMatrix, this.fov * Math.PI / 180.0, this.aspect, this.near, this.far);
            this._projectionMatrixNeedsUpdate = false;
        }
        return new ProjectionMatrix(this.near, this.far, this._projectionMatrix);
    }
    calculateUpFromWorldUp() {
        // determine up direction
        const worldUp = [0, 1., 0];
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* scale */ "k"](tmpVec3, this.forward, gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* dot */ "e"](worldUp, this.forward));
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* sub */ "m"](this.up, worldUp, tmpVec3);
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* normalize */ "h"](this.up, this.up);
        this.update();
    }
    clone(target) {
        const c = target || new Camera();
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* copy */ "b"](c.position, this.position);
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* copy */ "b"](c.forward, this.forward);
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* copy */ "b"](c.up, this.up);
        c.near = this.near;
        c.far = this.far;
        c.aspect = this.aspect;
        c.update();
        return c;
    }
    computeWorldToCamera() {
        const m = this._worldToCamera;
        const r = this.right();
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* set */ "m"](m, r[0], this.up[0], -this.forward[0], 0, r[1], this.up[1], -this.forward[1], 0, r[2], this.up[2], -this.forward[2], 0, 0, 0, 0, 1);
        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* scale */ "k"](tmpVec3, this.position, -1);
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* translate */ "n"](m, m, tmpVec3);
        return m;
    }
    computeCameraToWorld() {
        // This will essentially be equivalent to the inverset of getWorldToCamera(),
        // but it's much easier to compute by hand instead of inverse.
        const m = this._cameraToWorld;
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* fromTranslation */ "c"](m, this.position);
        const r = this.right();
        const mr = Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* tmpIdentityMatrix */ "j"])();
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* set */ "m"](mr, r[0], r[1], r[2], 0, this.up[0], this.up[1], this.up[2], 0, -this.forward[0], -this.forward[1], -this.forward[2], 0, 0, 0, 0, 1);
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* multiply */ "g"](m, m, mr);
        return m;
    }
}


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/*! exports provided: ATTRIBUTE_POSITION, ATTRIBUTE_POSITION_LOC, ATTRIBUTE_NORMALS, ATTRIBUTE_NORMALS_LOC, ATTRIBUTE_UV, ATTRIBUTE_UV_LOC, ATTRIBUTE_TANGENT, ATTRIBUTE_TANGENT_LOC, UNIFORM_CAMERA_POSITION, UNIFORM_WORLD_TO_CAMERA_MAT4, UNIFORM_CAMERA_TO_WORLD_MAT4, UNIFORM_PERSPECTIVE_MATRIX, UNIFORM_MODEL_WORLD_MATRIX, UNIFORM_MODEL_VIEW_MATRIX, UNIFORM_GBUF_POSITION, UNIFORM_GBUF_NORMAL, UNIFORM_GBUF_ALBEDO, UNIFORM_GBUF_MR, UNIFORM_HAS_TANGENT, SAMPLE_GLTF_SPONZA, SAMPLE_GLTF_SPONZA_DDS */
/*! exports used: ATTRIBUTE_NORMALS_LOC, ATTRIBUTE_POSITION_LOC, ATTRIBUTE_TANGENT_LOC, ATTRIBUTE_UV_LOC, SAMPLE_GLTF_SPONZA_DDS, UNIFORM_CAMERA_POSITION, UNIFORM_CAMERA_TO_WORLD_MAT4, UNIFORM_GBUF_ALBEDO, UNIFORM_GBUF_MR, UNIFORM_GBUF_NORMAL, UNIFORM_GBUF_POSITION, UNIFORM_HAS_TANGENT, UNIFORM_MODEL_VIEW_MATRIX, UNIFORM_MODEL_WORLD_MATRIX, UNIFORM_PERSPECTIVE_MATRIX, UNIFORM_WORLD_TO_CAMERA_MAT4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ATTRIBUTE_POSITION */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ATTRIBUTE_POSITION_LOC; });
/* unused harmony export ATTRIBUTE_NORMALS */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ATTRIBUTE_NORMALS_LOC; });
/* unused harmony export ATTRIBUTE_UV */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ATTRIBUTE_UV_LOC; });
/* unused harmony export ATTRIBUTE_TANGENT */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ATTRIBUTE_TANGENT_LOC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return UNIFORM_CAMERA_POSITION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return UNIFORM_WORLD_TO_CAMERA_MAT4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return UNIFORM_CAMERA_TO_WORLD_MAT4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return UNIFORM_PERSPECTIVE_MATRIX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return UNIFORM_MODEL_WORLD_MATRIX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return UNIFORM_MODEL_VIEW_MATRIX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return UNIFORM_GBUF_POSITION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return UNIFORM_GBUF_NORMAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return UNIFORM_GBUF_ALBEDO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return UNIFORM_GBUF_MR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return UNIFORM_HAS_TANGENT; });
/* unused harmony export SAMPLE_GLTF_SPONZA */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SAMPLE_GLTF_SPONZA_DDS; });
const ATTRIBUTE_POSITION = "a_pos";
const ATTRIBUTE_POSITION_LOC = 0;
const ATTRIBUTE_NORMALS = "a_norm";
const ATTRIBUTE_NORMALS_LOC = 1;
const ATTRIBUTE_UV = "a_uv";
const ATTRIBUTE_UV_LOC = 2;
const ATTRIBUTE_TANGENT = "a_tangent";
const ATTRIBUTE_TANGENT_LOC = 3;
const UNIFORM_CAMERA_POSITION = "u_cameraPos";
const UNIFORM_WORLD_TO_CAMERA_MAT4 = "u_worldToCameraMatrix";
const UNIFORM_CAMERA_TO_WORLD_MAT4 = "u_cameraToWorldMatrix";
const UNIFORM_PERSPECTIVE_MATRIX = "u_perspectiveMatrix";
const UNIFORM_MODEL_WORLD_MATRIX = "u_modelWorldMatrix";
const UNIFORM_MODEL_VIEW_MATRIX = "u_modelViewMatrix";
const UNIFORM_GBUF_POSITION = "gbuf_position";
const UNIFORM_GBUF_NORMAL = "gbuf_normal";
const UNIFORM_GBUF_ALBEDO = "gbuf_colormap";
const UNIFORM_GBUF_MR = "gbuf_metallic_roughness";
const UNIFORM_HAS_TANGENT = "u_hasTangent";
const SAMPLE_GLTF_SPONZA = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza.gltf";
// DDS variant produced like this:
// cat Sponza.gltf | sed -E 's/\.(jpg|png)/.\1.dds/g' | sed -E 's/(image\/jpeg|image\/png)/image\/vnd-ms.dds/g' > Sponza-dds.gltf
const SAMPLE_GLTF_SPONZA_DDS = "https://raw.githubusercontent.com/ikatson/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza-dds.gltf";


/***/ }),

/***/ "./src/deferredRenderer.ts":
/*!*********************************!*\
  !*** ./src/deferredRenderer.ts ***!
  \*********************************/
/*! exports provided: ShadowMapConfig, SSRConfig, DeferredRendererConfig, ShowLayer, showLayerAmong, StencilValues, StencilBits, withViewport, GBuffer, SSAORenderer, ShadowMapRenderer, LightingRenderer, DeferredRenderer */
/*! exports used: DeferredRenderer, DeferredRendererConfig, SSRConfig, ShadowMapConfig, ShowLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ShadowMapConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SSRConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DeferredRendererConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ShowLayer; });
/* unused harmony export showLayerAmong */
/* unused harmony export StencilValues */
/* unused harmony export StencilBits */
/* unused harmony export withViewport */
/* unused harmony export GBuffer */
/* unused harmony export SSAORenderer */
/* unused harmony export ShadowMapRenderer */
/* unused harmony export LightingRenderer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DeferredRenderer; });
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/mat4 */ "./node_modules/gl-matrix/src/gl-matrix/mat4.js");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./object */ "./src/object.ts");
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shaders */ "./src/shaders.ts");
/* harmony import */ var _shaders_final__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shaders/final */ "./src/shaders/final.ts");
/* harmony import */ var _shaders_gBuffer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shaders/gBuffer */ "./src/shaders/gBuffer.ts");
/* harmony import */ var _shaders_ssao__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shaders/ssao */ "./src/shaders/ssao.ts");
/* harmony import */ var _shaders_visualize_lights__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shaders/visualize-lights */ "./src/shaders/visualize-lights.ts");
/* harmony import */ var _SSAOState__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SSAOState */ "./src/SSAOState.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _shaders_shadowMap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shaders/shadowMap */ "./src/shaders/shadowMap.ts");
/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./material */ "./src/material.ts");
/* harmony import */ var _shaders_ssr__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./shaders/ssr */ "./src/shaders/ssr.ts");
/* harmony import */ var _shaders_includes_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shaders/includes/common */ "./src/shaders/includes/common.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");















class ShadowMapConfig {
    constructor() {
        this.fixedBias = 0.001;
        this.normalBias = 0.001;
    }
}
class SSRConfig {
}
class DeferredRendererConfig {
    constructor() {
        this.showLayer = ShowLayer.Final;
        this.normalMapsEnabled = true;
        this.albedoTexturesEnabled = true;
        this.ssao = new _SSAOState__WEBPACK_IMPORTED_MODULE_8__[/* SSAOConfig */ "a"]();
        this.shadowMap = new ShadowMapConfig();
        this.ssr = new SSRConfig();
    }
    showLayerAmong(...values) {
        return showLayerAmong(this.showLayer, ...values);
    }
}
var ShowLayer;
(function (ShowLayer) {
    ShowLayer[ShowLayer["Final"] = 1] = "Final";
    ShowLayer[ShowLayer["Positions"] = 2] = "Positions";
    ShowLayer[ShowLayer["Normals"] = 3] = "Normals";
    ShowLayer[ShowLayer["Color"] = 4] = "Color";
    ShowLayer[ShowLayer["SSAO"] = 5] = "SSAO";
    ShowLayer[ShowLayer["SSR"] = 6] = "SSR";
    ShowLayer[ShowLayer["ShadowMap"] = 7] = "ShadowMap";
    ShowLayer[ShowLayer["Metallic"] = 8] = "Metallic";
    ShowLayer[ShowLayer["Roughness"] = 9] = "Roughness";
})(ShowLayer || (ShowLayer = {}));
const showLayerAmong = (value, ...among) => {
    for (let i = 0; i < among.length; i++) {
        if (value === among[i]) {
            return true;
        }
    }
};
var StencilValues;
(function (StencilValues) {
    StencilValues[StencilValues["NORMAL"] = 1] = "NORMAL";
    StencilValues[StencilValues["SSR"] = 2] = "SSR";
})(StencilValues || (StencilValues = {}));
var StencilBits;
(function (StencilBits) {
    StencilBits[StencilBits["TEMP"] = 128] = "TEMP";
})(StencilBits || (StencilBits = {}));
function bindUniformTx(gl, shader, uniformName, tx, index) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.uniform1i(shader.getUniformLocation(gl, uniformName), index);
}
function createAndBindBufferTexture(gl, internalFormat, format, type, x, y, filtering) {
    x = x || gl.canvas.width;
    y = y || gl.canvas.height;
    filtering = filtering || gl.NEAREST;
    let tx = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, x, y, 0, format, type, null);
    return tx;
}
function withViewport(gl, x, y, callback) {
    let needReverse = false;
    if (gl.canvas.width != x || gl.canvas.height != y) {
        gl.viewport(0, 0, x, y);
        needReverse = true;
    }
    const result = callback();
    if (needReverse) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    return result;
}
class GBuffer {
    constructor(gl, rendererConfig) {
        this.defaultMaterial = new _material__WEBPACK_IMPORTED_MODULE_11__[/* Material */ "a"]();
        this.ATTACHMENT_POSITION = WebGL2RenderingContext.COLOR_ATTACHMENT0;
        this.ATTACHMENT_NORMAL = WebGL2RenderingContext.COLOR_ATTACHMENT0 + 1;
        this.ATTACHMENT_ALBEDO = WebGL2RenderingContext.COLOR_ATTACHMENT0 + 2;
        this.ATTACHMENT_METALLIC_ROUGHNESS = WebGL2RenderingContext.COLOR_ATTACHMENT0 + 3;
        this.config = rendererConfig;
        this.setupGBuffer(gl);
        this.compileShader(gl);
    }
    render(gl, camera, scene) {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.gFrameBuffer);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilMask(0x0f);
        const s = this.gBufferShader;
        s.use(gl);
        gl.uniform3fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_CAMERA_POSITION */ "f"]), camera.position);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_WORLD_TO_CAMERA_MAT4 */ "p"]), false, camera.getWorldToCamera());
        gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_PERSPECTIVE_MATRIX */ "o"]), false, camera.projectionMatrix().matrix);
        gl.drawBuffers([
            this.ATTACHMENT_POSITION,
            this.ATTACHMENT_NORMAL,
            this.ATTACHMENT_ALBEDO,
            this.ATTACHMENT_METALLIC_ROUGHNESS
        ]);
        gl.disable(gl.BLEND);
        for (let i = 0; i < scene.children.length; i++) {
            this.renderObject(gl, scene.children[i], camera);
        }
        // restore state.
        gl.disable(gl.STENCIL_TEST);
    }
    bindValueOrTx(gl, prefix, txOrValue, uniformFunc, index) {
        const s = this.gBufferShader;
        const valueName = prefix;
        const hasTxName = prefix + "HasTexture";
        const txName = prefix + "Texture";
        const hasFactorName = prefix + "HasFactor";
        const factorName = prefix + "Factor";
        gl[uniformFunc](s.getUniformLocation(gl, valueName), txOrValue.value);
        let hasTexture = txOrValue.hasTexture();
        if (prefix == "u_albedo" && !this.config.albedoTexturesEnabled) {
            hasTexture = false;
        }
        gl.uniform1i(s.getUniformLocation(gl, hasTxName), hasTexture ? 1 : 0);
        if (hasTexture) {
            bindUniformTx(gl, s, txName, txOrValue.texture.getTexture(), index);
        }
        const hasFactor = txOrValue.hasFactor();
        gl.uniform1i(s.getUniformLocation(gl, hasFactorName), hasFactor ? 1 : 0);
        if (hasFactor) {
            gl[uniformFunc](s.getUniformLocation(gl, factorName), txOrValue.factor);
        }
    }
    renderObject(gl, o, camera) {
        const s = this.gBufferShader;
        if (o.mesh != null) {
            const modelWorldMatrix = o.transform.getModelToWorld();
            const modelViewMatrix = _utils__WEBPACK_IMPORTED_MODULE_9__[/* tmpMat4 */ "k"];
            const material = o.material ? o.material.material : this.defaultMaterial;
            gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* multiply */ "g"](modelViewMatrix, camera.getWorldToCamera(), modelWorldMatrix);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_MODEL_VIEW_MATRIX */ "m"]), false, modelViewMatrix);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_MODEL_WORLD_MATRIX */ "n"]), false, modelWorldMatrix);
            this.bindValueOrTx(gl, "u_albedo", material.albedo, 'uniform4fv', 1);
            this.bindValueOrTx(gl, "u_metallic", material.metallic, 'uniform1f', 2);
            this.bindValueOrTx(gl, "u_roughness", material.roughness, 'uniform1f', 3);
            const hasNormalMap = !!material.normalMap && this.config.normalMapsEnabled;
            gl.uniform1i(s.getUniformLocation(gl, "u_normalMapHasTexture"), (hasNormalMap) ? 1 : 0);
            if (hasNormalMap) {
                bindUniformTx(gl, s, "u_normalMapTx", material.normalMap.getTexture(), 4);
            }
            gl.uniform1i(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_HAS_TANGENT */ "l"]), o.mesh.primitives[0].hasTangent() ? 1 : 0);
            /**
             * TODO: remove stencils? Not sure, maybe there will be some use for it later.
             * @deprecated
             */
            let stencilValue = StencilValues.NORMAL;
            if (material.isReflective) {
                stencilValue = StencilValues.SSR;
            }
            // always pass and overwrite the stencil value.
            gl.stencilFunc(gl.ALWAYS, stencilValue, 0xff);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
            o.mesh.draw(gl);
            if (o.boundingBoxComponent && o.boundingBoxComponent.visible) {
                const buf = o.boundingBoxComponent.asArrayBuffer(gl);
                buf.draw(gl);
            }
        }
        for (let i = 0; i < o.children.length; i++) {
            this.renderObject(gl, o.children[i], camera);
        }
    }
    ;
    compileShader(gl) {
        this.gBufferShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* VertexShader */ "d"](gl, _shaders_gBuffer__WEBPACK_IMPORTED_MODULE_5__[/* GBUFFER_SHADER_SOURCE */ "a"].vs), new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_gBuffer__WEBPACK_IMPORTED_MODULE_5__[/* GBUFFER_SHADER_SOURCE */ "a"].fs));
    }
    setupGBuffer(gl) {
        this.albedoTX = createAndBindBufferTexture(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        this.metallicRoughnessTX = createAndBindBufferTexture(gl, gl.RG16F, gl.RG, gl.HALF_FLOAT);
        // uncomment to have 16-bit float normals RG
        // NOT ENOUGH PRECISION, SSR texture jumps around when restoring Z from.
        // this.normalTX = createAndBindBufferTexture(gl, gl.RG16F, gl.RG, gl.HALF_FLOAT);
        // NOT ENOUGH PRECISION (although better than RG16F)
        // uncomment to have 8-bit integer normals.
        // this.normalTX = createAndBindBufferTexture(gl, gl.RGB8, gl.RGB, gl.UNSIGNED_BYTE);
        // uncomment to have 32-bit float normals RG.
        this.normalTX = createAndBindBufferTexture(gl, gl.RG32F, gl.RG, gl.FLOAT);
        this.posTx = createAndBindBufferTexture(gl, gl.RGBA16F, gl.RGBA, gl.FLOAT);
        this.depthTX = createAndBindBufferTexture(gl, gl.DEPTH24_STENCIL8, gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8);
        this.gFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.gFrameBuffer);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_POSITION, gl.TEXTURE_2D, this.posTx, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_NORMAL, gl.TEXTURE_2D, this.normalTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_ALBEDO, gl.TEXTURE_2D, this.albedoTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_METALLIC_ROUGHNESS, gl.TEXTURE_2D, this.metallicRoughnessTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, this.depthTX, 0);
        checkFrameBufferStatusOrThrow(gl);
    }
}
class SSAORenderer {
    constructor(gl, ssaoParameters, ssaoConfig, gBuffer, fullScreenQuad) {
        this.ssaoConfig = ssaoConfig;
        this.gBuffer = gBuffer;
        this.fullScreenQuad = fullScreenQuad;
        // this.width = gl.canvas.width / 4.0;
        // this.height = gl.canvas.height / 4.0;
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        this.setupSSAOBuffers(gl, ssaoParameters);
        this.recompileShaders(gl);
    }
    get ssaoTx() {
        return this._ssaoBlurTx;
    }
    onChangeSSAOState(gl) {
        this.recompileShaders(gl);
    }
    recompileShaders(gl) {
        [this.firstPassShader, this.blurShader].forEach(s => {
            if (s) {
                s.deleteAll(gl);
            }
        });
        // FIRST PASS SHADER
        this.firstPassShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, this.fullScreenQuad.vertexShader, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_ssao__WEBPACK_IMPORTED_MODULE_6__[/* SSAO_SHADER_SOURCE */ "a"].first_pass_fs
            .clone()
            .define("SSAO_SAMPLES", this.ssaoConfig.sampleCount.toString())
            .build()));
        this.firstPassShader.use(gl);
        // BLUR SHADER
        this.blurShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, this.fullScreenQuad.vertexShader, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_ssao__WEBPACK_IMPORTED_MODULE_6__[/* SSAO_SHADER_SOURCE */ "a"].blur_pass_fs
            .clone()
            .define("SSAO_NOISE_SCALE", this.ssaoConfig.noiseScale.toString())
            .define("SSAO_TEXEL_SIZE_X", this.width.toString())
            .define("SSAO_TEXEL_SIZE_Y", this.height.toString())
            .build()));
        this.blurShader.use(gl);
    }
    render(gl, camera) {
        const firstPass = () => {
            const s = this.firstPassShader;
            s.use(gl);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.firstPassFB);
            gl.clearColor(0., 0, 0, 1.);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.fullScreenQuad.bind(gl);
            // Common uniforms
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_WORLD_TO_CAMERA_MAT4 */ "p"]), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_PERSPECTIVE_MATRIX */ "o"]), false, camera.projectionMatrix().matrix);
            // SSAOState
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoRadius"), this.ssaoConfig.radius);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBias"), this.ssaoConfig.bias);
            gl.uniform3fv(s.getUniformLocation(gl, "u_ssaoSamples"), this.ssaoState.tangentSpaceSamples);
            gl.uniform2fv(s.getUniformLocation(gl, "u_ssaoNoiseScale"), [this.width / this.ssaoConfig.noiseScale, this.height / this.ssaoConfig.noiseScale]);
            bindUniformTx(gl, this.firstPassShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_POSITION */ "k"], this.gBuffer.posTx, 0);
            bindUniformTx(gl, this.firstPassShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_NORMAL */ "j"], this.gBuffer.normalTX, 1);
            bindUniformTx(gl, this.firstPassShader, "u_ssaoNoise", this.ssaoState.noiseTexture, 2);
            // Draw
            withViewport(gl, this.width, this.height, () => {
                this.fullScreenQuad.draw(gl);
            });
        };
        const blurPass = () => {
            const s = this.blurShader;
            s.use(gl);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.blurPassFB);
            gl.clearColor(0., 0, 0, 1.);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.fullScreenQuad.bind(gl);
            // Common uniforms
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_WORLD_TO_CAMERA_MAT4 */ "p"]), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_PERSPECTIVE_MATRIX */ "o"]), false, camera.projectionMatrix().matrix);
            // SSAOState
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoStrength"), this.ssaoConfig.strength);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBias"), this.ssaoConfig.bias);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBlurPositionThreshold"), this.ssaoConfig.blurPositionThreshold);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBlurNormalThreshold"), this.ssaoConfig.blurNormalThreshold);
            gl.uniform3fv(s.getUniformLocation(gl, "u_ssaoSamples"), this.ssaoState.tangentSpaceSamples);
            gl.uniform2fv(s.getUniformLocation(gl, "u_ssaoNoiseScale"), [gl.canvas.width / this.ssaoConfig.noiseScale, gl.canvas.height / this.ssaoConfig.noiseScale]);
            bindUniformTx(gl, this.blurShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_POSITION */ "k"], this.gBuffer.posTx, 0);
            bindUniformTx(gl, this.blurShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_NORMAL */ "j"], this.gBuffer.normalTX, 1);
            bindUniformTx(gl, this.blurShader, "u_ssaoNoise", this.ssaoState.noiseTexture, 2);
            bindUniformTx(gl, this.blurShader, "u_ssaoFirstPassTx", this._ssaoFirstPassTx, 3);
            this.fullScreenQuad.draw(gl);
        };
        firstPass();
        blurPass();
    }
    setupSSAOBuffers(gl, ssaoState) {
        this.ssaoState = ssaoState;
        this.firstPassFB = gl.createFramebuffer();
        this._ssaoFirstPassTx = createAndBindBufferTexture(gl, gl.R16F, gl.RED, gl.HALF_FLOAT, this.width, this.height);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.firstPassFB);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._ssaoFirstPassTx, 0);
        checkFrameBufferStatusOrThrow(gl);
        this.blurPassFB = gl.createFramebuffer();
        this._ssaoBlurTx = createAndBindBufferTexture(gl, gl.R16F, gl.RED, gl.HALF_FLOAT);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.blurPassFB);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._ssaoBlurTx, 0);
        checkFrameBufferStatusOrThrow(gl);
    }
}
class ShadowMapRenderer {
    constructor(gl) {
        this.setupShadowMapBuffers(gl);
        this.recompileShaders(gl);
    }
    get shadowMapTx() {
        return this._shadowMapTx;
    }
    get shadowMapWidth() {
        return this._shadowMapWidth;
    }
    get shadowMapHeight() {
        return this._shadowMapHeight;
    }
    render(gl, lightCameraWorldToProjectionMatrix, scene) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        const s = this.shadowMapShader;
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.shadowMapFB);
        gl.clearColor(0., 0, 0., 1.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        s.use(gl);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_lightCameraWorldToProjectionMatrix"), false, lightCameraWorldToProjectionMatrix.matrix);
        const drawObject = (o) => {
            o.children.forEach(drawObject);
            if (!o.mesh) {
                return;
            }
            if (!o.mesh.shadowCaster && !o.mesh.shadowReceiver) {
                return;
            }
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_MODEL_WORLD_MATRIX */ "n"]), false, o.transform.getModelToWorld());
            o.mesh.draw(gl);
        };
        withViewport(gl, this._shadowMapWidth, this._shadowMapHeight, () => {
            scene.children.forEach(drawObject);
        });
    }
    recompileShaders(gl) {
        this.shadowMapShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* VertexShader */ "d"](gl, _shaders_shadowMap__WEBPACK_IMPORTED_MODULE_10__[/* SHADOWMAP_SHADERS */ "a"].vs
            .build()), new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_shadowMap__WEBPACK_IMPORTED_MODULE_10__[/* SHADOWMAP_SHADERS */ "a"].fs
            .build()));
    }
    setupShadowMapBuffers(gl) {
        this._shadowMapWidth = 2048;
        this._shadowMapHeight = 2048;
        this._shadowMapTx = createAndBindBufferTexture(gl, gl.DEPTH_COMPONENT16, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, this._shadowMapWidth, this._shadowMapHeight, gl.NEAREST);
        this.shadowMapFB = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.shadowMapFB);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._shadowMapTx, 0);
        checkFrameBufferStatusOrThrow(gl);
    }
}
class LightingRenderer {
    constructor(gl, config, fullScreenQuad, gBuffer, ssaoRenderer, shadowMapRenderer, sphereMesh) {
        this.showBuffersShader = null;
        this.directionalLightShader = null;
        this.pointLightShader = null;
        this._recompileOnNextRun = true;
        this.fullScreenQuad = fullScreenQuad;
        this.gBuffer = gBuffer;
        this.ssaoRenderer = ssaoRenderer;
        this.shadowMapRenderer = shadowMapRenderer;
        this.sphereObject = new _object__WEBPACK_IMPORTED_MODULE_2__[/* GameObjectBuilder */ "d"]("sphere")
            .setMeshComponent(new _object__WEBPACK_IMPORTED_MODULE_2__[/* MeshComponent */ "f"](sphereMesh))
            .build();
        this.config = config;
        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        this.resultTX = createAndBindBufferTexture(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.resultTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, this.gBuffer.depthTX, 0);
        checkFrameBufferStatusOrThrow(gl);
        this.visualizeLightsShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* VertexShader */ "d"](gl, _shaders_visualize_lights__WEBPACK_IMPORTED_MODULE_7__[/* VISUALIZE_LIGHTS_SHADERS */ "a"].vs.build()), new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_visualize_lights__WEBPACK_IMPORTED_MODULE_7__[/* VISUALIZE_LIGHTS_SHADERS */ "a"].FS.build()));
        this.recompileOnNextRun();
    }
    recompileOnNextRun() {
        this._recompileOnNextRun = true;
    }
    recompileShaders(gl) {
        [this.showBuffersShader, this.pointLightShader, this.directionalLightShader].forEach(s => {
            if (s) {
                s.deleteAll(gl);
            }
        });
        this.showBuffersShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, this.fullScreenQuad.vertexShader, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_final__WEBPACK_IMPORTED_MODULE_4__[/* FINAL_SHADER_SOURCE */ "a"].showLayerFS
            .clone()
            .define('SCREEN_WIDTH', gl.canvas.width.toString())
            .define('SCREEN_HEIGHT', gl.canvas.height.toString())
            .define('SHADOW_MAP_WIDTH', `${this.shadowMapRenderer.shadowMapWidth}.`)
            .define('SHADOW_MAP_HEIGHT', `${this.shadowMapRenderer.shadowMapHeight}.`)
            .defineIfTrue('SSAO_ENABLED', this.config.ssao.isEnabled())
            .defineIfTrue('SHADOWMAP_ENABLED', this.config.shadowMap.enabled)
            .defineIfTrue('SHOW_SSAO', this.config.showLayer === ShowLayer.SSAO)
            .defineIfTrue('SHOW_COLORS', this.config.showLayer === ShowLayer.Color)
            .defineIfTrue('SHOW_POSITIONS', this.config.showLayer === ShowLayer.Positions)
            .defineIfTrue('SHOW_SHADOWMAP', this.config.showLayer === ShowLayer.ShadowMap)
            .defineIfTrue('SHOW_NORMALS', this.config.showLayer === ShowLayer.Normals)
            .defineIfTrue('SHOW_METALLIC', this.config.showLayer === ShowLayer.Metallic)
            .defineIfTrue('SHOW_ROUGHNESS', this.config.showLayer === ShowLayer.Roughness)
            .build()));
        this.showBuffersShader.use(gl);
        this.directionalLightShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, this.fullScreenQuad.vertexShader, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_final__WEBPACK_IMPORTED_MODULE_4__[/* FINAL_SHADER_SOURCE */ "a"].fs
            .clone()
            .define('SCREEN_WIDTH', gl.canvas.width.toString())
            .define('SCREEN_HEIGHT', gl.canvas.height.toString())
            .define('SHADOW_MAP_WIDTH', `${this.shadowMapRenderer.shadowMapWidth}.`)
            .define('SHADOW_MAP_HEIGHT', `${this.shadowMapRenderer.shadowMapHeight}.`)
            .define('AMBIENT_CONSTANT_HACK', '0.03')
            .define('DIRECTIONAL_LIGHT', '')
            .defineIfTrue('SSAO_ENABLED', this.config.ssao.isEnabled())
            .defineIfTrue('SHADOWMAP_ENABLED', this.config.shadowMap.enabled)
            .build()));
        this.directionalLightShader.use(gl);
        this.pointLightShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* VertexShader */ "d"](gl, _shaders_final__WEBPACK_IMPORTED_MODULE_4__[/* FINAL_SHADER_SOURCE */ "a"].pointLightSphere.build()), new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_final__WEBPACK_IMPORTED_MODULE_4__[/* FINAL_SHADER_SOURCE */ "a"].fs
            .clone()
            .define('SCREEN_WIDTH', gl.canvas.width.toString())
            .define('SCREEN_HEIGHT', gl.canvas.height.toString())
            .define('SHADOW_MAP_WIDTH', `${this.shadowMapRenderer.shadowMapWidth}.`)
            .define('SHADOW_MAP_HEIGHT', `${this.shadowMapRenderer.shadowMapHeight}.`)
            .define('AMBIENT_CONSTANT_HACK', '0.03')
            .define('POINT_LIGHT', '')
            .defineIfTrue('SSAO_ENABLED', this.config.ssao.isEnabled())
            // .defineIfTrue('SHADOWMAP_ENABLED', this.config.shadowMap.enabled)
            .build()));
        this.pointLightShader.use(gl);
        bindUniformTx(gl, this.pointLightShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_POSITION */ "k"], this.gBuffer.posTx, 0);
        bindUniformTx(gl, this.pointLightShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_NORMAL */ "j"], this.gBuffer.normalTX, 1);
        bindUniformTx(gl, this.pointLightShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_ALBEDO */ "h"], this.gBuffer.albedoTX, 2);
        bindUniformTx(gl, this.pointLightShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_MR */ "i"], this.gBuffer.metallicRoughnessTX, 3);
        bindUniformTx(gl, this.pointLightShader, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
        bindUniformTx(gl, this.pointLightShader, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);
        this._recompileOnNextRun = false;
    }
    render(gl, scene, camera) {
        if (this._recompileOnNextRun) {
            this.recompileShaders(gl);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        // No need for depth test when rendering full-screen framebuffers.
        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1.);
        // NO depth clearing here.
        // No stencil clearing too as it may contain important information in bits other than TEMP.
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (!this.config.showLayerAmong(ShowLayer.Final, ShowLayer.SSR)) {
            if (this.config.showLayer === ShowLayer.ShadowMap) {
                this.shadowMapRenderer.render(gl, Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* computeDirectionalLightCameraWorldToProjectionMatrix */ "b"])(scene.directionalLights[0], camera, scene, _utils__WEBPACK_IMPORTED_MODULE_9__[/* tmpProjectionMatrix */ "l"]), scene);
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
            }
            const s = this.showBuffersShader.use(gl);
            bindUniformTx(gl, this.showBuffersShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_POSITION */ "k"], this.gBuffer.posTx, 0);
            bindUniformTx(gl, this.showBuffersShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_NORMAL */ "j"], this.gBuffer.normalTX, 1);
            bindUniformTx(gl, this.showBuffersShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_ALBEDO */ "h"], this.gBuffer.albedoTX, 2);
            bindUniformTx(gl, this.showBuffersShader, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_MR */ "i"], this.gBuffer.metallicRoughnessTX, 3);
            bindUniformTx(gl, this.showBuffersShader, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
            bindUniformTx(gl, this.showBuffersShader, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);
            this.fullScreenQuad.draw(gl);
            return;
        }
        gl.enable(gl.STENCIL_TEST);
        const setStencilOnlyNormal = () => {
            gl.stencilFunc(gl.EQUAL, StencilValues.NORMAL, 0x0f);
            gl.stencilMask(0x00);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        };
        setStencilOnlyNormal();
        scene.directionalLights.forEach((light, i) => {
            let lightCameraWorldToProjectionMatrix = null;
            if (this.config.shadowMap.enabled) {
                lightCameraWorldToProjectionMatrix = Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* computeDirectionalLightCameraWorldToProjectionMatrix */ "b"])(light, camera, scene, _utils__WEBPACK_IMPORTED_MODULE_9__[/* tmpProjectionMatrix */ "l"]);
                gl.disable(gl.STENCIL_TEST);
                this.shadowMapRenderer.render(gl, lightCameraWorldToProjectionMatrix, scene);
                // Bind back the null framebuffer.
                gl.disable(gl.DEPTH_TEST);
                gl.enable(gl.STENCIL_TEST);
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
            }
            gl.enable(gl.BLEND);
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
            gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
            let s = this.directionalLightShader;
            s.use(gl);
            // Shadow map stuff
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapFixedBias"), this.config.shadowMap.fixedBias);
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapNormalBias"), this.config.shadowMap.normalBias);
            // Common uniforms
            gl.uniform3fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_CAMERA_POSITION */ "f"]), camera.position);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_WORLD_TO_CAMERA_MAT4 */ "p"]), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_PERSPECTIVE_MATRIX */ "o"]), false, camera.projectionMatrix().matrix);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_CAMERA_TO_WORLD_MAT4 */ "g"]), false, camera.getCameraToWorld());
            if (this.config.shadowMap.enabled) {
                const cameraViewSpaceToLightCamera = _utils__WEBPACK_IMPORTED_MODULE_9__[/* tmpMat4 */ "k"];
                gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* multiply */ "g"](cameraViewSpaceToLightCamera, lightCameraWorldToProjectionMatrix.matrix, camera.getCameraToWorld());
                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_cameraViewSpaceToLightCamera"), false, cameraViewSpaceToLightCamera);
                gl.uniform1f(s.getUniformLocation(gl, "u_lightNear"), lightCameraWorldToProjectionMatrix.near);
                gl.uniform1f(s.getUniformLocation(gl, "u_lightFar"), lightCameraWorldToProjectionMatrix.far);
            }
            gl.uniform3fv(s.getUniformLocation(gl, "u_lightData"), this.generateDirectionalLightData(light));
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_POSITION */ "k"], this.gBuffer.posTx, 0);
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_NORMAL */ "j"], this.gBuffer.normalTX, 1);
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_ALBEDO */ "h"], this.gBuffer.albedoTX, 2);
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_MR */ "i"], this.gBuffer.metallicRoughnessTX, 3);
            bindUniformTx(gl, s, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
            bindUniformTx(gl, s, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);
            this.fullScreenQuad.draw(gl);
        });
        const renderPointLights = () => {
            const s = this.pointLightShader;
            const obj = new _object__WEBPACK_IMPORTED_MODULE_2__[/* GameObject */ "c"]("sphere");
            const tc = obj.transform;
            const modelView = _utils__WEBPACK_IMPORTED_MODULE_9__[/* tmpMat4 */ "k"];
            s.use(gl);
            gl.enable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.STENCIL_TEST);
            gl.stencilMask(StencilBits.TEMP);
            gl.depthMask(false);
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
            gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
            // Shadow map stuff
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapFixedBias"), this.config.shadowMap.fixedBias);
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapNormalBias"), this.config.shadowMap.normalBias);
            // Common uniforms
            gl.uniform3fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_CAMERA_POSITION */ "f"]), camera.position);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_WORLD_TO_CAMERA_MAT4 */ "p"]), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_PERSPECTIVE_MATRIX */ "o"]), false, camera.projectionMatrix().matrix);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_CAMERA_TO_WORLD_MAT4 */ "g"]), false, camera.getCameraToWorld());
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_POSITION */ "k"], this.gBuffer.posTx, 0);
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_NORMAL */ "j"], this.gBuffer.normalTX, 1);
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_ALBEDO */ "h"], this.gBuffer.albedoTX, 2);
            bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_MR */ "i"], this.gBuffer.metallicRoughnessTX, 3);
            bindUniformTx(gl, s, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
            bindUniformTx(gl, s, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);
            scene.pointLights.forEach(light => {
                // NO shadow map support yet.
                gl.uniform3fv(s.getUniformLocation(gl, "u_lightData"), this.generatePointLightData(light));
                // 2 is because the sphere mesh is of diameter 1 (radius 0.5), so we scale it to radius = 1.
                // 2.1 is to round the imperfect sphere shape, as it is very low poly.
                const scale = (light.radius) * 2.1;
                tc.scale = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* fromValues */ "f"](scale, scale, scale);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* copy */ "b"](tc.position, light.object.transform.position);
                tc.update();
                gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* multiply */ "g"](modelView, camera.getWorldToCamera(), tc.getModelToWorld());
                gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_MODEL_VIEW_MATRIX */ "m"]), false, modelView);
                gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_WORLD_TO_CAMERA_MAT4 */ "p"]), false, camera.getWorldToCamera());
                // https://kayru.org/articles/deferred-stencil/
                // first pass
                gl.depthFunc(gl.LEQUAL);
                gl.cullFace(gl.BACK);
                gl.colorMask(false, false, false, false);
                // stencil function will ALWAYS pass, BUT it will set the TEMP bit
                // for all front-facing faces that are occluded by scene geometry.
                // if they are occluded, it's not possible for them to be lighted.
                // this is used in the second pass.
                gl.stencilFunc(gl.ALWAYS, StencilBits.TEMP, StencilBits.TEMP);
                gl.stencilOp(gl.KEEP, gl.REPLACE, gl.KEEP);
                this.sphereObject.mesh.primitives[0].draw(gl);
                // second pass
                gl.depthFunc(gl.GEQUAL);
                gl.cullFace(gl.FRONT);
                gl.colorMask(true, true, true, true);
                // only renders the BACK parts of the light that ARE occluded by scene geometry (using GEQUAL depth func)
                // BUT WHERE the front part of the sphere is NOT occluded by scene geometry using the TEMP bit
                // from the previous pass.
                // essentially this only will light up the pixels that are within the volume light's sphere.
                gl.stencilFunc(gl.EQUAL, StencilValues.NORMAL, StencilBits.TEMP | 0x0f);
                gl.stencilOp(gl.ZERO, gl.ZERO, gl.ZERO);
                this.sphereObject.mesh.primitives[0].draw(gl);
            });
            // Restore state.
            gl.depthMask(true);
            gl.depthFunc(gl.LEQUAL);
            gl.disable(gl.STENCIL_TEST);
            gl.stencilMask(0xff);
            gl.cullFace(gl.BACK);
        };
        renderPointLights();
        // if (this.config.showLayer === ShowLayer.Final) {
        //     this.renderLightVolumes(gl, camera, scene);
        // }
    }
    // private renderLightVolumes(gl: WebGL2RenderingContext, camera: Camera, scene: Scene) {
    //     const s = this.visualizeLightsShader;
    //     gl.useProgram(s.getProgram());
    //
    //     gl.uniformMatrix4fv(s.getUniformLocation(gl, UNIFORM_WORLD_TO_CAMERA_MAT4), false, camera.getWorldToCamera());
    //     gl.uniformMatrix4fv(s.getUniformLocation(gl, UNIFORM_PERSPECTIVE_MATRIX), false, camera.projectionMatrix().matrix);
    //
    //     this.sphereMesh.prepareMeshVertexAndShaderDataForRendering(gl, s);
    //
    //     gl.enable(gl.DEPTH_TEST);
    //     gl.enable(gl.BLEND);
    //     gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //     gl.clear(gl.DEPTH_BUFFER_BIT);
    //
    //     bindUniformTx(gl, s, "u_posTexture", this.gBuffer.posTx, 0);
    //
    //     scene.pointLights.forEach(light => {
    //         const modelWorldMatrix = light.transform.getModelToWorld();
    //         const modelViewMatrix = tmpMat4;
    //
    //         mat4.multiply(modelViewMatrix, camera.getWorldToCamera(), modelWorldMatrix);
    //
    //         gl.uniform3fv(s.getUniformLocation(gl, "u_color"), light.light.diffuse);
    //         gl.uniform1f(s.getUniformLocation(gl, "u_intensity"), light.light.intensity);
    //         gl.uniformMatrix4fv(s.getUniformLocation(gl, UNIFORM_MODEL_VIEW_MATRIX), false, modelViewMatrix);
    //         gl.uniformMatrix4fv(s.getUniformLocation(gl, UNIFORM_MODEL_WORLD_MATRIX), false, modelWorldMatrix);
    //
    //         this.sphereMesh.draw(gl);
    //     })
    // }
    generateDirectionalLightData(l) {
        let result = [];
        result.push(...l.direction);
        result.push(...l.color);
        // the 2 zeroes are unused.
        result.push(l.intensity, 0, 0);
        return new Float32Array(result);
    }
    generatePointLightData(l) {
        let result = [];
        result.push(...l.object.transform.position);
        result.push(...l.color);
        result.push(l.intensity, l.radius, 0);
        return new Float32Array(result);
    }
}
class SSRRenderer {
    constructor(gl, config, gbuffer, light, fullScreenQuad) {
        this.fullScreenQuad = fullScreenQuad;
        this.fb = gl.createFramebuffer();
        this.lightingRenderer = light;
        this.gbuffer = gbuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        this._resultTX = createAndBindBufferTexture(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._resultTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, gbuffer.depthTX, 0);
        checkFrameBufferStatusOrThrow(gl);
        this.shader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, fullScreenQuad.vertexShader, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, _shaders_ssr__WEBPACK_IMPORTED_MODULE_12__[/* SSR_SHADERS */ "a"].fs
            .define('SSR_STEPS', '90')
            .define('SSR_STEP_SIZE', '0.15')
            .define('SSR_BINARY_SEARCH_STEPS', '10')
            .build()));
        this.blendShader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, fullScreenQuad.vertexShader, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderSourceBuilder */ "c"]().addTopChunk(_shaders_includes_common__WEBPACK_IMPORTED_MODULE_13__[/* QUAD_FRAGMENT_INPUTS */ "b"]).addChunk(`
            uniform sampler2D u_lightedSceneTx;
            uniform sampler2D u_ssrTx;
            out vec4 color;
            void main() {
                vec4 l = texture(u_lightedSceneTx, tx_pos);
                vec4 s = texture(u_ssrTx, tx_pos);
                // color = vec4(max(l.rgb, s.rgb), l.a);
                // color = vec4(mix(l.rgb, max(s.rgb * s.a, l.rgb), s.a), l.a);
                color = vec4(mix(l.rgb, s.rgb, s.a), l.a);
            }
            `).build()));
    }
    get resultTX() {
        return this._resultTX;
    }
    render(gl, scene, camera) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST);
        // gl.enable(gl.STENCIL_TEST);
        // gl.stencilMask(0x00);
        // gl.stencilFunc(gl.EQUAL, StencilValues.SSR,0x0f);
        // gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        const s = this.shader;
        s.use(gl);
        bindUniformTx(gl, s, "u_lightedSceneTx", this.lightingRenderer.resultTX, 0);
        bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_NORMAL */ "j"], this.gbuffer.normalTX, 1);
        bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_POSITION */ "k"], this.gbuffer.posTx, 2);
        bindUniformTx(gl, s, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_GBUF_MR */ "i"], this.gbuffer.metallicRoughnessTX, 3);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_WORLD_TO_CAMERA_MAT4 */ "p"]), false, camera.getWorldToCamera());
        gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_CAMERA_TO_WORLD_MAT4 */ "g"]), false, camera.getCameraToWorld());
        gl.uniformMatrix4fv(s.getUniformLocation(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* UNIFORM_PERSPECTIVE_MATRIX */ "o"]), false, camera.projectionMatrix().matrix);
        // full screen quad final draw
        this.fullScreenQuad.draw(gl);
    }
    blend(gl, targetFB) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, targetFB);
        const s = this.blendShader;
        s.use(gl);
        bindUniformTx(gl, s, "u_lightedSceneTx", this.lightingRenderer.resultTX, 0);
        bindUniformTx(gl, s, "u_ssrTx", this.resultTX, 1);
        this.fullScreenQuad.draw(gl);
    }
}
class CopierShader {
    constructor(gl, fullScreenQuad) {
        this._shader = new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderProgram */ "b"](gl, fullScreenQuad.vertexShader, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* FragmentShader */ "a"](gl, new _shaders__WEBPACK_IMPORTED_MODULE_3__[/* ShaderSourceBuilder */ "c"]().addTopChunk(_shaders_includes_common__WEBPACK_IMPORTED_MODULE_13__[/* QUAD_FRAGMENT_INPUTS */ "b"]).addChunk(`
            uniform sampler2D tx;
            out vec4 color;
            void main() {
                color = texture(tx, tx_pos);
            }
            `).build()));
    }
    get shader() {
        return this._shader;
    }
}
class TextureToFbCopier {
    constructor(gl, tx, targetFramebuffer, shader, fullScreenQuad) {
        this.tx = tx;
        this.targetFB = targetFramebuffer;
        this.fsq = fullScreenQuad;
        this.shader = shader;
    }
    copy(gl) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetFB);
        const s = this.shader.shader;
        s.use(gl);
        bindUniformTx(gl, s, "tx", this.tx, 0);
        this.fsq.draw(gl);
    }
}
class DeferredRenderer {
    constructor(gl, config, fullScreenQuad, sphere, ssaoState) {
        this.recompileOnNextRun = false;
        this.gl = gl;
        this._config = config;
        this.gbuffer = new GBuffer(gl, config);
        this.ssaoRenderer = new SSAORenderer(gl, ssaoState, this._config.ssao, this.gbuffer, fullScreenQuad);
        this.shadowMap = new ShadowMapRenderer(gl);
        this.lightingRenderer = new LightingRenderer(gl, this.config, fullScreenQuad, this.gbuffer, this.ssaoRenderer, this.shadowMap, sphere);
        this.ssr = new SSRRenderer(gl, this.config, this.gbuffer, this.lightingRenderer, fullScreenQuad);
        const copierShader = new CopierShader(gl, fullScreenQuad);
        this.finalToDefaultFB = new TextureToFbCopier(gl, this.lightingRenderer.resultTX, null, copierShader, fullScreenQuad);
        this.ssrToDefaultFB = new TextureToFbCopier(gl, this.ssr.resultTX, null, copierShader, fullScreenQuad);
    }
    get config() {
        return this._config;
    }
    onChangeSSAOState() {
        this.ssaoRenderer.onChangeSSAOState(this.gl);
        this.lightingRenderer.recompileOnNextRun();
    }
    recompileShaders() {
        this.recompileOnNextRun = true;
    }
    render(scene, camera) {
        const gl = this.gl;
        if (this.recompileOnNextRun) {
            this.ssaoRenderer.recompileShaders(gl);
            this.lightingRenderer.recompileOnNextRun();
            this.recompileOnNextRun = false;
        }
        this.gbuffer.render(gl, camera, scene);
        if (this._config.ssao.isEnabled()) {
            this.ssaoRenderer.render(gl, camera);
        }
        this.lightingRenderer.render(gl, scene, camera);
        if (this.config.ssr.enabled && this._config.showLayerAmong(ShowLayer.Final, ShowLayer.SSR)) {
            this.ssr.render(gl, scene, camera);
        }
        // TODO: move "show layers" to the end here, not to the lighting shader.
        // this.finalToDefaultFB.copy(gl);
        switch (this.config.ssr.enabled) {
            case true:
                switch (this.config.showLayer) {
                    case ShowLayer.Final:
                        gl.disable(gl.BLEND);
                        this.ssr.blend(gl, null);
                        // gl.clearColor(0, 0, 0, 1);
                        // gl.clear(gl.COLOR_BUFFER_BIT);
                        break;
                    case ShowLayer.SSR:
                        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                        gl.enable(gl.BLEND);
                        gl.clearColor(0, 0, 0, 1);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                        this.ssrToDefaultFB.copy(gl);
                        break;
                    default:
                        this.finalToDefaultFB.copy(gl);
                }
                break;
            case false:
                this.finalToDefaultFB.copy(gl);
                break;
        }
    }
}
function checkFrameBufferStatusOrThrow(gl) {
    // return true;
    const fbStatus = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
    if (fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
        switch (fbStatus) {
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            case gl.FRAMEBUFFER_UNSUPPORTED:
                throw new Error("gl.FRAMEBUFFER_UNSUPPORTED");
            case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
            case gl.RENDERBUFFER_SAMPLES:
                throw new Error("gl.RENDERBUFFER_SAMPLES");
            default:
                throw new Error("unknown error, but framebuffer is not complete. Error is " + fbStatus);
        }
    }
}


/***/ }),

/***/ "./src/errors.ts":
/*!***********************!*\
  !*** ./src/errors.ts ***!
  \***********************/
/*! exports provided: GLError, LinkError, ShaderLoadError */
/*! exports used: LinkError, ShaderLoadError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export GLError */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinkError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ShaderLoadError; });
class GLError extends Error {
}
class LinkError extends GLError {
}
class ShaderLoadError extends GLError {
}


/***/ }),

/***/ "./src/glArrayBuffer.ts":
/*!******************************!*\
  !*** ./src/glArrayBuffer.ts ***!
  \******************************/
/*! exports provided: ArrayBufferDataType, ArrayBufferDataTypeToGL, GLArrayBufferDataParams, computeBoundingBox, GLArrayBufferData, GlArrayBufferDataIterator, tmpIter, ArrayWebGLBufferWrapper, ElementArrayWebGLBufferWrapper, BufferView, GLTFAccessor, GLArrayBufferGLTF, GLArrayBufferV1 */
/*! exports used: ArrayBufferDataType, ArrayWebGLBufferWrapper, BufferView, ElementArrayWebGLBufferWrapper, GLArrayBufferData, GLArrayBufferDataParams, GLArrayBufferGLTF, GLArrayBufferV1, GLTFAccessor, computeBoundingBox, tmpIter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArrayBufferDataType; });
/* unused harmony export ArrayBufferDataTypeToGL */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return GLArrayBufferDataParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return computeBoundingBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return GLArrayBufferData; });
/* unused harmony export GlArrayBufferDataIterator */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return tmpIter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ArrayWebGLBufferWrapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ElementArrayWebGLBufferWrapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BufferView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return GLTFAccessor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return GLArrayBufferGLTF; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return GLArrayBufferV1; });
/* harmony import */ var _axisAlignedBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./axisAlignedBox */ "./src/axisAlignedBox.ts");
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec4 */ "./node_modules/gl-matrix/src/gl-matrix/vec4.js");
/* harmony import */ var _gltf_enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gltf-enums */ "./src/gltf-enums.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");






const FLOAT_BYTES = 4;
const VEC3 = 3;
const VEC4 = 4;
const UV_SIZE = 2;
const tmpVec1 = new Array(1);
const tmpVec4 = gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__[/* create */ "d"]();
var ArrayBufferDataType;
(function (ArrayBufferDataType) {
    ArrayBufferDataType[ArrayBufferDataType["TRIANGLES"] = WebGL2RenderingContext.TRIANGLES] = "TRIANGLES";
    ArrayBufferDataType[ArrayBufferDataType["LINES"] = WebGL2RenderingContext.LINES] = "LINES";
    ArrayBufferDataType[ArrayBufferDataType["LINE_STRIP"] = WebGL2RenderingContext.LINE_STRIP] = "LINE_STRIP";
    ArrayBufferDataType[ArrayBufferDataType["POINTS"] = WebGL2RenderingContext.POINTS] = "POINTS";
    ArrayBufferDataType[ArrayBufferDataType["TRIANGLE_STRIP"] = WebGL2RenderingContext.TRIANGLE_STRIP] = "TRIANGLE_STRIP";
})(ArrayBufferDataType || (ArrayBufferDataType = {}));
function ArrayBufferDataTypeToGL(a) {
    return a;
}
class GLArrayBufferDataParams {
    constructor(hasNormals, hasUVs, vertexCount, dataType) {
        // how many floats per element
        this.elementSize = VEC4;
        this.normalsSize = VEC4;
        this.uvSize = UV_SIZE;
        this.dataType = ArrayBufferDataType.TRIANGLES;
        this.hasNormals = hasNormals;
        this.hasUVs = hasUVs;
        this.vertexCount = vertexCount;
        this.dataType = dataType || this.dataType;
    }
    computeStrideInElements() {
        return this.computeStrideInBytes() / FLOAT_BYTES;
    }
    computeStrideInBytes() {
        let size = this.elementSize * FLOAT_BYTES;
        if (this.hasNormals) {
            size += this.normalsSize * FLOAT_BYTES;
        }
        if (this.hasUVs) {
            size += this.uvSize * FLOAT_BYTES;
        }
        return size;
    }
    computeNormalOffset() {
        return FLOAT_BYTES * this.elementSize;
    }
    computeUVOffset() {
        return this.computeNormalOffset() + (this.hasNormals ? this.normalsSize * FLOAT_BYTES : 0);
    }
}
const computeBoundingBox = (() => {
    const min = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* create */ "c"]();
    const max = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* create */ "c"]();
    const compareAndSet = (out, inp, offset, f) => {
        for (let i = 0; i < out.length; i++) {
            out[i] = f(out[i], inp[offset + i]);
        }
    };
    return (objects, invertZ = false, target, start) => {
        target = target || new _axisAlignedBox__WEBPACK_IMPORTED_MODULE_0__[/* AxisAlignedBox */ "a"]();
        if (start) {
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* copy */ "b"](min, start.min);
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* copy */ "b"](max, start.max);
        }
        else {
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* set */ "l"](min, Infinity, Infinity, Infinity);
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* set */ "l"](max, -Infinity, -Infinity, -Infinity);
        }
        for (let i = 0; i < objects.length; i++) {
            const o = objects[i];
            if (o === null) {
                continue;
            }
            if (o instanceof GLArrayBufferData) {
                for (const it of o.iterator(tmpIter)) {
                    compareAndSet(min, o.buf, it.vs, Math.min);
                    compareAndSet(max, o.buf, it.vs, Math.max);
                }
            }
            else if (o instanceof _axisAlignedBox__WEBPACK_IMPORTED_MODULE_0__[/* AxisAlignedBox */ "a"]) {
                compareAndSet(min, o.min, 0, Math.min);
                compareAndSet(max, o.max, 0, Math.max);
            }
        }
        target.setMin(min);
        target.setMax(max);
        return target;
    };
})();
class GLArrayBufferData {
    constructor(buf, params) {
        this.buf = buf;
        this.params = params;
    }
    intoGLArrayBuffer(gl) {
        return new GLArrayBufferV1(gl, this);
    }
    translate(matrix) {
        const result = new GLArrayBufferData(new Float32Array(this.buf.length), this.params);
        return this.translateTo(matrix, result);
    }
    translateInPlace(matrix) {
        this.translateToBuf(matrix, this.buf);
        return this;
    }
    translateToBuf(matrix, result) {
        for (const it of this.iterator(tmpIter)) {
            let l = it.ve - it.vs;
            if (l === 3) {
                _utils__WEBPACK_IMPORTED_MODULE_5__[/* tmpVec3 */ "m"][0] = this.buf[it.vs];
                _utils__WEBPACK_IMPORTED_MODULE_5__[/* tmpVec3 */ "m"][1] = this.buf[it.vs + 1];
                _utils__WEBPACK_IMPORTED_MODULE_5__[/* tmpVec3 */ "m"][2] = this.buf[it.vs + 2];
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* transformMat4 */ "n"](_utils__WEBPACK_IMPORTED_MODULE_5__[/* tmpVec3 */ "m"], _utils__WEBPACK_IMPORTED_MODULE_5__[/* tmpVec3 */ "m"], matrix);
                result.set(_utils__WEBPACK_IMPORTED_MODULE_5__[/* tmpVec3 */ "m"], it.vs);
            }
            else {
                tmpVec4[0] = this.buf[it.vs];
                tmpVec4[1] = this.buf[it.vs + 1];
                tmpVec4[2] = this.buf[it.vs + 2];
                tmpVec4[3] = this.buf[it.vs + 3];
                gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__[/* transformMat4 */ "o"](tmpVec4, tmpVec4, matrix);
                result.set(tmpVec4, it.vs);
            }
            // TODO: translate normals. this just copies normals and uvs back
            for (let i = it.ns; i < it.ue; i++) {
                result[i] = this.buf[i];
            }
        }
        return result;
    }
    translateTo(matrix, result) {
        this.translateToBuf(matrix, result.buf);
        result.params = this.params;
        return result;
    }
    computeBoundingBox(target) {
        tmpVec1[0] = this;
        return computeBoundingBox(tmpVec1, false, target);
    }
    iterator(outIter) {
        outIter = outIter || new GlArrayBufferDataIterator(this);
        outIter.initialize(this);
        return outIter;
    }
}
class GlArrayBufferDataIterator {
    constructor(data) {
        this.currentVertex = -1;
        this.initialize(data);
    }
    get done() {
        return this.currentVertex >= this.data.params.vertexCount;
    }
    get value() {
        if (!this.done) {
            return this;
        }
        return null;
    }
    initialize(data) {
        this.data = data;
        this.currentVertex = -1;
    }
    computeOffsets() {
        const p = this.data.params;
        const offset = this.currentVertex * p.computeStrideInElements();
        const noffset = offset + p.elementSize;
        const uvoffset = p.hasNormals ? noffset + p.normalsSize : noffset;
        this.vs = offset;
        this.ve = offset + p.elementSize;
        this.ns = noffset;
        this.ne = p.hasNormals ? noffset + p.normalsSize : noffset;
        this.us = uvoffset;
        this.ue = p.hasUVs ? uvoffset + p.uvSize : uvoffset;
    }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        this.currentVertex++;
        this.computeOffsets();
        return this;
    }
}
const tmpIter = new GlArrayBufferDataIterator(null);
class ArrayWebGLBufferWrapper {
    constructor(gl, data) {
        this._buf = gl.createBuffer();
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }
    buf() {
        return this._buf;
    }
    delete(gl) {
        gl.deleteBuffer(this._buf);
        this._buf = null;
    }
    target() {
        return WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
    }
}
class ElementArrayWebGLBufferWrapper {
    constructor(gl, data) {
        this._buf = gl.createBuffer();
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }
    buf() {
        return this._buf;
    }
    delete(gl) {
        gl.deleteBuffer(this._buf);
        this._buf = null;
    }
    target() {
        return WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
    }
}
class BufferView {
    constructor(buf, byteLength, byteOffset = 0, byteStride = 0) {
        this._buf = buf;
        this._byteLength = byteLength;
        this._byteOffset = byteOffset;
        this._byteStride = byteStride;
    }
    get byteLength() {
        return this._byteLength;
    }
    get byteOffset() {
        return this._byteOffset;
    }
    get byteStride() {
        return this._byteStride;
    }
    get buf() {
        return this._buf;
    }
}
class GLTFAccessor {
    constructor(accessor, data) {
        this._accessor = accessor;
        this._data = data;
    }
    get accessor() {
        return this._accessor;
    }
    get data() {
        return this._data;
    }
    get webGlBuf() {
        return this.data.buf.buf();
    }
    componentTypeToGlType() {
        return _gltf_enums__WEBPACK_IMPORTED_MODULE_3__[/* GLTF */ "a"].COMPONENT_TYPES_TO_GL_TYPE[this._accessor.componentType];
    }
    numberOfComponents() {
        switch (this._accessor.type) {
            case "SCALAR":
                return 1;
            case "VEC2":
                return 2;
            case "VEC3":
                return 3;
            case "VEC4":
                return 4;
            case "MAT2":
                return 4;
            case "MAT3":
                return 9;
            case "MAT4":
                return 16;
            default:
                throw new Error(`Unknown type ${this._accessor.type}`);
        }
    }
    setupVertexPointer(gl, attribLocation) {
        if (attribLocation === -1) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webGlBuf);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.numberOfComponents(), this.componentTypeToGlType(), this.accessor.normalized || false, this.data.byteStride, (this.data.byteOffset || 0) + (this.accessor.byteOffset || 0));
    }
}
class GLArrayBufferGLTF {
    constructor(gl, indices, position, uv, normal, tangent, boundingBox) {
        this.indices = indices;
        this.position = position;
        this.uv = uv;
        this.normal = normal;
        this.tangent = tangent;
        this.vao = this.prepareVAO(gl);
        this.bb = boundingBox;
    }
    getBoundingBox() {
        return this.bb;
    }
    delete(gl) {
        console.log('delete called on GLArrayBufferGLTF, not sure what to do');
    }
    draw(gl, renderMode) {
        if (renderMode === undefined) {
            renderMode = gl.TRIANGLES;
        }
        gl.bindVertexArray(this.vao);
        if (this.indices) {
            gl.drawElements(renderMode, this.indices.accessor.count, this.indices.componentTypeToGlType(), this.indices.accessor.byteOffset);
        }
        else {
            gl.drawArrays(renderMode, 0, this.position.accessor.count);
        }
    }
    hasNormals() {
        return !!this.normal;
    }
    hasTangent() {
        return !!this.tangent;
    }
    hasUV() {
        return !!this.uv;
    }
    prepareVAO(gl) {
        const arr = gl.createVertexArray();
        try {
            gl.bindVertexArray(arr);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.webGlBuf);
            const normals = !!this.normal;
            const uv = !!this.uv;
            const tangent = !!this.tangent;
            this.setupVertexPositionsPointer(gl, _constants__WEBPACK_IMPORTED_MODULE_4__[/* ATTRIBUTE_POSITION_LOC */ "b"]);
            if (normals) {
                this.setupVertexNormalsPointer(gl, _constants__WEBPACK_IMPORTED_MODULE_4__[/* ATTRIBUTE_NORMALS_LOC */ "a"]);
            }
            if (uv) {
                this.setupVertexUVPointer(gl, _constants__WEBPACK_IMPORTED_MODULE_4__[/* ATTRIBUTE_UV_LOC */ "d"]);
            }
            if (tangent) {
                this.setupTangentPointer(gl, _constants__WEBPACK_IMPORTED_MODULE_4__[/* ATTRIBUTE_TANGENT_LOC */ "c"]);
            }
        }
        catch (e) {
            gl.deleteVertexArray(arr);
            throw e;
        }
        return arr;
    }
    setupVertexNormalsPointer(gl, attribLocation) {
        this.normal.setupVertexPointer(gl, attribLocation);
    }
    setupVertexPositionsPointer(gl, attribLocation) {
        this.position.setupVertexPointer(gl, attribLocation);
    }
    setupVertexUVPointer(gl, attribLocation) {
        this.uv.setupVertexPointer(gl, attribLocation);
    }
    setupTangentPointer(gl, attribLocation) {
        this.tangent.setupVertexPointer(gl, attribLocation);
    }
}
class GLArrayBufferV1 {
    constructor(gl, data, usage) {
        if (usage === undefined) {
            usage = gl.STATIC_DRAW;
        }
        this.buffer = gl.createBuffer();
        this.params = data.params;
        this.vao = this.parepareVAO(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buf, usage);
        gl.bindVertexArray(null);
        this.bb = data.computeBoundingBox();
    }
    getBoundingBox() {
        return this.bb;
    }
    draw(gl, renderMode) {
        gl.bindVertexArray(this.vao);
        gl.drawArrays(renderMode || ArrayBufferDataTypeToGL(this.params.dataType), 0, this.params.vertexCount);
    }
    delete(gl) {
        gl.deleteVertexArray(this.vao);
        gl.deleteBuffer(this.buffer);
    }
    hasNormals() {
        return this.params.hasNormals;
    }
    hasTangent() {
        return false;
    }
    hasUV() {
        return this.params.hasUVs;
    }
    setupVertexPositionsPointer(gl, attribLocation) {
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.elementSize, gl.FLOAT, false, this.params.computeStrideInBytes(), 0);
    }
    setupVertexNormalsPointer(gl, attribLocation) {
        if (!this.params.hasNormals) {
            throw new Error("buf has no normals");
        }
        if (attribLocation == -1) {
            return;
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.normalsSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeNormalOffset());
    }
    setupVertexUVPointer(gl, attribLocation) {
        if (!this.params.hasUVs) {
            throw new Error("buf has no UVs");
        }
        if (attribLocation == -1) {
            return;
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.uvSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeUVOffset());
    }
    parepareVAO(gl) {
        const arr = gl.createVertexArray();
        try {
            gl.bindVertexArray(arr);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            const normals = this.params.hasNormals;
            const uv = this.params.hasUVs;
            this.setupVertexPositionsPointer(gl, _constants__WEBPACK_IMPORTED_MODULE_4__[/* ATTRIBUTE_POSITION_LOC */ "b"]);
            if (normals) {
                this.setupVertexNormalsPointer(gl, _constants__WEBPACK_IMPORTED_MODULE_4__[/* ATTRIBUTE_NORMALS_LOC */ "a"]);
            }
            if (uv) {
                this.setupVertexUVPointer(gl, _constants__WEBPACK_IMPORTED_MODULE_4__[/* ATTRIBUTE_UV_LOC */ "d"]);
            }
        }
        catch (e) {
            gl.deleteVertexArray(arr);
        }
        return arr;
    }
}


/***/ }),

/***/ "./src/gltf-enums.ts":
/*!***************************!*\
  !*** ./src/gltf-enums.ts ***!
  \***************************/
/*! exports provided: GLTF */
/*! exports used: GLTF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GLTF; });
const GLTF = {
    TRIANGLES: 4,
    COMPONENT_TYPES_TO_GL_TYPE: {
        5120: WebGL2RenderingContext.BYTE,
        5121: WebGL2RenderingContext.UNSIGNED_BYTE,
        5122: WebGL2RenderingContext.SHORT,
        5123: WebGL2RenderingContext.UNSIGNED_SHORT,
        5125: WebGL2RenderingContext.UNSIGNED_INT,
        5126: WebGL2RenderingContext.FLOAT,
    }
};


/***/ }),

/***/ "./src/gltf.ts":
/*!*********************!*\
  !*** ./src/gltf.ts ***!
  \*********************/
/*! exports provided: constructUrlBase, GLTFLoader, fetchGLTF, newGLTFLoader, loadSceneFromGLTF */
/*! exports used: loadSceneFromGLTF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export constructUrlBase */
/* unused harmony export GLTFLoader */
/* unused harmony export fetchGLTF */
/* unused harmony export newGLTFLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return loadSceneFromGLTF; });
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scene */ "./src/scene.ts");
/* harmony import */ var gl_matrix_src_gl_matrix_quat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/quat */ "./node_modules/gl-matrix/src/gl-matrix/quat.js");
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec4 */ "./node_modules/gl-matrix/src/gl-matrix/vec4.js");
/* harmony import */ var _texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texture */ "./src/texture.ts");
/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./material */ "./src/material.ts");
/* harmony import */ var _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./glArrayBuffer */ "./src/glArrayBuffer.ts");
/* harmony import */ var _gltf_enums__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./gltf-enums */ "./src/gltf-enums.ts");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./object */ "./src/object.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _axisAlignedBox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./axisAlignedBox */ "./src/axisAlignedBox.ts");











function constructUrlBase(url) {
    const parts = url.split('/');
    if (parts.length === 1) {
        return './';
    }
    parts.pop();
    return parts.join('/') + '/';
}
const m = () => new Map();
const white = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_2__[/* fromValues */ "f"](1, 1, 1);
class GLTFLoader {
    constructor(gl, g, urlPrefix) {
        this.buffers = m();
        this.bufferViewsIndices = m();
        this.bufferViewsArrays = m();
        this.images = m();
        this.textures = m();
        this.materials = m();
        this.accessorsIndices = m();
        this.accessorsArrays = m();
        this.urlJoin = (suffix) => {
            return this.urlPrefix + suffix;
        };
        this.loadBuffer = (id) => {
            return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.buffers, id, async (id) => {
                const uri = this.urlJoin(this.g.buffers[id].uri);
                const response = await fetch(uri);
                if (response.status != 200) {
                    throw new Error(`Unexpected response: ${response.status}`);
                }
                const buf = await response.arrayBuffer();
                return new Uint8Array(buf);
            });
        };
        this.loadBufferViewIndices = (id) => {
            return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.bufferViewsIndices, id, async (id) => {
                const bv = this.g.bufferViews[id];
                const buf = await this.loadBuffer(bv.buffer);
                const glbuf = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* ElementArrayWebGLBufferWrapper */ "d"](this.gl, buf.subarray(bv.byteOffset, bv.byteOffset + bv.byteLength));
                return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* BufferView */ "c"](glbuf, bv.byteLength);
            });
        };
        this.loadBufferViewArray = (id) => {
            return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.bufferViewsArrays, id, async (id) => {
                const bv = this.g.bufferViews[id];
                const buf = await this.loadBuffer(bv.buffer);
                const glbuf = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* ArrayWebGLBufferWrapper */ "b"](this.gl, buf.subarray(bv.byteOffset, bv.byteOffset + bv.byteLength));
                return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* BufferView */ "c"](glbuf, bv.byteLength);
            });
        };
        this.loadAccessorIndices = (id) => {
            if (id === null || id === undefined) {
                return Promise.resolve(undefined);
            }
            return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.accessorsIndices, id, async (id) => {
                const accessor = this.g.accessors[id];
                const bv = await this.loadBufferViewIndices(accessor.bufferView);
                return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* GLTFAccessor */ "i"](accessor, bv);
            });
        };
        this.urlPrefix = urlPrefix;
        this.g = g;
        this.gl = gl;
    }
    async loadScene(id) {
        if (id === undefined) {
            id = this.g.scene;
            if (id === undefined) {
                console.warn("Assuming the scene to load is 0 as it was not explicitly specified and GlTf has no default scene");
                id = 0;
            }
        }
        const scene = new _scene__WEBPACK_IMPORTED_MODULE_0__[/* Scene */ "a"]();
        this.g.scenes[id].nodes.forEach(nodeId => {
            scene.addChild(this.toGameObject(nodeId));
        });
        return scene;
    }
    loadImage(id) {
        return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.images, id, id => {
            const img = this.g.images[id];
            const uri = this.urlJoin(img.uri);
            switch (img.mimeType) {
                case "image/vnd-ms.dds":
                    return fetch(uri).then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.arrayBuffer();
                    }).then(b => new _texture__WEBPACK_IMPORTED_MODULE_4__[/* DDSPixels */ "a"](b));
                default:
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = uri;
                        img.crossOrigin = "anonymous";
                        img.addEventListener('load', () => {
                            resolve(new _texture__WEBPACK_IMPORTED_MODULE_4__[/* ImagePixels */ "b"](img));
                        });
                        img.addEventListener('error', e => {
                            console.log(`error loading image ${id}`);
                            reject(e);
                        });
                    });
            }
        });
    }
    ;
    loadAccessorArrays(id) {
        if (id === null || id === undefined) {
            return Promise.resolve(undefined);
        }
        return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.accessorsArrays, id, async (id) => {
            const accessor = this.g.accessors[id];
            const bv = await this.loadBufferViewArray(accessor.bufferView);
            return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* GLTFAccessor */ "i"](accessor, bv);
        });
    }
    ;
    loadTexture(id) {
        return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.textures, id, () => {
            const t = this.g.textures[id];
            const img = this.loadImage(t.source);
            return new _texture__WEBPACK_IMPORTED_MODULE_4__[/* Texture */ "c"](this.gl, img, white);
        });
    }
    ;
    loadMaterial(id) {
        return Object(_utils__WEBPACK_IMPORTED_MODULE_9__[/* mapComputeIfAbsent */ "f"])(this.materials, id, id => {
            const nm = new _material__WEBPACK_IMPORTED_MODULE_5__[/* Material */ "a"]();
            const m = this.g.materials[id];
            const mr = m.pbrMetallicRoughness;
            // albedo
            if (mr.baseColorFactor) {
                if (mr.baseColorTexture) {
                    // @ts-ignore
                    nm.albedo.setFactor(gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_3__[/* fromValues */ "h"](...mr.baseColorFactor));
                }
                else {
                    gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_3__[/* copy */ "c"](nm.albedo.value, mr.baseColorFactor);
                }
            }
            if (mr.baseColorTexture) {
                nm.albedo.setTexture(this.loadTexture(mr.baseColorTexture.index));
            }
            // metallic
            if (mr.metallicFactor) {
                if (mr.metallicRoughnessTexture) {
                    nm.metallic.factor = mr.metallicFactor;
                }
                else {
                    nm.metallic.value = mr.metallicFactor;
                }
            }
            if (mr.metallicRoughnessTexture) {
                nm.metallic.texture = this.loadTexture(mr.metallicRoughnessTexture.index);
            }
            // roughness
            if (mr.roughnessFactor) {
                if (mr.metallicRoughnessTexture) {
                    nm.roughness.factor = mr.roughnessFactor;
                }
                else {
                    nm.roughness.value = mr.roughnessFactor;
                }
            }
            if (mr.metallicRoughnessTexture) {
                nm.roughness.texture = this.loadTexture(mr.metallicRoughnessTexture.index);
            }
            if (m.normalTexture) {
                nm.setNormalMap(this.loadTexture(m.normalTexture.index));
            }
            return nm;
        });
    }
    ;
    loadPrimitive(p) {
        if (p.mode !== undefined && p.mode != _gltf_enums__WEBPACK_IMPORTED_MODULE_7__[/* GLTF */ "a"].TRIANGLES) {
            throw new Error(`Not trianges: ${p.mode}`);
        }
        const posAccessor = this.g.accessors[p.attributes['POSITION']];
        const bb = new _axisAlignedBox__WEBPACK_IMPORTED_MODULE_10__[/* AxisAlignedBox */ "a"]().setMin(posAccessor.min).setMax(posAccessor.max);
        return Promise.all([
            this.loadAccessorIndices(p.indices),
            this.loadAccessorArrays(p.attributes['POSITION']),
            this.loadAccessorArrays(p.attributes['TEXCOORD_0']),
            this.loadAccessorArrays(p.attributes['NORMAL']),
            this.loadAccessorArrays(p.attributes['TANGENT'])
        ]).then(([indices, pos, uv, normal, tangent]) => {
            return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* GLArrayBufferGLTF */ "g"](this.gl, indices, pos, uv, normal, tangent, bb);
        });
    }
    toGameObject(nodeId) {
        const node = this.g.nodes[nodeId];
        const gameObject = new _object__WEBPACK_IMPORTED_MODULE_8__[/* GameObject */ "c"](node.name || nodeId.toString());
        if (node.scale) {
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_2__[/* copy */ "b"](gameObject.transform.scale, node.scale);
        }
        if (node.translation) {
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_2__[/* copy */ "b"](gameObject.transform.position, node.translation);
        }
        if (node.rotation) {
            // @ts-ignore
            gl_matrix_src_gl_matrix_quat__WEBPACK_IMPORTED_MODULE_1__[/* getAxisAngle */ "b"](gameObject.transform.rotation, gl_matrix_src_gl_matrix_quat__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "a"](...node.rotation));
        }
        gameObject.transform.update();
        if (node.mesh !== undefined) {
            const mesh = this.g.meshes[node.mesh];
            let bb = null;
            mesh.primitives.forEach((p, pi) => {
                this.loadPrimitive(p).then(buf => {
                    const primitiveBB = buf.getBoundingBox();
                    const primitiveGameObject = new _object__WEBPACK_IMPORTED_MODULE_8__[/* GameObjectBuilder */ "d"](`mesh ${node.mesh}, primitive ${pi}`)
                        .setMeshComponent(new _object__WEBPACK_IMPORTED_MODULE_8__[/* MeshComponent */ "f"](buf))
                        .setBoundingBoxComponent(new _object__WEBPACK_IMPORTED_MODULE_8__[/* BoundingBoxComponent */ "a"](primitiveBB))
                        .setMaterialComponent(new _object__WEBPACK_IMPORTED_MODULE_8__[/* MaterialComponent */ "e"](this.loadMaterial(p.material))).build();
                    const isFirst = bb === null;
                    bb = Object(_glArrayBuffer__WEBPACK_IMPORTED_MODULE_6__[/* computeBoundingBox */ "j"])([primitiveBB], false, bb, bb);
                    gameObject.addChild(primitiveGameObject);
                    if (isFirst) {
                        gameObject.boundingBoxComponent = new _object__WEBPACK_IMPORTED_MODULE_8__[/* BoundingBoxComponent */ "a"](bb).setComputedFromChildren(true);
                    }
                });
            });
        }
        if (node.children) {
            node.children.forEach(nodeId => {
                const child = this.toGameObject(nodeId);
                gameObject.addChild(child);
            });
        }
        return gameObject;
    }
}
async function fetchGLTF(gltfFilename) {
    const response = await fetch(gltfFilename);
    if (!response.ok) {
        throw new Error(`Error loading gltf from ${gltfFilename}: ${response.statusText}`);
    }
    return response.json();
}
async function newGLTFLoader(gl, gltfFilename) {
    const g = await fetchGLTF(gltfFilename);
    return new GLTFLoader(gl, g, constructUrlBase(gltfFilename));
}
async function loadSceneFromGLTF(gl, gltfFilename) {
    const loader = await newGLTFLoader(gl, gltfFilename);
    return loader.loadScene();
}


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _objparser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objparser */ "./src/objparser.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _progressbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./progressbar */ "./src/progressbar.ts");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./object */ "./src/object.ts");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./camera */ "./src/camera.ts");
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./scene */ "./src/scene.ts");
/* harmony import */ var _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./deferredRenderer */ "./src/deferredRenderer.ts");
/* harmony import */ var _glArrayBuffer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./glArrayBuffer */ "./src/glArrayBuffer.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ui */ "./src/ui.ts");
/* harmony import */ var _SSAOState__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SSAOState */ "./src/SSAOState.ts");
/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./material */ "./src/material.ts");
/* harmony import */ var _quad__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./quad */ "./src/quad.ts");
/* harmony import */ var _gltf__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./gltf */ "./src/gltf.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var wasm__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! wasm */ "./typescript-3d-renderer-rust/pkg/typescript_3d_renderer_rust.js");
















const originZero = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* create */ "c"]();
const PI2 = Math.PI / 2.0 - 0.01;
const printError = e => {
    console.error(e);
    const errE = document.getElementById('error');
    errE.innerText = e.toString();
    errE.style.display = '';
};
function main() {
    wasm__WEBPACK_IMPORTED_MODULE_15__[/* greet */ "a"]();
    const state = {
        lighting: {
            lightCount: {
                value: 1,
                min: 0,
                max: 1000,
                step: 1,
                onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
            },
            sun: {
                intensity: { value: 60., min: 0, step: 0.1, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
            },
            'new': {
                radius: { value: 1.5, min: 0, max: 100, step: 0.1, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
                posScale: { value: 1.5, min: 0, max: 100, step: 0.1, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
                intensity: { value: 1., min: 0, max: 100, step: 0.1, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
            }
        },
        ssr: {
            enable: {
                onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
                checked: true,
            }
        },
        shadowMap: {
            enable: {
                onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
                checked: true,
            },
            bias: {
                fixed: { value: 0.005, min: 0, step: 0.0001, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
                normal: { value: 0.001, min: 0, step: 0.0001, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
            }
        },
        ssao: {
            enable: {
                onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
                checked: true,
            },
            sampleCount: { value: 64, min: 1, step: 1, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
            noiseScale: { value: 4, min: 2, step: 1, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
            radius: { value: 1., min: 0.001, step: 0.1, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](), },
            bias: { value: 0.02, step: 0.001, min: 0.001, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](), },
            strength: { value: 2.0, min: 0, step: 0.5, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](), },
            scalePower: { value: 2, min: 0, step: 0.5, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](), },
            blurPositionThreshold: { value: 0.3, min: 0, step: 0.01, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
            blurNormalThreshold: { value: 0.9, min: 0, step: 0.05, onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"]() },
        },
        showLayer: {
            value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].Final,
            onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
            options: [
                { label: 'Final', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].Final },
                { label: 'Positions', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].Positions },
                { label: 'Normals', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].Normals },
                { label: 'SSAO', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].SSAO },
                { label: 'Color', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].Color },
                { label: 'Shadow Map', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].ShadowMap },
                { label: 'Metallic', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].Metallic },
                { label: 'Roughness', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].Roughness },
                { label: 'SSR', value: _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"].SSR },
            ]
        },
        shouldRotate: {
            onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
            checked: true
        },
        normalMapsEnabled: {
            onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
            checked: true
        },
        albedoTexturesEnabled: {
            onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
            checked: true,
        },
        pause: {
            onChange: _ui__WEBPACK_IMPORTED_MODULE_9__[/* funcRef */ "k"](),
            checked: false,
        },
        materials: {},
        fps: {
            min: 0,
            max: 0,
            current: 0,
        }
    };
    const n = (label, props) => {
        return _ui__WEBPACK_IMPORTED_MODULE_9__[/* NumberInput */ "f"](label, props, props.onChange);
    };
    const color = (label, props) => {
        return _ui__WEBPACK_IMPORTED_MODULE_9__[/* ColorInput */ "b"](label, props, props.onChange);
    };
    const slider = (label, props) => {
        return _ui__WEBPACK_IMPORTED_MODULE_9__[/* SliderInput */ "h"](label, props, props.onChange);
    };
    const minFpsE = document.getElementById('min-fps');
    const maxFpsE = document.getElementById('max-fps');
    const currentFpsE = document.getElementById('current-fps');
    const updateFpsHTML = () => {
        currentFpsE.innerText = state.fps.current.toFixed(2);
        minFpsE.innerText = state.fps.min.toFixed(2);
        maxFpsE.innerText = state.fps.max.toFixed(2);
    };
    updateFpsHTML();
    document.getElementById('app').appendChild(_ui__WEBPACK_IMPORTED_MODULE_9__[/* Form */ "c"](_ui__WEBPACK_IMPORTED_MODULE_9__[/* FormRow */ "e"](_ui__WEBPACK_IMPORTED_MODULE_9__[/* e */ "j"]('div', _ui__WEBPACK_IMPORTED_MODULE_9__[/* c */ "i"]('col-lg'), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('Features', _ui__WEBPACK_IMPORTED_MODULE_9__[/* CheckBoxInput */ "a"]('Pause', state.pause, state.pause.onChange), _ui__WEBPACK_IMPORTED_MODULE_9__[/* CheckBoxInput */ "a"]('Rotate / animate', state.shouldRotate, state.shouldRotate.onChange), _ui__WEBPACK_IMPORTED_MODULE_9__[/* CheckBoxInput */ "a"]('SSAO', state.ssao.enable, state.ssao.enable.onChange), _ui__WEBPACK_IMPORTED_MODULE_9__[/* CheckBoxInput */ "a"]('Shadow Map', state.shadowMap.enable, state.shadowMap.enable.onChange), _ui__WEBPACK_IMPORTED_MODULE_9__[/* CheckBoxInput */ "a"]('Normal maps', state.normalMapsEnabled, state.normalMapsEnabled.onChange), _ui__WEBPACK_IMPORTED_MODULE_9__[/* CheckBoxInput */ "a"]('Albedo textures', state.albedoTexturesEnabled, state.albedoTexturesEnabled.onChange), _ui__WEBPACK_IMPORTED_MODULE_9__[/* CheckBoxInput */ "a"]('Screen-space reflections', state.ssr.enable, state.ssr.enable.onChange)), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('Layer to show', _ui__WEBPACK_IMPORTED_MODULE_9__[/* RadioInput */ "g"](state.showLayer.options, state.showLayer, state.showLayer.onChange)), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('SSAO', n('Samples', state.ssao.sampleCount), n('Noise scale', state.ssao.noiseScale), n('Radius', state.ssao.radius), n('Bias', state.ssao.bias), n('Strength', state.ssao.strength), n('Scale power', state.ssao.scalePower)), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('SSAO Blur', n('Pos. threshold', state.ssao.blurPositionThreshold), n('Normal threshold', state.ssao.blurNormalThreshold))), _ui__WEBPACK_IMPORTED_MODULE_9__[/* e */ "j"]('div', _ui__WEBPACK_IMPORTED_MODULE_9__[/* c */ "i"]('col-lg'), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('Shadow Map', n('Fixed bias', state.shadowMap.bias.fixed), n('Normal bias', state.shadowMap.bias.normal)), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('Lighting', n('Light count', state.lighting.lightCount)), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('Sun', n('Intensity', state.lighting.sun.intensity)), _ui__WEBPACK_IMPORTED_MODULE_9__[/* FormGroup */ "d"]('New lights', n('Radius', state.lighting.new.radius), n('Pos scale', state.lighting.new.posScale), n('Intensity', state.lighting.new.intensity))))));
    const canvas = document.getElementById("gl");
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    const gl = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* initGL */ "d"])(canvas);
    const quadArrayBuffer = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_8__[/* GLArrayBufferV1 */ "h"](gl, _quad__WEBPACK_IMPORTED_MODULE_12__[/* QuadArrayBufferData */ "b"]);
    const fb = new _quad__WEBPACK_IMPORTED_MODULE_12__[/* FullScreenQuad */ "a"](gl, quadArrayBuffer);
    const progressBarCommon = new _progressbar__WEBPACK_IMPORTED_MODULE_2__[/* ProgressBarCommon */ "b"](gl, fb);
    const progressBar = new _progressbar__WEBPACK_IMPORTED_MODULE_2__[/* ProgressBar */ "a"](gl, progressBarCommon);
    var contentLength = 1;
    var downloaded = 0;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    progressBar.prepare(gl);
    const onHeaders = ({ headers, length }) => {
        if (headers) {
            contentLength = parseInt(headers.get("content-length"));
        }
        else {
            downloaded += length;
            const progress = downloaded / contentLength;
            progressBar.render(gl, progress);
        }
    };
    const onColorChanges = (stateRef, material) => {
        stateRef.albedo.onChange.ref = (v) => {
            Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* hexToRgb1 */ "c"])(material.albedo.value, v);
        };
        stateRef.metallic.onChange.ref = v => {
            material.setMetallic(v);
        };
        stateRef.roughness.onChange.ref = v => {
            material.setRoughness(v);
        };
    };
    const makeMaterialFromState = (stateRef) => {
        const albedo = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* hexToRgb1 */ "c"])(_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec4 */ "n"], stateRef.albedo.value);
        return new _material__WEBPACK_IMPORTED_MODULE_11__[/* Material */ "a"]()
            .setAlbedo(albedo[0], albedo[1], albedo[2], 1.)
            .setRoughness(stateRef.roughness.value)
            .setMetallic(stateRef.metallic.value);
    };
    Promise.all([
        Object(_objparser__WEBPACK_IMPORTED_MODULE_0__[/* fetchObject */ "a"])('resources/sphere.obj', onHeaders).then(parser => {
            return parser.getArrayBuffer().intoGLArrayBuffer(gl);
        }),
        Object(_objparser__WEBPACK_IMPORTED_MODULE_0__[/* fetchObject */ "a"])('resources/plane.obj', onHeaders).then(parser => {
            return parser.getArrayBuffer().intoGLArrayBuffer(gl);
        }),
    ]).then(([sphereMesh, planeMesh]) => {
        const camera = new _camera__WEBPACK_IMPORTED_MODULE_4__[/* Camera */ "a"](gl.canvas.width / gl.canvas.height);
        camera.position = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* fromValues */ "f"](0, 0, -3.);
        const ssaoConfig = new _SSAOState__WEBPACK_IMPORTED_MODULE_10__[/* SSAOConfig */ "a"]();
        const shadowMapConfig = new _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShadowMapConfig */ "d"]();
        const ssrConfig = new _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* SSRConfig */ "c"]();
        const updateSSAOConfig = () => {
            const c = ssaoConfig;
            const s = state.ssao;
            c.strength = s.strength.value;
            c.scalePower = s.scalePower.value;
            c.bias = s.bias.value;
            c.radius = s.radius.value;
            c.noiseScale = s.noiseScale.value;
            c.sampleCount = s.sampleCount.value;
            c.enabled = state.ssao.enable.checked;
            c.blurNormalThreshold = state.ssao.blurNormalThreshold.value;
            c.blurPositionThreshold = state.ssao.blurPositionThreshold.value;
        };
        updateSSAOConfig();
        const updateShadowMapConfig = () => {
            const c = shadowMapConfig;
            const s = state.shadowMap;
            c.enabled = s.enable.checked;
            c.normalBias = s.bias.normal.value;
            c.fixedBias = s.bias.fixed.value;
        };
        updateShadowMapConfig();
        const updateSSRConfig = () => {
            ssrConfig.enabled = state.ssr.enable.checked;
        };
        updateSSRConfig();
        const ssaoState = new _SSAOState__WEBPACK_IMPORTED_MODULE_10__[/* SSAOState */ "b"](gl, ssaoConfig);
        const rendererConfig = new _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* DeferredRendererConfig */ "b"]();
        rendererConfig.ssao = ssaoConfig;
        rendererConfig.shadowMap = shadowMapConfig;
        rendererConfig.ssr = ssrConfig;
        rendererConfig.showLayer = state.showLayer.value;
        rendererConfig.normalMapsEnabled = state.normalMapsEnabled.checked;
        rendererConfig.albedoTexturesEnabled = state.albedoTexturesEnabled.checked;
        const renderer = new _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* DeferredRenderer */ "a"](gl, rendererConfig, fb, sphereMesh, ssaoState);
        let scene = new _scene__WEBPACK_IMPORTED_MODULE_6__[/* Scene */ "a"]();
        state.normalMapsEnabled.onChange.ref = v => {
            rendererConfig.normalMapsEnabled = v;
        };
        state.albedoTexturesEnabled.onChange.ref = v => {
            rendererConfig.albedoTexturesEnabled = v;
        };
        Object(_gltf__WEBPACK_IMPORTED_MODULE_13__[/* loadSceneFromGLTF */ "a"])(gl, _constants__WEBPACK_IMPORTED_MODULE_14__[/* SAMPLE_GLTF_SPONZA_DDS */ "e"]).then(newScene => {
            scene = newScene;
            scene.directionalLights.push(sun.directionalLight);
            // camera.far = 50;
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* set */ "l"](camera.position, -6.4035325050354, 1.3013536930084229, -0.20439213514328003);
            gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* set */ "l"](camera.forward, 1, 0, 0);
            camera.calculateUpFromWorldUp();
        }, (err) => {
            printError(err);
        });
        const sun = new _object__WEBPACK_IMPORTED_MODULE_3__[/* GameObjectBuilder */ "d"]("sun").setDirectionalLightComponent(new _object__WEBPACK_IMPORTED_MODULE_3__[/* DirectionalLight */ "b"]()).build();
        sun.directionalLight.direction = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* normalize */ "h"](sun.directionalLight.direction, [-1, -1, -1]);
        sun.directionalLight.intensity = state.lighting.sun.intensity.value;
        scene.directionalLights.push(sun.directionalLight);
        // TEST 2 shadow lights
        // const sun2 = new GameObjectBuilder("sun 2").setDirectionalLightComponent(new DirectionalLight()).build();
        // sun2.directionalLight.direction = vec3.normalize(sun2.directionalLight.direction, [-1, -0.2, 1]);
        // sun2.directionalLight.intensity = 0.5;
        // sun2.directionalLight.ambient = v3(state.lighting.sun.ambient.value);
        // sun2.directionalLight.diffuse = v3(state.lighting.sun.diffuse.value);
        // sun2.directionalLight.specular = v3(state.lighting.sun.specular.value);
        //
        // scene.directionalLights.push(sun2.directionalLight);
        let delta = 1000. / 60;
        let lastStart = null;
        let frame = 0;
        function processFrame(timestamp) {
            if (state.pause.checked) {
                return;
            }
            if (lastStart === null) {
                delta = 1000 / 60;
                lastStart = timestamp;
            }
            else {
                delta = timestamp - lastStart;
                lastStart = timestamp;
            }
            state.fps.current = 1000 / delta;
            if (frame % 100 === 0) {
                state.fps.min = state.fps.current;
                state.fps.max = state.fps.current;
            }
            else {
                state.fps.min = Math.min(state.fps.min, state.fps.current);
                state.fps.max = Math.max(state.fps.max, state.fps.current);
            }
            frame++;
            if (frame % 5 === 0) {
                updateFpsHTML();
            }
            pressedKeys.forEach((v, k) => {
                const moveSpeed = delta * 0.003;
                switch (k) {
                    case 'e':
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.up, moveSpeed);
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                        camera.update();
                        break;
                    case 'z':
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.up, -moveSpeed);
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                        camera.update();
                        break;
                    case 'w':
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.forward, moveSpeed);
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                        camera.update();
                        break;
                    case 's':
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.forward, -moveSpeed);
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                        camera.update();
                        break;
                    case 'a':
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.right(), -moveSpeed);
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                        camera.update();
                        break;
                    case 'd':
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.right(), moveSpeed);
                        gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                        camera.update();
                        break;
                }
            });
            if (state.shouldRotate.checked) {
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* normalize */ "h"](sun.directionalLight.direction, [-0.5, -0.95, Math.sin(timestamp / 8000) * 0.25]);
            }
            Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* optimizeNearFar */ "g"])(camera, scene);
            renderer.render(scene, camera);
            requestAnimationFrame(processFrame);
        }
        var zoom = 1.0;
        var pitch = 0.;
        var yaw = 0.;
        var sensitivityY = 0.0001;
        var sensitivityX = 0.0001;
        const pressedKeys = new Map();
        window.onkeydown = ev => {
            pressedKeys.set(ev.key, true);
        };
        window.onkeyup = ev => {
            pressedKeys.delete(ev.key);
        };
        var initialFov = camera.fov;
        canvas.onwheel = ev => {
            if (ev.ctrlKey) {
                zoom = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* clip */ "a"])(zoom + ev.deltaY * camera.fov * 0.0001, 0.1, 1.90);
                camera.fov = initialFov * zoom;
                camera.update();
            }
            else if (ev.shiftKey) {
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.up, -ev.deltaY * 0.01);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* scale */ "k"](_utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"], camera.right(), ev.deltaX * 0.01);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* add */ "a"](camera.position, camera.position, _utils__WEBPACK_IMPORTED_MODULE_1__[/* tmpVec3 */ "m"]);
                camera.update();
            }
            else {
                pitch += ev.deltaY * sensitivityY * camera.fov;
                yaw -= ev.deltaX * sensitivityX * camera.fov;
                pitch = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* clip */ "a"])(pitch, -PI2, PI2);
                let forward = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* fromValues */ "f"](0, 0, 1);
                let up = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* fromValues */ "f"](0, 1, 0);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* rotateX */ "i"](forward, forward, originZero, pitch);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* rotateY */ "j"](forward, forward, originZero, yaw);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* rotateX */ "i"](up, up, originZero, pitch);
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_5__[/* rotateY */ "j"](up, up, originZero, yaw);
                camera.forward = forward;
                camera.up = up;
                camera.update();
            }
            ev.preventDefault();
        };
        state.ssr.enable.onChange.ref = updateSSRConfig;
        const onSSSAOStateParamsChange = () => {
            updateSSAOConfig();
            ssaoState.recalculate(gl, ssaoConfig);
            renderer.onChangeSSAOState();
        };
        state.ssao.sampleCount.onChange.ref = onSSSAOStateParamsChange;
        state.ssao.noiseScale.onChange.ref = onSSSAOStateParamsChange;
        state.ssao.scalePower.onChange.ref = onSSSAOStateParamsChange;
        state.ssao.strength.onChange.ref = (v, prev) => {
            renderer.config.ssao.strength = v;
            if (v === 0 || prev === 0) {
                renderer.recompileShaders();
            }
        };
        state.ssao.bias.onChange.ref = updateSSAOConfig;
        state.ssao.radius.onChange.ref = updateSSAOConfig;
        state.ssao.blurPositionThreshold.onChange.ref = updateSSAOConfig;
        state.ssao.blurNormalThreshold.onChange.ref = updateSSAOConfig;
        state.ssao.enable.onChange.ref = v => {
            renderer.config.ssao.enabled = v;
            console.log('SSAOState enabled', renderer.config.ssao.enabled);
            renderer.recompileShaders();
        };
        state.shadowMap.bias.fixed.onChange.ref = updateShadowMapConfig;
        state.shadowMap.bias.normal.onChange.ref = updateShadowMapConfig;
        state.shadowMap.enable.onChange.ref = v => {
            renderer.config.shadowMap.enabled = v;
            console.log('shadowmap enabled', renderer.config.shadowMap.enabled);
            renderer.recompileShaders();
        };
        state.lighting.sun.intensity.onChange.ref = v => {
            sun.directionalLight.intensity = v;
        };
        state.lighting.lightCount.onChange.ref = v => {
            v = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[/* clip */ "a"])(v, 0, 500);
            console.log(scene.pointLights.length);
            const diff = scene.pointLights.length - v;
            if (diff > 0) {
                for (let index = 0; index < diff; index++) {
                    scene.pointLights.pop();
                }
            }
            else if (diff < 0) {
                for (let index = 0; index < -diff; index++) {
                    const l = Object(_scene__WEBPACK_IMPORTED_MODULE_6__[/* randomPointLight */ "b"])(state.lighting.new.posScale.value, state.lighting.new.intensity.value);
                    l.radius = state.lighting.new.radius.value;
                    scene.pointLights.push(l);
                }
            }
            console.log('new point light count ' + scene.pointLights.length);
        };
        state.lighting.lightCount.onChange(state.lighting.lightCount.value);
        state.showLayer.onChange.ref = vstring => {
            const v = _deferredRenderer__WEBPACK_IMPORTED_MODULE_7__[/* ShowLayer */ "e"][vstring];
            console.log('setting show layer to ' + v);
            renderer.config.showLayer = parseInt(vstring);
            renderer.recompileShaders();
        };
        state.pause.onChange.ref = isPaused => {
            if (!isPaused) {
                lastStart = null;
                requestAnimationFrame(processFrame);
            }
        };
        requestAnimationFrame(processFrame);
    }).catch(printError);
}
window.addEventListener('load', () => {
    try {
        main();
    }
    catch (e) {
        printError(e);
    }
});


/***/ }),

/***/ "./src/material.ts":
/*!*************************!*\
  !*** ./src/material.ts ***!
  \*************************/
/*! exports provided: TextureOrValue, Material */
/*! exports used: Material */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TextureOrValue */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Material; });
/* harmony import */ var gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec4 */ "./node_modules/gl-matrix/src/gl-matrix/vec4.js");

class TextureOrValue {
    constructor(value, texture, factor) {
        this.texture = null;
        this.value = value;
        this.factor = factor;
        if (texture) {
            this.texture = texture;
        }
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    setFactor(value) {
        this.factor = value;
        return this;
    }
    hasTexture() {
        return !!this.texture;
    }
    hasFactor() {
        return this.factor !== undefined && this.factor !== null;
    }
    setTexture(texture) {
        this.texture = texture;
        return this;
    }
}
class Material {
    constructor(albedo, metallic, roughness) {
        this.albedo = new TextureOrValue(gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_0__[/* fromValues */ "h"](1, 1, 1, 1));
        this.metallic = new TextureOrValue(0);
        this.roughness = new TextureOrValue(0.5);
        this.isReflective = false;
        if (albedo) {
            gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_0__[/* copy */ "c"](this.albedo.value, albedo);
        }
        if (metallic !== undefined) {
            this.metallic.value = metallic;
        }
        if (roughness !== undefined) {
            this.roughness.value = roughness;
        }
    }
    setAlbedo(r, g, b, a) {
        this.albedo.value[0] = r;
        this.albedo.value[1] = g;
        this.albedo.value[2] = b;
        this.albedo.value[3] = a;
        return this;
    }
    setMetallic(v) {
        this.metallic.setValue(v);
        return this;
    }
    setRoughness(v) {
        this.roughness.setValue(v);
        return this;
    }
    setReflective(v) {
        this.isReflective = v;
        return this;
    }
    setNormalMap(t) {
        this.normalMap = t;
        return this;
    }
}


/***/ }),

/***/ "./src/object.ts":
/*!***********************!*\
  !*** ./src/object.ts ***!
  \***********************/
/*! exports provided: Component, MeshComponent, BoundingBoxComponent, BaseLightComponent, DirectionalLight, PointLightComponent, TransformComponent, MaterialComponent, GameObject, GameObjectBuilder */
/*! exports used: BoundingBoxComponent, DirectionalLight, GameObject, GameObjectBuilder, MaterialComponent, MeshComponent, PointLightComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Component */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return MeshComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BoundingBoxComponent; });
/* unused harmony export BaseLightComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DirectionalLight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return PointLightComponent; });
/* unused harmony export TransformComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MaterialComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return GameObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return GameObjectBuilder; });
/* harmony import */ var gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/mat4 */ "./node_modules/gl-matrix/src/gl-matrix/mat4.js");
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var _glArrayBuffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./glArrayBuffer */ "./src/glArrayBuffer.ts");



class Component {
    constructor() {
        this.object = null;
    }
    setObject(o) {
        this.object = o;
        return this;
    }
}
class MeshComponent extends Component {
    constructor(primitives) {
        super();
        this.shadowCaster = true;
        this.shadowReceiver = true;
        this.forceRenderMode = undefined;
        if (Array.isArray(primitives)) {
            this.primitives = primitives;
        }
        else {
            this.primitives = [primitives];
        }
    }
    setRenderMode(m) {
        this.forceRenderMode = m;
        return this;
    }
    setShadowCaster(v) {
        this.shadowCaster = v;
        return this;
    }
    setShadowReceiver(v) {
        this.shadowReceiver = v;
        return this;
    }
    draw(gl) {
        for (let i = 0; i < this.primitives.length; i++) {
            const p = this.primitives[i];
            p.draw(gl, this.forceRenderMode);
        }
    }
}
class BoundingBoxComponent extends Component {
    constructor(box) {
        super();
        this.visible = false;
        this.computedFromChildren = false;
        this.box = box;
    }
    setComputedFromChildren(v) {
        this.computedFromChildren = v;
        return this;
    }
    asArrayBuffer(gl) {
        if (!this.glArrayBuffer) {
            this.glArrayBuffer = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_2__[/* GLArrayBufferV1 */ "h"](gl, this.box.asWireFrameBuffer());
        }
        return this.glArrayBuffer;
    }
}
class BaseLightComponent extends Component {
    constructor() {
        super(...arguments);
        this.color = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](1., 1., 1.);
        this.intensity = 1.;
    }
}
class DirectionalLight extends BaseLightComponent {
    constructor() {
        super(...arguments);
        this.direction = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](0, -1, 0);
    }
}
class PointLightComponent extends BaseLightComponent {
    constructor() {
        super(...arguments);
        this.radius = 1.;
    }
}
class TransformComponent extends Component {
    constructor(object) {
        super();
        this.modelToWorld = gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* create */ "b"]();
        this.modelToParent = gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* create */ "b"]();
        this.object = object;
        this.position = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](0, 0, 0);
        this.rotation = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](0, 0, 0);
        this.scale = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](1, 1, 1);
        this.computeModelToParent();
        this.computeModelToWorld();
    }
    getModelToWorld() {
        return this.modelToWorld;
    }
    getModelToParent() {
        return this.modelToParent;
    }
    computeModelToWorld() {
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* copy */ "a"](this.modelToWorld, this.getModelToParent());
        const mw = this.modelToWorld;
        let parent = this.object.parent;
        while (parent) {
            gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* multiply */ "g"](mw, parent.transform.getModelToParent(), mw);
            parent = parent.parent;
        }
        return mw;
    }
    computeModelToParent() {
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* identity */ "d"](this.modelToParent);
        const modelToParent = this.modelToParent;
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* translate */ "n"](modelToParent, modelToParent, this.position);
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* scale */ "l"](modelToParent, modelToParent, this.scale);
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* rotateX */ "i"](modelToParent, modelToParent, this.rotation[0]);
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* rotateY */ "j"](modelToParent, modelToParent, this.rotation[1]);
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_0__[/* rotateZ */ "k"](modelToParent, modelToParent, this.rotation[2]);
        return modelToParent;
    }
    update() {
        this.computeModelToParent();
        this.computeModelToWorld();
        this.object.children.forEach(c => c.transform.update());
    }
}
class MaterialComponent extends Component {
    constructor(m) {
        super();
        this.material = m;
    }
}
class GameObject {
    constructor(name) {
        this.children = [];
        this._mesh = null;
        this._pointLight = null;
        this._directionalLight = null;
        this._boundingBoxComponent = null;
        this._transform = new TransformComponent(this);
        this.name = name;
    }
    get transform() {
        return this._transform;
    }
    set transform(value) {
        this._transform = value;
        value.object = this;
    }
    get mesh() {
        return this._mesh;
    }
    set mesh(value) {
        this._mesh = value;
        value.object = this;
    }
    get pointLight() {
        return this._pointLight;
    }
    set pointLight(value) {
        this._pointLight = value;
        value.object = this;
    }
    get directionalLight() {
        return this._directionalLight;
    }
    set directionalLight(value) {
        this._directionalLight = value;
        value.object = this;
    }
    get boundingBoxComponent() {
        return this._boundingBoxComponent;
    }
    set boundingBoxComponent(value) {
        this._boundingBoxComponent = value;
        value.object = this;
    }
    addChild(o) {
        this.children.push(o);
        o.parent = this;
        o._transform.update();
        // console.log(`added ${o.name} as child of ${this.fqdn()}`);
    }
    fqdn() {
        const name = [];
        let o = this;
        while (o) {
            name.push(o.name);
            o = o.parent;
        }
        name.reverse();
        return name.join(' / ');
    }
}
class GameObjectBuilder {
    constructor(name) {
        this.o = new GameObject(name);
    }
    setMeshFromBuffer(mesh) {
        this.o.mesh = new MeshComponent(mesh);
        this.o.boundingBoxComponent = new BoundingBoxComponent(mesh.getBoundingBox());
        return this;
    }
    setMeshComponent(meshComponent) {
        this.o.mesh = meshComponent;
        meshComponent.setObject(this.o);
        return this;
    }
    setDirectionalLightComponent(light) {
        this.o.directionalLight = light;
        light.object = this.o;
        return this;
    }
    setPointLightComponent(light) {
        this.o.pointLight = light;
        light.object = this.o;
        return this;
    }
    setBoundingBoxComponent(bbox) {
        this.o.boundingBoxComponent = bbox;
        bbox.object = this.o;
        return this;
    }
    setMaterialComponent(c) {
        this.o.material = c;
        c.object = this.o;
        return this;
    }
    build() {
        return this.o;
    }
}


/***/ }),

/***/ "./src/objparser.ts":
/*!**************************!*\
  !*** ./src/objparser.ts ***!
  \**************************/
/*! exports provided: ObjParser, fetchObject */
/*! exports used: fetchObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ObjParser */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fetchObject; });
/* harmony import */ var _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glArrayBuffer */ "./src/glArrayBuffer.ts");

// Parses one object from an object file only.
class ObjParser {
    constructor(addHomogenousCoordinate = false) {
        this.textDecoder = new TextDecoder('utf-8');
        this.lineBuf = "";
        this.faceCount = 0;
        this.vertexBuf = [];
        this.normalBuf = [];
        this.texBuf = [];
        this.hasNormals = false;
        this.hasUVs = false;
        this.finalBuf = [];
        this.addHomogenous = addHomogenousCoordinate;
    }
    getArrayBuffer() {
        const params = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferDataParams */ "f"](this.hasNormals, this.hasUVs, this.getTriangleCount() * 3, _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* ArrayBufferDataType */ "a"].TRIANGLES);
        params.elementSize = 3 + (this.addHomogenous ? 1 : 0);
        params.normalsSize = 3 + (this.addHomogenous ? 1 : 0);
        return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferData */ "e"](new Float32Array(this.finalBuf), params);
    }
    getTriangleCount() {
        return this.faceCount;
    }
    feedLine(line) {
        if (line.startsWith('v ')) {
            const vertices = line.split(' ');
            vertices.slice(1).forEach((v) => {
                this.vertexBuf.push(parseFloat(v));
            });
        }
        else if (line.startsWith('vt ')) {
            const tx = line.split(' ');
            tx.slice(1).forEach((v) => {
                this.texBuf.push(parseFloat(v));
            });
            this.hasUVs = true;
        }
        else if (line.startsWith('f ')) {
            const indexes = line.split(' ');
            indexes.slice(1).forEach((v) => {
                const values = v.split('/');
                const vidx = (parseInt(values[0]) - 1) * 3;
                const tidx = (parseInt(values[1]) - 1) * 2;
                const nidx = (parseInt(values[2]) - 1) * 3;
                if (this.hasNormals && nidx === undefined) {
                    throw new Error(`incomplete object, has normals, but can't parse normals from line: ${line}`);
                }
                if (this.hasUVs && tidx === undefined) {
                    throw new Error(`incomplete object, has normals, but can't parse UVs from line: ${line}`);
                }
                this.finalBuf.push(this.vertexBuf[vidx]);
                this.finalBuf.push(this.vertexBuf[vidx + 1]);
                this.finalBuf.push(this.vertexBuf[vidx + 2]);
                if (this.addHomogenous) {
                    this.finalBuf.push(1.);
                }
                // normal
                if (this.hasNormals) {
                    this.finalBuf.push(this.normalBuf[nidx]);
                    this.finalBuf.push(this.normalBuf[nidx + 1]);
                    this.finalBuf.push(this.normalBuf[nidx + 2]);
                    if (this.addHomogenous) {
                        this.finalBuf.push(0.);
                    }
                }
                // UV
                if (this.hasUVs) {
                    this.finalBuf.push(this.texBuf[tidx] || 0.);
                    this.finalBuf.push(1. - this.texBuf[tidx + 1] || 0.);
                }
            });
            this.faceCount += 1;
        }
        else if (line.startsWith('vn ')) {
            const normals = line.split(' ');
            normals.slice(1).forEach((v) => {
                this.normalBuf.push(parseFloat(v));
            });
            this.hasNormals = true;
        }
    }
    feedByteChunk(data) {
        const text = this.textDecoder.decode(data, { stream: true });
        const lines = text.split('\n');
        lines[0] = this.lineBuf + lines[0];
        this.lineBuf = lines.pop();
        // debugger;
        lines.forEach(line => this.feedLine(line));
    }
    endParsing() {
        if (this.lineBuf != "") {
            this.feedLine(this.lineBuf);
            this.lineBuf = "";
        }
    }
    clear() {
        this.lineBuf = "";
        this.vertexBuf = [];
        this.normalBuf = [];
        this.finalBuf = [];
        this.faceCount = 0;
        this.hasNormals = false;
        this.hasUVs = false;
    }
}
async function fetchObject(url, progressCallback, parser) {
    const response = await fetch(url);
    if (progressCallback) {
        progressCallback({ headers: response.headers });
    }
    // Chrome supports incremental fetching, this is more efficient.
    if (response.body) {
        const reader = response.body.getReader();
        const objParser = parser || new ObjParser();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            objParser.feedByteChunk(value);
            if (progressCallback) {
                progressCallback({ length: value.length });
            }
        }
        objParser.endParsing();
        console.log(`fetched object from ${url}`);
        return objParser;
    }
    else {
        const objParser = parser || new ObjParser();
        const data = await response.arrayBuffer();
        objParser.feedByteChunk(data);
        objParser.endParsing();
        return objParser;
    }
}


/***/ }),

/***/ "./src/progressbar.ts":
/*!****************************!*\
  !*** ./src/progressbar.ts ***!
  \****************************/
/*! exports provided: ProgressBarCommon, ProgressBar */
/*! exports used: ProgressBar, ProgressBarCommon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ProgressBarCommon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProgressBar; });
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders */ "./src/shaders.ts");

class ProgressBarCommon {
    constructor(gl, fullScreenBuffer) {
        this.fullScreenBuffer = fullScreenBuffer;
        this.vs = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* VertexShader */ "d"](gl, `
        layout(location = 0) in vec2 a_pos;
        
        uniform float percent;
        out vec2 v_pos;

        void main() {
            gl_Position = vec4((a_pos.x + 1.) * percent - 1., a_pos.y * 0.05, 0., 1.);
            v_pos = a_pos;
        }
        `);
        this.fs = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* FragmentShader */ "a"](gl, `
        precision highp float;
        in vec2 v_pos;
        out vec4 color;
        uniform float percent;
        
        void main() {
            // color = vec4(0.5, 1., 1., 1.);

            // just some random crap to test that variables work.
            // looks OK in the end, so left it.
            color = vec4(v_pos / 2. + 0.5, percent, 1.);
        }
        `);
        this.shader = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderProgram */ "b"](gl, this.vs, this.fs);
        this.percentLoc = this.shader.getUniformLocation(gl, "percent");
    }
    delete(gl) {
        this.fs.delete(gl);
    }
}
class ProgressBar {
    constructor(gl, common) {
        this.common = common;
    }
    prepare(gl) {
        this.common.shader.use(gl);
    }
    render(gl, percent) {
        gl.uniform1f(this.common.percentLoc, percent);
        this.common.fullScreenBuffer.draw(gl);
    }
    delete() {
    }
}


/***/ }),

/***/ "./src/quad.ts":
/*!*********************!*\
  !*** ./src/quad.ts ***!
  \*********************/
/*! exports provided: QuadVertices, QuadArrayBufferData, FULLSCREEN_QUAD_VS, FullScreenQuad */
/*! exports used: FullScreenQuad, QuadArrayBufferData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export QuadVertices */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QuadArrayBufferData; });
/* unused harmony export FULLSCREEN_QUAD_VS */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FullScreenQuad; });
/* harmony import */ var _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glArrayBuffer */ "./src/glArrayBuffer.ts");
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders */ "./src/shaders.ts");


const QuadVertices = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
]);
const QuadArrayBufferData = (() => {
    const params = new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferDataParams */ "f"](false, false, 4, _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* ArrayBufferDataType */ "a"].TRIANGLE_STRIP);
    params.elementSize = 2;
    return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_0__[/* GLArrayBufferData */ "e"](QuadVertices, params);
})();
const FULLSCREEN_QUAD_VS = `
precision highp float;

in vec2 a_pos;
out vec2 v_pos;
out vec2 tx_pos;

void main() {
    gl_Position = vec4(a_pos, 0., 1.);
    v_pos = a_pos;
    tx_pos = v_pos.xy * 0.5 + 0.5;
}
`;
class FullScreenQuad {
    constructor(gl, quadBuffer) {
        this.glArrayBuffer = quadBuffer;
        this.vertexShader = new _shaders__WEBPACK_IMPORTED_MODULE_1__[/* VertexShader */ "d"](gl, FULLSCREEN_QUAD_VS);
        // this object owns the shader, don't let others delete it recursively.
        this.vertexShader.setAutodelete(false);
    }
    bind(gl) {
    }
    draw(gl) {
        this.glArrayBuffer.draw(gl);
    }
}


/***/ }),

/***/ "./src/scene.ts":
/*!**********************!*\
  !*** ./src/scene.ts ***!
  \**********************/
/*! exports provided: randomPointLight, randomPointLights, Scene */
/*! exports used: Scene, randomPointLight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return randomPointLight; });
/* unused harmony export randomPointLights */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Scene; });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object */ "./src/object.ts");
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



function randomPointLight(posScale, intensity) {
    intensity = intensity || 1.;
    const l = new _object__WEBPACK_IMPORTED_MODULE_0__[/* GameObjectBuilder */ "d"]("a light").setPointLightComponent(new _object__WEBPACK_IMPORTED_MODULE_0__[/* PointLightComponent */ "g"]()).build();
    l.transform.position = Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* randVec3 */ "i"])(-posScale, posScale);
    l.transform.scale = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* fromValues */ "f"](0.1, 0.1, 0.1);
    l.transform.update();
    l.pointLight.color = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_1__[/* normalize */ "h"](l.pointLight.color, Object(_utils__WEBPACK_IMPORTED_MODULE_2__[/* randVec3 */ "i"])(0., 1.));
    l.pointLight.intensity = intensity;
    return l.pointLight;
}
function randomPointLights(count, posScale, totalIntensity) {
    if (totalIntensity === undefined) {
        totalIntensity = 1.0;
    }
    const result = [];
    for (let index = 0; index < count; index++) {
        const l = randomPointLight(posScale, totalIntensity / count);
        result.push(l);
    }
    return result;
}
class Scene {
    constructor() {
        this.children = [];
        this.directionalLights = [];
        this.pointLights = [];
    }
    addChild(o) {
        this.children.push(o);
        o.parent = null;
        o.transform.update();
        // console.log(`added ${o.fqdn()} to scene`)
    }
}


/***/ }),

/***/ "./src/shaders.ts":
/*!************************!*\
  !*** ./src/shaders.ts ***!
  \************************/
/*! exports provided: redefine, addLineNumbers, ShaderProgram, FragmentShader, VertexShader, ShaderSourceBuilder */
/*! exports used: FragmentShader, ShaderProgram, ShaderSourceBuilder, VertexShader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export redefine */
/* unused harmony export addLineNumbers */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ShaderProgram; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FragmentShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return VertexShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ShaderSourceBuilder; });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./src/errors.ts");

function redefine(shaderSource, defineName, value) {
    return shaderSource.replace(new RegExp(`#define ${defineName} .*`), `#define ${defineName} ${value}`);
}
function addLineNumbers(source) {
    let line = 1;
    let result = [];
    source.split('\n').forEach(l => {
        result.push(`${line} ${l}`);
        line += 1;
    });
    return result.join('\n');
}
class RawShader {
    constructor(gl, type, source) {
        this.autodelete = false;
        source = '#version 300 es\n' + source;
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* ShaderLoadError */ "b"](error + "\n\n\n" + addLineNumbers(source));
        }
        this.shader = shader;
    }
    setAutodelete(v) {
        this.autodelete = v;
    }
    shouldAutodelete() {
        return this.autodelete;
    }
    getShader() {
        return this.shader;
    }
    delete(gl) {
        gl.deleteShader(this.shader);
        this.shader = null;
    }
}
class ShaderProgram {
    constructor(gl, vs, fs) {
        this._attribs = new Map();
        this._uniforms = new Map();
        this.program = gl.createProgram();
        gl.attachShader(this.program, vs.getShader());
        gl.attachShader(this.program, fs.getShader());
        gl.linkProgram(this.program);
        this.vs = vs;
        this.fs = fs;
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            let error = gl.getProgramInfoLog(this.program);
            gl.deleteProgram(this.program);
            throw new _errors__WEBPACK_IMPORTED_MODULE_0__[/* LinkError */ "a"](error);
        }
    }
    use(gl) {
        gl.useProgram(this.getProgram());
        return this;
    }
    getProgram() {
        return this.program;
    }
    deleteAll(gl) {
        this.delete(gl);
        if (this.fs.shouldAutodelete()) {
            this.fs.delete(gl);
        }
        if (this.vs.shouldAutodelete()) {
            this.vs.delete(gl);
        }
    }
    delete(gl) {
        gl.deleteProgram(this.program);
    }
    getAttribLocation(gl, name) {
        const existing = this._attribs.get(name);
        if (existing !== undefined) {
            return existing;
        }
        const loc = gl.getAttribLocation(this.program, name);
        this._attribs.set(name, loc);
        return loc;
    }
    getUniformLocation(gl, name) {
        const existing = this._uniforms.get(name);
        if (existing !== undefined) {
            return existing;
        }
        const u = gl.getUniformLocation(this.program, name);
        this._uniforms.set(name, u);
        return u;
    }
}
class FragmentShader extends RawShader {
    constructor(gl, source) {
        super(gl, gl.FRAGMENT_SHADER, source);
    }
}
class VertexShader extends RawShader {
    constructor(gl, source) {
        super(gl, gl.VERTEX_SHADER, source);
    }
}
class ShaderSourceBuilder {
    constructor() {
        this.topChunks = [];
        this.chunks = [];
        this.defines = new Map();
        this.redefines = new Map();
        this.precision = 'highp';
    }
    clone() {
        const b = new ShaderSourceBuilder();
        b.topChunks = this.topChunks.slice();
        b.chunks = this.chunks.slice();
        this.defines.forEach((v, k) => {
            b.defines.set(k, v);
        });
        this.redefines.forEach((v, k) => {
            b.redefines.set(k, v);
        });
        b.precision = this.precision;
        return b;
    }
    setPrecision(p) {
        this.precision = p;
        return this;
    }
    defineIfTrue(name, value) {
        if (value) {
            this.defines.set(name, '1');
        }
        return this;
    }
    define(name, value) {
        this.defines.set(name, value);
        return this;
    }
    redefine(name, value) {
        this.redefines.set(name, value);
        return this;
    }
    addChunk(chunk) {
        this.chunks.push(chunk);
        return this;
    }
    addTopChunk(chunk) {
        this.topChunks.push(chunk);
        return this;
    }
    include(other) {
        other.topChunks.forEach(tc => {
            this.topChunks.push(tc);
        });
        other.chunks.forEach(c => {
            this.chunks.push(c);
        });
        other.defines.forEach((v, k) => {
            this.defines.set(k, v);
        });
        other.redefines.forEach((v, k) => {
            this.redefines.set(k, v);
        });
        return this;
    }
    build() {
        const result = [];
        result.push(`precision ${this.precision} float;`);
        this.defines.forEach((v, k) => {
            result.push(`#define ${k} ${v}`);
        });
        this.topChunks.forEach(c => {
            this.redefines.forEach((v, k) => {
                c = redefine(c, k, v);
            });
            result.push(c);
        });
        this.chunks.forEach(c => {
            this.redefines.forEach((v, k) => {
                c = redefine(c, k, v);
            });
            result.push(c);
        });
        return result.join('\n');
    }
}


/***/ }),

/***/ "./src/shaders/final.ts":
/*!******************************!*\
  !*** ./src/shaders/final.ts ***!
  \******************************/
/*! exports provided: FINAL_SHADER_SOURCE */
/*! exports used: FINAL_SHADER_SOURCE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FINAL_SHADER_SOURCE; });
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders */ "./src/shaders.ts");
/* harmony import */ var _includes_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./includes/common */ "./src/shaders/includes/common.ts");
/* harmony import */ var _includes_pbr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./includes/pbr */ "./src/shaders/includes/pbr.ts");



const SHOW_LAYER_FS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* QUAD_FRAGMENT_INPUTS */ "b"])
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* GBUF_TEXTURES */ "a"])
    .addChunk(`
layout(location = 0) out vec4 color;

uniform sampler2D u_ssaoTx;
uniform sampler2D u_shadowmapTx;

uniform float u_lightNear;
uniform float u_lightFar;

float eye_space_z(float depth, float near, float far) {
    float eye_z = near * far / ((depth * (far - near)) - far);
    float val = ( eye_z - (-near) ) / ( -far - (-near) );
    return val;
} 

void main() {
    #ifdef SHOW_SSAO
    color = vec4(vec3(texture(u_ssaoTx, tx_pos).r), 1.);
    return;
    #endif

    vec4 normal = GBUFFER_NORMAL(tx_pos);
    vec4 pos = GBUFFER_POSITION(tx_pos);
    vec4 albedo = GBUFFER_ALBEDO(tx_pos);
    
    float metallic;
    float roughness;
    GBUFFER_MR(tx_pos, metallic, roughness);

    #ifdef SHOW_NORMALS
    color = vec4(normal.xyz * .5 + .5, pos.a);
    // color = normal;
    return;
    #endif

    #ifdef SHOW_POSITIONS
    color = pos;
    return;
    #endif

    #ifdef SHOW_COLORS
    color = albedo;
    return;
    #endif
    
    #ifdef SHOW_METALLIC
    color = vec4(vec3(metallic), pos.a);
    return;
    #endif
    
    #ifdef SHOW_ROUGHNESS
    color = vec4(vec3(roughness), pos.a);
    return;
    #endif

    #ifdef SHADOWMAP_ENABLED
    #ifdef SHOW_SHADOWMAP
    // color = vec4(vec3(eye_space_z(texture(u_shadowmapTx, tx_pos).r, u_lightNear, u_lightFar)), 1.);
    color = vec4(vec3(texture(u_shadowmapTx, tx_pos).r), 1.);
    return;
    #endif
    #endif

    color = vec4(.5, .0, .0, 1.);
    return;
}
`);
const LIGHTING_FS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* QUAD_FRAGMENT_INPUTS */ "b"])
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* GBUF_TEXTURES */ "a"])
    .addTopChunk(`
layout(location = 0) out vec4 color;

#define SHADOW_MAP_ERROR 0.99

uniform sampler2D u_ssaoTx;
uniform sampler2D u_shadowmapTx;

uniform mat4 u_cameraViewSpaceToLightCamera;

uniform float u_shadowMapFixedBias;
uniform float u_shadowMapNormalBias;
uniform float u_lightNear;
uniform float u_lightFar;

struct light {
    #ifdef DIRECTIONAL_LIGHT
    vec3 direction;
    #endif
    
    #ifdef POINT_LIGHT
    float radius;
    float attenuation;
    vec3 position;
    #endif
    
    vec3 color;
    float intensity;
};

uniform vec3[3] u_lightData;

light makeLight() {
    light l;
    
    #ifdef DIRECTIONAL_LIGHT
    l.direction = (u_worldToCameraMatrix * vec4(u_lightData[0], 0.)).xyz;
    #endif
    
    #ifdef POINT_LIGHT
    l.position = (u_worldToCameraMatrix * vec4(u_lightData[0], 1.)).xyz;
    l.radius = u_lightData[2].y;
    l.attenuation = u_lightData[2].z;
    #endif
    
    l.color = u_lightData[1];
    l.intensity = u_lightData[2].x;
    
    return l;
}
`)
    .addTopChunk(_includes_pbr__WEBPACK_IMPORTED_MODULE_2__[/* PBR_INCLUDE */ "a"])
    .addChunk(`
void main() {
    vec4 normal = GBUFFER_NORMAL(tx_pos);
    vec4 pos = GBUFFER_POSITION(tx_pos);
    vec4 albedo = GBUFFER_ALBEDO(tx_pos);

    float metallic;
    float roughness;
    GBUFFER_MR(tx_pos, metallic, roughness);

    // final color.
    vec3 c = vec3(0.);

    light l = makeLight();
    
    #ifdef POINT_LIGHT
    vec3 lightDir = normalize(pos.xyz - l.position);
    float distanceForAttenuation = length(l.position - pos.xyz);
    float attenuation = UE4Falloff(distanceForAttenuation, l.radius);
    
    // color = vec4(1.);
    // return;
    #endif
    
    #ifdef DIRECTIONAL_LIGHT
    vec3 lightDir = l.direction;
    float attenuation = 1.;
    #endif
    
    #ifdef SSAO_ENABLED
    float ssao = texture(u_ssaoTx, tx_pos).r;
    #else
    float ssao = 1.0;
    #endif
    
    //ambient
    vec3 ambient = vec3(AMBIENT_CONSTANT_HACK) * albedo.rgb * l.color * ssao * attenuation * l.intensity;
    c += ambient;

    #ifdef SHADOWMAP_ENABLED
    float bias = u_shadowMapFixedBias + u_shadowMapNormalBias * (1.0 - abs(dot(normal.xyz, -lightDir)));

    vec4 posLSS = u_cameraViewSpaceToLightCamera * pos;
    posLSS.xyz /= posLSS.w;
    
    // color = posLSS;
    // return;

    vec2 texmapscale = vec2(1. / SHADOW_MAP_WIDTH, 1. / SHADOW_MAP_HEIGHT);

    int notInShadowSamples = 0;
    float x, y;
    float shadowMapDepth;
    vec2 base = posLSS.xy * 0.5 + 0.5;

    for (y = -1.5; y <= 1.5; y += 1.0) {
        for (x = -1.5; x <= 1.5; x += 1.0) {
            vec2 offset = base + vec2(x, y) * texmapscale;
            
            // the depth buffer texture is clamped to 0, 1, so unclamp.
            shadowMapDepth = texture(u_shadowmapTx, offset).r * 2. - 1.;
            
            // out of bounds by X or Y
            if (offset.x < 0. || offset.y < 0. || offset.x > 1. || offset.y > 1.) {
                notInShadowSamples++;
                continue;
            }
            
            // out of bounds by Z case
            if (abs(posLSS.z) > 1.) {
                // if out of bounds by Z, then it's in shadow if there's anything else in view (i.e. there's depth)
                if (abs(shadowMapDepth) < SHADOW_MAP_ERROR) {
                    continue;
                }
                notInShadowSamples++;
                continue;
            } else if (shadowMapDepth > posLSS.z - bias) {
                notInShadowSamples++;
            }
        }
    }
    l.intensity *= float(notInShadowSamples) / 16.0;
    #endif
    
    // calculate per-light radiance
    vec3 radiance = l.color * attenuation * l.intensity;
    
    c += CookTorranceBRDF(
        albedo.xyz, roughness, metallic, 
        -normalize(pos.xyz), normal.xyz, -lightDir, radiance
    );

    c = toneMap(c);

    color = vec4(c.xyz, 1.);
}
`);
const POINT_LIGHT_RADIUS_VS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addChunk(`
layout(location = 0) in vec4 a_pos;
out vec2 tx_pos;

void main() {
    gl_Position = u_perspectiveMatrix * u_modelViewMatrix * a_pos;
    gl_Position /= gl_Position.w;
    tx_pos = (gl_Position.xy / gl_Position.w) / 2. + 0.5;
}
`);
const FINAL_SHADER_SOURCE = {
    fs: LIGHTING_FS,
    showLayerFS: SHOW_LAYER_FS,
    pointLightSphere: POINT_LIGHT_RADIUS_VS,
};


/***/ }),

/***/ "./src/shaders/gBuffer.ts":
/*!********************************!*\
  !*** ./src/shaders/gBuffer.ts ***!
  \********************************/
/*! exports provided: GBUFFER_SHADER_SOURCE */
/*! exports used: GBUFFER_SHADER_SOURCE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GBUFFER_SHADER_SOURCE; });
const VS = `
precision highp float;

layout(location = 0) in vec4 a_pos;
layout(location = 1) in vec3 a_norm;
layout(location = 2) in vec2 a_uv;
layout(location = 3) in vec4 a_tangent;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_perspectiveMatrix;

out vec4 v_pos;
out vec4 v_norm;
out vec2 v_uv;
out vec4 v_tangent;

void main() {
    v_pos = u_modelViewMatrix * a_pos;
    gl_Position = u_perspectiveMatrix * u_modelViewMatrix * a_pos;

    v_norm = normalize(u_modelViewMatrix * vec4(a_norm, 0.));
    v_uv = a_uv;
    v_tangent = a_tangent;
    gl_PointSize = 2.;    
}
`;
const FS = `
precision highp float;

in vec4 v_pos;
in vec4 v_norm;
in vec4 v_tangent;
in vec2 v_uv;

uniform mat4 u_modelViewMatrix;
uniform vec4 u_albedo;
uniform vec4 u_albedoFactor;
uniform bool u_albedoHasFactor;
uniform bool u_albedoHasTexture;
uniform sampler2D u_albedoTexture;

uniform float u_metallic;
uniform bool u_metallicHasTexture;
uniform sampler2D u_metallicTexture;

uniform float u_roughness;
uniform bool u_roughnessHasTexture;
uniform sampler2D u_roughnessTexture;

uniform bool u_normalMapHasTexture;
uniform bool u_hasTangent;
uniform sampler2D u_normalMapTx;

layout(location = 0) out vec4 gbuf_position;
layout(location = 1) out vec3 gbuf_normal;
layout(location = 2) out vec4 gbuf_albedo;
layout(location = 3) out vec4 gbuf_metallic_roughness;

vec4 srgb(vec4 color) {
    return vec4(pow(color.rgb, vec3(2.2)), color.a);
}

void main() {
    gbuf_position = vec4(v_pos.xyz, 1.0);
    vec3 normal;
    if (u_normalMapHasTexture && u_hasTangent) {
        vec3 normalMap = normalize(texture(u_normalMapTx, v_uv).xyz * 2. - 1.);
        vec3 tangent = normalize(u_modelViewMatrix * vec4(v_tangent.xyz, 0.)).xyz;
        vec3 bitangent = cross(v_norm.xyz, tangent) * v_tangent.w;
        mat3 tangentToView = mat3(
            tangent,
            bitangent,
            v_norm.xyz
        );
        normal = normalize(tangentToView * normalMap);
    } else {
        normal = normalize(v_norm.xyz);
    }
    // encode Z normal sign in R. This is pretty stupid encoding but does the job.
    if (normal.z < 0.) {
        normal.x += 3.;
    }
    gbuf_normal = normal;
    
    if (u_albedoHasTexture) {
        gbuf_albedo = srgb(texture(u_albedoTexture, v_uv));
        if (u_albedoHasFactor) {
           gbuf_albedo *= u_albedoFactor;
        }
    } else {
        gbuf_albedo = u_albedo;
    }

    if (gbuf_albedo.a == 0.) {
        discard;
        return;
    }
    
    float metallic;
    float roughness;
    
    if (u_metallicHasTexture) {
        metallic = texture(u_metallicTexture, v_uv).b;
    } else {
        metallic = u_metallic;
    }
    
    if (u_roughnessHasTexture) {
        roughness = texture(u_roughnessTexture, v_uv).g;
    } else {
        roughness = u_roughness;
    }
    
    gbuf_metallic_roughness = vec4(metallic, roughness, 1., 1.);
}
`;
const GBUFFER_SHADER_SOURCE = {
    vs: VS,
    fs: FS,
};


/***/ }),

/***/ "./src/shaders/includes/common.ts":
/*!****************************************!*\
  !*** ./src/shaders/includes/common.ts ***!
  \****************************************/
/*! exports provided: GBUF_TEXTURES, QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS */
/*! exports used: GBUF_TEXTURES, QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GBUF_TEXTURES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QUAD_FRAGMENT_INPUTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return WORLD_AND_CAMERA_TRANSFORMS; });
const GBUF_TEXTURES = `
uniform sampler2D gbuf_position;
uniform sampler2D gbuf_normal;
uniform sampler2D gbuf_colormap;
uniform sampler2D gbuf_metallic_roughness;

vec4 read_gbuffer_normal(vec2 pos) {
    vec3 val = texture(gbuf_normal, pos).xyz;
    bool zIsNegative = false;
    if (val.x > 1.5) {
        val.x -= 3.;
        zIsNegative = true;
    }
    // clamp is for float error correction
    val.z = sqrt(clamp(1. - val.x * val.x - val.y * val.y, 0., 1.));
    if (zIsNegative) {
        val.z = -val.z;
    }
    val = normalize(val);
    return vec4(val, 0.);
}

struct metallicRoughness {
    float metallic;
    float roughness;
};

void gbufferMetallicRoughness(vec2 coord, out float metallic, out float roughness) {
    vec4 tx = texture(gbuf_metallic_roughness, coord);
    metallic = tx.r;
    roughness = tx.g;
    return;
}

#define GBUFFER_POSITION(coord) (texture(gbuf_position, coord))
#define GBUFFER_NORMAL(coord) (read_gbuffer_normal(coord))
#define GBUFFER_ALBEDO(coord) (texture(gbuf_colormap, coord))
#define GBUFFER_MR(coord, metallic, roughness)     gbufferMetallicRoughness(coord, metallic, roughness)
`;
const QUAD_FRAGMENT_INPUTS = `
in vec2 v_pos;
in vec2 tx_pos;
`;
const WORLD_AND_CAMERA_TRANSFORMS = `
uniform vec3 u_cameraPos;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_cameraToWorldMatrix;
uniform mat4 u_perspectiveMatrix;
`;


/***/ }),

/***/ "./src/shaders/includes/pbr.ts":
/*!*************************************!*\
  !*** ./src/shaders/includes/pbr.ts ***!
  \*************************************/
/*! exports provided: PBR_INCLUDE */
/*! exports used: PBR_INCLUDE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PBR_INCLUDE; });
const PBR_INCLUDE = `
const float PI = 3.14159265359;

// https://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf

float UE4Falloff(float distance, float lightRadius) {
    float nominator = clamp(1. - pow(distance / lightRadius, 4.), 0., 1.); 
    return nominator * nominator / (distance * distance + 1.);
}

float UE4NDF(float NdotH, float roughness)
{
    float a      = roughness*roughness;
    float a2     = a*a;
    float NdotH2 = NdotH*NdotH;
	
    float num   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
	
    return num / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float num   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
	
    return num / denom;
}

float GeometrySmith(float NdotV, float NdotL, float roughness) {
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}

vec3 fresnelSchlick(float HdotV, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - HdotV, 5.0);
}  

vec3 fresnelSchlick(vec3 albedo, float metallic, float HdotV) {
    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);

    return fresnelSchlick(HdotV, F0);
}

vec3 CookTorranceBRDF(
    vec3 albedo, float roughness, float metallic, 
    vec3 V, vec3 normal, vec3 L, vec3 radiance
) {
    vec3 H = normalize(V + L);
    vec3 N = normal;
    
    float NdotL = max(dot(N, L), 0.);
    float NdotH = max(dot(N, H), 0.);
    float NdotV = max(dot(N, V), 0.);
    float HdotV = max(dot(H, V), 0.);

    float NDF = UE4NDF(NdotH, roughness);
    // return NDF * radiance * NdotL;
    
    float G = GeometrySmith(NdotV, NdotL, roughness);      
    vec3 F = fresnelSchlick(albedo, metallic, HdotV);       
    
    vec3 kD = vec3(1.0) - F;
    kD *= 1.0 - metallic;	  
    
    vec3 numerator    = NDF * G * F;
    float denominator = 4.0 * NdotV * NdotL;
    vec3 specular     = numerator / max(denominator, 0.001);
        
    // add to outgoing radiance Lo
    return (kD * albedo.xyz / PI + specular) * radiance * NdotL; 
}

vec3 toneMap(vec3 color) {
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));
    return color; 
}

`;


/***/ }),

/***/ "./src/shaders/shadowMap.ts":
/*!**********************************!*\
  !*** ./src/shaders/shadowMap.ts ***!
  \**********************************/
/*! exports provided: SHADOWMAP_SHADERS */
/*! exports used: SHADOWMAP_SHADERS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SHADOWMAP_SHADERS; });
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders */ "./src/shaders.ts");
/* harmony import */ var _includes_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./includes/common */ "./src/shaders/includes/common.ts");


const VS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addChunk(`
layout(location = 0) in vec4 a_pos;
out vec4 v_pos;

uniform mat4 u_lightCameraWorldToProjectionMatrix;

void main() {
    v_pos = u_lightCameraWorldToProjectionMatrix * u_modelWorldMatrix * a_pos;
    gl_Position = v_pos;
}
`);
const FS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addChunk(`
void main() {
}
`);
const SHADOWMAP_SHADERS = {
    vs: VS,
    fs: FS,
};


/***/ }),

/***/ "./src/shaders/ssao.ts":
/*!*****************************!*\
  !*** ./src/shaders/ssao.ts ***!
  \*****************************/
/*! exports provided: SSAO_SHADER_SOURCE */
/*! exports used: SSAO_SHADER_SOURCE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SSAO_SHADER_SOURCE; });
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders */ "./src/shaders.ts");
/* harmony import */ var _includes_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./includes/common */ "./src/shaders/includes/common.ts");


const SSAO_FIRST_PASS_FS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .setPrecision('lowp')
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* GBUF_TEXTURES */ "a"])
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* QUAD_FRAGMENT_INPUTS */ "b"])
    .addChunk(`
layout(location = 0) out vec4 color;

uniform float u_ssaoRadius;
uniform float u_ssaoBias;
uniform sampler2D u_ssaoNoise;
uniform vec2 u_ssaoNoiseScale;
uniform vec3[SSAO_SAMPLES] u_ssaoSamples;

float ssao(vec3 normalVS, vec4 posVS, vec2 tx_pos) {
    vec3 random = normalize(texture(u_ssaoNoise, tx_pos * u_ssaoNoiseScale).xyz);
    vec3 tangent = normalize(random - normalVS * dot(normalVS, random));
    vec3 bitangent = cross(normalVS, tangent);
    
    mat3 tangentToViewSpaceMatrix = mat3(tangent, bitangent, normalVS);

    // return vec4(normal, 1.);
    // return vec4(tangentToViewSpaceMatrix * normalVS, 1.);

    float radius = u_ssaoRadius;
    float samples = float(SSAO_SAMPLES);
    float occlusion = 0.;
    float totalWeight = 0.;
    float bias = u_ssaoBias;

    for (int i = 0; i < SSAO_SAMPLES; i++) {
        vec4 randomVectorVS = vec4(tangentToViewSpaceMatrix * u_ssaoSamples[i], 0.);
        // vec4 randomVectorVS = vec4(tangentToViewSpaceMatrix * vec3(0., 0., 1.), 0.);

        // Sample in view space.
        vec4 sampleVS = posVS + randomVectorVS * radius;

        vec4 sampleSS = u_perspectiveMatrix * sampleVS;
        sampleSS /= sampleSS.w;
        
        float weight = dot(randomVectorVS.xyz, normalVS.xyz);
        totalWeight += weight;

        vec2 absSampleSS = abs(sampleSS.xy);
        if (absSampleSS.x >= 1. || absSampleSS.y >= 1.) {
            continue;
        }
        
        vec4 storedPosVS = GBUFFER_POSITION(sampleSS.xy * 0.5 + 0.5);
        float storedDepthVS = storedPosVS.z;

        if (storedDepthVS > sampleVS.z + bias) {
            float falloff = smoothstep(0.0, 1.0, radius / length(storedPosVS.xyz - posVS.xyz));
            // float falloff = 1. - smoothstep(0.8, 1.2, length(storedPosVS.xyz - posVS.xyz) / radius);
            occlusion += falloff * weight;
        }
    }
    occlusion = 1. - (occlusion / totalWeight);
    return occlusion;
}

void main() {
    vec3 normal = GBUFFER_NORMAL(tx_pos).xyz;
    vec4 pos = GBUFFER_POSITION(tx_pos);

    float occlusion = ssao(normal, pos, tx_pos);
    color = vec4(vec3(occlusion), pos.a);
}
`);
const SSAO_BLUR_FS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* GBUF_TEXTURES */ "a"])
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* QUAD_FRAGMENT_INPUTS */ "b"])
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addChunk(`
layout(location = 0) out vec4 color;

uniform sampler2D u_ssaoFirstPassTx;
uniform float u_ssaoStrength;
uniform float u_ssaoBlurPositionThreshold;
uniform float u_ssaoBlurNormalThreshold;

// This does position and normal-aware "smart-blur".
float getSsaoBlurred(vec4 posVS, vec3 normalVS) {
    vec2 texelSize = vec2(1. / float(SSAO_TEXEL_SIZE_X), 1. / float(SSAO_TEXEL_SIZE_Y));
    
    if (posVS.a == 0.) {
        return 1.;
    }

    int samples = 1;
    float occlusion = texture(u_ssaoFirstPassTx, tx_pos).r;
    // return occlusion;
    
    for (int i = -SSAO_NOISE_SCALE / 2; i < SSAO_NOISE_SCALE / 2; i++) {
        for (int j = -SSAO_NOISE_SCALE / 2; j < SSAO_NOISE_SCALE / 2; j++) {
            if (i == 0 && j == 0) {
                continue;
            }

            vec2 offset = tx_pos + texelSize * vec2(float(i), float(j));
            
            vec4 posVS_offset = GBUFFER_POSITION(offset);
            if (posVS_offset.a == 0.) {
                continue;
            }
            
            if (abs(posVS.z - posVS_offset.z) > u_ssaoBlurPositionThreshold) {
                continue;
            }
            
            vec3 normalVS_offset = GBUFFER_NORMAL(offset).xyz;
            if (abs(dot(normalVS_offset, normalVS)) < u_ssaoBlurNormalThreshold) {
                continue;
            }
            
            occlusion += texture(u_ssaoFirstPassTx, offset).r;
            samples += 1;
        }
    }

    occlusion /= float(samples);
    
    return pow(occlusion, u_ssaoStrength);
}

void main() {
    vec3 normalVS = GBUFFER_NORMAL(tx_pos).xyz;
    vec4 posVS = GBUFFER_POSITION(tx_pos);
    
    color = vec4(getSsaoBlurred(posVS, normalVS), 0., 0., 1.);
    // color = vec4(texture(u_ssaoFirstPassTx, tx_pos).xyz, 1.);
}
`);
const SSAO_SHADER_SOURCE = {
    first_pass_fs: SSAO_FIRST_PASS_FS,
    blur_pass_fs: SSAO_BLUR_FS
};


/***/ }),

/***/ "./src/shaders/ssr.ts":
/*!****************************!*\
  !*** ./src/shaders/ssr.ts ***!
  \****************************/
/*! exports provided: SSR_SHADERS */
/*! exports used: SSR_SHADERS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SSR_SHADERS; });
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders */ "./src/shaders.ts");
/* harmony import */ var _includes_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./includes/common */ "./src/shaders/includes/common.ts");


const FS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* QUAD_FRAGMENT_INPUTS */ "b"])
    .addChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* GBUF_TEXTURES */ "a"])
    .addChunk(`
out vec4 color;
uniform sampler2D u_lightedSceneTx;

void main() {
    vec3 eye = vec3(0., 0., 0.);
    vec4 posVS = GBUFFER_POSITION(tx_pos);
    vec4 normalVS = GBUFFER_NORMAL(tx_pos);
    
    float metallic;
    float roughness;
    GBUFFER_MR(tx_pos, metallic, roughness);
    
    vec3 reflectRay = reflect(normalize(posVS.xyz - eye), normalVS.xyz);

    // float strength = (1. - roughness) * metallic;
    float strength = (1. - roughness);
    // float strength = 1.; // this is good for testing SSR or just displaying it.
    if (strength < 0.01) {
        color = vec4(vec3(0.), 0.);
        return;
    }
    
    vec3 c = vec3(0.);
    
    int i = 0;

    bool isFound = false;
    
    for (; i < SSR_STEPS; i++) {
        vec3 sampleVS = posVS.xyz + reflectRay * (SSR_STEP_SIZE * float(i + 1));
        vec4 sampleSS4 = u_perspectiveMatrix * vec4(sampleVS, 1.);
        vec3 sampleSS = sampleSS4.xyz / sampleSS4.w;
        
        // ignore off-screen samples
        if (abs(sampleSS.x) > 1. || abs(sampleSS.y) > 1.) {
            break;
        } 
        
        vec4 resultVS = GBUFFER_POSITION(sampleSS.xy * 0.5 + 0.5);
        
        // The ray intersected smth, do binary search
        float distance = resultVS.z - sampleVS.z;
        float minDistance = abs(distance);
        vec3 minPosSS = sampleSS;
        
        if (distance > 0. && resultVS.a > 0.) {
            vec3 dir = reflectRay * (SSR_STEP_SIZE * 0.5);
            for (int j = 0; j < SSR_BINARY_SEARCH_STEPS; ++j) {
                if (distance > 0.) {
                    sampleVS -= dir;
                } else {
                    sampleVS += dir;
                }
                dir *= 0.5;
                
                sampleSS4 = u_perspectiveMatrix * vec4(sampleVS, 1.);
                sampleSS = sampleSS4.xyz / sampleSS4.w;
                
                resultVS = GBUFFER_POSITION(sampleSS.xy * 0.5 + 0.5);
                
                // hit out-of-bounds somewhere.
                if (resultVS.a == 0.) {
                    continue;
                }
                
                distance = resultVS.z - sampleVS.z;
                if (abs(distance) < minDistance) {
                    minDistance = abs(distance);
                    minPosSS = sampleSS;
                }
            }
            
            // c = vec3(distance);
            if (abs(minDistance) < 0.05) {
                float howFar = clamp(length(sampleVS - posVS.xyz) / (float(SSR_STEPS) * SSR_STEP_SIZE), 0., 1.);
                // the further the sample is from the start and the closer it is to screen edges, the more is attenuation.
                float attenuation = (1. - howFar) * (1. - smoothstep(.7, .95, abs(sampleSS.x))) * (1. - smoothstep(.7, .95, abs(sampleSS.y)));
                strength *= attenuation;
                c = texture(u_lightedSceneTx, minPosSS.xy * 0.5 + 0.5).xyz;
                isFound = true;
            }
            break;
        }
    }

    if (!isFound) {
        strength = 0.;
    }

    color = vec4(c, strength);
}
`);
const SSR_SHADERS = {
    fs: FS,
};


/***/ }),

/***/ "./src/shaders/visualize-lights.ts":
/*!*****************************************!*\
  !*** ./src/shaders/visualize-lights.ts ***!
  \*****************************************/
/*! exports provided: VISUALIZE_LIGHTS_SHADERS */
/*! exports used: VISUALIZE_LIGHTS_SHADERS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VISUALIZE_LIGHTS_SHADERS; });
/* harmony import */ var _shaders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shaders */ "./src/shaders.ts");
/* harmony import */ var _includes_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./includes/common */ "./src/shaders/includes/common.ts");


const VS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addChunk(`
layout(location = 0) in vec4 a_pos;
out vec4 v_pos;
out vec2 tx_pos;

void main() {
    v_pos = u_modelViewMatrix * a_pos;
    gl_Position = u_perspectiveMatrix * v_pos;
    tx_pos = (gl_Position.xy / gl_Position.w) / 2. + 0.5;
}
`);
const FS = new _shaders__WEBPACK_IMPORTED_MODULE_0__[/* ShaderSourceBuilder */ "c"]()
    .addTopChunk(_includes_common__WEBPACK_IMPORTED_MODULE_1__[/* WORLD_AND_CAMERA_TRANSFORMS */ "c"])
    .addChunk(`
in vec4 v_pos;
in vec2 tx_pos;

uniform vec3 u_color;
uniform float u_intensity;
uniform sampler2D u_posTexture;

out vec4 color;

void main() {
    float alpha = 1.0;
    vec4 sceneTexel = texture(u_posTexture, tx_pos);
    vec4 scenePos = sceneTexel;
    if (scenePos.z > v_pos.z && sceneTexel.a > 0.) {
        alpha = 0.;
    }
    color = vec4(u_color * u_intensity, alpha);
}
`);
const VISUALIZE_LIGHTS_SHADERS = {
    vs: VS,
    FS: FS,
};


/***/ }),

/***/ "./src/texture.ts":
/*!************************!*\
  !*** ./src/texture.ts ***!
  \************************/
/*! exports provided: vec3ToUnit8Array, fillTexture2DWithEmptyTexture, ImagePixels, DDSPixels, Texture */
/*! exports used: DDSPixels, ImagePixels, Texture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export vec3ToUnit8Array */
/* unused harmony export fillTexture2DWithEmptyTexture */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ImagePixels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DDSPixels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Texture; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var parse_dds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! parse-dds */ "./node_modules/parse-dds/index.js");
/* harmony import */ var parse_dds__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(parse_dds__WEBPACK_IMPORTED_MODULE_1__);


function r1to255(v) {
    return Math.trunc(v * 255);
}
function vec3ToUnit8Array(v) {
    const nv = _utils__WEBPACK_IMPORTED_MODULE_0__[/* tmpVec4 */ "n"];
    nv[0] = r1to255(v[0]);
    nv[1] = r1to255(v[1]);
    nv[2] = r1to255(v[2]);
    nv[3] = 255;
    return new Uint8Array(nv);
}
function fillTexture2DWithEmptyTexture(gl, defaultColor) {
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = vec3ToUnit8Array(defaultColor);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
}
class ImagePixels {
    constructor(img) {
        this.img = img;
    }
    setupTexture(gl) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
}
function getDDSFormat(ext, ddsFormat) {
    switch (ddsFormat) {
        case 'dxt1':
            return ext.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case 'dxt3':
            return ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case 'dxt5':
            return ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        default:
            throw new Error('unsupported format ' + ddsFormat);
    }
}
class DDSPixels {
    constructor(data) {
        this.data = data;
        this.dds = parse_dds__WEBPACK_IMPORTED_MODULE_1__(this.data);
    }
    setupTexture(gl) {
        const ext = gl.getExtension("WEBGL_compressed_texture_s3tc");
        if (!ext) {
            throw new Error("Compressed textures not supported, can't load WEBGL_compressed_texture_s3tc");
        }
        for (let mip = 0; mip < this.dds.images.length; mip++) {
            const image = this.dds.images[mip];
            const data = new Uint8Array(this.data, image.offset, image.length);
            var width = image.shape[0];
            var height = image.shape[1];
            gl.compressedTexImage2D(gl.TEXTURE_2D, mip, getDDSFormat(ext, this.dds.format), width, height, 0, data);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }
}
class Texture {
    constructor(gl, pixels, defaultColor) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        fillTexture2DWithEmptyTexture(gl, defaultColor);
        this.promise = pixels.then(img => this.bindImageToTexture(gl, img));
    }
    getTexture() {
        return this.texture;
    }
    getPromise() {
        return this.promise;
    }
    bindImageToTexture(gl, pixels) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        pixels.setupTexture(gl);
    }
}


/***/ }),

/***/ "./src/ui.ts":
/*!*******************!*\
  !*** ./src/ui.ts ***!
  \*******************/
/*! exports provided: c, funcRef, e, Form, FormGroup, FormRow, InputGroup, NumberInput, SliderInput, ColorInput, RadioInput, CheckBoxInput */
/*! exports used: CheckBoxInput, ColorInput, Form, FormGroup, FormRow, NumberInput, RadioInput, SliderInput, c, e, funcRef */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return c; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return funcRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return e; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Form; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return FormGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return FormRow; });
/* unused harmony export InputGroup */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return NumberInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return SliderInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ColorInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return RadioInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CheckBoxInput; });
const nextId = (() => {
    let id = 0;
    return () => {
        id++;
        return id;
    };
})();
const c = (name) => {
    return { className: name };
};
const funcRef = (ref) => {
    const f = function () {
        if (f.ref) {
            f.ref.apply(null, arguments);
        }
    };
    f.ref = ref;
    return f;
};
const e = (name, props, ...children) => {
    const el = document.createElement(name);
    if (props) {
        for (const k in props) {
            if (!props.hasOwnProperty(k)) {
                continue;
            }
            const v = props[k];
            switch (k) {
                case 'for':
                    el.setAttribute('for', props.for);
                    break;
                default:
                    el[k] = v;
            }
        }
    }
    const cb = c => {
        if (c instanceof Array) {
            c.map(cb);
        }
        else if (typeof c === 'string') {
            el.textContent = c;
        }
        else {
            el.appendChild(c);
        }
    };
    children.map(cb);
    return el;
};
const Form = (...children) => {
    return e('div', c('form'), ...children);
};
const FormGroup = (label, ...children) => {
    return e('div', c('form-group'), e('label', null, label), ...children);
};
const FormRow = (...children) => {
    return e('div', c('form-row'), ...children);
};
/**
 * @deprecated
 */
const InputGroup = (...children) => {
    // return e('div', c('input-group input-group-sm'), ...children);
    return children;
};
const NumberInput = (label, props, onChange) => {
    return e('div', c('input-group input-group-xs'), e('div', c('input-group-prepend'), e('span', c('input-group-text'), label)), e('input', Object.assign({}, props, { className: 'form-control', type: 'number', onchange: (ev) => {
            props.value = ev.target.value;
            onChange(ev.target.value);
        } })));
};
const SliderInput = (label, props, onChange) => {
    const id = nextId();
    return [
        e('label', { for: id.toString() }, label),
        e('input', Object.assign({}, props, { className: 'form-control-range', type: 'range', id: id.toString(), onchange: (ev) => {
                props.value = ev.target.value;
                onChange(ev.target.value);
            } })),
    ];
};
const ColorInput = (label, props, onChange) => {
    const valueLabel = e('div', c('color-label'), props.value.toString());
    return e('div', c('input-group input-group-xs'), e('div', c('input-group-prepend'), e('span', c('input-group-text'), label)), e('input', Object.assign({}, props, { className: 'form-control', type: 'color', onchange: (ev) => {
            const v = ev.target.value;
            props.value = v;
            valueLabel.textContent = v;
            onChange(v);
        } })), valueLabel);
};
const RadioInput = (options, props, onChange) => {
    const id = nextId();
    return options.map(o => {
        const eid = nextId();
        return e('div', c('form-check'), e('input', {
            className: 'form-check-input',
            name: id.toString(),
            type: 'radio',
            id: eid.toString(),
            value: o.value,
            checked: o.value === props.value,
            onchange: (ev) => {
                props.value = ev.target.value;
                onChange(ev.target.value);
            }
        }), e('label', { className: 'form-check-label', for: eid.toString() }, o.label));
    });
};
const CheckBoxInput = (label, props, onChange) => {
    const id = nextId();
    return e('div', c('form-check'), e('input', Object.assign({}, props, { className: 'form-check-input', type: 'checkbox', id: id.toString(), onchange: (ev) => {
            props.checked = ev.target.checked;
            onChange(ev.target.checked);
        } })), e('label', { className: 'form-check-label', for: id.toString() }, label));
};


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: initGL, clip, clamp, lerp, randFloat, randVec3, makeObjLoader, cacheOnFirstUse, makeCache, loadSphere, loadCube, tmpMat4, tmpVec3, tmpVec4, tmpBoundingBoxCache, tmpIdentityMatrix, makeWorldSpaceCameraFrustum, makeDirectionalLightWorldToCameraMatrix, orthoProjection, computeBoundingBoxInTransformedSpace, optimizeNearFar, tmpProjectionMatrix, computeDirectionalLightCameraWorldToProjectionMatrix, hexToRgb1, rgbToHex, mapComputeIfAbsent */
/*! exports used: clip, computeDirectionalLightCameraWorldToProjectionMatrix, hexToRgb1, initGL, lerp, mapComputeIfAbsent, optimizeNearFar, randFloat, randVec3, tmpIdentityMatrix, tmpMat4, tmpProjectionMatrix, tmpVec3, tmpVec4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return initGL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return clip; });
/* unused harmony export clamp */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return lerp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return randFloat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return randVec3; });
/* unused harmony export makeObjLoader */
/* unused harmony export cacheOnFirstUse */
/* unused harmony export makeCache */
/* unused harmony export loadSphere */
/* unused harmony export loadCube */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return tmpMat4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return tmpVec3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return tmpVec4; });
/* unused harmony export tmpBoundingBoxCache */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return tmpIdentityMatrix; });
/* unused harmony export makeWorldSpaceCameraFrustum */
/* unused harmony export makeDirectionalLightWorldToCameraMatrix */
/* unused harmony export orthoProjection */
/* unused harmony export computeBoundingBoxInTransformedSpace */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return optimizeNearFar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return tmpProjectionMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return computeDirectionalLightCameraWorldToProjectionMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return hexToRgb1; });
/* unused harmony export rgbToHex */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return mapComputeIfAbsent; });
/* harmony import */ var gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec3 */ "./node_modules/gl-matrix/src/gl-matrix/vec3.js");
/* harmony import */ var gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/mat4 */ "./node_modules/gl-matrix/src/gl-matrix/mat4.js");
/* harmony import */ var gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gl-matrix/src/gl-matrix/vec4 */ "./node_modules/gl-matrix/src/gl-matrix/vec4.js");
/* harmony import */ var _objparser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objparser */ "./src/objparser.ts");
/* harmony import */ var _glArrayBuffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./glArrayBuffer */ "./src/glArrayBuffer.ts");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./camera */ "./src/camera.ts");
/* harmony import */ var _axisAlignedBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./axisAlignedBox */ "./src/axisAlignedBox.ts");







function initGL(canvas) {
    let gl = canvas.getContext("webgl2", {
        antialias: false,
    });
    gl.getExtension("EXT_color_buffer_float");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return gl;
}
const clip = (v, min, max) => {
    if (v < min) {
        return min;
    }
    if (v > max) {
        return max;
    }
    return v;
};
const clamp = clip;
function lerp(v, a, b, c, d) {
    return c + v / (b - a) * (d - c);
}
function randFloat(min, max) {
    const v = Math.random();
    return lerp(v, 0, 1, min, max);
}
function randVec3(min, max) {
    return gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* fromValues */ "f"](randFloat(min, max), randFloat(min, max), randFloat(min, max));
}
function makeObjLoader(name) {
    let sphere = null;
    return function loadObject() {
        if (sphere) {
            return sphere;
        }
        sphere = Object(_objparser__WEBPACK_IMPORTED_MODULE_3__[/* fetchObject */ "a"])(name);
        return sphere;
    };
}
function cacheOnFirstUse(factory) {
    let obj = null;
    return () => {
        if (obj === null) {
            obj = factory();
        }
        return obj;
    };
}
function makeCache(factory) {
    let cache = new Array(1);
    return (index) => {
        if (cache[index] === undefined) {
            cache[index] = factory();
        }
        return cache[index];
    };
}
const loadSphere = makeObjLoader('resources/sphere.obj');
const loadCube = makeObjLoader('resources/cube.obj');
const tmpMat4 = gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* create */ "b"]();
const tmpVec3 = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* create */ "c"]();
const tmpVec4 = gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__[/* create */ "d"]();
const tmpBoundingBoxCache = makeCache(() => new _axisAlignedBox__WEBPACK_IMPORTED_MODULE_6__[/* AxisAlignedBox */ "a"]());
const tmpIdentityMatrix = (function () {
    const m = gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* create */ "b"]();
    return () => {
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* identity */ "d"](m);
        return m;
    };
})();
const makeWorldSpaceCameraFrustum = (() => {
    const identityAABB = cacheOnFirstUse(() => new _axisAlignedBox__WEBPACK_IMPORTED_MODULE_6__[/* AxisAlignedBox */ "a"]());
    const identityAABBVertexBuffer = cacheOnFirstUse(() => new Float32Array(8 * 3));
    const identityAABBWireframeBuffer = cacheOnFirstUse(() => new Float32Array(24 * 3));
    return (camera, pointsOnly = false, isTemporary = true) => {
        const camToWorld = camera.getCameraToWorld();
        let cubeVertices;
        if (pointsOnly) {
            cubeVertices = identityAABB().asVerticesBuffer();
        }
        else {
            cubeVertices = identityAABB().asWireFrameBuffer();
        }
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* invert */ "e"](tmpMat4, camera.projectionMatrix().matrix);
        let data;
        if (isTemporary) {
            if (pointsOnly) {
                data = identityAABBVertexBuffer();
            }
            else {
                data = identityAABBWireframeBuffer();
            }
        }
        else {
            if (pointsOnly) {
                data = new Float32Array(8 * 3);
            }
            else {
                data = new Float32Array(24 * 3);
            }
        }
        for (const it of cubeVertices.iterator(_glArrayBuffer__WEBPACK_IMPORTED_MODULE_4__[/* tmpIter */ "k"])) {
            const v = tmpVec4;
            const l = it.ve - it.vs;
            if (l != 3) {
                throw new Error('unsupported length of cubeVertices, should be 3');
            }
            v[0] = cubeVertices.buf[it.vs];
            v[1] = cubeVertices.buf[it.vs + 1];
            v[2] = cubeVertices.buf[it.vs + 2];
            v[3] = 1;
            gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__[/* transformMat4 */ "o"](v, v, tmpMat4);
            gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__[/* scale */ "l"](v, v, 1. / v[3]);
            gl_matrix_src_gl_matrix_vec4__WEBPACK_IMPORTED_MODULE_2__[/* transformMat4 */ "o"](v, v, camToWorld);
            data[it.vs] = v[0];
            data[it.vs + 1] = v[1];
            data[it.vs + 2] = v[2];
        }
        return new _glArrayBuffer__WEBPACK_IMPORTED_MODULE_4__[/* GLArrayBufferData */ "e"](data, cubeVertices.params);
    };
})();
const makeDirectionalLightWorldToCameraMatrix = (() => {
    const tmpCamera = new _camera__WEBPACK_IMPORTED_MODULE_5__[/* Camera */ "a"]();
    return (direction) => {
        // A new "camera" IS NOT needed here, but we only need the world to camera matrix from it.
        tmpCamera.forward = direction;
        tmpCamera.calculateUpFromWorldUp();
        tmpCamera.update();
        return tmpCamera.getWorldToCamera();
    };
})();
const orthoProjection = (out, left, right, bottom, top, near, far) => {
    const fn = 1. / (far - near);
    const tb = 1. / (top - bottom);
    const rl = 1. / (right - left);
    gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* set */ "m"](out, 2 * rl, 0, 0, 0, 0, 2 * tb, 0, 0, 0, 0, -2 * fn, 0, -(right + left) * rl, -(bottom + top) * tb, (far + near) * fn, 1);
};
const computeBoundingBoxInTransformedSpace = (() => {
    const tmpBoundingBoxVerticesBuf = cacheOnFirstUse(() => new _axisAlignedBox__WEBPACK_IMPORTED_MODULE_6__[/* AxisAlignedBox */ "a"]().asVerticesBuffer());
    const tmpVec1 = new Array(1);
    const tmpVec3_2 = gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* create */ "c"]();
    const bb = makeCache(() => new _axisAlignedBox__WEBPACK_IMPORTED_MODULE_6__[/* AxisAlignedBox */ "a"]());
    return (scene, transform, objFilter = null, target = null, includePointLights = false) => {
        let allBB = null;
        objFilter = objFilter || (_ => true);
        const bboxForChildInTransformedSpace = (o) => {
            // only process children's bounding boxes if the current object does not have a bounding box computed
            // from children.
            if (!o.boundingBoxComponent || !o.boundingBoxComponent.computedFromChildren) {
                o.children.forEach(bboxForChildInTransformedSpace);
            }
            if (!(o.boundingBoxComponent && objFilter(o))) {
                return;
            }
            gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* mul */ "f"](tmpMat4, transform, o.transform.getModelToWorld());
            const objLSBoundingBox = o.boundingBoxComponent.box.asVerticesBuffer(true)
                .translateTo(tmpMat4, tmpBoundingBoxVerticesBuf())
                .computeBoundingBox(bb(0));
            if (allBB === null) {
                allBB = target || bb(1);
                allBB.setMin(objLSBoundingBox.min);
                allBB.setMax(objLSBoundingBox.max);
            }
            else {
                tmpVec1[0] = objLSBoundingBox;
                allBB = Object(_glArrayBuffer__WEBPACK_IMPORTED_MODULE_4__[/* computeBoundingBox */ "j"])(tmpVec1, false, allBB, allBB);
            }
        };
        scene.children.forEach(bboxForChildInTransformedSpace);
        // this is inefficient and incorrect, but works around artifacts with point lights.
        if (allBB && includePointLights) {
            scene.pointLights.forEach(l => {
                gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* transformMat4 */ "n"](tmpVec3, l.object.transform.position, transform);
                const b = bb(0);
                const offset = l.radius + 0.1;
                b.setMin(gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* set */ "l"](tmpVec3_2, tmpVec3[0] - offset, tmpVec3[1] - offset, tmpVec3[2] - offset));
                b.setMax(gl_matrix_src_gl_matrix_vec3__WEBPACK_IMPORTED_MODULE_0__[/* set */ "l"](tmpVec3_2, tmpVec3[0] + offset, tmpVec3[1] + offset, tmpVec3[2] + offset));
                tmpVec1[0] = b;
                allBB = Object(_glArrayBuffer__WEBPACK_IMPORTED_MODULE_4__[/* computeBoundingBox */ "j"])(tmpVec1, false, allBB, allBB);
            });
        }
        if (allBB === null) {
            allBB = target || bb(1);
        }
        return allBB;
    };
})();
const optimizeNearFar = (camera, scene, minNear = 0.1, minFar = 1., objFilter = null) => {
    const bb = computeBoundingBoxInTransformedSpace(scene, camera.getWorldToCamera(), objFilter, tmpBoundingBoxCache(0), true);
    camera.near = Math.max(minNear, -bb.max[2]);
    camera.far = Math.max(minFar, -bb.min[2]);
    camera.update();
    return camera;
};
const tmpProjectionMatrix = new _camera__WEBPACK_IMPORTED_MODULE_5__[/* ProjectionMatrix */ "b"](0, 1, gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* create */ "b"]());
const computeDirectionalLightCameraWorldToProjectionMatrix = (() => {
    const bb = tmpBoundingBoxCache;
    return (light, camera, scene, out) => {
        const worldToLightViewSpace = makeDirectionalLightWorldToCameraMatrix(light.direction);
        out = out || new _camera__WEBPACK_IMPORTED_MODULE_5__[/* ProjectionMatrix */ "b"](0, 1, gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* create */ "b"]());
        let cameraFrustumBB = makeWorldSpaceCameraFrustum(camera, true, true)
            .translateInPlace(worldToLightViewSpace)
            .computeBoundingBox(bb(0));
        let allBB = computeBoundingBoxInTransformedSpace(scene, worldToLightViewSpace, o => o.mesh ? o.mesh.shadowCaster : true, bb(2));
        if (allBB === null) {
            allBB = bb(2);
        }
        const lightClipSpaceMatrix = tmpMat4;
        const x = 0;
        const y = 1;
        const z = 2;
        const left = Math.max(allBB.min[x], cameraFrustumBB.min[x]);
        const right = Math.min(allBB.max[x], cameraFrustumBB.max[x]);
        const bottom = Math.max(allBB.min[y], cameraFrustumBB.min[y]);
        const top = Math.min(allBB.max[y], cameraFrustumBB.max[y]);
        // note Z is reversed here
        const near = allBB.min[z];
        const far = allBB.max[z];
        orthoProjection(lightClipSpaceMatrix, left, right, bottom, top, near, far);
        gl_matrix_src_gl_matrix_mat4__WEBPACK_IMPORTED_MODULE_1__[/* multiply */ "g"](out.matrix, lightClipSpaceMatrix, worldToLightViewSpace);
        out.near = near;
        out.far = far;
        return out;
    };
})();
function hexToRgb1(out, hex) {
    const bigint = parseInt(hex.slice(1, hex.length), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    out[0] = r / 256;
    out[1] = g / 256;
    out[2] = b / 256;
    out[3] = 1.;
    return out;
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function mapComputeIfAbsent(m, key, callback) {
    if (m.has(key)) {
        return m.get(key);
    }
    const v = callback(key);
    m.set(key, v);
    return v;
}


/***/ }),

/***/ "./typescript-3d-renderer-rust/pkg/typescript_3d_renderer_rust.js":
/*!************************************************************************!*\
  !*** ./typescript-3d-renderer-rust/pkg/typescript_3d_renderer_rust.js ***!
  \************************************************************************/
/*! exports provided: greet, __wbg_alert_255330db75c694e6 */
/*! exports used: greet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return greet; });
/* unused harmony export __wbg_alert_255330db75c694e6 */
/* harmony import */ var _typescript_3d_renderer_rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typescript_3d_renderer_rust_bg.wasm */ "./typescript-3d-renderer-rust/pkg/typescript_3d_renderer_rust_bg.wasm");
/* harmony import */ var _typescript_3d_renderer_rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_typescript_3d_renderer_rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__);


/**
*/
function greet() {
    _typescript_3d_renderer_rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["greet"]();
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== _typescript_3d_renderer_rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
        cachegetUint8Memory = new Uint8Array(_typescript_3d_renderer_rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

const __wbg_alert_255330db75c694e6 = function(arg0, arg1) {
    alert(getStringFromWasm(arg0, arg1));
};



/***/ }),

/***/ "./typescript-3d-renderer-rust/pkg/typescript_3d_renderer_rust_bg.wasm":
/*!*****************************************************************************!*\
  !*** ./typescript-3d-renderer-rust/pkg/typescript_3d_renderer_rust_bg.wasm ***!
  \*****************************************************************************/
/*! no static exports found */
/*! exports used: greet, memory */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Instantiate WebAssembly module
var wasmExports = __webpack_require__.w[module.i];

// export exports from WebAssembly module
module.exports = wasmExports;
// exec imports from WebAssembly module (for esm order)


// exec wasm module
wasmExports["c"]()

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map
import { p as private_env } from './index-271b33d1.js';
import * as crypto__default from 'crypto';
import crypto__default__default from 'crypto';
import * as process$1 from 'process';
import require$$0 from 'node:http';
import require$$1$2 from 'node:https';
import require$$2 from 'node:zlib';
import require$$3 from 'node:stream';
import require$$4 from 'node:buffer';
import require$$5 from 'node:util';
import require$$6 from 'node:url';
import require$$7 from 'node:net';
import require$$1$3 from 'node:fs';
import require$$2$1 from 'node:path';

function _mergeNamespaces(n, m) {
	m.forEach(function (e) {
		e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
			if (k !== 'default' && !(k in n)) {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	});
	return Object.freeze(n);
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

// src/utils/runtimeEnvironment.ts
var isTestEnvironment = () => {
  try {
    return process.env.NODE_ENV === "test";
  } catch (err) {
  }
  return false;
};
var isProductionEnvironment = () => {
  try {
    return process.env.NODE_ENV === "production";
  } catch (err) {
  }
  return false;
};

// src/deprecated.ts
var displayedWarnings = /* @__PURE__ */ new Set();
var deprecated = (fnName, warning, key) => {
  const hideWarning = isTestEnvironment() || isProductionEnvironment();
  const messageId = key ?? fnName;
  if (displayedWarnings.has(messageId) || hideWarning) {
    return;
  }
  displayedWarnings.add(messageId);
  console.warn(
    `Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.
${warning}`
  );
};
var deprecatedProperty = (cls, propName, warning, isStatic = false) => {
  const target = isStatic ? cls : cls.prototype;
  let value = target[propName];
  Object.defineProperty(target, propName, {
    get() {
      deprecated(propName, warning, `${cls.name}:${propName}`);
      return value;
    },
    set(v) {
      value = v;
    }
  });
};
var deprecatedObjectProperty = (obj, propName, warning, key) => {
  let value = obj[propName];
  Object.defineProperty(obj, propName, {
    get() {
      deprecated(propName, warning, key);
      return value;
    },
    set(v) {
      value = v;
    }
  });
};

// src/callWithRetry.ts
function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
var MAX_NUMBER_OF_RETRIES = 5;
async function callWithRetry(fn, attempt = 1, maxAttempts = MAX_NUMBER_OF_RETRIES) {
  try {
    return await fn();
  } catch (e) {
    if (attempt >= maxAttempts) {
      throw e;
    }
    await wait(2 ** attempt * 100);
    return callWithRetry(fn, attempt + 1, maxAttempts);
  }
}

// src/isomorphicAtob.ts
var isomorphicAtob = (data) => {
  if (typeof atob !== "undefined" && typeof atob === "function") {
    return atob(data);
  } else if (typeof global !== "undefined" && global.Buffer) {
    return new global.Buffer(data, "base64").toString();
  }
  return data;
};

var _MagicLinkErrorCode = {
  Expired: "expired",
  Failed: "failed"
};
new Proxy(_MagicLinkErrorCode, {
  get(target, prop, receiver) {
    deprecated("MagicLinkErrorCode", "Use `EmailLinkErrorCode` instead.");
    return Reflect.get(target, prop, receiver);
  }
});
var DefaultMessages = Object.freeze({
  InvalidFrontendApiErrorMessage: `The frontendApi passed to Clerk is invalid. You can get your Frontend API key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
  InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
  InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
  MissingPublishableKeyErrorMessage: `Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`
});
function buildErrorThrower({ packageName, customMessages }) {
  let pkg = packageName;
  const messages = {
    ...DefaultMessages,
    ...customMessages
  };
  function buildMessage(rawMessage, replacements) {
    if (!replacements) {
      return `${pkg}: ${rawMessage}`;
    }
    let msg = rawMessage;
    const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
    for (const match of matches) {
      const replacement = (replacements[match[1]] || "").toString();
      msg = msg.replace(`{{${match[1]}}}`, replacement);
    }
    return `${pkg}: ${msg}`;
  }
  return {
    setPackageName({ packageName: packageName2 }) {
      if (typeof packageName2 === "string") {
        pkg = packageName2;
      }
      return this;
    },
    setMessages({ customMessages: customMessages2 }) {
      Object.assign(messages, customMessages2 || {});
      return this;
    },
    throwInvalidPublishableKeyError(params) {
      throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
    },
    throwInvalidFrontendApiError(params) {
      throw new Error(buildMessage(messages.InvalidFrontendApiErrorMessage, params));
    },
    throwInvalidProxyUrl(params) {
      throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
    },
    throwMissingPublishableKeyError() {
      throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
    }
  };
}

/*!
 * MIT License
 * 
 * Copyright (c) 2017-2022 Peculiar Ventures, LLC
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

const ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
class BufferSourceConverter {
    static isArrayBuffer(data) {
        return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
    }
    static toArrayBuffer(data) {
        if (this.isArrayBuffer(data)) {
            return data;
        }
        if (data.byteLength === data.buffer.byteLength) {
            return data.buffer;
        }
        if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
            return data.buffer;
        }
        return this.toUint8Array(data.buffer)
            .slice(data.byteOffset, data.byteOffset + data.byteLength)
            .buffer;
    }
    static toUint8Array(data) {
        return this.toView(data, Uint8Array);
    }
    static toView(data, type) {
        if (data.constructor === type) {
            return data;
        }
        if (this.isArrayBuffer(data)) {
            return new type(data);
        }
        if (this.isArrayBufferView(data)) {
            return new type(data.buffer, data.byteOffset, data.byteLength);
        }
        throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
    }
    static isBufferSource(data) {
        return this.isArrayBufferView(data)
            || this.isArrayBuffer(data);
    }
    static isArrayBufferView(data) {
        return ArrayBuffer.isView(data)
            || (data && this.isArrayBuffer(data.buffer));
    }
    static isEqual(a, b) {
        const aView = BufferSourceConverter.toUint8Array(a);
        const bView = BufferSourceConverter.toUint8Array(b);
        if (aView.length !== bView.byteLength) {
            return false;
        }
        for (let i = 0; i < aView.length; i++) {
            if (aView[i] !== bView[i]) {
                return false;
            }
        }
        return true;
    }
    static concat(...args) {
        let buffers;
        if (Array.isArray(args[0]) && !(args[1] instanceof Function)) {
            buffers = args[0];
        }
        else if (Array.isArray(args[0]) && args[1] instanceof Function) {
            buffers = args[0];
        }
        else {
            if (args[args.length - 1] instanceof Function) {
                buffers = args.slice(0, args.length - 1);
            }
            else {
                buffers = args;
            }
        }
        let size = 0;
        for (const buffer of buffers) {
            size += buffer.byteLength;
        }
        const res = new Uint8Array(size);
        let offset = 0;
        for (const buffer of buffers) {
            const view = this.toUint8Array(buffer);
            res.set(view, offset);
            offset += view.length;
        }
        if (args[args.length - 1] instanceof Function) {
            return this.toView(res, args[args.length - 1]);
        }
        return res.buffer;
    }
}

const STRING_TYPE = "string";
const HEX_REGEX = /^[0-9a-f]+$/i;
const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
class Utf8Converter {
    static fromString(text) {
        const s = unescape(encodeURIComponent(text));
        const uintArray = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
            uintArray[i] = s.charCodeAt(i);
        }
        return uintArray.buffer;
    }
    static toString(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        let encodedString = "";
        for (let i = 0; i < buf.length; i++) {
            encodedString += String.fromCharCode(buf[i]);
        }
        const decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
    }
}
class Utf16Converter {
    static toString(buffer, littleEndian = false) {
        const arrayBuffer = BufferSourceConverter.toArrayBuffer(buffer);
        const dataView = new DataView(arrayBuffer);
        let res = "";
        for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
            const code = dataView.getUint16(i, littleEndian);
            res += String.fromCharCode(code);
        }
        return res;
    }
    static fromString(text, littleEndian = false) {
        const res = new ArrayBuffer(text.length * 2);
        const dataView = new DataView(res);
        for (let i = 0; i < text.length; i++) {
            dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
        }
        return res;
    }
}
class Convert {
    static isHex(data) {
        return typeof data === STRING_TYPE
            && HEX_REGEX.test(data);
    }
    static isBase64(data) {
        return typeof data === STRING_TYPE
            && BASE64_REGEX.test(data);
    }
    static isBase64Url(data) {
        return typeof data === STRING_TYPE
            && BASE64URL_REGEX.test(data);
    }
    static ToString(buffer, enc = "utf8") {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        switch (enc.toLowerCase()) {
            case "utf8":
                return this.ToUtf8String(buf);
            case "binary":
                return this.ToBinary(buf);
            case "hex":
                return this.ToHex(buf);
            case "base64":
                return this.ToBase64(buf);
            case "base64url":
                return this.ToBase64Url(buf);
            case "utf16le":
                return Utf16Converter.toString(buf, true);
            case "utf16":
            case "utf16be":
                return Utf16Converter.toString(buf);
            default:
                throw new Error(`Unknown type of encoding '${enc}'`);
        }
    }
    static FromString(str, enc = "utf8") {
        if (!str) {
            return new ArrayBuffer(0);
        }
        switch (enc.toLowerCase()) {
            case "utf8":
                return this.FromUtf8String(str);
            case "binary":
                return this.FromBinary(str);
            case "hex":
                return this.FromHex(str);
            case "base64":
                return this.FromBase64(str);
            case "base64url":
                return this.FromBase64Url(str);
            case "utf16le":
                return Utf16Converter.fromString(str, true);
            case "utf16":
            case "utf16be":
                return Utf16Converter.fromString(str);
            default:
                throw new Error(`Unknown type of encoding '${enc}'`);
        }
    }
    static ToBase64(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        if (typeof btoa !== "undefined") {
            const binary = this.ToString(buf, "binary");
            return btoa(binary);
        }
        else {
            return Buffer.from(buf).toString("base64");
        }
    }
    static FromBase64(base64) {
        const formatted = this.formatString(base64);
        if (!formatted) {
            return new ArrayBuffer(0);
        }
        if (!Convert.isBase64(formatted)) {
            throw new TypeError("Argument 'base64Text' is not Base64 encoded");
        }
        if (typeof atob !== "undefined") {
            return this.FromBinary(atob(formatted));
        }
        else {
            return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
        }
    }
    static FromBase64Url(base64url) {
        const formatted = this.formatString(base64url);
        if (!formatted) {
            return new ArrayBuffer(0);
        }
        if (!Convert.isBase64Url(formatted)) {
            throw new TypeError("Argument 'base64url' is not Base64Url encoded");
        }
        return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
    }
    static ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
    }
    static FromUtf8String(text, encoding = Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
            case "ascii":
                return this.FromBinary(text);
            case "utf8":
                return Utf8Converter.fromString(text);
            case "utf16":
            case "utf16be":
                return Utf16Converter.fromString(text);
            case "utf16le":
            case "usc2":
                return Utf16Converter.fromString(text, true);
            default:
                throw new Error(`Unknown type of encoding '${encoding}'`);
        }
    }
    static ToUtf8String(buffer, encoding = Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
            case "ascii":
                return this.ToBinary(buffer);
            case "utf8":
                return Utf8Converter.toString(buffer);
            case "utf16":
            case "utf16be":
                return Utf16Converter.toString(buffer);
            case "utf16le":
            case "usc2":
                return Utf16Converter.toString(buffer, true);
            default:
                throw new Error(`Unknown type of encoding '${encoding}'`);
        }
    }
    static FromBinary(text) {
        const stringLength = text.length;
        const resultView = new Uint8Array(stringLength);
        for (let i = 0; i < stringLength; i++) {
            resultView[i] = text.charCodeAt(i);
        }
        return resultView.buffer;
    }
    static ToBinary(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        let res = "";
        for (let i = 0; i < buf.length; i++) {
            res += String.fromCharCode(buf[i]);
        }
        return res;
    }
    static ToHex(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        let result = "";
        const len = buf.length;
        for (let i = 0; i < len; i++) {
            const byte = buf[i];
            if (byte < 16) {
                result += "0";
            }
            result += byte.toString(16);
        }
        return result;
    }
    static FromHex(hexString) {
        let formatted = this.formatString(hexString);
        if (!formatted) {
            return new ArrayBuffer(0);
        }
        if (!Convert.isHex(formatted)) {
            throw new TypeError("Argument 'hexString' is not HEX encoded");
        }
        if (formatted.length % 2) {
            formatted = `0${formatted}`;
        }
        const res = new Uint8Array(formatted.length / 2);
        for (let i = 0; i < formatted.length; i = i + 2) {
            const c = formatted.slice(i, i + 2);
            res[i / 2] = parseInt(c, 16);
        }
        return res.buffer;
    }
    static ToUtf16String(buffer, littleEndian = false) {
        return Utf16Converter.toString(buffer, littleEndian);
    }
    static FromUtf16String(text, littleEndian = false) {
        return Utf16Converter.fromString(text, littleEndian);
    }
    static Base64Padding(base64) {
        const padCount = 4 - (base64.length % 4);
        if (padCount < 4) {
            for (let i = 0; i < padCount; i++) {
                base64 += "=";
            }
        }
        return base64;
    }
    static formatString(data) {
        return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
    }
}
Convert.DEFAULT_UTF8_ENCODING = "utf8";
function combine(...buf) {
    const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
    const res = new Uint8Array(totalByteLength);
    let currentPos = 0;
    buf.map((item) => new Uint8Array(item)).forEach((arr) => {
        for (const item2 of arr) {
            res[currentPos++] = item2;
        }
    });
    return res.buffer;
}

/*!
 Copyright (c) Peculiar Ventures, LLC
*/

function utilFromBase(inputBuffer, inputBase) {
    let result = 0;
    if (inputBuffer.length === 1) {
        return inputBuffer[0];
    }
    for (let i = (inputBuffer.length - 1); i >= 0; i--) {
        result += inputBuffer[(inputBuffer.length - 1) - i] * Math.pow(2, inputBase * i);
    }
    return result;
}
function utilToBase(value, base, reserved = (-1)) {
    const internalReserved = reserved;
    let internalValue = value;
    let result = 0;
    let biggest = Math.pow(2, base);
    for (let i = 1; i < 8; i++) {
        if (value < biggest) {
            let retBuf;
            if (internalReserved < 0) {
                retBuf = new ArrayBuffer(i);
                result = i;
            }
            else {
                if (internalReserved < i) {
                    return (new ArrayBuffer(0));
                }
                retBuf = new ArrayBuffer(internalReserved);
                result = internalReserved;
            }
            const retView = new Uint8Array(retBuf);
            for (let j = (i - 1); j >= 0; j--) {
                const basis = Math.pow(2, j * base);
                retView[result - j - 1] = Math.floor(internalValue / basis);
                internalValue -= (retView[result - j - 1]) * basis;
            }
            return retBuf;
        }
        biggest *= Math.pow(2, base);
    }
    return new ArrayBuffer(0);
}
function utilConcatView(...views) {
    let outputLength = 0;
    let prevLength = 0;
    for (const view of views) {
        outputLength += view.length;
    }
    const retBuf = new ArrayBuffer(outputLength);
    const retView = new Uint8Array(retBuf);
    for (const view of views) {
        retView.set(view, prevLength);
        prevLength += view.length;
    }
    return retView;
}
function utilDecodeTC() {
    const buf = new Uint8Array(this.valueHex);
    if (this.valueHex.byteLength >= 2) {
        const condition1 = (buf[0] === 0xFF) && (buf[1] & 0x80);
        const condition2 = (buf[0] === 0x00) && ((buf[1] & 0x80) === 0x00);
        if (condition1 || condition2) {
            this.warnings.push("Needlessly long format");
        }
    }
    const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
    const bigIntView = new Uint8Array(bigIntBuffer);
    for (let i = 0; i < this.valueHex.byteLength; i++) {
        bigIntView[i] = 0;
    }
    bigIntView[0] = (buf[0] & 0x80);
    const bigInt = utilFromBase(bigIntView, 8);
    const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
    const smallIntView = new Uint8Array(smallIntBuffer);
    for (let j = 0; j < this.valueHex.byteLength; j++) {
        smallIntView[j] = buf[j];
    }
    smallIntView[0] &= 0x7F;
    const smallInt = utilFromBase(smallIntView, 8);
    return (smallInt - bigInt);
}
function utilEncodeTC(value) {
    const modValue = (value < 0) ? (value * (-1)) : value;
    let bigInt = 128;
    for (let i = 1; i < 8; i++) {
        if (modValue <= bigInt) {
            if (value < 0) {
                const smallInt = bigInt - modValue;
                const retBuf = utilToBase(smallInt, 8, i);
                const retView = new Uint8Array(retBuf);
                retView[0] |= 0x80;
                return retBuf;
            }
            let retBuf = utilToBase(modValue, 8, i);
            let retView = new Uint8Array(retBuf);
            if (retView[0] & 0x80) {
                const tempBuf = retBuf.slice(0);
                const tempView = new Uint8Array(tempBuf);
                retBuf = new ArrayBuffer(retBuf.byteLength + 1);
                retView = new Uint8Array(retBuf);
                for (let k = 0; k < tempBuf.byteLength; k++) {
                    retView[k + 1] = tempView[k];
                }
                retView[0] = 0x00;
            }
            return retBuf;
        }
        bigInt *= Math.pow(2, 8);
    }
    return (new ArrayBuffer(0));
}
function isEqualBuffer(inputBuffer1, inputBuffer2) {
    if (inputBuffer1.byteLength !== inputBuffer2.byteLength) {
        return false;
    }
    const view1 = new Uint8Array(inputBuffer1);
    const view2 = new Uint8Array(inputBuffer2);
    for (let i = 0; i < view1.length; i++) {
        if (view1[i] !== view2[i]) {
            return false;
        }
    }
    return true;
}
function padNumber(inputNumber, fullLength) {
    const str = inputNumber.toString(10);
    if (fullLength < str.length) {
        return "";
    }
    const dif = fullLength - str.length;
    const padding = new Array(dif);
    for (let i = 0; i < dif; i++) {
        padding[i] = "0";
    }
    const paddingString = padding.join("");
    return paddingString.concat(str);
}

/*!
 * Copyright (c) 2014, GMO GlobalSign
 * Copyright (c) 2015-2022, Peculiar Ventures
 * All rights reserved.
 * 
 * Author 2014-2019, Yury Strozhevsky
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice, this
 *   list of conditions and the following disclaimer in the documentation and/or
 *   other materials provided with the distribution.
 * 
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */


function assertBigInt() {
    if (typeof BigInt === "undefined") {
        throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
    }
}
function concat(buffers) {
    let outputLength = 0;
    let prevLength = 0;
    for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        outputLength += buffer.byteLength;
    }
    const retView = new Uint8Array(outputLength);
    for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        retView.set(new Uint8Array(buffer), prevLength);
        prevLength += buffer.byteLength;
    }
    return retView.buffer;
}
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
    if (!(inputBuffer instanceof Uint8Array)) {
        baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
        return false;
    }
    if (!inputBuffer.byteLength) {
        baseBlock.error = "Wrong parameter: inputBuffer has zero length";
        return false;
    }
    if (inputOffset < 0) {
        baseBlock.error = "Wrong parameter: inputOffset less than zero";
        return false;
    }
    if (inputLength < 0) {
        baseBlock.error = "Wrong parameter: inputLength less than zero";
        return false;
    }
    if ((inputBuffer.byteLength - inputOffset - inputLength) < 0) {
        baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
        return false;
    }
    return true;
}

class ViewWriter {
    constructor() {
        this.items = [];
    }
    write(buf) {
        this.items.push(buf);
    }
    final() {
        return concat(this.items);
    }
}

const powers2 = [new Uint8Array([1])];
const digitsString = "0123456789";
const NAME = "name";
const VALUE_HEX_VIEW = "valueHexView";
const IS_HEX_ONLY = "isHexOnly";
const ID_BLOCK = "idBlock";
const TAG_CLASS = "tagClass";
const TAG_NUMBER = "tagNumber";
const IS_CONSTRUCTED = "isConstructed";
const FROM_BER = "fromBER";
const TO_BER = "toBER";
const LOCAL = "local";
const EMPTY_STRING = "";
const EMPTY_BUFFER = new ArrayBuffer(0);
const EMPTY_VIEW = new Uint8Array(0);
const END_OF_CONTENT_NAME = "EndOfContent";
const OCTET_STRING_NAME = "OCTET STRING";
const BIT_STRING_NAME = "BIT STRING";

function HexBlock(BaseClass) {
    var _a;
    return _a = class Some extends BaseClass {
            constructor(...args) {
                var _a;
                super(...args);
                const params = args[0] || {};
                this.isHexOnly = (_a = params.isHexOnly) !== null && _a !== void 0 ? _a : false;
                this.valueHexView = params.valueHex ? BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
            }
            get valueHex() {
                return this.valueHexView.slice().buffer;
            }
            set valueHex(value) {
                this.valueHexView = new Uint8Array(value);
            }
            fromBER(inputBuffer, inputOffset, inputLength) {
                const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
                if (!checkBufferParams(this, view, inputOffset, inputLength)) {
                    return -1;
                }
                const endLength = inputOffset + inputLength;
                this.valueHexView = view.subarray(inputOffset, endLength);
                if (!this.valueHexView.length) {
                    this.warnings.push("Zero buffer length");
                    return inputOffset;
                }
                this.blockLength = inputLength;
                return endLength;
            }
            toBER(sizeOnly = false) {
                if (!this.isHexOnly) {
                    this.error = "Flag 'isHexOnly' is not set, abort";
                    return EMPTY_BUFFER;
                }
                if (sizeOnly) {
                    return new ArrayBuffer(this.valueHexView.byteLength);
                }
                return (this.valueHexView.byteLength === this.valueHexView.buffer.byteLength)
                    ? this.valueHexView.buffer
                    : this.valueHexView.slice().buffer;
            }
            toJSON() {
                return {
                    ...super.toJSON(),
                    isHexOnly: this.isHexOnly,
                    valueHex: Convert.ToHex(this.valueHexView),
                };
            }
        },
        _a.NAME = "hexBlock",
        _a;
}

class LocalBaseBlock {
    constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW, } = {}) {
        this.blockLength = blockLength;
        this.error = error;
        this.warnings = warnings;
        this.valueBeforeDecodeView = BufferSourceConverter.toUint8Array(valueBeforeDecode);
    }
    static blockName() {
        return this.NAME;
    }
    get valueBeforeDecode() {
        return this.valueBeforeDecodeView.slice().buffer;
    }
    set valueBeforeDecode(value) {
        this.valueBeforeDecodeView = new Uint8Array(value);
    }
    toJSON() {
        return {
            blockName: this.constructor.NAME,
            blockLength: this.blockLength,
            error: this.error,
            warnings: this.warnings,
            valueBeforeDecode: Convert.ToHex(this.valueBeforeDecodeView),
        };
    }
}
LocalBaseBlock.NAME = "baseBlock";

class ValueBlock extends LocalBaseBlock {
    fromBER(inputBuffer, inputOffset, inputLength) {
        throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
    }
    toBER(sizeOnly, writer) {
        throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
    }
}
ValueBlock.NAME = "valueBlock";

class LocalIdentificationBlock extends HexBlock(LocalBaseBlock) {
    constructor({ idBlock = {}, } = {}) {
        var _a, _b, _c, _d;
        super();
        if (idBlock) {
            this.isHexOnly = (_a = idBlock.isHexOnly) !== null && _a !== void 0 ? _a : false;
            this.valueHexView = idBlock.valueHex ? BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
            this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
            this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
            this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
        }
        else {
            this.tagClass = -1;
            this.tagNumber = -1;
            this.isConstructed = false;
        }
    }
    toBER(sizeOnly = false) {
        let firstOctet = 0;
        switch (this.tagClass) {
            case 1:
                firstOctet |= 0x00;
                break;
            case 2:
                firstOctet |= 0x40;
                break;
            case 3:
                firstOctet |= 0x80;
                break;
            case 4:
                firstOctet |= 0xC0;
                break;
            default:
                this.error = "Unknown tag class";
                return EMPTY_BUFFER;
        }
        if (this.isConstructed)
            firstOctet |= 0x20;
        if (this.tagNumber < 31 && !this.isHexOnly) {
            const retView = new Uint8Array(1);
            if (!sizeOnly) {
                let number = this.tagNumber;
                number &= 0x1F;
                firstOctet |= number;
                retView[0] = firstOctet;
            }
            return retView.buffer;
        }
        if (!this.isHexOnly) {
            const encodedBuf = utilToBase(this.tagNumber, 7);
            const encodedView = new Uint8Array(encodedBuf);
            const size = encodedBuf.byteLength;
            const retView = new Uint8Array(size + 1);
            retView[0] = (firstOctet | 0x1F);
            if (!sizeOnly) {
                for (let i = 0; i < (size - 1); i++)
                    retView[i + 1] = encodedView[i] | 0x80;
                retView[size] = encodedView[size - 1];
            }
            return retView.buffer;
        }
        const retView = new Uint8Array(this.valueHexView.byteLength + 1);
        retView[0] = (firstOctet | 0x1F);
        if (!sizeOnly) {
            const curView = this.valueHexView;
            for (let i = 0; i < (curView.length - 1); i++)
                retView[i + 1] = curView[i] | 0x80;
            retView[this.valueHexView.byteLength] = curView[curView.length - 1];
        }
        return retView.buffer;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
            return -1;
        }
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        if (intBuffer.length === 0) {
            this.error = "Zero buffer length";
            return -1;
        }
        const tagClassMask = intBuffer[0] & 0xC0;
        switch (tagClassMask) {
            case 0x00:
                this.tagClass = (1);
                break;
            case 0x40:
                this.tagClass = (2);
                break;
            case 0x80:
                this.tagClass = (3);
                break;
            case 0xC0:
                this.tagClass = (4);
                break;
            default:
                this.error = "Unknown tag class";
                return -1;
        }
        this.isConstructed = (intBuffer[0] & 0x20) === 0x20;
        this.isHexOnly = false;
        const tagNumberMask = intBuffer[0] & 0x1F;
        if (tagNumberMask !== 0x1F) {
            this.tagNumber = (tagNumberMask);
            this.blockLength = 1;
        }
        else {
            let count = 1;
            let intTagNumberBuffer = this.valueHexView = new Uint8Array(255);
            let tagNumberBufferMaxLength = 255;
            while (intBuffer[count] & 0x80) {
                intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F;
                count++;
                if (count >= intBuffer.length) {
                    this.error = "End of input reached before message was fully decoded";
                    return -1;
                }
                if (count === tagNumberBufferMaxLength) {
                    tagNumberBufferMaxLength += 255;
                    const tempBufferView = new Uint8Array(tagNumberBufferMaxLength);
                    for (let i = 0; i < intTagNumberBuffer.length; i++)
                        tempBufferView[i] = intTagNumberBuffer[i];
                    intTagNumberBuffer = this.valueHexView = new Uint8Array(tagNumberBufferMaxLength);
                }
            }
            this.blockLength = (count + 1);
            intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F;
            const tempBufferView = new Uint8Array(count);
            for (let i = 0; i < count; i++)
                tempBufferView[i] = intTagNumberBuffer[i];
            intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
            intTagNumberBuffer.set(tempBufferView);
            if (this.blockLength <= 9)
                this.tagNumber = utilFromBase(intTagNumberBuffer, 7);
            else {
                this.isHexOnly = true;
                this.warnings.push("Tag too long, represented as hex-coded");
            }
        }
        if (((this.tagClass === 1)) &&
            (this.isConstructed)) {
            switch (this.tagNumber) {
                case 1:
                case 2:
                case 5:
                case 6:
                case 9:
                case 13:
                case 14:
                case 23:
                case 24:
                case 31:
                case 32:
                case 33:
                case 34:
                    this.error = "Constructed encoding used for primitive type";
                    return -1;
            }
        }
        return (inputOffset + this.blockLength);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            tagClass: this.tagClass,
            tagNumber: this.tagNumber,
            isConstructed: this.isConstructed,
        };
    }
}
LocalIdentificationBlock.NAME = "identificationBlock";

class LocalLengthBlock extends LocalBaseBlock {
    constructor({ lenBlock = {}, } = {}) {
        var _a, _b, _c;
        super();
        this.isIndefiniteForm = (_a = lenBlock.isIndefiniteForm) !== null && _a !== void 0 ? _a : false;
        this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
        this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const view = BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, view, inputOffset, inputLength)) {
            return -1;
        }
        const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
        if (intBuffer.length === 0) {
            this.error = "Zero buffer length";
            return -1;
        }
        if (intBuffer[0] === 0xFF) {
            this.error = "Length block 0xFF is reserved by standard";
            return -1;
        }
        this.isIndefiniteForm = intBuffer[0] === 0x80;
        if (this.isIndefiniteForm) {
            this.blockLength = 1;
            return (inputOffset + this.blockLength);
        }
        this.longFormUsed = !!(intBuffer[0] & 0x80);
        if (this.longFormUsed === false) {
            this.length = (intBuffer[0]);
            this.blockLength = 1;
            return (inputOffset + this.blockLength);
        }
        const count = intBuffer[0] & 0x7F;
        if (count > 8) {
            this.error = "Too big integer";
            return -1;
        }
        if ((count + 1) > intBuffer.length) {
            this.error = "End of input reached before message was fully decoded";
            return -1;
        }
        const lenOffset = inputOffset + 1;
        const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
        if (lengthBufferView[count - 1] === 0x00)
            this.warnings.push("Needlessly long encoded length");
        this.length = utilFromBase(lengthBufferView, 8);
        if (this.longFormUsed && (this.length <= 127))
            this.warnings.push("Unnecessary usage of long length form");
        this.blockLength = count + 1;
        return (inputOffset + this.blockLength);
    }
    toBER(sizeOnly = false) {
        let retBuf;
        let retView;
        if (this.length > 127)
            this.longFormUsed = true;
        if (this.isIndefiniteForm) {
            retBuf = new ArrayBuffer(1);
            if (sizeOnly === false) {
                retView = new Uint8Array(retBuf);
                retView[0] = 0x80;
            }
            return retBuf;
        }
        if (this.longFormUsed) {
            const encodedBuf = utilToBase(this.length, 8);
            if (encodedBuf.byteLength > 127) {
                this.error = "Too big length";
                return (EMPTY_BUFFER);
            }
            retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
            if (sizeOnly)
                return retBuf;
            const encodedView = new Uint8Array(encodedBuf);
            retView = new Uint8Array(retBuf);
            retView[0] = encodedBuf.byteLength | 0x80;
            for (let i = 0; i < encodedBuf.byteLength; i++)
                retView[i + 1] = encodedView[i];
            return retBuf;
        }
        retBuf = new ArrayBuffer(1);
        if (sizeOnly === false) {
            retView = new Uint8Array(retBuf);
            retView[0] = this.length;
        }
        return retBuf;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            isIndefiniteForm: this.isIndefiniteForm,
            longFormUsed: this.longFormUsed,
            length: this.length,
        };
    }
}
LocalLengthBlock.NAME = "lengthBlock";

const typeStore = {};

class BaseBlock extends LocalBaseBlock {
    constructor({ name = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
        super(parameters);
        this.name = name;
        this.optional = optional;
        if (primitiveSchema) {
            this.primitiveSchema = primitiveSchema;
        }
        this.idBlock = new LocalIdentificationBlock(parameters);
        this.lenBlock = new LocalLengthBlock(parameters);
        this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, (this.lenBlock.isIndefiniteForm) ? inputLength : this.lenBlock.length);
        if (resultOffset === -1) {
            this.error = this.valueBlock.error;
            return resultOffset;
        }
        if (!this.idBlock.error.length)
            this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
            this.blockLength += this.lenBlock.blockLength;
        if (!this.valueBlock.error.length)
            this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
    }
    toBER(sizeOnly, writer) {
        const _writer = writer || new ViewWriter();
        if (!writer) {
            prepareIndefiniteForm(this);
        }
        const idBlockBuf = this.idBlock.toBER(sizeOnly);
        _writer.write(idBlockBuf);
        if (this.lenBlock.isIndefiniteForm) {
            _writer.write(new Uint8Array([0x80]).buffer);
            this.valueBlock.toBER(sizeOnly, _writer);
            _writer.write(new ArrayBuffer(2));
        }
        else {
            const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
            this.lenBlock.length = valueBlockBuf.byteLength;
            const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
            _writer.write(lenBlockBuf);
            _writer.write(valueBlockBuf);
        }
        if (!writer) {
            return _writer.final();
        }
        return EMPTY_BUFFER;
    }
    toJSON() {
        const object = {
            ...super.toJSON(),
            idBlock: this.idBlock.toJSON(),
            lenBlock: this.lenBlock.toJSON(),
            valueBlock: this.valueBlock.toJSON(),
            name: this.name,
            optional: this.optional,
        };
        if (this.primitiveSchema)
            object.primitiveSchema = this.primitiveSchema.toJSON();
        return object;
    }
    toString(encoding = "ascii") {
        if (encoding === "ascii") {
            return this.onAsciiEncoding();
        }
        return Convert.ToHex(this.toBER());
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME} : ${Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
    }
    isEqual(other) {
        if (this === other) {
            return true;
        }
        if (!(other instanceof this.constructor)) {
            return false;
        }
        const thisRaw = this.toBER();
        const otherRaw = other.toBER();
        return isEqualBuffer(thisRaw, otherRaw);
    }
}
BaseBlock.NAME = "BaseBlock";
function prepareIndefiniteForm(baseBlock) {
    if (baseBlock instanceof typeStore.Constructed) {
        for (const value of baseBlock.valueBlock.value) {
            if (prepareIndefiniteForm(value)) {
                baseBlock.lenBlock.isIndefiniteForm = true;
            }
        }
    }
    return !!baseBlock.lenBlock.isIndefiniteForm;
}

class BaseStringBlock extends BaseBlock {
    constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
        super(parameters, stringValueBlockType);
        if (value) {
            this.fromString(value);
        }
    }
    getValue() {
        return this.valueBlock.value;
    }
    setValue(value) {
        this.valueBlock.value = value;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, (this.lenBlock.isIndefiniteForm) ? inputLength : this.lenBlock.length);
        if (resultOffset === -1) {
            this.error = this.valueBlock.error;
            return resultOffset;
        }
        this.fromBuffer(this.valueBlock.valueHexView);
        if (!this.idBlock.error.length)
            this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
            this.blockLength += this.lenBlock.blockLength;
        if (!this.valueBlock.error.length)
            this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
    }
}
BaseStringBlock.NAME = "BaseStringBlock";

class LocalPrimitiveValueBlock extends HexBlock(ValueBlock) {
    constructor({ isHexOnly = true, ...parameters } = {}) {
        super(parameters);
        this.isHexOnly = isHexOnly;
    }
}
LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";

var _a$w;
class Primitive extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, LocalPrimitiveValueBlock);
        this.idBlock.isConstructed = false;
    }
}
_a$w = Primitive;
(() => {
    typeStore.Primitive = _a$w;
})();
Primitive.NAME = "PRIMITIVE";

function localChangeType(inputObject, newType) {
    if (inputObject instanceof newType) {
        return inputObject;
    }
    const newObject = new newType();
    newObject.idBlock = inputObject.idBlock;
    newObject.lenBlock = inputObject.lenBlock;
    newObject.warnings = inputObject.warnings;
    newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
    return newObject;
}
function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length) {
    const incomingOffset = inputOffset;
    let returnObject = new BaseBlock({}, ValueBlock);
    const baseBlock = new LocalBaseBlock();
    if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
        returnObject.error = baseBlock.error;
        return {
            offset: -1,
            result: returnObject
        };
    }
    const intBuffer = inputBuffer.subarray(inputOffset, inputOffset + inputLength);
    if (!intBuffer.length) {
        returnObject.error = "Zero buffer length";
        return {
            offset: -1,
            result: returnObject
        };
    }
    let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
    if (returnObject.idBlock.warnings.length) {
        returnObject.warnings.concat(returnObject.idBlock.warnings);
    }
    if (resultOffset === -1) {
        returnObject.error = returnObject.idBlock.error;
        return {
            offset: -1,
            result: returnObject
        };
    }
    inputOffset = resultOffset;
    inputLength -= returnObject.idBlock.blockLength;
    resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
    if (returnObject.lenBlock.warnings.length) {
        returnObject.warnings.concat(returnObject.lenBlock.warnings);
    }
    if (resultOffset === -1) {
        returnObject.error = returnObject.lenBlock.error;
        return {
            offset: -1,
            result: returnObject
        };
    }
    inputOffset = resultOffset;
    inputLength -= returnObject.lenBlock.blockLength;
    if (!returnObject.idBlock.isConstructed &&
        returnObject.lenBlock.isIndefiniteForm) {
        returnObject.error = "Indefinite length form used for primitive encoding form";
        return {
            offset: -1,
            result: returnObject
        };
    }
    let newASN1Type = BaseBlock;
    switch (returnObject.idBlock.tagClass) {
        case 1:
            if ((returnObject.idBlock.tagNumber >= 37) &&
                (returnObject.idBlock.isHexOnly === false)) {
                returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
                return {
                    offset: -1,
                    result: returnObject
                };
            }
            switch (returnObject.idBlock.tagNumber) {
                case 0:
                    if ((returnObject.idBlock.isConstructed) &&
                        (returnObject.lenBlock.length > 0)) {
                        returnObject.error = "Type [UNIVERSAL 0] is reserved";
                        return {
                            offset: -1,
                            result: returnObject
                        };
                    }
                    newASN1Type = typeStore.EndOfContent;
                    break;
                case 1:
                    newASN1Type = typeStore.Boolean;
                    break;
                case 2:
                    newASN1Type = typeStore.Integer;
                    break;
                case 3:
                    newASN1Type = typeStore.BitString;
                    break;
                case 4:
                    newASN1Type = typeStore.OctetString;
                    break;
                case 5:
                    newASN1Type = typeStore.Null;
                    break;
                case 6:
                    newASN1Type = typeStore.ObjectIdentifier;
                    break;
                case 10:
                    newASN1Type = typeStore.Enumerated;
                    break;
                case 12:
                    newASN1Type = typeStore.Utf8String;
                    break;
                case 13:
                    newASN1Type = typeStore.RelativeObjectIdentifier;
                    break;
                case 14:
                    newASN1Type = typeStore.TIME;
                    break;
                case 15:
                    returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
                    return {
                        offset: -1,
                        result: returnObject
                    };
                case 16:
                    newASN1Type = typeStore.Sequence;
                    break;
                case 17:
                    newASN1Type = typeStore.Set;
                    break;
                case 18:
                    newASN1Type = typeStore.NumericString;
                    break;
                case 19:
                    newASN1Type = typeStore.PrintableString;
                    break;
                case 20:
                    newASN1Type = typeStore.TeletexString;
                    break;
                case 21:
                    newASN1Type = typeStore.VideotexString;
                    break;
                case 22:
                    newASN1Type = typeStore.IA5String;
                    break;
                case 23:
                    newASN1Type = typeStore.UTCTime;
                    break;
                case 24:
                    newASN1Type = typeStore.GeneralizedTime;
                    break;
                case 25:
                    newASN1Type = typeStore.GraphicString;
                    break;
                case 26:
                    newASN1Type = typeStore.VisibleString;
                    break;
                case 27:
                    newASN1Type = typeStore.GeneralString;
                    break;
                case 28:
                    newASN1Type = typeStore.UniversalString;
                    break;
                case 29:
                    newASN1Type = typeStore.CharacterString;
                    break;
                case 30:
                    newASN1Type = typeStore.BmpString;
                    break;
                case 31:
                    newASN1Type = typeStore.DATE;
                    break;
                case 32:
                    newASN1Type = typeStore.TimeOfDay;
                    break;
                case 33:
                    newASN1Type = typeStore.DateTime;
                    break;
                case 34:
                    newASN1Type = typeStore.Duration;
                    break;
                default: {
                    const newObject = returnObject.idBlock.isConstructed
                        ? new typeStore.Constructed()
                        : new typeStore.Primitive();
                    newObject.idBlock = returnObject.idBlock;
                    newObject.lenBlock = returnObject.lenBlock;
                    newObject.warnings = returnObject.warnings;
                    returnObject = newObject;
                }
            }
            break;
        case 2:
        case 3:
        case 4:
        default: {
            newASN1Type = returnObject.idBlock.isConstructed
                ? typeStore.Constructed
                : typeStore.Primitive;
        }
    }
    returnObject = localChangeType(returnObject, newASN1Type);
    resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length);
    returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
    return {
        offset: resultOffset,
        result: returnObject
    };
}
function fromBER(inputBuffer) {
    if (!inputBuffer.byteLength) {
        const result = new BaseBlock({}, ValueBlock);
        result.error = "Input buffer has zero length";
        return {
            offset: -1,
            result
        };
    }
    return localFromBER(BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength);
}

function checkLen(indefiniteLength, length) {
    if (indefiniteLength) {
        return 1;
    }
    return length;
}
class LocalConstructedValueBlock extends ValueBlock {
    constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
        super(parameters);
        this.value = value;
        this.isIndefiniteForm = isIndefiniteForm;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const view = BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, view, inputOffset, inputLength)) {
            return -1;
        }
        this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
        if (this.valueBeforeDecodeView.length === 0) {
            this.warnings.push("Zero buffer length");
            return inputOffset;
        }
        let currentOffset = inputOffset;
        while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
            const returnObject = localFromBER(view, currentOffset, inputLength);
            if (returnObject.offset === -1) {
                this.error = returnObject.result.error;
                this.warnings.concat(returnObject.result.warnings);
                return -1;
            }
            currentOffset = returnObject.offset;
            this.blockLength += returnObject.result.blockLength;
            inputLength -= returnObject.result.blockLength;
            this.value.push(returnObject.result);
            if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) {
                break;
            }
        }
        if (this.isIndefiniteForm) {
            if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) {
                this.value.pop();
            }
            else {
                this.warnings.push("No EndOfContent block encoded");
            }
        }
        return currentOffset;
    }
    toBER(sizeOnly, writer) {
        const _writer = writer || new ViewWriter();
        for (let i = 0; i < this.value.length; i++) {
            this.value[i].toBER(sizeOnly, _writer);
        }
        if (!writer) {
            return _writer.final();
        }
        return EMPTY_BUFFER;
    }
    toJSON() {
        const object = {
            ...super.toJSON(),
            isIndefiniteForm: this.isIndefiniteForm,
            value: [],
        };
        for (const value of this.value) {
            object.value.push(value.toJSON());
        }
        return object;
    }
}
LocalConstructedValueBlock.NAME = "ConstructedValueBlock";

var _a$v;
class Constructed extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, LocalConstructedValueBlock);
        this.idBlock.isConstructed = true;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, (this.lenBlock.isIndefiniteForm) ? inputLength : this.lenBlock.length);
        if (resultOffset === -1) {
            this.error = this.valueBlock.error;
            return resultOffset;
        }
        if (!this.idBlock.error.length)
            this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
            this.blockLength += this.lenBlock.blockLength;
        if (!this.valueBlock.error.length)
            this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
    }
    onAsciiEncoding() {
        const values = [];
        for (const value of this.valueBlock.value) {
            values.push(value.toString("ascii").split("\n").map(o => `  ${o}`).join("\n"));
        }
        const blockName = this.idBlock.tagClass === 3
            ? `[${this.idBlock.tagNumber}]`
            : this.constructor.NAME;
        return values.length
            ? `${blockName} :\n${values.join("\n")}`
            : `${blockName} :`;
    }
}
_a$v = Constructed;
(() => {
    typeStore.Constructed = _a$v;
})();
Constructed.NAME = "CONSTRUCTED";

class LocalEndOfContentValueBlock extends ValueBlock {
    fromBER(inputBuffer, inputOffset, inputLength) {
        return inputOffset;
    }
    toBER(sizeOnly) {
        return EMPTY_BUFFER;
    }
}
LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";

var _a$u;
class EndOfContent extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, LocalEndOfContentValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 0;
    }
}
_a$u = EndOfContent;
(() => {
    typeStore.EndOfContent = _a$u;
})();
EndOfContent.NAME = END_OF_CONTENT_NAME;

var _a$t;
class Null extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, ValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 5;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        if (this.lenBlock.length > 0)
            this.warnings.push("Non-zero length of value block for Null type");
        if (!this.idBlock.error.length)
            this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
            this.blockLength += this.lenBlock.blockLength;
        this.blockLength += inputLength;
        if ((inputOffset + inputLength) > inputBuffer.byteLength) {
            this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
            return -1;
        }
        return (inputOffset + inputLength);
    }
    toBER(sizeOnly, writer) {
        const retBuf = new ArrayBuffer(2);
        if (!sizeOnly) {
            const retView = new Uint8Array(retBuf);
            retView[0] = 0x05;
            retView[1] = 0x00;
        }
        if (writer) {
            writer.write(retBuf);
        }
        return retBuf;
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME}`;
    }
}
_a$t = Null;
(() => {
    typeStore.Null = _a$t;
})();
Null.NAME = "NULL";

class LocalBooleanValueBlock extends HexBlock(ValueBlock) {
    constructor({ value, ...parameters } = {}) {
        super(parameters);
        if (parameters.valueHex) {
            this.valueHexView = BufferSourceConverter.toUint8Array(parameters.valueHex);
        }
        else {
            this.valueHexView = new Uint8Array(1);
        }
        if (value) {
            this.value = value;
        }
    }
    get value() {
        for (const octet of this.valueHexView) {
            if (octet > 0) {
                return true;
            }
        }
        return false;
    }
    set value(value) {
        this.valueHexView[0] = value ? 0xFF : 0x00;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
            return -1;
        }
        this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
        if (inputLength > 1)
            this.warnings.push("Boolean value encoded in more then 1 octet");
        this.isHexOnly = true;
        utilDecodeTC.call(this);
        this.blockLength = inputLength;
        return (inputOffset + inputLength);
    }
    toBER() {
        return this.valueHexView.slice();
    }
    toJSON() {
        return {
            ...super.toJSON(),
            value: this.value,
        };
    }
}
LocalBooleanValueBlock.NAME = "BooleanValueBlock";

var _a$s;
let Boolean$1 = class Boolean extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, LocalBooleanValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 1;
    }
    getValue() {
        return this.valueBlock.value;
    }
    setValue(value) {
        this.valueBlock.value = value;
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.getValue}`;
    }
};
_a$s = Boolean$1;
(() => {
    typeStore.Boolean = _a$s;
})();
Boolean$1.NAME = "BOOLEAN";

class LocalOctetStringValueBlock extends HexBlock(LocalConstructedValueBlock) {
    constructor({ isConstructed = false, ...parameters } = {}) {
        super(parameters);
        this.isConstructed = isConstructed;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = 0;
        if (this.isConstructed) {
            this.isHexOnly = false;
            resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
            if (resultOffset === -1)
                return resultOffset;
            for (let i = 0; i < this.value.length; i++) {
                const currentBlockName = this.value[i].constructor.NAME;
                if (currentBlockName === END_OF_CONTENT_NAME) {
                    if (this.isIndefiniteForm)
                        break;
                    else {
                        this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
                        return -1;
                    }
                }
                if (currentBlockName !== OCTET_STRING_NAME) {
                    this.error = "OCTET STRING may consists of OCTET STRINGs only";
                    return -1;
                }
            }
        }
        else {
            this.isHexOnly = true;
            resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
            this.blockLength = inputLength;
        }
        return resultOffset;
    }
    toBER(sizeOnly, writer) {
        if (this.isConstructed)
            return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
        return sizeOnly
            ? new ArrayBuffer(this.valueHexView.byteLength)
            : this.valueHexView.slice().buffer;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            isConstructed: this.isConstructed,
        };
    }
}
LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";

var _a$r;
let OctetString$1 = class OctetString extends BaseBlock {
    constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
        var _b, _c;
        (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
        super({
            idBlock: {
                isConstructed: parameters.isConstructed,
                ...idBlock,
            },
            lenBlock: {
                ...lenBlock,
                isIndefiniteForm: !!parameters.isIndefiniteForm,
            },
            ...parameters,
        }, LocalOctetStringValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 4;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isConstructed = this.idBlock.isConstructed;
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        if (inputLength === 0) {
            if (this.idBlock.error.length === 0)
                this.blockLength += this.idBlock.blockLength;
            if (this.lenBlock.error.length === 0)
                this.blockLength += this.lenBlock.blockLength;
            return inputOffset;
        }
        if (!this.valueBlock.isConstructed) {
            const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
            const buf = view.subarray(inputOffset, inputOffset + inputLength);
            try {
                if (buf.byteLength) {
                    const asn = localFromBER(buf, 0, buf.byteLength);
                    if (asn.offset !== -1 && asn.offset === inputLength) {
                        this.valueBlock.value = [asn.result];
                    }
                }
            }
            catch (e) {
            }
        }
        return super.fromBER(inputBuffer, inputOffset, inputLength);
    }
    onAsciiEncoding() {
        if (this.valueBlock.isConstructed || (this.valueBlock.value && this.valueBlock.value.length)) {
            return Constructed.prototype.onAsciiEncoding.call(this);
        }
        return `${this.constructor.NAME} : ${Convert.ToHex(this.valueBlock.valueHexView)}`;
    }
    getValue() {
        if (!this.idBlock.isConstructed) {
            return this.valueBlock.valueHexView.slice().buffer;
        }
        const array = [];
        for (const content of this.valueBlock.value) {
            if (content instanceof OctetString) {
                array.push(content.valueBlock.valueHexView);
            }
        }
        return BufferSourceConverter.concat(array);
    }
};
_a$r = OctetString$1;
(() => {
    typeStore.OctetString = _a$r;
})();
OctetString$1.NAME = OCTET_STRING_NAME;

class LocalBitStringValueBlock extends HexBlock(LocalConstructedValueBlock) {
    constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
        super(parameters);
        this.unusedBits = unusedBits;
        this.isConstructed = isConstructed;
        this.blockLength = this.valueHexView.byteLength;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        if (!inputLength) {
            return inputOffset;
        }
        let resultOffset = -1;
        if (this.isConstructed) {
            resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
            if (resultOffset === -1)
                return resultOffset;
            for (const value of this.value) {
                const currentBlockName = value.constructor.NAME;
                if (currentBlockName === END_OF_CONTENT_NAME) {
                    if (this.isIndefiniteForm)
                        break;
                    else {
                        this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
                        return -1;
                    }
                }
                if (currentBlockName !== BIT_STRING_NAME) {
                    this.error = "BIT STRING may consists of BIT STRINGs only";
                    return -1;
                }
                const valueBlock = value.valueBlock;
                if ((this.unusedBits > 0) && (valueBlock.unusedBits > 0)) {
                    this.error = "Using of \"unused bits\" inside constructive BIT STRING allowed for least one only";
                    return -1;
                }
                this.unusedBits = valueBlock.unusedBits;
            }
            return resultOffset;
        }
        const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
            return -1;
        }
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        this.unusedBits = intBuffer[0];
        if (this.unusedBits > 7) {
            this.error = "Unused bits for BitString must be in range 0-7";
            return -1;
        }
        if (!this.unusedBits) {
            const buf = intBuffer.subarray(1);
            try {
                if (buf.byteLength) {
                    const asn = localFromBER(buf, 0, buf.byteLength);
                    if (asn.offset !== -1 && asn.offset === (inputLength - 1)) {
                        this.value = [asn.result];
                    }
                }
            }
            catch (e) {
            }
        }
        this.valueHexView = intBuffer.subarray(1);
        this.blockLength = intBuffer.length;
        return (inputOffset + inputLength);
    }
    toBER(sizeOnly, writer) {
        if (this.isConstructed) {
            return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
        }
        if (sizeOnly) {
            return new ArrayBuffer(this.valueHexView.byteLength + 1);
        }
        if (!this.valueHexView.byteLength) {
            return EMPTY_BUFFER;
        }
        const retView = new Uint8Array(this.valueHexView.length + 1);
        retView[0] = this.unusedBits;
        retView.set(this.valueHexView, 1);
        return retView.buffer;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            unusedBits: this.unusedBits,
            isConstructed: this.isConstructed,
        };
    }
}
LocalBitStringValueBlock.NAME = "BitStringValueBlock";

var _a$q;
let BitString$1 = class BitString extends BaseBlock {
    constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
        var _b, _c;
        (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
        super({
            idBlock: {
                isConstructed: parameters.isConstructed,
                ...idBlock,
            },
            lenBlock: {
                ...lenBlock,
                isIndefiniteForm: !!parameters.isIndefiniteForm,
            },
            ...parameters,
        }, LocalBitStringValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 3;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isConstructed = this.idBlock.isConstructed;
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        return super.fromBER(inputBuffer, inputOffset, inputLength);
    }
    onAsciiEncoding() {
        if (this.valueBlock.isConstructed || (this.valueBlock.value && this.valueBlock.value.length)) {
            return Constructed.prototype.onAsciiEncoding.call(this);
        }
        else {
            const bits = [];
            const valueHex = this.valueBlock.valueHexView;
            for (const byte of valueHex) {
                bits.push(byte.toString(2).padStart(8, "0"));
            }
            const bitsStr = bits.join("");
            return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
        }
    }
};
_a$q = BitString$1;
(() => {
    typeStore.BitString = _a$q;
})();
BitString$1.NAME = BIT_STRING_NAME;

var _a$p;
function viewAdd(first, second) {
    const c = new Uint8Array([0]);
    const firstView = new Uint8Array(first);
    const secondView = new Uint8Array(second);
    let firstViewCopy = firstView.slice(0);
    const firstViewCopyLength = firstViewCopy.length - 1;
    const secondViewCopy = secondView.slice(0);
    const secondViewCopyLength = secondViewCopy.length - 1;
    let value = 0;
    const max = (secondViewCopyLength < firstViewCopyLength) ? firstViewCopyLength : secondViewCopyLength;
    let counter = 0;
    for (let i = max; i >= 0; i--, counter++) {
        switch (true) {
            case (counter < secondViewCopy.length):
                value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
                break;
            default:
                value = firstViewCopy[firstViewCopyLength - counter] + c[0];
        }
        c[0] = value / 10;
        switch (true) {
            case (counter >= firstViewCopy.length):
                firstViewCopy = utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
                break;
            default:
                firstViewCopy[firstViewCopyLength - counter] = value % 10;
        }
    }
    if (c[0] > 0)
        firstViewCopy = utilConcatView(c, firstViewCopy);
    return firstViewCopy;
}
function power2(n) {
    if (n >= powers2.length) {
        for (let p = powers2.length; p <= n; p++) {
            const c = new Uint8Array([0]);
            let digits = (powers2[p - 1]).slice(0);
            for (let i = (digits.length - 1); i >= 0; i--) {
                const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
                c[0] = newValue[0] / 10;
                digits[i] = newValue[0] % 10;
            }
            if (c[0] > 0)
                digits = utilConcatView(c, digits);
            powers2.push(digits);
        }
    }
    return powers2[n];
}
function viewSub(first, second) {
    let b = 0;
    const firstView = new Uint8Array(first);
    const secondView = new Uint8Array(second);
    const firstViewCopy = firstView.slice(0);
    const firstViewCopyLength = firstViewCopy.length - 1;
    const secondViewCopy = secondView.slice(0);
    const secondViewCopyLength = secondViewCopy.length - 1;
    let value;
    let counter = 0;
    for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
        value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
        switch (true) {
            case (value < 0):
                b = 1;
                firstViewCopy[firstViewCopyLength - counter] = value + 10;
                break;
            default:
                b = 0;
                firstViewCopy[firstViewCopyLength - counter] = value;
        }
    }
    if (b > 0) {
        for (let i = (firstViewCopyLength - secondViewCopyLength + 1); i >= 0; i--, counter++) {
            value = firstViewCopy[firstViewCopyLength - counter] - b;
            if (value < 0) {
                b = 1;
                firstViewCopy[firstViewCopyLength - counter] = value + 10;
            }
            else {
                b = 0;
                firstViewCopy[firstViewCopyLength - counter] = value;
                break;
            }
        }
    }
    return firstViewCopy.slice();
}
class LocalIntegerValueBlock extends HexBlock(ValueBlock) {
    constructor({ value, ...parameters } = {}) {
        super(parameters);
        this._valueDec = 0;
        if (parameters.valueHex) {
            this.setValueHex();
        }
        if (value !== undefined) {
            this.valueDec = value;
        }
    }
    setValueHex() {
        if (this.valueHexView.length >= 4) {
            this.warnings.push("Too big Integer for decoding, hex only");
            this.isHexOnly = true;
            this._valueDec = 0;
        }
        else {
            this.isHexOnly = false;
            if (this.valueHexView.length > 0) {
                this._valueDec = utilDecodeTC.call(this);
            }
        }
    }
    set valueDec(v) {
        this._valueDec = v;
        this.isHexOnly = false;
        this.valueHexView = new Uint8Array(utilEncodeTC(v));
    }
    get valueDec() {
        return this._valueDec;
    }
    fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
        const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
        if (offset === -1)
            return offset;
        const view = this.valueHexView;
        if ((view[0] === 0x00) && ((view[1] & 0x80) !== 0)) {
            this.valueHexView = view.subarray(1);
        }
        else {
            if (expectedLength !== 0) {
                if (view.length < expectedLength) {
                    if ((expectedLength - view.length) > 1)
                        expectedLength = view.length + 1;
                    this.valueHexView = view.subarray(expectedLength - view.length);
                }
            }
        }
        return offset;
    }
    toDER(sizeOnly = false) {
        const view = this.valueHexView;
        switch (true) {
            case ((view[0] & 0x80) !== 0):
                {
                    const updatedView = new Uint8Array(this.valueHexView.length + 1);
                    updatedView[0] = 0x00;
                    updatedView.set(view, 1);
                    this.valueHexView = updatedView;
                }
                break;
            case ((view[0] === 0x00) && ((view[1] & 0x80) === 0)):
                {
                    this.valueHexView = this.valueHexView.subarray(1);
                }
                break;
        }
        return this.toBER(sizeOnly);
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
        if (resultOffset === -1) {
            return resultOffset;
        }
        this.setValueHex();
        return resultOffset;
    }
    toBER(sizeOnly) {
        return sizeOnly
            ? new ArrayBuffer(this.valueHexView.length)
            : this.valueHexView.slice().buffer;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            valueDec: this.valueDec,
        };
    }
    toString() {
        const firstBit = (this.valueHexView.length * 8) - 1;
        let digits = new Uint8Array((this.valueHexView.length * 8) / 3);
        let bitNumber = 0;
        let currentByte;
        const asn1View = this.valueHexView;
        let result = "";
        let flag = false;
        for (let byteNumber = (asn1View.byteLength - 1); byteNumber >= 0; byteNumber--) {
            currentByte = asn1View[byteNumber];
            for (let i = 0; i < 8; i++) {
                if ((currentByte & 1) === 1) {
                    switch (bitNumber) {
                        case firstBit:
                            digits = viewSub(power2(bitNumber), digits);
                            result = "-";
                            break;
                        default:
                            digits = viewAdd(digits, power2(bitNumber));
                    }
                }
                bitNumber++;
                currentByte >>= 1;
            }
        }
        for (let i = 0; i < digits.length; i++) {
            if (digits[i])
                flag = true;
            if (flag)
                result += digitsString.charAt(digits[i]);
        }
        if (flag === false)
            result += digitsString.charAt(0);
        return result;
    }
}
_a$p = LocalIntegerValueBlock;
LocalIntegerValueBlock.NAME = "IntegerValueBlock";
(() => {
    Object.defineProperty(_a$p.prototype, "valueHex", {
        set: function (v) {
            this.valueHexView = new Uint8Array(v);
            this.setValueHex();
        },
        get: function () {
            return this.valueHexView.slice().buffer;
        },
    });
})();

var _a$o;
class Integer extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, LocalIntegerValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 2;
    }
    toBigInt() {
        assertBigInt();
        return BigInt(this.valueBlock.toString());
    }
    static fromBigInt(value) {
        assertBigInt();
        const bigIntValue = BigInt(value);
        const writer = new ViewWriter();
        const hex = bigIntValue.toString(16).replace(/^-/, "");
        const view = new Uint8Array(Convert.FromHex(hex));
        if (bigIntValue < 0) {
            const first = new Uint8Array(view.length + (view[0] & 0x80 ? 1 : 0));
            first[0] |= 0x80;
            const firstInt = BigInt(`0x${Convert.ToHex(first)}`);
            const secondInt = firstInt + bigIntValue;
            const second = BufferSourceConverter.toUint8Array(Convert.FromHex(secondInt.toString(16)));
            second[0] |= 0x80;
            writer.write(second);
        }
        else {
            if (view[0] & 0x80) {
                writer.write(new Uint8Array([0]));
            }
            writer.write(view);
        }
        const res = new Integer({
            valueHex: writer.final(),
        });
        return res;
    }
    convertToDER() {
        const integer = new Integer({ valueHex: this.valueBlock.valueHexView });
        integer.valueBlock.toDER();
        return integer;
    }
    convertFromDER() {
        return new Integer({
            valueHex: this.valueBlock.valueHexView[0] === 0
                ? this.valueBlock.valueHexView.subarray(1)
                : this.valueBlock.valueHexView,
        });
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
    }
}
_a$o = Integer;
(() => {
    typeStore.Integer = _a$o;
})();
Integer.NAME = "INTEGER";

var _a$n;
class Enumerated extends Integer {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 10;
    }
}
_a$n = Enumerated;
(() => {
    typeStore.Enumerated = _a$n;
})();
Enumerated.NAME = "ENUMERATED";

class LocalSidValueBlock extends HexBlock(ValueBlock) {
    constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
        super(parameters);
        this.valueDec = valueDec;
        this.isFirstSid = isFirstSid;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        if (!inputLength) {
            return inputOffset;
        }
        const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
            return -1;
        }
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        this.valueHexView = new Uint8Array(inputLength);
        for (let i = 0; i < inputLength; i++) {
            this.valueHexView[i] = intBuffer[i] & 0x7F;
            this.blockLength++;
            if ((intBuffer[i] & 0x80) === 0x00)
                break;
        }
        const tempView = new Uint8Array(this.blockLength);
        for (let i = 0; i < this.blockLength; i++) {
            tempView[i] = this.valueHexView[i];
        }
        this.valueHexView = tempView;
        if ((intBuffer[this.blockLength - 1] & 0x80) !== 0x00) {
            this.error = "End of input reached before message was fully decoded";
            return -1;
        }
        if (this.valueHexView[0] === 0x00)
            this.warnings.push("Needlessly long format of SID encoding");
        if (this.blockLength <= 8)
            this.valueDec = utilFromBase(this.valueHexView, 7);
        else {
            this.isHexOnly = true;
            this.warnings.push("Too big SID for decoding, hex only");
        }
        return (inputOffset + this.blockLength);
    }
    set valueBigInt(value) {
        assertBigInt();
        let bits = BigInt(value).toString(2);
        while (bits.length % 7) {
            bits = "0" + bits;
        }
        const bytes = new Uint8Array(bits.length / 7);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes.length ? 0x80 : 0);
        }
        this.fromBER(bytes.buffer, 0, bytes.length);
    }
    toBER(sizeOnly) {
        if (this.isHexOnly) {
            if (sizeOnly)
                return (new ArrayBuffer(this.valueHexView.byteLength));
            const curView = this.valueHexView;
            const retView = new Uint8Array(this.blockLength);
            for (let i = 0; i < (this.blockLength - 1); i++)
                retView[i] = curView[i] | 0x80;
            retView[this.blockLength - 1] = curView[this.blockLength - 1];
            return retView.buffer;
        }
        const encodedBuf = utilToBase(this.valueDec, 7);
        if (encodedBuf.byteLength === 0) {
            this.error = "Error during encoding SID value";
            return EMPTY_BUFFER;
        }
        const retView = new Uint8Array(encodedBuf.byteLength);
        if (!sizeOnly) {
            const encodedView = new Uint8Array(encodedBuf);
            const len = encodedBuf.byteLength - 1;
            for (let i = 0; i < len; i++)
                retView[i] = encodedView[i] | 0x80;
            retView[len] = encodedView[len];
        }
        return retView;
    }
    toString() {
        let result = "";
        if (this.isHexOnly)
            result = Convert.ToHex(this.valueHexView);
        else {
            if (this.isFirstSid) {
                let sidValue = this.valueDec;
                if (this.valueDec <= 39)
                    result = "0.";
                else {
                    if (this.valueDec <= 79) {
                        result = "1.";
                        sidValue -= 40;
                    }
                    else {
                        result = "2.";
                        sidValue -= 80;
                    }
                }
                result += sidValue.toString();
            }
            else
                result = this.valueDec.toString();
        }
        return result;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            valueDec: this.valueDec,
            isFirstSid: this.isFirstSid,
        };
    }
}
LocalSidValueBlock.NAME = "sidBlock";

class LocalObjectIdentifierValueBlock extends ValueBlock {
    constructor({ value = EMPTY_STRING, ...parameters } = {}) {
        super(parameters);
        this.value = [];
        if (value) {
            this.fromString(value);
        }
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = inputOffset;
        while (inputLength > 0) {
            const sidBlock = new LocalSidValueBlock();
            resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
            if (resultOffset === -1) {
                this.blockLength = 0;
                this.error = sidBlock.error;
                return resultOffset;
            }
            if (this.value.length === 0)
                sidBlock.isFirstSid = true;
            this.blockLength += sidBlock.blockLength;
            inputLength -= sidBlock.blockLength;
            this.value.push(sidBlock);
        }
        return resultOffset;
    }
    toBER(sizeOnly) {
        const retBuffers = [];
        for (let i = 0; i < this.value.length; i++) {
            const valueBuf = this.value[i].toBER(sizeOnly);
            if (valueBuf.byteLength === 0) {
                this.error = this.value[i].error;
                return EMPTY_BUFFER;
            }
            retBuffers.push(valueBuf);
        }
        return concat(retBuffers);
    }
    fromString(string) {
        this.value = [];
        let pos1 = 0;
        let pos2 = 0;
        let sid = "";
        let flag = false;
        do {
            pos2 = string.indexOf(".", pos1);
            if (pos2 === -1)
                sid = string.substring(pos1);
            else
                sid = string.substring(pos1, pos2);
            pos1 = pos2 + 1;
            if (flag) {
                const sidBlock = this.value[0];
                let plus = 0;
                switch (sidBlock.valueDec) {
                    case 0:
                        break;
                    case 1:
                        plus = 40;
                        break;
                    case 2:
                        plus = 80;
                        break;
                    default:
                        this.value = [];
                        return;
                }
                const parsedSID = parseInt(sid, 10);
                if (isNaN(parsedSID))
                    return;
                sidBlock.valueDec = parsedSID + plus;
                flag = false;
            }
            else {
                const sidBlock = new LocalSidValueBlock();
                if (sid > Number.MAX_SAFE_INTEGER) {
                    assertBigInt();
                    const sidValue = BigInt(sid);
                    sidBlock.valueBigInt = sidValue;
                }
                else {
                    sidBlock.valueDec = parseInt(sid, 10);
                    if (isNaN(sidBlock.valueDec))
                        return;
                }
                if (!this.value.length) {
                    sidBlock.isFirstSid = true;
                    flag = true;
                }
                this.value.push(sidBlock);
            }
        } while (pos2 !== -1);
    }
    toString() {
        let result = "";
        let isHexOnly = false;
        for (let i = 0; i < this.value.length; i++) {
            isHexOnly = this.value[i].isHexOnly;
            let sidStr = this.value[i].toString();
            if (i !== 0)
                result = `${result}.`;
            if (isHexOnly) {
                sidStr = `{${sidStr}}`;
                if (this.value[i].isFirstSid)
                    result = `2.{${sidStr} - 80}`;
                else
                    result += sidStr;
            }
            else
                result += sidStr;
        }
        return result;
    }
    toJSON() {
        const object = {
            ...super.toJSON(),
            value: this.toString(),
            sidArray: [],
        };
        for (let i = 0; i < this.value.length; i++) {
            object.sidArray.push(this.value[i].toJSON());
        }
        return object;
    }
}
LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";

var _a$m;
let ObjectIdentifier$1 = class ObjectIdentifier extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, LocalObjectIdentifierValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 6;
    }
    getValue() {
        return this.valueBlock.toString();
    }
    setValue(value) {
        this.valueBlock.fromString(value);
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            value: this.getValue(),
        };
    }
};
_a$m = ObjectIdentifier$1;
(() => {
    typeStore.ObjectIdentifier = _a$m;
})();
ObjectIdentifier$1.NAME = "OBJECT IDENTIFIER";

class LocalRelativeSidValueBlock extends HexBlock(LocalBaseBlock) {
    constructor({ valueDec = 0, ...parameters } = {}) {
        super(parameters);
        this.valueDec = valueDec;
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        if (inputLength === 0)
            return inputOffset;
        const inputView = BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength))
            return -1;
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        this.valueHexView = new Uint8Array(inputLength);
        for (let i = 0; i < inputLength; i++) {
            this.valueHexView[i] = intBuffer[i] & 0x7F;
            this.blockLength++;
            if ((intBuffer[i] & 0x80) === 0x00)
                break;
        }
        const tempView = new Uint8Array(this.blockLength);
        for (let i = 0; i < this.blockLength; i++)
            tempView[i] = this.valueHexView[i];
        this.valueHexView = tempView;
        if ((intBuffer[this.blockLength - 1] & 0x80) !== 0x00) {
            this.error = "End of input reached before message was fully decoded";
            return -1;
        }
        if (this.valueHexView[0] === 0x00)
            this.warnings.push("Needlessly long format of SID encoding");
        if (this.blockLength <= 8)
            this.valueDec = utilFromBase(this.valueHexView, 7);
        else {
            this.isHexOnly = true;
            this.warnings.push("Too big SID for decoding, hex only");
        }
        return (inputOffset + this.blockLength);
    }
    toBER(sizeOnly) {
        if (this.isHexOnly) {
            if (sizeOnly)
                return (new ArrayBuffer(this.valueHexView.byteLength));
            const curView = this.valueHexView;
            const retView = new Uint8Array(this.blockLength);
            for (let i = 0; i < (this.blockLength - 1); i++)
                retView[i] = curView[i] | 0x80;
            retView[this.blockLength - 1] = curView[this.blockLength - 1];
            return retView.buffer;
        }
        const encodedBuf = utilToBase(this.valueDec, 7);
        if (encodedBuf.byteLength === 0) {
            this.error = "Error during encoding SID value";
            return EMPTY_BUFFER;
        }
        const retView = new Uint8Array(encodedBuf.byteLength);
        if (!sizeOnly) {
            const encodedView = new Uint8Array(encodedBuf);
            const len = encodedBuf.byteLength - 1;
            for (let i = 0; i < len; i++)
                retView[i] = encodedView[i] | 0x80;
            retView[len] = encodedView[len];
        }
        return retView.buffer;
    }
    toString() {
        let result = "";
        if (this.isHexOnly)
            result = Convert.ToHex(this.valueHexView);
        else {
            result = this.valueDec.toString();
        }
        return result;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            valueDec: this.valueDec,
        };
    }
}
LocalRelativeSidValueBlock.NAME = "relativeSidBlock";

class LocalRelativeObjectIdentifierValueBlock extends ValueBlock {
    constructor({ value = EMPTY_STRING, ...parameters } = {}) {
        super(parameters);
        this.value = [];
        if (value) {
            this.fromString(value);
        }
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = inputOffset;
        while (inputLength > 0) {
            const sidBlock = new LocalRelativeSidValueBlock();
            resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
            if (resultOffset === -1) {
                this.blockLength = 0;
                this.error = sidBlock.error;
                return resultOffset;
            }
            this.blockLength += sidBlock.blockLength;
            inputLength -= sidBlock.blockLength;
            this.value.push(sidBlock);
        }
        return resultOffset;
    }
    toBER(sizeOnly, writer) {
        const retBuffers = [];
        for (let i = 0; i < this.value.length; i++) {
            const valueBuf = this.value[i].toBER(sizeOnly);
            if (valueBuf.byteLength === 0) {
                this.error = this.value[i].error;
                return EMPTY_BUFFER;
            }
            retBuffers.push(valueBuf);
        }
        return concat(retBuffers);
    }
    fromString(string) {
        this.value = [];
        let pos1 = 0;
        let pos2 = 0;
        let sid = "";
        do {
            pos2 = string.indexOf(".", pos1);
            if (pos2 === -1)
                sid = string.substring(pos1);
            else
                sid = string.substring(pos1, pos2);
            pos1 = pos2 + 1;
            const sidBlock = new LocalRelativeSidValueBlock();
            sidBlock.valueDec = parseInt(sid, 10);
            if (isNaN(sidBlock.valueDec))
                return true;
            this.value.push(sidBlock);
        } while (pos2 !== -1);
        return true;
    }
    toString() {
        let result = "";
        let isHexOnly = false;
        for (let i = 0; i < this.value.length; i++) {
            isHexOnly = this.value[i].isHexOnly;
            let sidStr = this.value[i].toString();
            if (i !== 0)
                result = `${result}.`;
            if (isHexOnly) {
                sidStr = `{${sidStr}}`;
                result += sidStr;
            }
            else
                result += sidStr;
        }
        return result;
    }
    toJSON() {
        const object = {
            ...super.toJSON(),
            value: this.toString(),
            sidArray: [],
        };
        for (let i = 0; i < this.value.length; i++)
            object.sidArray.push(this.value[i].toJSON());
        return object;
    }
}
LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";

var _a$l;
class RelativeObjectIdentifier extends BaseBlock {
    constructor(parameters = {}) {
        super(parameters, LocalRelativeObjectIdentifierValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 13;
    }
    getValue() {
        return this.valueBlock.toString();
    }
    setValue(value) {
        this.valueBlock.fromString(value);
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            value: this.getValue(),
        };
    }
}
_a$l = RelativeObjectIdentifier;
(() => {
    typeStore.RelativeObjectIdentifier = _a$l;
})();
RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";

var _a$k;
class Sequence extends Constructed {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 16;
    }
}
_a$k = Sequence;
(() => {
    typeStore.Sequence = _a$k;
})();
Sequence.NAME = "SEQUENCE";

var _a$j;
let Set$1 = class Set extends Constructed {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 17;
    }
};
_a$j = Set$1;
(() => {
    typeStore.Set = _a$j;
})();
Set$1.NAME = "SET";

class LocalStringValueBlock extends HexBlock(ValueBlock) {
    constructor({ ...parameters } = {}) {
        super(parameters);
        this.isHexOnly = true;
        this.value = EMPTY_STRING;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            value: this.value,
        };
    }
}
LocalStringValueBlock.NAME = "StringValueBlock";

class LocalSimpleStringValueBlock extends LocalStringValueBlock {
}
LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";

class LocalSimpleStringBlock extends BaseStringBlock {
    constructor({ ...parameters } = {}) {
        super(parameters, LocalSimpleStringValueBlock);
    }
    fromBuffer(inputBuffer) {
        this.valueBlock.value = String.fromCharCode.apply(null, BufferSourceConverter.toUint8Array(inputBuffer));
    }
    fromString(inputString) {
        const strLen = inputString.length;
        const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
        for (let i = 0; i < strLen; i++)
            view[i] = inputString.charCodeAt(i);
        this.valueBlock.value = inputString;
    }
}
LocalSimpleStringBlock.NAME = "SIMPLE STRING";

class LocalUtf8StringValueBlock extends LocalSimpleStringBlock {
    fromBuffer(inputBuffer) {
        this.valueBlock.valueHexView = BufferSourceConverter.toUint8Array(inputBuffer);
        try {
            this.valueBlock.value = Convert.ToUtf8String(inputBuffer);
        }
        catch (ex) {
            this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
            this.valueBlock.value = Convert.ToBinary(inputBuffer);
        }
    }
    fromString(inputString) {
        this.valueBlock.valueHexView = new Uint8Array(Convert.FromUtf8String(inputString));
        this.valueBlock.value = inputString;
    }
}
LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";

var _a$i;
class Utf8String extends LocalUtf8StringValueBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 12;
    }
}
_a$i = Utf8String;
(() => {
    typeStore.Utf8String = _a$i;
})();
Utf8String.NAME = "UTF8String";

class LocalBmpStringValueBlock extends LocalSimpleStringBlock {
    fromBuffer(inputBuffer) {
        this.valueBlock.value = Convert.ToUtf16String(inputBuffer);
        this.valueBlock.valueHexView = BufferSourceConverter.toUint8Array(inputBuffer);
    }
    fromString(inputString) {
        this.valueBlock.value = inputString;
        this.valueBlock.valueHexView = new Uint8Array(Convert.FromUtf16String(inputString));
    }
}
LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";

var _a$h;
class BmpString extends LocalBmpStringValueBlock {
    constructor({ ...parameters } = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 30;
    }
}
_a$h = BmpString;
(() => {
    typeStore.BmpString = _a$h;
})();
BmpString.NAME = "BMPString";

class LocalUniversalStringValueBlock extends LocalSimpleStringBlock {
    fromBuffer(inputBuffer) {
        const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
        const valueView = new Uint8Array(copyBuffer);
        for (let i = 0; i < valueView.length; i += 4) {
            valueView[i] = valueView[i + 3];
            valueView[i + 1] = valueView[i + 2];
            valueView[i + 2] = 0x00;
            valueView[i + 3] = 0x00;
        }
        this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
    }
    fromString(inputString) {
        const strLength = inputString.length;
        const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
        for (let i = 0; i < strLength; i++) {
            const codeBuf = utilToBase(inputString.charCodeAt(i), 8);
            const codeView = new Uint8Array(codeBuf);
            if (codeView.length > 4)
                continue;
            const dif = 4 - codeView.length;
            for (let j = (codeView.length - 1); j >= 0; j--)
                valueHexView[i * 4 + j + dif] = codeView[j];
        }
        this.valueBlock.value = inputString;
    }
}
LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";

var _a$g;
class UniversalString extends LocalUniversalStringValueBlock {
    constructor({ ...parameters } = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 28;
    }
}
_a$g = UniversalString;
(() => {
    typeStore.UniversalString = _a$g;
})();
UniversalString.NAME = "UniversalString";

var _a$f;
class NumericString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 18;
    }
}
_a$f = NumericString;
(() => {
    typeStore.NumericString = _a$f;
})();
NumericString.NAME = "NumericString";

var _a$e;
class PrintableString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 19;
    }
}
_a$e = PrintableString;
(() => {
    typeStore.PrintableString = _a$e;
})();
PrintableString.NAME = "PrintableString";

var _a$d;
class TeletexString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 20;
    }
}
_a$d = TeletexString;
(() => {
    typeStore.TeletexString = _a$d;
})();
TeletexString.NAME = "TeletexString";

var _a$c;
class VideotexString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 21;
    }
}
_a$c = VideotexString;
(() => {
    typeStore.VideotexString = _a$c;
})();
VideotexString.NAME = "VideotexString";

var _a$b;
class IA5String extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 22;
    }
}
_a$b = IA5String;
(() => {
    typeStore.IA5String = _a$b;
})();
IA5String.NAME = "IA5String";

var _a$a;
class GraphicString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 25;
    }
}
_a$a = GraphicString;
(() => {
    typeStore.GraphicString = _a$a;
})();
GraphicString.NAME = "GraphicString";

var _a$9;
class VisibleString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 26;
    }
}
_a$9 = VisibleString;
(() => {
    typeStore.VisibleString = _a$9;
})();
VisibleString.NAME = "VisibleString";

var _a$8;
class GeneralString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 27;
    }
}
_a$8 = GeneralString;
(() => {
    typeStore.GeneralString = _a$8;
})();
GeneralString.NAME = "GeneralString";

var _a$7;
class CharacterString extends LocalSimpleStringBlock {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 29;
    }
}
_a$7 = CharacterString;
(() => {
    typeStore.CharacterString = _a$7;
})();
CharacterString.NAME = "CharacterString";

var _a$6;
class UTCTime extends VisibleString {
    constructor({ value, valueDate, ...parameters } = {}) {
        super(parameters);
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        if (value) {
            this.fromString(value);
            this.valueBlock.valueHexView = new Uint8Array(value.length);
            for (let i = 0; i < value.length; i++)
                this.valueBlock.valueHexView[i] = value.charCodeAt(i);
        }
        if (valueDate) {
            this.fromDate(valueDate);
            this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
        }
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 23;
    }
    fromBuffer(inputBuffer) {
        this.fromString(String.fromCharCode.apply(null, BufferSourceConverter.toUint8Array(inputBuffer)));
    }
    toBuffer() {
        const str = this.toString();
        const buffer = new ArrayBuffer(str.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < str.length; i++)
            view[i] = str.charCodeAt(i);
        return buffer;
    }
    fromDate(inputDate) {
        this.year = inputDate.getUTCFullYear();
        this.month = inputDate.getUTCMonth() + 1;
        this.day = inputDate.getUTCDate();
        this.hour = inputDate.getUTCHours();
        this.minute = inputDate.getUTCMinutes();
        this.second = inputDate.getUTCSeconds();
    }
    toDate() {
        return (new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second)));
    }
    fromString(inputString) {
        const parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
        const parserArray = parser.exec(inputString);
        if (parserArray === null) {
            this.error = "Wrong input string for conversion";
            return;
        }
        const year = parseInt(parserArray[1], 10);
        if (year >= 50)
            this.year = 1900 + year;
        else
            this.year = 2000 + year;
        this.month = parseInt(parserArray[2], 10);
        this.day = parseInt(parserArray[3], 10);
        this.hour = parseInt(parserArray[4], 10);
        this.minute = parseInt(parserArray[5], 10);
        this.second = parseInt(parserArray[6], 10);
    }
    toString(encoding = "iso") {
        if (encoding === "iso") {
            const outputArray = new Array(7);
            outputArray[0] = padNumber(((this.year < 2000) ? (this.year - 1900) : (this.year - 2000)), 2);
            outputArray[1] = padNumber(this.month, 2);
            outputArray[2] = padNumber(this.day, 2);
            outputArray[3] = padNumber(this.hour, 2);
            outputArray[4] = padNumber(this.minute, 2);
            outputArray[5] = padNumber(this.second, 2);
            outputArray[6] = "Z";
            return outputArray.join("");
        }
        return super.toString(encoding);
    }
    onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            year: this.year,
            month: this.month,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
        };
    }
}
_a$6 = UTCTime;
(() => {
    typeStore.UTCTime = _a$6;
})();
UTCTime.NAME = "UTCTime";

var _a$5;
class GeneralizedTime extends UTCTime {
    constructor(parameters = {}) {
        var _b;
        super(parameters);
        (_b = this.millisecond) !== null && _b !== void 0 ? _b : (this.millisecond = 0);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 24;
    }
    fromDate(inputDate) {
        super.fromDate(inputDate);
        this.millisecond = inputDate.getUTCMilliseconds();
    }
    toDate() {
        return (new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)));
    }
    fromString(inputString) {
        let isUTC = false;
        let timeString = "";
        let dateTimeString = "";
        let fractionPart = 0;
        let parser;
        let hourDifference = 0;
        let minuteDifference = 0;
        if (inputString[inputString.length - 1] === "Z") {
            timeString = inputString.substring(0, inputString.length - 1);
            isUTC = true;
        }
        else {
            const number = new Number(inputString[inputString.length - 1]);
            if (isNaN(number.valueOf()))
                throw new Error("Wrong input string for conversion");
            timeString = inputString;
        }
        if (isUTC) {
            if (timeString.indexOf("+") !== -1)
                throw new Error("Wrong input string for conversion");
            if (timeString.indexOf("-") !== -1)
                throw new Error("Wrong input string for conversion");
        }
        else {
            let multiplier = 1;
            let differencePosition = timeString.indexOf("+");
            let differenceString = "";
            if (differencePosition === -1) {
                differencePosition = timeString.indexOf("-");
                multiplier = -1;
            }
            if (differencePosition !== -1) {
                differenceString = timeString.substring(differencePosition + 1);
                timeString = timeString.substring(0, differencePosition);
                if ((differenceString.length !== 2) && (differenceString.length !== 4))
                    throw new Error("Wrong input string for conversion");
                let number = parseInt(differenceString.substring(0, 2), 10);
                if (isNaN(number.valueOf()))
                    throw new Error("Wrong input string for conversion");
                hourDifference = multiplier * number;
                if (differenceString.length === 4) {
                    number = parseInt(differenceString.substring(2, 4), 10);
                    if (isNaN(number.valueOf()))
                        throw new Error("Wrong input string for conversion");
                    minuteDifference = multiplier * number;
                }
            }
        }
        let fractionPointPosition = timeString.indexOf(".");
        if (fractionPointPosition === -1)
            fractionPointPosition = timeString.indexOf(",");
        if (fractionPointPosition !== -1) {
            const fractionPartCheck = new Number(`0${timeString.substring(fractionPointPosition)}`);
            if (isNaN(fractionPartCheck.valueOf()))
                throw new Error("Wrong input string for conversion");
            fractionPart = fractionPartCheck.valueOf();
            dateTimeString = timeString.substring(0, fractionPointPosition);
        }
        else
            dateTimeString = timeString;
        switch (true) {
            case (dateTimeString.length === 8):
                parser = /(\d{4})(\d{2})(\d{2})/ig;
                if (fractionPointPosition !== -1)
                    throw new Error("Wrong input string for conversion");
                break;
            case (dateTimeString.length === 10):
                parser = /(\d{4})(\d{2})(\d{2})(\d{2})/ig;
                if (fractionPointPosition !== -1) {
                    let fractionResult = 60 * fractionPart;
                    this.minute = Math.floor(fractionResult);
                    fractionResult = 60 * (fractionResult - this.minute);
                    this.second = Math.floor(fractionResult);
                    fractionResult = 1000 * (fractionResult - this.second);
                    this.millisecond = Math.floor(fractionResult);
                }
                break;
            case (dateTimeString.length === 12):
                parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
                if (fractionPointPosition !== -1) {
                    let fractionResult = 60 * fractionPart;
                    this.second = Math.floor(fractionResult);
                    fractionResult = 1000 * (fractionResult - this.second);
                    this.millisecond = Math.floor(fractionResult);
                }
                break;
            case (dateTimeString.length === 14):
                parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
                if (fractionPointPosition !== -1) {
                    const fractionResult = 1000 * fractionPart;
                    this.millisecond = Math.floor(fractionResult);
                }
                break;
            default:
                throw new Error("Wrong input string for conversion");
        }
        const parserArray = parser.exec(dateTimeString);
        if (parserArray === null)
            throw new Error("Wrong input string for conversion");
        for (let j = 1; j < parserArray.length; j++) {
            switch (j) {
                case 1:
                    this.year = parseInt(parserArray[j], 10);
                    break;
                case 2:
                    this.month = parseInt(parserArray[j], 10);
                    break;
                case 3:
                    this.day = parseInt(parserArray[j], 10);
                    break;
                case 4:
                    this.hour = parseInt(parserArray[j], 10) + hourDifference;
                    break;
                case 5:
                    this.minute = parseInt(parserArray[j], 10) + minuteDifference;
                    break;
                case 6:
                    this.second = parseInt(parserArray[j], 10);
                    break;
                default:
                    throw new Error("Wrong input string for conversion");
            }
        }
        if (isUTC === false) {
            const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
            this.year = tempDate.getUTCFullYear();
            this.month = tempDate.getUTCMonth();
            this.day = tempDate.getUTCDay();
            this.hour = tempDate.getUTCHours();
            this.minute = tempDate.getUTCMinutes();
            this.second = tempDate.getUTCSeconds();
            this.millisecond = tempDate.getUTCMilliseconds();
        }
    }
    toString(encoding = "iso") {
        if (encoding === "iso") {
            const outputArray = [];
            outputArray.push(padNumber(this.year, 4));
            outputArray.push(padNumber(this.month, 2));
            outputArray.push(padNumber(this.day, 2));
            outputArray.push(padNumber(this.hour, 2));
            outputArray.push(padNumber(this.minute, 2));
            outputArray.push(padNumber(this.second, 2));
            if (this.millisecond !== 0) {
                outputArray.push(".");
                outputArray.push(padNumber(this.millisecond, 3));
            }
            outputArray.push("Z");
            return outputArray.join("");
        }
        return super.toString(encoding);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            millisecond: this.millisecond,
        };
    }
}
_a$5 = GeneralizedTime;
(() => {
    typeStore.GeneralizedTime = _a$5;
})();
GeneralizedTime.NAME = "GeneralizedTime";

var _a$4;
class DATE extends Utf8String {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 31;
    }
}
_a$4 = DATE;
(() => {
    typeStore.DATE = _a$4;
})();
DATE.NAME = "DATE";

var _a$3;
class TimeOfDay extends Utf8String {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 32;
    }
}
_a$3 = TimeOfDay;
(() => {
    typeStore.TimeOfDay = _a$3;
})();
TimeOfDay.NAME = "TimeOfDay";

var _a$2;
class DateTime extends Utf8String {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 33;
    }
}
_a$2 = DateTime;
(() => {
    typeStore.DateTime = _a$2;
})();
DateTime.NAME = "DateTime";

var _a$1;
class Duration extends Utf8String {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 34;
    }
}
_a$1 = Duration;
(() => {
    typeStore.Duration = _a$1;
})();
Duration.NAME = "Duration";

var _a;
class TIME extends Utf8String {
    constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 14;
    }
}
_a = TIME;
(() => {
    typeStore.TIME = _a;
})();
TIME.NAME = "TIME";

class Any {
    constructor({ name = EMPTY_STRING, optional = false, } = {}) {
        this.name = name;
        this.optional = optional;
    }
}

class Choice extends Any {
    constructor({ value = [], ...parameters } = {}) {
        super(parameters);
        this.value = value;
    }
}

class Repeated extends Any {
    constructor({ value = new Any(), local = false, ...parameters } = {}) {
        super(parameters);
        this.value = value;
        this.local = local;
    }
}

class RawData {
    constructor({ data = EMPTY_VIEW } = {}) {
        this.dataView = BufferSourceConverter.toUint8Array(data);
    }
    get data() {
        return this.dataView.slice().buffer;
    }
    set data(value) {
        this.dataView = BufferSourceConverter.toUint8Array(value);
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
        const endLength = inputOffset + inputLength;
        this.dataView = BufferSourceConverter.toUint8Array(inputBuffer).subarray(inputOffset, endLength);
        return endLength;
    }
    toBER(sizeOnly) {
        return this.dataView.slice().buffer;
    }
}

function compareSchema(root, inputData, inputSchema) {
    if (inputSchema instanceof Choice) {
        for (let j = 0; j < inputSchema.value.length; j++) {
            const result = compareSchema(root, inputData, inputSchema.value[j]);
            if (result.verified) {
                return {
                    verified: true,
                    result: root
                };
            }
        }
        {
            const _result = {
                verified: false,
                result: {
                    error: "Wrong values for Choice type"
                },
            };
            if (inputSchema.hasOwnProperty(NAME))
                _result.name = inputSchema.name;
            return _result;
        }
    }
    if (inputSchema instanceof Any) {
        if (inputSchema.hasOwnProperty(NAME))
            root[inputSchema.name] = inputData;
        return {
            verified: true,
            result: root
        };
    }
    if ((root instanceof Object) === false) {
        return {
            verified: false,
            result: { error: "Wrong root object" }
        };
    }
    if ((inputData instanceof Object) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 data" }
        };
    }
    if ((inputSchema instanceof Object) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    if ((ID_BLOCK in inputSchema) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    if ((FROM_BER in inputSchema.idBlock) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    if ((TO_BER in inputSchema.idBlock) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    const encodedId = inputSchema.idBlock.toBER(false);
    if (encodedId.byteLength === 0) {
        return {
            verified: false,
            result: { error: "Error encoding idBlock for ASN.1 schema" }
        };
    }
    const decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);
    if (decodedOffset === -1) {
        return {
            verified: false,
            result: { error: "Error decoding idBlock for ASN.1 schema" }
        };
    }
    if (inputSchema.idBlock.hasOwnProperty(TAG_CLASS) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) {
        return {
            verified: false,
            result: root
        };
    }
    if (inputSchema.idBlock.hasOwnProperty(TAG_NUMBER) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) {
        return {
            verified: false,
            result: root
        };
    }
    if (inputSchema.idBlock.hasOwnProperty(IS_CONSTRUCTED) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) {
        return {
            verified: false,
            result: root
        };
    }
    if (!(IS_HEX_ONLY in inputSchema.idBlock)) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
        };
    }
    if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) {
        return {
            verified: false,
            result: root
        };
    }
    if (inputSchema.idBlock.isHexOnly) {
        if ((VALUE_HEX_VIEW in inputSchema.idBlock) === false) {
            return {
                verified: false,
                result: { error: "Wrong ASN.1 schema" }
            };
        }
        const schemaView = inputSchema.idBlock.valueHexView;
        const asn1View = inputData.idBlock.valueHexView;
        if (schemaView.length !== asn1View.length) {
            return {
                verified: false,
                result: root
            };
        }
        for (let i = 0; i < schemaView.length; i++) {
            if (schemaView[i] !== asn1View[1]) {
                return {
                    verified: false,
                    result: root
                };
            }
        }
    }
    if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name)
            root[inputSchema.name] = inputData;
    }
    if (inputSchema instanceof typeStore.Constructed) {
        let admission = 0;
        let result = {
            verified: false,
            result: {
                error: "Unknown error",
            }
        };
        let maxLength = inputSchema.valueBlock.value.length;
        if (maxLength > 0) {
            if (inputSchema.valueBlock.value[0] instanceof Repeated) {
                maxLength = inputData.valueBlock.value.length;
            }
        }
        if (maxLength === 0) {
            return {
                verified: true,
                result: root
            };
        }
        if ((inputData.valueBlock.value.length === 0) &&
            (inputSchema.valueBlock.value.length !== 0)) {
            let _optional = true;
            for (let i = 0; i < inputSchema.valueBlock.value.length; i++)
                _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);
            if (_optional) {
                return {
                    verified: true,
                    result: root
                };
            }
            if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name)
                    delete root[inputSchema.name];
            }
            root.error = "Inconsistent object length";
            return {
                verified: false,
                result: root
            };
        }
        for (let i = 0; i < maxLength; i++) {
            if ((i - admission) >= inputData.valueBlock.value.length) {
                if (inputSchema.valueBlock.value[i].optional === false) {
                    const _result = {
                        verified: false,
                        result: root
                    };
                    root.error = "Inconsistent length between ASN.1 data and schema";
                    if (inputSchema.name) {
                        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                        if (inputSchema.name) {
                            delete root[inputSchema.name];
                            _result.name = inputSchema.name;
                        }
                    }
                    return _result;
                }
            }
            else {
                if (inputSchema.valueBlock.value[0] instanceof Repeated) {
                    result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);
                    if (result.verified === false) {
                        if (inputSchema.valueBlock.value[0].optional)
                            admission++;
                        else {
                            if (inputSchema.name) {
                                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                                if (inputSchema.name)
                                    delete root[inputSchema.name];
                            }
                            return result;
                        }
                    }
                    if ((NAME in inputSchema.valueBlock.value[0]) && (inputSchema.valueBlock.value[0].name.length > 0)) {
                        let arrayRoot = {};
                        if ((LOCAL in inputSchema.valueBlock.value[0]) && (inputSchema.valueBlock.value[0].local))
                            arrayRoot = inputData;
                        else
                            arrayRoot = root;
                        if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined")
                            arrayRoot[inputSchema.valueBlock.value[0].name] = [];
                        arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
                    }
                }
                else {
                    result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);
                    if (result.verified === false) {
                        if (inputSchema.valueBlock.value[i].optional)
                            admission++;
                        else {
                            if (inputSchema.name) {
                                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                                if (inputSchema.name)
                                    delete root[inputSchema.name];
                            }
                            return result;
                        }
                    }
                }
            }
        }
        if (result.verified === false) {
            const _result = {
                verified: false,
                result: root
            };
            if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name) {
                    delete root[inputSchema.name];
                    _result.name = inputSchema.name;
                }
            }
            return _result;
        }
        return {
            verified: true,
            result: root
        };
    }
    if (inputSchema.primitiveSchema &&
        (VALUE_HEX_VIEW in inputData.valueBlock)) {
        const asn1 = localFromBER(inputData.valueBlock.valueHexView);
        if (asn1.offset === -1) {
            const _result = {
                verified: false,
                result: asn1.result
            };
            if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name) {
                    delete root[inputSchema.name];
                    _result.name = inputSchema.name;
                }
            }
            return _result;
        }
        return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
    }
    return {
        verified: true,
        result: root
    };
}
function verifySchema(inputBuffer, inputSchema) {
    if ((inputSchema instanceof Object) === false) {
        return {
            verified: false,
            result: { error: "Wrong ASN.1 schema type" }
        };
    }
    const asn1 = localFromBER(BufferSourceConverter.toUint8Array(inputBuffer));
    if (asn1.offset === -1) {
        return {
            verified: false,
            result: asn1.result
        };
    }
    return compareSchema(asn1.result, asn1.result, inputSchema);
}

var asn1js = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Any: Any,
	BaseBlock: BaseBlock,
	BaseStringBlock: BaseStringBlock,
	BitString: BitString$1,
	BmpString: BmpString,
	Boolean: Boolean$1,
	CharacterString: CharacterString,
	Choice: Choice,
	Constructed: Constructed,
	DATE: DATE,
	DateTime: DateTime,
	Duration: Duration,
	EndOfContent: EndOfContent,
	Enumerated: Enumerated,
	GeneralString: GeneralString,
	GeneralizedTime: GeneralizedTime,
	GraphicString: GraphicString,
	HexBlock: HexBlock,
	IA5String: IA5String,
	Integer: Integer,
	Null: Null,
	NumericString: NumericString,
	ObjectIdentifier: ObjectIdentifier$1,
	OctetString: OctetString$1,
	Primitive: Primitive,
	PrintableString: PrintableString,
	RawData: RawData,
	RelativeObjectIdentifier: RelativeObjectIdentifier,
	Repeated: Repeated,
	Sequence: Sequence,
	Set: Set$1,
	TIME: TIME,
	TeletexString: TeletexString,
	TimeOfDay: TimeOfDay,
	UTCTime: UTCTime,
	UniversalString: UniversalString,
	Utf8String: Utf8String,
	ValueBlock: ValueBlock,
	VideotexString: VideotexString,
	ViewWriter: ViewWriter,
	VisibleString: VisibleString,
	compareSchema: compareSchema,
	fromBER: fromBER,
	verifySchema: verifySchema
});

var AsnTypeTypes;
(function (AsnTypeTypes) {
    AsnTypeTypes[AsnTypeTypes["Sequence"] = 0] = "Sequence";
    AsnTypeTypes[AsnTypeTypes["Set"] = 1] = "Set";
    AsnTypeTypes[AsnTypeTypes["Choice"] = 2] = "Choice";
})(AsnTypeTypes || (AsnTypeTypes = {}));
var AsnPropTypes;
(function (AsnPropTypes) {
    AsnPropTypes[AsnPropTypes["Any"] = 1] = "Any";
    AsnPropTypes[AsnPropTypes["Boolean"] = 2] = "Boolean";
    AsnPropTypes[AsnPropTypes["OctetString"] = 3] = "OctetString";
    AsnPropTypes[AsnPropTypes["BitString"] = 4] = "BitString";
    AsnPropTypes[AsnPropTypes["Integer"] = 5] = "Integer";
    AsnPropTypes[AsnPropTypes["Enumerated"] = 6] = "Enumerated";
    AsnPropTypes[AsnPropTypes["ObjectIdentifier"] = 7] = "ObjectIdentifier";
    AsnPropTypes[AsnPropTypes["Utf8String"] = 8] = "Utf8String";
    AsnPropTypes[AsnPropTypes["BmpString"] = 9] = "BmpString";
    AsnPropTypes[AsnPropTypes["UniversalString"] = 10] = "UniversalString";
    AsnPropTypes[AsnPropTypes["NumericString"] = 11] = "NumericString";
    AsnPropTypes[AsnPropTypes["PrintableString"] = 12] = "PrintableString";
    AsnPropTypes[AsnPropTypes["TeletexString"] = 13] = "TeletexString";
    AsnPropTypes[AsnPropTypes["VideotexString"] = 14] = "VideotexString";
    AsnPropTypes[AsnPropTypes["IA5String"] = 15] = "IA5String";
    AsnPropTypes[AsnPropTypes["GraphicString"] = 16] = "GraphicString";
    AsnPropTypes[AsnPropTypes["VisibleString"] = 17] = "VisibleString";
    AsnPropTypes[AsnPropTypes["GeneralString"] = 18] = "GeneralString";
    AsnPropTypes[AsnPropTypes["CharacterString"] = 19] = "CharacterString";
    AsnPropTypes[AsnPropTypes["UTCTime"] = 20] = "UTCTime";
    AsnPropTypes[AsnPropTypes["GeneralizedTime"] = 21] = "GeneralizedTime";
    AsnPropTypes[AsnPropTypes["DATE"] = 22] = "DATE";
    AsnPropTypes[AsnPropTypes["TimeOfDay"] = 23] = "TimeOfDay";
    AsnPropTypes[AsnPropTypes["DateTime"] = 24] = "DateTime";
    AsnPropTypes[AsnPropTypes["Duration"] = 25] = "Duration";
    AsnPropTypes[AsnPropTypes["TIME"] = 26] = "TIME";
    AsnPropTypes[AsnPropTypes["Null"] = 27] = "Null";
})(AsnPropTypes || (AsnPropTypes = {}));

const AsnAnyConverter = {
    fromASN: (value) => value instanceof Null ? null : value.valueBeforeDecodeView,
    toASN: (value) => {
        if (value === null) {
            return new Null();
        }
        const schema = fromBER(value);
        if (schema.result.error) {
            throw new Error(schema.result.error);
        }
        return schema.result;
    },
};
const AsnIntegerConverter = {
    fromASN: (value) => value.valueBlock.valueHexView.byteLength >= 4
        ? value.valueBlock.toString()
        : value.valueBlock.valueDec,
    toASN: (value) => new Integer({ value: +value }),
};
const AsnEnumeratedConverter = {
    fromASN: (value) => value.valueBlock.valueDec,
    toASN: (value) => new Enumerated({ value }),
};
const AsnBitStringConverter = {
    fromASN: (value) => value.valueBlock.valueHexView,
    toASN: (value) => new BitString$1({ valueHex: value }),
};
const AsnObjectIdentifierConverter = {
    fromASN: (value) => value.valueBlock.toString(),
    toASN: (value) => new ObjectIdentifier$1({ value }),
};
const AsnBooleanConverter = {
    fromASN: (value) => value.valueBlock.value,
    toASN: (value) => new Boolean$1({ value }),
};
const AsnOctetStringConverter = {
    fromASN: (value) => value.valueBlock.valueHexView,
    toASN: (value) => new OctetString$1({ valueHex: value }),
};
function createStringConverter(Asn1Type) {
    return {
        fromASN: (value) => value.valueBlock.value,
        toASN: (value) => new Asn1Type({ value }),
    };
}
const AsnUtf8StringConverter = createStringConverter(Utf8String);
const AsnBmpStringConverter = createStringConverter(BmpString);
const AsnUniversalStringConverter = createStringConverter(UniversalString);
const AsnNumericStringConverter = createStringConverter(NumericString);
const AsnPrintableStringConverter = createStringConverter(PrintableString);
const AsnTeletexStringConverter = createStringConverter(TeletexString);
const AsnVideotexStringConverter = createStringConverter(VideotexString);
const AsnIA5StringConverter = createStringConverter(IA5String);
const AsnGraphicStringConverter = createStringConverter(GraphicString);
const AsnVisibleStringConverter = createStringConverter(VisibleString);
const AsnGeneralStringConverter = createStringConverter(GeneralString);
const AsnCharacterStringConverter = createStringConverter(CharacterString);
const AsnUTCTimeConverter = {
    fromASN: (value) => value.toDate(),
    toASN: (value) => new UTCTime({ valueDate: value }),
};
const AsnGeneralizedTimeConverter = {
    fromASN: (value) => value.toDate(),
    toASN: (value) => new GeneralizedTime({ valueDate: value }),
};
const AsnNullConverter = {
    fromASN: () => null,
    toASN: () => {
        return new Null();
    },
};
function defaultConverter(type) {
    switch (type) {
        case AsnPropTypes.Any:
            return AsnAnyConverter;
        case AsnPropTypes.BitString:
            return AsnBitStringConverter;
        case AsnPropTypes.BmpString:
            return AsnBmpStringConverter;
        case AsnPropTypes.Boolean:
            return AsnBooleanConverter;
        case AsnPropTypes.CharacterString:
            return AsnCharacterStringConverter;
        case AsnPropTypes.Enumerated:
            return AsnEnumeratedConverter;
        case AsnPropTypes.GeneralString:
            return AsnGeneralStringConverter;
        case AsnPropTypes.GeneralizedTime:
            return AsnGeneralizedTimeConverter;
        case AsnPropTypes.GraphicString:
            return AsnGraphicStringConverter;
        case AsnPropTypes.IA5String:
            return AsnIA5StringConverter;
        case AsnPropTypes.Integer:
            return AsnIntegerConverter;
        case AsnPropTypes.Null:
            return AsnNullConverter;
        case AsnPropTypes.NumericString:
            return AsnNumericStringConverter;
        case AsnPropTypes.ObjectIdentifier:
            return AsnObjectIdentifierConverter;
        case AsnPropTypes.OctetString:
            return AsnOctetStringConverter;
        case AsnPropTypes.PrintableString:
            return AsnPrintableStringConverter;
        case AsnPropTypes.TeletexString:
            return AsnTeletexStringConverter;
        case AsnPropTypes.UTCTime:
            return AsnUTCTimeConverter;
        case AsnPropTypes.UniversalString:
            return AsnUniversalStringConverter;
        case AsnPropTypes.Utf8String:
            return AsnUtf8StringConverter;
        case AsnPropTypes.VideotexString:
            return AsnVideotexStringConverter;
        case AsnPropTypes.VisibleString:
            return AsnVisibleStringConverter;
        default:
            return null;
    }
}

function isConvertible$1(target) {
    if (typeof target === "function" && target.prototype) {
        if (target.prototype.toASN && target.prototype.fromASN) {
            return true;
        }
        else {
            return isConvertible$1(target.prototype);
        }
    }
    else {
        return !!(target && typeof target === "object" && "toASN" in target && "fromASN" in target);
    }
}
function isTypeOfArray(target) {
    var _a;
    if (target) {
        const proto = Object.getPrototypeOf(target);
        if (((_a = proto === null || proto === void 0 ? void 0 : proto.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === Array) {
            return true;
        }
        return isTypeOfArray(proto);
    }
    return false;
}
function isArrayEqual(bytes1, bytes2) {
    if (!(bytes1 && bytes2)) {
        return false;
    }
    if (bytes1.byteLength !== bytes2.byteLength) {
        return false;
    }
    const b1 = new Uint8Array(bytes1);
    const b2 = new Uint8Array(bytes2);
    for (let i = 0; i < bytes1.byteLength; i++) {
        if (b1[i] !== b2[i]) {
            return false;
        }
    }
    return true;
}

class AsnSchemaStorage {
    constructor() {
        this.items = new WeakMap();
    }
    has(target) {
        return this.items.has(target);
    }
    get(target, checkSchema = false) {
        const schema = this.items.get(target);
        if (!schema) {
            throw new Error(`Cannot get schema for '${target.prototype.constructor.name}' target`);
        }
        if (checkSchema && !schema.schema) {
            throw new Error(`Schema '${target.prototype.constructor.name}' doesn't contain ASN.1 schema. Call 'AsnSchemaStorage.cache'.`);
        }
        return schema;
    }
    cache(target) {
        const schema = this.get(target);
        if (!schema.schema) {
            schema.schema = this.create(target, true);
        }
    }
    createDefault(target) {
        const schema = {
            type: AsnTypeTypes.Sequence,
            items: {},
        };
        const parentSchema = this.findParentSchema(target);
        if (parentSchema) {
            Object.assign(schema, parentSchema);
            schema.items = Object.assign({}, schema.items, parentSchema.items);
        }
        return schema;
    }
    create(target, useNames) {
        const schema = this.items.get(target) || this.createDefault(target);
        const asn1Value = [];
        for (const key in schema.items) {
            const item = schema.items[key];
            const name = useNames ? key : "";
            let asn1Item;
            if (typeof (item.type) === "number") {
                const Asn1TypeName = AsnPropTypes[item.type];
                const Asn1Type = asn1js[Asn1TypeName];
                if (!Asn1Type) {
                    throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
                }
                asn1Item = new Asn1Type({ name });
            }
            else if (isConvertible$1(item.type)) {
                const instance = new item.type();
                asn1Item = instance.toSchema(name);
            }
            else if (item.optional) {
                const itemSchema = this.get(item.type);
                if (itemSchema.type === AsnTypeTypes.Choice) {
                    asn1Item = new Any({ name });
                }
                else {
                    asn1Item = this.create(item.type, false);
                    asn1Item.name = name;
                }
            }
            else {
                asn1Item = new Any({ name });
            }
            const optional = !!item.optional || item.defaultValue !== undefined;
            if (item.repeated) {
                asn1Item.name = "";
                const Container = item.repeated === "set"
                    ? Set$1
                    : Sequence;
                asn1Item = new Container({
                    name: "",
                    value: [
                        new Repeated({
                            name,
                            value: asn1Item,
                        }),
                    ],
                });
            }
            if (item.context !== null && item.context !== undefined) {
                if (item.implicit) {
                    if (typeof item.type === "number" || isConvertible$1(item.type)) {
                        const Container = item.repeated
                            ? Constructed
                            : Primitive;
                        asn1Value.push(new Container({
                            name,
                            optional,
                            idBlock: {
                                tagClass: 3,
                                tagNumber: item.context,
                            },
                        }));
                    }
                    else {
                        this.cache(item.type);
                        const isRepeated = !!item.repeated;
                        let value = !isRepeated
                            ? this.get(item.type, true).schema
                            : asn1Item;
                        value = "valueBlock" in value ? value.valueBlock.value : value.value;
                        asn1Value.push(new Constructed({
                            name: !isRepeated ? name : "",
                            optional,
                            idBlock: {
                                tagClass: 3,
                                tagNumber: item.context,
                            },
                            value: value,
                        }));
                    }
                }
                else {
                    asn1Value.push(new Constructed({
                        optional,
                        idBlock: {
                            tagClass: 3,
                            tagNumber: item.context,
                        },
                        value: [asn1Item],
                    }));
                }
            }
            else {
                asn1Item.optional = optional;
                asn1Value.push(asn1Item);
            }
        }
        switch (schema.type) {
            case AsnTypeTypes.Sequence:
                return new Sequence({ value: asn1Value, name: "" });
            case AsnTypeTypes.Set:
                return new Set$1({ value: asn1Value, name: "" });
            case AsnTypeTypes.Choice:
                return new Choice({ value: asn1Value, name: "" });
            default:
                throw new Error(`Unsupported ASN1 type in use`);
        }
    }
    set(target, schema) {
        this.items.set(target, schema);
        return this;
    }
    findParentSchema(target) {
        const parent = Object.getPrototypeOf(target);
        if (parent) {
            const schema = this.items.get(parent);
            return schema || this.findParentSchema(parent);
        }
        return null;
    }
}

const schemaStorage$1 = new AsnSchemaStorage();

const AsnType = (options) => (target) => {
    let schema;
    if (!schemaStorage$1.has(target)) {
        schema = schemaStorage$1.createDefault(target);
        schemaStorage$1.set(target, schema);
    }
    else {
        schema = schemaStorage$1.get(target);
    }
    Object.assign(schema, options);
};
const AsnProp = (options) => (target, propertyKey) => {
    let schema;
    if (!schemaStorage$1.has(target.constructor)) {
        schema = schemaStorage$1.createDefault(target.constructor);
        schemaStorage$1.set(target.constructor, schema);
    }
    else {
        schema = schemaStorage$1.get(target.constructor);
    }
    const copyOptions = Object.assign({}, options);
    if (typeof copyOptions.type === "number" && !copyOptions.converter) {
        const defaultConverter$1 = defaultConverter(options.type);
        if (!defaultConverter$1) {
            throw new Error(`Cannot get default converter for property '${propertyKey}' of ${target.constructor.name}`);
        }
        copyOptions.converter = defaultConverter$1;
    }
    schema.items[propertyKey] = copyOptions;
};

class AsnSchemaValidationError extends Error {
    constructor() {
        super(...arguments);
        this.schemas = [];
    }
}

class AsnParser {
    static parse(data, target) {
        const asn1Parsed = fromBER(data);
        if (asn1Parsed.result.error) {
            throw new Error(asn1Parsed.result.error);
        }
        const res = this.fromASN(asn1Parsed.result, target);
        return res;
    }
    static fromASN(asn1Schema, target) {
        var _a;
        try {
            if (isConvertible$1(target)) {
                const value = new target();
                return value.fromASN(asn1Schema);
            }
            const schema = schemaStorage$1.get(target);
            schemaStorage$1.cache(target);
            let targetSchema = schema.schema;
            if (asn1Schema.constructor === Constructed && schema.type !== AsnTypeTypes.Choice) {
                targetSchema = new Constructed({
                    idBlock: {
                        tagClass: 3,
                        tagNumber: asn1Schema.idBlock.tagNumber,
                    },
                    value: schema.schema.valueBlock.value,
                });
                for (const key in schema.items) {
                    delete asn1Schema[key];
                }
            }
            const asn1ComparedSchema = compareSchema({}, asn1Schema, targetSchema);
            if (!asn1ComparedSchema.verified) {
                throw new AsnSchemaValidationError(`Data does not match to ${target.name} ASN1 schema. ${asn1ComparedSchema.result.error}`);
            }
            const res = new target();
            if (isTypeOfArray(target)) {
                if (!("value" in asn1Schema.valueBlock && Array.isArray(asn1Schema.valueBlock.value))) {
                    throw new Error(`Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.`);
                }
                const itemType = schema.itemType;
                if (typeof itemType === "number") {
                    const converter = defaultConverter(itemType);
                    if (!converter) {
                        throw new Error(`Cannot get default converter for array item of ${target.name} ASN1 schema`);
                    }
                    return target.from(asn1Schema.valueBlock.value, (element) => converter.fromASN(element));
                }
                else {
                    return target.from(asn1Schema.valueBlock.value, (element) => this.fromASN(element, itemType));
                }
            }
            for (const key in schema.items) {
                const asn1SchemaValue = asn1ComparedSchema.result[key];
                if (!asn1SchemaValue) {
                    continue;
                }
                const schemaItem = schema.items[key];
                const schemaItemType = schemaItem.type;
                if (typeof schemaItemType === "number" || isConvertible$1(schemaItemType)) {
                    const converter = (_a = schemaItem.converter) !== null && _a !== void 0 ? _a : (isConvertible$1(schemaItemType)
                        ? new schemaItemType()
                        : null);
                    if (!converter) {
                        throw new Error("Converter is empty");
                    }
                    if (schemaItem.repeated) {
                        if (schemaItem.implicit) {
                            const Container = schemaItem.repeated === "sequence"
                                ? Sequence
                                : Set$1;
                            const newItem = new Container();
                            newItem.valueBlock = asn1SchemaValue.valueBlock;
                            const newItemAsn = fromBER(newItem.toBER(false));
                            if (newItemAsn.offset === -1) {
                                throw new Error(`Cannot parse the child item. ${newItemAsn.result.error}`);
                            }
                            if (!("value" in newItemAsn.result.valueBlock && Array.isArray(newItemAsn.result.valueBlock.value))) {
                                throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
                            }
                            const value = newItemAsn.result.valueBlock.value;
                            res[key] = Array.from(value, (element) => converter.fromASN(element));
                        }
                        else {
                            res[key] = Array.from(asn1SchemaValue, (element) => converter.fromASN(element));
                        }
                    }
                    else {
                        let value = asn1SchemaValue;
                        if (schemaItem.implicit) {
                            let newItem;
                            if (isConvertible$1(schemaItemType)) {
                                newItem = new schemaItemType().toSchema("");
                            }
                            else {
                                const Asn1TypeName = AsnPropTypes[schemaItemType];
                                const Asn1Type = asn1js[Asn1TypeName];
                                if (!Asn1Type) {
                                    throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
                                }
                                newItem = new Asn1Type();
                            }
                            newItem.valueBlock = value.valueBlock;
                            value = fromBER(newItem.toBER(false)).result;
                        }
                        res[key] = converter.fromASN(value);
                    }
                }
                else {
                    if (schemaItem.repeated) {
                        if (!Array.isArray(asn1SchemaValue)) {
                            throw new Error("Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.");
                        }
                        res[key] = Array.from(asn1SchemaValue, (element) => this.fromASN(element, schemaItemType));
                    }
                    else {
                        res[key] = this.fromASN(asn1SchemaValue, schemaItemType);
                    }
                }
            }
            return res;
        }
        catch (error) {
            if (error instanceof AsnSchemaValidationError) {
                error.schemas.push(target.name);
            }
            throw error;
        }
    }
}

class AsnSerializer {
    static serialize(obj) {
        if (obj instanceof BaseBlock) {
            return obj.toBER(false);
        }
        return this.toASN(obj).toBER(false);
    }
    static toASN(obj) {
        if (obj && typeof obj === "object" && isConvertible$1(obj)) {
            return obj.toASN();
        }
        if (!(obj && typeof obj === "object")) {
            throw new TypeError("Parameter 1 should be type of Object.");
        }
        const target = obj.constructor;
        const schema = schemaStorage$1.get(target);
        schemaStorage$1.cache(target);
        let asn1Value = [];
        if (schema.itemType) {
            if (!Array.isArray(obj)) {
                throw new TypeError("Parameter 1 should be type of Array.");
            }
            if (typeof schema.itemType === "number") {
                const converter = defaultConverter(schema.itemType);
                if (!converter) {
                    throw new Error(`Cannot get default converter for array item of ${target.name} ASN1 schema`);
                }
                asn1Value = obj.map((o) => converter.toASN(o));
            }
            else {
                asn1Value = obj.map((o) => this.toAsnItem({ type: schema.itemType }, "[]", target, o));
            }
        }
        else {
            for (const key in schema.items) {
                const schemaItem = schema.items[key];
                const objProp = obj[key];
                if (objProp === undefined
                    || schemaItem.defaultValue === objProp
                    || (typeof schemaItem.defaultValue === "object" && typeof objProp === "object"
                        && isArrayEqual(this.serialize(schemaItem.defaultValue), this.serialize(objProp)))) {
                    continue;
                }
                const asn1Item = AsnSerializer.toAsnItem(schemaItem, key, target, objProp);
                if (typeof schemaItem.context === "number") {
                    if (schemaItem.implicit) {
                        if (!schemaItem.repeated
                            && (typeof schemaItem.type === "number" || isConvertible$1(schemaItem.type))) {
                            const value = {};
                            value.valueHex = asn1Item instanceof Null ? asn1Item.valueBeforeDecodeView : asn1Item.valueBlock.toBER();
                            asn1Value.push(new Primitive({
                                optional: schemaItem.optional,
                                idBlock: {
                                    tagClass: 3,
                                    tagNumber: schemaItem.context,
                                },
                                ...value,
                            }));
                        }
                        else {
                            asn1Value.push(new Constructed({
                                optional: schemaItem.optional,
                                idBlock: {
                                    tagClass: 3,
                                    tagNumber: schemaItem.context,
                                },
                                value: asn1Item.valueBlock.value,
                            }));
                        }
                    }
                    else {
                        asn1Value.push(new Constructed({
                            optional: schemaItem.optional,
                            idBlock: {
                                tagClass: 3,
                                tagNumber: schemaItem.context,
                            },
                            value: [asn1Item],
                        }));
                    }
                }
                else if (schemaItem.repeated) {
                    asn1Value = asn1Value.concat(asn1Item);
                }
                else {
                    asn1Value.push(asn1Item);
                }
            }
        }
        let asnSchema;
        switch (schema.type) {
            case AsnTypeTypes.Sequence:
                asnSchema = new Sequence({ value: asn1Value });
                break;
            case AsnTypeTypes.Set:
                asnSchema = new Set$1({ value: asn1Value });
                break;
            case AsnTypeTypes.Choice:
                if (!asn1Value[0]) {
                    throw new Error(`Schema '${target.name}' has wrong data. Choice cannot be empty.`);
                }
                asnSchema = asn1Value[0];
                break;
        }
        return asnSchema;
    }
    static toAsnItem(schemaItem, key, target, objProp) {
        let asn1Item;
        if (typeof (schemaItem.type) === "number") {
            const converter = schemaItem.converter;
            if (!converter) {
                throw new Error(`Property '${key}' doesn't have converter for type ${AsnPropTypes[schemaItem.type]} in schema '${target.name}'`);
            }
            if (schemaItem.repeated) {
                if (!Array.isArray(objProp)) {
                    throw new TypeError("Parameter 'objProp' should be type of Array.");
                }
                const items = Array.from(objProp, (element) => converter.toASN(element));
                const Container = schemaItem.repeated === "sequence"
                    ? Sequence
                    : Set$1;
                asn1Item = new Container({
                    value: items,
                });
            }
            else {
                asn1Item = converter.toASN(objProp);
            }
        }
        else {
            if (schemaItem.repeated) {
                if (!Array.isArray(objProp)) {
                    throw new TypeError("Parameter 'objProp' should be type of Array.");
                }
                const items = Array.from(objProp, (element) => this.toASN(element));
                const Container = schemaItem.repeated === "sequence"
                    ? Sequence
                    : Set$1;
                asn1Item = new Container({
                    value: items,
                });
            }
            else {
                asn1Item = this.toASN(objProp);
            }
        }
        return asn1Item;
    }
}

class AsnConvert {
    static serialize(obj) {
        return AsnSerializer.serialize(obj);
    }
    static parse(data, target) {
        return AsnParser.parse(data, target);
    }
    static toString(data) {
        const buf = BufferSourceConverter.isBufferSource(data)
            ? BufferSourceConverter.toArrayBuffer(data)
            : AsnConvert.serialize(data);
        const asn = fromBER(buf);
        if (asn.offset === -1) {
            throw new Error(`Cannot decode ASN.1 data. ${asn.result.error}`);
        }
        return asn.result.toString();
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Copyright (c) 2020, Peculiar Ventures, All rights reserved.
 */

class JsonError extends Error {
    constructor(message, innerError) {
        super(innerError
            ? `${message}. See the inner exception for more details.`
            : message);
        this.message = message;
        this.innerError = innerError;
    }
}

class TransformError extends JsonError {
    constructor(schema, message, innerError) {
        super(message, innerError);
        this.schema = schema;
    }
}

class ParserError extends TransformError {
    constructor(schema, message, innerError) {
        super(schema, `JSON doesn't match to '${schema.target.name}' schema. ${message}`, innerError);
    }
}

class ValidationError extends JsonError {
}

class SerializerError extends JsonError {
    constructor(schemaName, message, innerError) {
        super(`Cannot serialize by '${schemaName}' schema. ${message}`, innerError);
        this.schemaName = schemaName;
    }
}

class KeyError extends ParserError {
    constructor(schema, keys, errors = {}) {
        super(schema, "Some keys doesn't match to schema");
        this.keys = keys;
        this.errors = errors;
    }
}

var JsonPropTypes;
(function (JsonPropTypes) {
    JsonPropTypes[JsonPropTypes["Any"] = 0] = "Any";
    JsonPropTypes[JsonPropTypes["Boolean"] = 1] = "Boolean";
    JsonPropTypes[JsonPropTypes["Number"] = 2] = "Number";
    JsonPropTypes[JsonPropTypes["String"] = 3] = "String";
})(JsonPropTypes || (JsonPropTypes = {}));

function checkType(value, type) {
    switch (type) {
        case JsonPropTypes.Boolean:
            return typeof value === "boolean";
        case JsonPropTypes.Number:
            return typeof value === "number";
        case JsonPropTypes.String:
            return typeof value === "string";
    }
    return true;
}
function throwIfTypeIsWrong(value, type) {
    if (!checkType(value, type)) {
        throw new TypeError(`Value must be ${JsonPropTypes[type]}`);
    }
}
function isConvertible(target) {
    if (target && target.prototype) {
        if (target.prototype.toJSON && target.prototype.fromJSON) {
            return true;
        }
        else {
            return isConvertible(target.prototype);
        }
    }
    else {
        return !!(target && target.toJSON && target.fromJSON);
    }
}

class JsonSchemaStorage {
    constructor() {
        this.items = new Map();
    }
    has(target) {
        return this.items.has(target) || !!this.findParentSchema(target);
    }
    get(target) {
        const schema = this.items.get(target) || this.findParentSchema(target);
        if (!schema) {
            throw new Error("Cannot get schema for current target");
        }
        return schema;
    }
    create(target) {
        const schema = { names: {} };
        const parentSchema = this.findParentSchema(target);
        if (parentSchema) {
            Object.assign(schema, parentSchema);
            schema.names = {};
            for (const name in parentSchema.names) {
                schema.names[name] = Object.assign({}, parentSchema.names[name]);
            }
        }
        schema.target = target;
        return schema;
    }
    set(target, schema) {
        this.items.set(target, schema);
        return this;
    }
    findParentSchema(target) {
        const parent = target.__proto__;
        if (parent) {
            const schema = this.items.get(parent);
            return schema || this.findParentSchema(parent);
        }
        return null;
    }
}

const DEFAULT_SCHEMA = "default";
const schemaStorage = new JsonSchemaStorage();

class PatternValidation {
    constructor(pattern) {
        this.pattern = new RegExp(pattern);
    }
    validate(value) {
        const pattern = new RegExp(this.pattern.source, this.pattern.flags);
        if (typeof value !== "string") {
            throw new ValidationError("Incoming value must be string");
        }
        if (!pattern.exec(value)) {
            throw new ValidationError(`Value doesn't match to pattern '${pattern.toString()}'`);
        }
    }
}

class InclusiveValidation {
    constructor(min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
        this.min = min;
        this.max = max;
    }
    validate(value) {
        throwIfTypeIsWrong(value, JsonPropTypes.Number);
        if (!(this.min <= value && value <= this.max)) {
            const min = this.min === Number.MIN_VALUE ? "MIN" : this.min;
            const max = this.max === Number.MAX_VALUE ? "MAX" : this.max;
            throw new ValidationError(`Value doesn't match to diapason [${min},${max}]`);
        }
    }
}

class ExclusiveValidation {
    constructor(min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
        this.min = min;
        this.max = max;
    }
    validate(value) {
        throwIfTypeIsWrong(value, JsonPropTypes.Number);
        if (!(this.min < value && value < this.max)) {
            const min = this.min === Number.MIN_VALUE ? "MIN" : this.min;
            const max = this.max === Number.MAX_VALUE ? "MAX" : this.max;
            throw new ValidationError(`Value doesn't match to diapason (${min},${max})`);
        }
    }
}

class LengthValidation {
    constructor(length, minLength, maxLength) {
        this.length = length;
        this.minLength = minLength;
        this.maxLength = maxLength;
    }
    validate(value) {
        if (this.length !== undefined) {
            if (value.length !== this.length) {
                throw new ValidationError(`Value length must be exactly ${this.length}.`);
            }
            return;
        }
        if (this.minLength !== undefined) {
            if (value.length < this.minLength) {
                throw new ValidationError(`Value length must be more than ${this.minLength}.`);
            }
        }
        if (this.maxLength !== undefined) {
            if (value.length > this.maxLength) {
                throw new ValidationError(`Value length must be less than ${this.maxLength}.`);
            }
        }
    }
}

class EnumerationValidation {
    constructor(enumeration) {
        this.enumeration = enumeration;
    }
    validate(value) {
        throwIfTypeIsWrong(value, JsonPropTypes.String);
        if (!this.enumeration.includes(value)) {
            throw new ValidationError(`Value must be one of ${this.enumeration.map((v) => `'${v}'`).join(", ")}`);
        }
    }
}

class JsonTransform {
    static checkValues(data, schemaItem) {
        const values = Array.isArray(data) ? data : [data];
        for (const value of values) {
            for (const validation of schemaItem.validations) {
                if (validation instanceof LengthValidation && schemaItem.repeated) {
                    validation.validate(data);
                }
                else {
                    validation.validate(value);
                }
            }
        }
    }
    static checkTypes(value, schemaItem) {
        if (schemaItem.repeated && !Array.isArray(value)) {
            throw new TypeError("Value must be Array");
        }
        if (typeof schemaItem.type === "number") {
            const values = Array.isArray(value) ? value : [value];
            for (const v of values) {
                throwIfTypeIsWrong(v, schemaItem.type);
            }
        }
    }
    static getSchemaByName(schema, name = DEFAULT_SCHEMA) {
        return { ...schema.names[DEFAULT_SCHEMA], ...schema.names[name] };
    }
}

class JsonSerializer extends JsonTransform {
    static serialize(obj, options, replacer, space) {
        const json = this.toJSON(obj, options);
        return JSON.stringify(json, replacer, space);
    }
    static toJSON(obj, options = {}) {
        let res;
        let targetSchema = options.targetSchema;
        const schemaName = options.schemaName || DEFAULT_SCHEMA;
        if (isConvertible(obj)) {
            return obj.toJSON();
        }
        if (Array.isArray(obj)) {
            res = [];
            for (const item of obj) {
                res.push(this.toJSON(item, options));
            }
        }
        else if (typeof obj === "object") {
            if (targetSchema && !schemaStorage.has(targetSchema)) {
                throw new JsonError("Cannot get schema for `targetSchema` param");
            }
            targetSchema = (targetSchema || obj.constructor);
            if (schemaStorage.has(targetSchema)) {
                const schema = schemaStorage.get(targetSchema);
                res = {};
                const namedSchema = this.getSchemaByName(schema, schemaName);
                for (const key in namedSchema) {
                    try {
                        const item = namedSchema[key];
                        const objItem = obj[key];
                        let value;
                        if ((item.optional && objItem === undefined)
                            || (item.defaultValue !== undefined && objItem === item.defaultValue)) {
                            continue;
                        }
                        if (!item.optional && objItem === undefined) {
                            throw new SerializerError(targetSchema.name, `Property '${key}' is required.`);
                        }
                        if (typeof item.type === "number") {
                            if (item.converter) {
                                if (item.repeated) {
                                    value = objItem.map((el) => item.converter.toJSON(el, obj));
                                }
                                else {
                                    value = item.converter.toJSON(objItem, obj);
                                }
                            }
                            else {
                                value = objItem;
                            }
                        }
                        else {
                            if (item.repeated) {
                                value = objItem.map((el) => this.toJSON(el, { schemaName }));
                            }
                            else {
                                value = this.toJSON(objItem, { schemaName });
                            }
                        }
                        this.checkTypes(value, item);
                        this.checkValues(value, item);
                        res[item.name || key] = value;
                    }
                    catch (e) {
                        if (e instanceof SerializerError) {
                            throw e;
                        }
                        else {
                            throw new SerializerError(schema.target.name, `Property '${key}' is wrong. ${e.message}`, e);
                        }
                    }
                }
            }
            else {
                res = {};
                for (const key in obj) {
                    res[key] = this.toJSON(obj[key], { schemaName });
                }
            }
        }
        else {
            res = obj;
        }
        return res;
    }
}

class JsonParser extends JsonTransform {
    static parse(data, options) {
        const obj = JSON.parse(data);
        return this.fromJSON(obj, options);
    }
    static fromJSON(target, options) {
        const targetSchema = options.targetSchema;
        const schemaName = options.schemaName || DEFAULT_SCHEMA;
        const obj = new targetSchema();
        if (isConvertible(obj)) {
            return obj.fromJSON(target);
        }
        const schema = schemaStorage.get(targetSchema);
        const namedSchema = this.getSchemaByName(schema, schemaName);
        const keyErrors = {};
        if (options.strictProperty && !Array.isArray(target)) {
            JsonParser.checkStrictProperty(target, namedSchema, schema);
        }
        for (const key in namedSchema) {
            try {
                const item = namedSchema[key];
                const name = item.name || key;
                const value = target[name];
                if (value === undefined && (item.optional || item.defaultValue !== undefined)) {
                    continue;
                }
                if (!item.optional && value === undefined) {
                    throw new ParserError(schema, `Property '${name}' is required.`);
                }
                this.checkTypes(value, item);
                this.checkValues(value, item);
                if (typeof (item.type) === "number") {
                    if (item.converter) {
                        if (item.repeated) {
                            obj[key] = value.map((el) => item.converter.fromJSON(el, obj));
                        }
                        else {
                            obj[key] = item.converter.fromJSON(value, obj);
                        }
                    }
                    else {
                        obj[key] = value;
                    }
                }
                else {
                    const newOptions = {
                        ...options,
                        targetSchema: item.type,
                        schemaName,
                    };
                    if (item.repeated) {
                        obj[key] = value.map((el) => this.fromJSON(el, newOptions));
                    }
                    else {
                        obj[key] = this.fromJSON(value, newOptions);
                    }
                }
            }
            catch (e) {
                if (!(e instanceof ParserError)) {
                    e = new ParserError(schema, `Property '${key}' is wrong. ${e.message}`, e);
                }
                if (options.strictAllKeys) {
                    keyErrors[key] = e;
                }
                else {
                    throw e;
                }
            }
        }
        const keys = Object.keys(keyErrors);
        if (keys.length) {
            throw new KeyError(schema, keys, keyErrors);
        }
        return obj;
    }
    static checkStrictProperty(target, namedSchema, schema) {
        const jsonProps = Object.keys(target);
        const schemaProps = Object.keys(namedSchema);
        const keys = [];
        for (const key of jsonProps) {
            if (schemaProps.indexOf(key) === -1) {
                keys.push(key);
            }
        }
        if (keys.length) {
            throw new KeyError(schema, keys);
        }
    }
}

function getValidations(item) {
    const validations = [];
    if (item.pattern) {
        validations.push(new PatternValidation(item.pattern));
    }
    if (item.type === JsonPropTypes.Number || item.type === JsonPropTypes.Any) {
        if (item.minInclusive !== undefined || item.maxInclusive !== undefined) {
            validations.push(new InclusiveValidation(item.minInclusive, item.maxInclusive));
        }
        if (item.minExclusive !== undefined || item.maxExclusive !== undefined) {
            validations.push(new ExclusiveValidation(item.minExclusive, item.maxExclusive));
        }
        if (item.enumeration !== undefined) {
            validations.push(new EnumerationValidation(item.enumeration));
        }
    }
    if (item.type === JsonPropTypes.String || item.repeated || item.type === JsonPropTypes.Any) {
        if (item.length !== undefined || item.minLength !== undefined || item.maxLength !== undefined) {
            validations.push(new LengthValidation(item.length, item.minLength, item.maxLength));
        }
    }
    return validations;
}
const JsonProp = (options = {}) => (target, propertyKey) => {
    const errorMessage = `Cannot set type for ${propertyKey} property of ${target.constructor.name} schema`;
    let schema;
    if (!schemaStorage.has(target.constructor)) {
        schema = schemaStorage.create(target.constructor);
        schemaStorage.set(target.constructor, schema);
    }
    else {
        schema = schemaStorage.get(target.constructor);
        if (schema.target !== target.constructor) {
            schema = schemaStorage.create(target.constructor);
            schemaStorage.set(target.constructor, schema);
        }
    }
    const defaultSchema = {
        type: JsonPropTypes.Any,
        validations: [],
    };
    const copyOptions = Object.assign(defaultSchema, options);
    copyOptions.validations = getValidations(copyOptions);
    if (typeof copyOptions.type !== "number") {
        if (!schemaStorage.has(copyOptions.type) && !isConvertible(copyOptions.type)) {
            throw new Error(`${errorMessage}. Assigning type doesn't have schema.`);
        }
    }
    let schemaNames;
    if (Array.isArray(options.schema)) {
        schemaNames = options.schema;
    }
    else {
        schemaNames = [options.schema || DEFAULT_SCHEMA];
    }
    for (const schemaName of schemaNames) {
        if (!schema.names[schemaName]) {
            schema.names[schemaName] = {};
        }
        const namedSchema = schema.names[schemaName];
        namedSchema[propertyKey] = copyOptions;
    }
};

/*!
 Copyright (c) Peculiar Ventures, LLC
*/


class CryptoError extends Error {
}

class AlgorithmError extends CryptoError {
}

class UnsupportedOperationError extends CryptoError {
    constructor(methodName) {
        super(`Unsupported operation: ${methodName ? `${methodName}` : ""}`);
    }
}

class OperationError extends CryptoError {
}

class RequiredPropertyError extends CryptoError {
    constructor(propName) {
        super(`${propName}: Missing required property`);
    }
}

function isJWK(data) {
    return typeof data === "object" && "kty" in data;
}

class ProviderCrypto {
    async digest(...args) {
        this.checkDigest.apply(this, args);
        return this.onDigest.apply(this, args);
    }
    checkDigest(algorithm, data) {
        this.checkAlgorithmName(algorithm);
    }
    async onDigest(algorithm, data) {
        throw new UnsupportedOperationError("digest");
    }
    async generateKey(...args) {
        this.checkGenerateKey.apply(this, args);
        return this.onGenerateKey.apply(this, args);
    }
    checkGenerateKey(algorithm, extractable, keyUsages, ...args) {
        this.checkAlgorithmName(algorithm);
        this.checkGenerateKeyParams(algorithm);
        if (!(keyUsages && keyUsages.length)) {
            throw new TypeError(`Usages cannot be empty when creating a key.`);
        }
        let allowedUsages;
        if (Array.isArray(this.usages)) {
            allowedUsages = this.usages;
        }
        else {
            allowedUsages = this.usages.privateKey.concat(this.usages.publicKey);
        }
        this.checkKeyUsages(keyUsages, allowedUsages);
    }
    checkGenerateKeyParams(algorithm) {
    }
    async onGenerateKey(algorithm, extractable, keyUsages, ...args) {
        throw new UnsupportedOperationError("generateKey");
    }
    async sign(...args) {
        this.checkSign.apply(this, args);
        return this.onSign.apply(this, args);
    }
    checkSign(algorithm, key, data, ...args) {
        this.checkAlgorithmName(algorithm);
        this.checkAlgorithmParams(algorithm);
        this.checkCryptoKey(key, "sign");
    }
    async onSign(algorithm, key, data, ...args) {
        throw new UnsupportedOperationError("sign");
    }
    async verify(...args) {
        this.checkVerify.apply(this, args);
        return this.onVerify.apply(this, args);
    }
    checkVerify(algorithm, key, signature, data, ...args) {
        this.checkAlgorithmName(algorithm);
        this.checkAlgorithmParams(algorithm);
        this.checkCryptoKey(key, "verify");
    }
    async onVerify(algorithm, key, signature, data, ...args) {
        throw new UnsupportedOperationError("verify");
    }
    async encrypt(...args) {
        this.checkEncrypt.apply(this, args);
        return this.onEncrypt.apply(this, args);
    }
    checkEncrypt(algorithm, key, data, options = {}, ...args) {
        this.checkAlgorithmName(algorithm);
        this.checkAlgorithmParams(algorithm);
        this.checkCryptoKey(key, options.keyUsage ? "encrypt" : void 0);
    }
    async onEncrypt(algorithm, key, data, ...args) {
        throw new UnsupportedOperationError("encrypt");
    }
    async decrypt(...args) {
        this.checkDecrypt.apply(this, args);
        return this.onDecrypt.apply(this, args);
    }
    checkDecrypt(algorithm, key, data, options = {}, ...args) {
        this.checkAlgorithmName(algorithm);
        this.checkAlgorithmParams(algorithm);
        this.checkCryptoKey(key, options.keyUsage ? "decrypt" : void 0);
    }
    async onDecrypt(algorithm, key, data, ...args) {
        throw new UnsupportedOperationError("decrypt");
    }
    async deriveBits(...args) {
        this.checkDeriveBits.apply(this, args);
        return this.onDeriveBits.apply(this, args);
    }
    checkDeriveBits(algorithm, baseKey, length, options = {}, ...args) {
        this.checkAlgorithmName(algorithm);
        this.checkAlgorithmParams(algorithm);
        this.checkCryptoKey(baseKey, options.keyUsage ? "deriveBits" : void 0);
        if (length % 8 !== 0) {
            throw new OperationError("length: Is not multiple of 8");
        }
    }
    async onDeriveBits(algorithm, baseKey, length, ...args) {
        throw new UnsupportedOperationError("deriveBits");
    }
    async exportKey(...args) {
        this.checkExportKey.apply(this, args);
        return this.onExportKey.apply(this, args);
    }
    checkExportKey(format, key, ...args) {
        this.checkKeyFormat(format);
        this.checkCryptoKey(key);
        if (!key.extractable) {
            throw new CryptoError("key: Is not extractable");
        }
    }
    async onExportKey(format, key, ...args) {
        throw new UnsupportedOperationError("exportKey");
    }
    async importKey(...args) {
        this.checkImportKey.apply(this, args);
        return this.onImportKey.apply(this, args);
    }
    checkImportKey(format, keyData, algorithm, extractable, keyUsages, ...args) {
        this.checkKeyFormat(format);
        this.checkKeyData(format, keyData);
        this.checkAlgorithmName(algorithm);
        this.checkImportParams(algorithm);
        if (Array.isArray(this.usages)) {
            this.checkKeyUsages(keyUsages, this.usages);
        }
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages, ...args) {
        throw new UnsupportedOperationError("importKey");
    }
    checkAlgorithmName(algorithm) {
        if (algorithm.name.toLowerCase() !== this.name.toLowerCase()) {
            throw new AlgorithmError("Unrecognized name");
        }
    }
    checkAlgorithmParams(algorithm) {
    }
    checkDerivedKeyParams(algorithm) {
    }
    checkKeyUsages(usages, allowed) {
        for (const usage of usages) {
            if (allowed.indexOf(usage) === -1) {
                throw new TypeError("Cannot create a key using the specified key usages");
            }
        }
    }
    checkCryptoKey(key, keyUsage) {
        this.checkAlgorithmName(key.algorithm);
        if (keyUsage && key.usages.indexOf(keyUsage) === -1) {
            throw new CryptoError(`key does not match that of operation`);
        }
    }
    checkRequiredProperty(data, propName) {
        if (!(propName in data)) {
            throw new RequiredPropertyError(propName);
        }
    }
    checkHashAlgorithm(algorithm, hashAlgorithms) {
        for (const item of hashAlgorithms) {
            if (item.toLowerCase() === algorithm.name.toLowerCase()) {
                return;
            }
        }
        throw new OperationError(`hash: Must be one of ${hashAlgorithms.join(", ")}`);
    }
    checkImportParams(algorithm) {
    }
    checkKeyFormat(format) {
        switch (format) {
            case "raw":
            case "pkcs8":
            case "spki":
            case "jwk":
                break;
            default:
                throw new TypeError("format: Is invalid value. Must be 'jwk', 'raw', 'spki', or 'pkcs8'");
        }
    }
    checkKeyData(format, keyData) {
        if (!keyData) {
            throw new TypeError("keyData: Cannot be empty on empty on key importing");
        }
        if (format === "jwk") {
            if (!isJWK(keyData)) {
                throw new TypeError("keyData: Is not JsonWebToken");
            }
        }
        else if (!BufferSourceConverter.isBufferSource(keyData)) {
            throw new TypeError("keyData: Is not ArrayBufferView or ArrayBuffer");
        }
    }
    prepareData(data) {
        return BufferSourceConverter.toArrayBuffer(data);
    }
}

class AesProvider extends ProviderCrypto {
    checkGenerateKeyParams(algorithm) {
        this.checkRequiredProperty(algorithm, "length");
        if (typeof algorithm.length !== "number") {
            throw new TypeError("length: Is not of type Number");
        }
        switch (algorithm.length) {
            case 128:
            case 192:
            case 256:
                break;
            default:
                throw new TypeError("length: Must be 128, 192, or 256");
        }
    }
    checkDerivedKeyParams(algorithm) {
        this.checkGenerateKeyParams(algorithm);
    }
}

let AesCbcProvider$1 = class AesCbcProvider extends AesProvider {
    constructor() {
        super(...arguments);
        this.name = "AES-CBC";
        this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "iv");
        if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
            throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }
        if (algorithm.iv.byteLength !== 16) {
            throw new TypeError("iv: Must have length 16 bytes");
        }
    }
};

let AesCmacProvider$1 = class AesCmacProvider extends AesProvider {
    constructor() {
        super(...arguments);
        this.name = "AES-CMAC";
        this.usages = ["sign", "verify"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "length");
        if (typeof algorithm.length !== "number") {
            throw new TypeError("length: Is not a Number");
        }
        if (algorithm.length < 1) {
            throw new OperationError("length: Must be more than 0");
        }
    }
};

let AesCtrProvider$1 = class AesCtrProvider extends AesProvider {
    constructor() {
        super(...arguments);
        this.name = "AES-CTR";
        this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "counter");
        if (!(algorithm.counter instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.counter))) {
            throw new TypeError("counter: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }
        if (algorithm.counter.byteLength !== 16) {
            throw new TypeError("iv: Must have length 16 bytes");
        }
        this.checkRequiredProperty(algorithm, "length");
        if (typeof algorithm.length !== "number") {
            throw new TypeError("length: Is not a Number");
        }
        if (algorithm.length < 1) {
            throw new OperationError("length: Must be more than 0");
        }
    }
};

let AesEcbProvider$1 = class AesEcbProvider extends AesProvider {
    constructor() {
        super(...arguments);
        this.name = "AES-ECB";
        this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }
};

let AesGcmProvider$1 = class AesGcmProvider extends AesProvider {
    constructor() {
        super(...arguments);
        this.name = "AES-GCM";
        this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "iv");
        if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
            throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }
        if (algorithm.iv.byteLength < 1) {
            throw new OperationError("iv: Must have length more than 0 and less than 2^64 - 1");
        }
        if (!("tagLength" in algorithm)) {
            algorithm.tagLength = 128;
        }
        switch (algorithm.tagLength) {
            case 32:
            case 64:
            case 96:
            case 104:
            case 112:
            case 120:
            case 128:
                break;
            default:
                throw new OperationError("tagLength: Must be one of 32, 64, 96, 104, 112, 120 or 128");
        }
    }
};

let AesKwProvider$1 = class AesKwProvider extends AesProvider {
    constructor() {
        super(...arguments);
        this.name = "AES-KW";
        this.usages = ["wrapKey", "unwrapKey"];
    }
};

class DesProvider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.usages = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
    }
    checkAlgorithmParams(algorithm) {
        if (this.ivSize) {
            this.checkRequiredProperty(algorithm, "iv");
            if (!(algorithm.iv instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.iv))) {
                throw new TypeError("iv: Is not of type '(ArrayBuffer or ArrayBufferView)'");
            }
            if (algorithm.iv.byteLength !== this.ivSize) {
                throw new TypeError(`iv: Must have length ${this.ivSize} bytes`);
            }
        }
    }
    checkGenerateKeyParams(algorithm) {
        this.checkRequiredProperty(algorithm, "length");
        if (typeof algorithm.length !== "number") {
            throw new TypeError("length: Is not of type Number");
        }
        if (algorithm.length !== this.keySizeBits) {
            throw new OperationError(`algorithm.length: Must be ${this.keySizeBits}`);
        }
    }
    checkDerivedKeyParams(algorithm) {
        this.checkGenerateKeyParams(algorithm);
    }
}

class RsaProvider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    }
    checkGenerateKeyParams(algorithm) {
        this.checkRequiredProperty(algorithm, "hash");
        this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
        this.checkRequiredProperty(algorithm, "publicExponent");
        if (!(algorithm.publicExponent && algorithm.publicExponent instanceof Uint8Array)) {
            throw new TypeError("publicExponent: Missing or not a Uint8Array");
        }
        const publicExponent = Convert.ToBase64(algorithm.publicExponent);
        if (!(publicExponent === "Aw==" || publicExponent === "AQAB")) {
            throw new TypeError("publicExponent: Must be [3] or [1,0,1]");
        }
        this.checkRequiredProperty(algorithm, "modulusLength");
        if (algorithm.modulusLength % 8
            || algorithm.modulusLength < 256
            || algorithm.modulusLength > 16384) {
            throw new TypeError("The modulus length must be a multiple of 8 bits and >= 256 and <= 16384");
        }
    }
    checkImportParams(algorithm) {
        this.checkRequiredProperty(algorithm, "hash");
        this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
    }
}

let RsaSsaProvider$1 = class RsaSsaProvider extends RsaProvider {
    constructor() {
        super(...arguments);
        this.name = "RSASSA-PKCS1-v1_5";
        this.usages = {
            privateKey: ["sign"],
            publicKey: ["verify"],
        };
    }
};

let RsaPssProvider$1 = class RsaPssProvider extends RsaProvider {
    constructor() {
        super(...arguments);
        this.name = "RSA-PSS";
        this.usages = {
            privateKey: ["sign"],
            publicKey: ["verify"],
        };
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "saltLength");
        if (typeof algorithm.saltLength !== "number") {
            throw new TypeError("saltLength: Is not a Number");
        }
        if (algorithm.saltLength < 0) {
            throw new RangeError("saltLength: Must be positive number");
        }
    }
};

let RsaOaepProvider$1 = class RsaOaepProvider extends RsaProvider {
    constructor() {
        super(...arguments);
        this.name = "RSA-OAEP";
        this.usages = {
            privateKey: ["decrypt", "unwrapKey"],
            publicKey: ["encrypt", "wrapKey"],
        };
    }
    checkAlgorithmParams(algorithm) {
        if (algorithm.label
            && !(algorithm.label instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.label))) {
            throw new TypeError("label: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }
    }
};

class EllipticProvider extends ProviderCrypto {
    checkGenerateKeyParams(algorithm) {
        this.checkRequiredProperty(algorithm, "namedCurve");
        this.checkNamedCurve(algorithm.namedCurve);
    }
    checkNamedCurve(namedCurve) {
        for (const item of this.namedCurves) {
            if (item.toLowerCase() === namedCurve.toLowerCase()) {
                return;
            }
        }
        throw new OperationError(`namedCurve: Must be one of ${this.namedCurves.join(", ")}`);
    }
}

let EcdsaProvider$1 = class EcdsaProvider extends EllipticProvider {
    constructor() {
        super(...arguments);
        this.name = "ECDSA";
        this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
        this.usages = {
            privateKey: ["sign"],
            publicKey: ["verify"],
        };
        this.namedCurves = ["P-256", "P-384", "P-521", "K-256"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "hash");
        this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
    }
};

const KEY_TYPES = ["secret", "private", "public"];
let CryptoKey$1 = class CryptoKey {
    static create(algorithm, type, extractable, usages) {
        const key = new this();
        key.algorithm = algorithm;
        key.type = type;
        key.extractable = extractable;
        key.usages = usages;
        return key;
    }
    static isKeyType(data) {
        return KEY_TYPES.indexOf(data) !== -1;
    }
    get [Symbol.toStringTag]() {
        return "CryptoKey";
    }
};

let EcdhProvider$1 = class EcdhProvider extends EllipticProvider {
    constructor() {
        super(...arguments);
        this.name = "ECDH";
        this.usages = {
            privateKey: ["deriveBits", "deriveKey"],
            publicKey: [],
        };
        this.namedCurves = ["P-256", "P-384", "P-521", "K-256"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "public");
        if (!(algorithm.public instanceof CryptoKey$1)) {
            throw new TypeError("public: Is not a CryptoKey");
        }
        if (algorithm.public.type !== "public") {
            throw new OperationError("public: Is not a public key");
        }
        if (algorithm.public.algorithm.name !== this.name) {
            throw new OperationError(`public: Is not ${this.name} key`);
        }
    }
};

let EcdhEsProvider$1 = class EcdhEsProvider extends EcdhProvider$1 {
    constructor() {
        super(...arguments);
        this.name = "ECDH-ES";
        this.namedCurves = ["X25519", "X448"];
    }
};

let EdDsaProvider$1 = class EdDsaProvider extends EllipticProvider {
    constructor() {
        super(...arguments);
        this.name = "EdDSA";
        this.usages = {
            privateKey: ["sign"],
            publicKey: ["verify"],
        };
        this.namedCurves = ["Ed25519", "Ed448"];
    }
};

let ObjectIdentifier = class ObjectIdentifier {
    constructor(value) {
        if (value) {
            this.value = value;
        }
    }
};
__decorate([
    AsnProp({ type: AsnPropTypes.ObjectIdentifier })
], ObjectIdentifier.prototype, "value", void 0);
ObjectIdentifier = __decorate([
    AsnType({ type: AsnTypeTypes.Choice })
], ObjectIdentifier);

class AlgorithmIdentifier {
    constructor(params) {
        Object.assign(this, params);
    }
}
__decorate([
    AsnProp({
        type: AsnPropTypes.ObjectIdentifier,
    })
], AlgorithmIdentifier.prototype, "algorithm", void 0);
__decorate([
    AsnProp({
        type: AsnPropTypes.Any,
        optional: true,
    })
], AlgorithmIdentifier.prototype, "parameters", void 0);

class PrivateKeyInfo {
    constructor() {
        this.version = 0;
        this.privateKeyAlgorithm = new AlgorithmIdentifier();
        this.privateKey = new ArrayBuffer(0);
    }
}
__decorate([
    AsnProp({ type: AsnPropTypes.Integer })
], PrivateKeyInfo.prototype, "version", void 0);
__decorate([
    AsnProp({ type: AlgorithmIdentifier })
], PrivateKeyInfo.prototype, "privateKeyAlgorithm", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.OctetString })
], PrivateKeyInfo.prototype, "privateKey", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Any, optional: true })
], PrivateKeyInfo.prototype, "attributes", void 0);

class PublicKeyInfo {
    constructor() {
        this.publicKeyAlgorithm = new AlgorithmIdentifier();
        this.publicKey = new ArrayBuffer(0);
    }
}
__decorate([
    AsnProp({ type: AlgorithmIdentifier })
], PublicKeyInfo.prototype, "publicKeyAlgorithm", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.BitString })
], PublicKeyInfo.prototype, "publicKey", void 0);

const JsonBase64UrlArrayBufferConverter = {
    fromJSON: (value) => Convert.FromBase64Url(value),
    toJSON: (value) => Convert.ToBase64Url(new Uint8Array(value)),
};

const AsnIntegerArrayBufferConverter = {
    fromASN: (value) => {
        const valueHex = value.valueBlock.valueHex;
        return !(new Uint8Array(valueHex)[0])
            ? value.valueBlock.valueHex.slice(1)
            : value.valueBlock.valueHex;
    },
    toASN: (value) => {
        const valueHex = new Uint8Array(value)[0] > 127
            ? combine(new Uint8Array([0]).buffer, value)
            : value;
        return new Integer({ valueHex });
    },
};

let RsaPrivateKey$1 = class RsaPrivateKey {
    constructor() {
        this.version = 0;
        this.modulus = new ArrayBuffer(0);
        this.publicExponent = new ArrayBuffer(0);
        this.privateExponent = new ArrayBuffer(0);
        this.prime1 = new ArrayBuffer(0);
        this.prime2 = new ArrayBuffer(0);
        this.exponent1 = new ArrayBuffer(0);
        this.exponent2 = new ArrayBuffer(0);
        this.coefficient = new ArrayBuffer(0);
    }
};
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerConverter })
], RsaPrivateKey$1.prototype, "version", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "n", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "modulus", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "e", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "publicExponent", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "d", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "privateExponent", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "p", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "prime1", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "q", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "prime2", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "dp", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "exponent1", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "dq", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "exponent2", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "qi", converter: JsonBase64UrlArrayBufferConverter })
], RsaPrivateKey$1.prototype, "coefficient", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Any, optional: true })
], RsaPrivateKey$1.prototype, "otherPrimeInfos", void 0);

let RsaPublicKey$1 = class RsaPublicKey {
    constructor() {
        this.modulus = new ArrayBuffer(0);
        this.publicExponent = new ArrayBuffer(0);
    }
};
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "n", converter: JsonBase64UrlArrayBufferConverter })
], RsaPublicKey$1.prototype, "modulus", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter }),
    JsonProp({ name: "e", converter: JsonBase64UrlArrayBufferConverter })
], RsaPublicKey$1.prototype, "publicExponent", void 0);

let EcPublicKey$1 = class EcPublicKey {
    constructor(value) {
        this.value = new ArrayBuffer(0);
        if (value) {
            this.value = value;
        }
    }
    toJSON() {
        let bytes = new Uint8Array(this.value);
        if (bytes[0] !== 0x04) {
            throw new CryptoError("Wrong ECPoint. Current version supports only Uncompressed (0x04) point");
        }
        bytes = new Uint8Array(this.value.slice(1));
        const size = bytes.length / 2;
        const offset = 0;
        const json = {
            x: Convert.ToBase64Url(bytes.buffer.slice(offset, offset + size)),
            y: Convert.ToBase64Url(bytes.buffer.slice(offset + size, offset + size + size)),
        };
        return json;
    }
    fromJSON(json) {
        if (!("x" in json)) {
            throw new Error("x: Missing required property");
        }
        if (!("y" in json)) {
            throw new Error("y: Missing required property");
        }
        const x = Convert.FromBase64Url(json.x);
        const y = Convert.FromBase64Url(json.y);
        const value = combine(new Uint8Array([0x04]).buffer, x, y);
        this.value = new Uint8Array(value).buffer;
        return this;
    }
};
__decorate([
    AsnProp({ type: AsnPropTypes.OctetString })
], EcPublicKey$1.prototype, "value", void 0);
EcPublicKey$1 = __decorate([
    AsnType({ type: AsnTypeTypes.Choice })
], EcPublicKey$1);

let EcPrivateKey$1 = class EcPrivateKey {
    constructor() {
        this.version = 1;
        this.privateKey = new ArrayBuffer(0);
    }
    fromJSON(json) {
        if (!("d" in json)) {
            throw new Error("d: Missing required property");
        }
        this.privateKey = Convert.FromBase64Url(json.d);
        if ("x" in json) {
            const publicKey = new EcPublicKey$1();
            publicKey.fromJSON(json);
            const asn = AsnSerializer.toASN(publicKey);
            if ("valueHex" in asn.valueBlock) {
                this.publicKey = asn.valueBlock.valueHex;
            }
        }
        return this;
    }
    toJSON() {
        const jwk = {};
        jwk.d = Convert.ToBase64Url(this.privateKey);
        if (this.publicKey) {
            Object.assign(jwk, new EcPublicKey$1(this.publicKey).toJSON());
        }
        return jwk;
    }
};
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerConverter })
], EcPrivateKey$1.prototype, "version", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.OctetString })
], EcPrivateKey$1.prototype, "privateKey", void 0);
__decorate([
    AsnProp({ context: 0, type: AsnPropTypes.Any, optional: true })
], EcPrivateKey$1.prototype, "parameters", void 0);
__decorate([
    AsnProp({ context: 1, type: AsnPropTypes.BitString, optional: true })
], EcPrivateKey$1.prototype, "publicKey", void 0);

const AsnIntegerWithoutPaddingConverter = {
    fromASN: (value) => {
        const bytes = new Uint8Array(value.valueBlock.valueHex);
        return (bytes[0] === 0)
            ? bytes.buffer.slice(1)
            : bytes.buffer;
    },
    toASN: (value) => {
        const bytes = new Uint8Array(value);
        if (bytes[0] > 127) {
            const newValue = new Uint8Array(bytes.length + 1);
            newValue.set(bytes, 1);
            return new Integer({ valueHex: newValue.buffer });
        }
        return new Integer({ valueHex: value });
    },
};

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AsnIntegerWithoutPaddingConverter: AsnIntegerWithoutPaddingConverter
});

class EcUtils {
    static decodePoint(data, pointSize) {
        const view = BufferSourceConverter.toUint8Array(data);
        if ((view.length === 0) || (view[0] !== 4)) {
            throw new Error("Only uncompressed point format supported");
        }
        const n = (view.length - 1) / 2;
        if (n !== (Math.ceil(pointSize / 8))) {
            throw new Error("Point does not match field size");
        }
        const xb = view.slice(1, n + 1);
        const yb = view.slice(n + 1, n + 1 + n);
        return { x: xb, y: yb };
    }
    static encodePoint(point, pointSize) {
        const size = Math.ceil(pointSize / 8);
        if (point.x.byteLength !== size || point.y.byteLength !== size) {
            throw new Error("X,Y coordinates don't match point size criteria");
        }
        const x = BufferSourceConverter.toUint8Array(point.x);
        const y = BufferSourceConverter.toUint8Array(point.y);
        const res = new Uint8Array(size * 2 + 1);
        res[0] = 4;
        res.set(x, 1);
        res.set(y, size + 1);
        return res;
    }
    static getSize(pointSize) {
        return Math.ceil(pointSize / 8);
    }
    static encodeSignature(signature, pointSize) {
        const size = this.getSize(pointSize);
        const r = BufferSourceConverter.toUint8Array(signature.r);
        const s = BufferSourceConverter.toUint8Array(signature.s);
        const res = new Uint8Array(size * 2);
        res.set(this.padStart(r, size));
        res.set(this.padStart(s, size), size);
        return res;
    }
    static decodeSignature(data, pointSize) {
        const size = this.getSize(pointSize);
        const view = BufferSourceConverter.toUint8Array(data);
        if (view.length !== (size * 2)) {
            throw new Error("Incorrect size of the signature");
        }
        const r = view.slice(0, size);
        const s = view.slice(size);
        return {
            r: this.trimStart(r),
            s: this.trimStart(s),
        };
    }
    static trimStart(data) {
        let i = 0;
        while ((i < data.length - 1) && (data[i] === 0)) {
            i++;
        }
        if (i === 0) {
            return data;
        }
        return data.slice(i, data.length);
    }
    static padStart(data, size) {
        if (size === data.length) {
            return data;
        }
        const res = new Uint8Array(size);
        res.set(data, size - data.length);
        return res;
    }
}

class EcDsaSignature {
    constructor() {
        this.r = new ArrayBuffer(0);
        this.s = new ArrayBuffer(0);
    }
    static fromWebCryptoSignature(value) {
        const pointSize = value.byteLength / 2;
        const point = EcUtils.decodeSignature(value, pointSize * 8);
        const ecSignature = new EcDsaSignature();
        ecSignature.r = BufferSourceConverter.toArrayBuffer(point.r);
        ecSignature.s = BufferSourceConverter.toArrayBuffer(point.s);
        return ecSignature;
    }
    toWebCryptoSignature(pointSize) {
        pointSize !== null && pointSize !== void 0 ? pointSize : (pointSize = Math.max(this.r.byteLength, this.s.byteLength) * 8);
        const signature = EcUtils.encodeSignature(this, pointSize);
        return signature.buffer;
    }
}
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerWithoutPaddingConverter })
], EcDsaSignature.prototype, "r", void 0);
__decorate([
    AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerWithoutPaddingConverter })
], EcDsaSignature.prototype, "s", void 0);

class OneAsymmetricKey extends PrivateKeyInfo {
}
__decorate([
    AsnProp({ context: 1, implicit: true, type: AsnPropTypes.BitString, optional: true })
], OneAsymmetricKey.prototype, "publicKey", void 0);

let EdPrivateKey$1 = class EdPrivateKey {
    constructor() {
        this.value = new ArrayBuffer(0);
    }
    fromJSON(json) {
        if (!json.d) {
            throw new Error("d: Missing required property");
        }
        this.value = Convert.FromBase64Url(json.d);
        return this;
    }
    toJSON() {
        const jwk = {
            d: Convert.ToBase64Url(this.value),
        };
        return jwk;
    }
};
__decorate([
    AsnProp({ type: AsnPropTypes.OctetString })
], EdPrivateKey$1.prototype, "value", void 0);
EdPrivateKey$1 = __decorate([
    AsnType({ type: AsnTypeTypes.Choice })
], EdPrivateKey$1);

let EdPublicKey$1 = class EdPublicKey {
    constructor(value) {
        this.value = new ArrayBuffer(0);
        if (value) {
            this.value = value;
        }
    }
    toJSON() {
        const json = {
            x: Convert.ToBase64Url(this.value),
        };
        return json;
    }
    fromJSON(json) {
        if (!("x" in json)) {
            throw new Error("x: Missing required property");
        }
        this.value = Convert.FromBase64Url(json.x);
        return this;
    }
};
__decorate([
    AsnProp({ type: AsnPropTypes.BitString })
], EdPublicKey$1.prototype, "value", void 0);
EdPublicKey$1 = __decorate([
    AsnType({ type: AsnTypeTypes.Choice })
], EdPublicKey$1);

let CurvePrivateKey = class CurvePrivateKey {
};
__decorate([
    AsnProp({ type: AsnPropTypes.OctetString }),
    JsonProp({ type: JsonPropTypes.String, converter: JsonBase64UrlArrayBufferConverter })
], CurvePrivateKey.prototype, "d", void 0);
CurvePrivateKey = __decorate([
    AsnType({ type: AsnTypeTypes.Choice })
], CurvePrivateKey);

const idSecp256r1 = "1.2.840.10045.3.1.7";
const idEllipticCurve = "1.3.132.0";
const idSecp384r1 = `${idEllipticCurve}.34`;
const idSecp521r1 = `${idEllipticCurve}.35`;
const idSecp256k1 = `${idEllipticCurve}.10`;
const idVersionOne = "1.3.36.3.3.2.8.1.1";
const idBrainpoolP160r1 = `${idVersionOne}.1`;
const idBrainpoolP160t1 = `${idVersionOne}.2`;
const idBrainpoolP192r1 = `${idVersionOne}.3`;
const idBrainpoolP192t1 = `${idVersionOne}.4`;
const idBrainpoolP224r1 = `${idVersionOne}.5`;
const idBrainpoolP224t1 = `${idVersionOne}.6`;
const idBrainpoolP256r1 = `${idVersionOne}.7`;
const idBrainpoolP256t1 = `${idVersionOne}.8`;
const idBrainpoolP320r1 = `${idVersionOne}.9`;
const idBrainpoolP320t1 = `${idVersionOne}.10`;
const idBrainpoolP384r1 = `${idVersionOne}.11`;
const idBrainpoolP384t1 = `${idVersionOne}.12`;
const idBrainpoolP512r1 = `${idVersionOne}.13`;
const idBrainpoolP512t1 = `${idVersionOne}.14`;
const idX25519 = "1.3.101.110";
const idX448 = "1.3.101.111";
const idEd25519 = "1.3.101.112";
const idEd448 = "1.3.101.113";

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AlgorithmIdentifier: AlgorithmIdentifier,
  get CurvePrivateKey () { return CurvePrivateKey; },
  EcDsaSignature: EcDsaSignature,
  EcPrivateKey: EcPrivateKey$1,
  get EcPublicKey () { return EcPublicKey$1; },
  get EdPrivateKey () { return EdPrivateKey$1; },
  get EdPublicKey () { return EdPublicKey$1; },
  get ObjectIdentifier () { return ObjectIdentifier; },
  OneAsymmetricKey: OneAsymmetricKey,
  PrivateKeyInfo: PrivateKeyInfo,
  PublicKeyInfo: PublicKeyInfo,
  RsaPrivateKey: RsaPrivateKey$1,
  RsaPublicKey: RsaPublicKey$1,
  converters: index$2,
  idBrainpoolP160r1: idBrainpoolP160r1,
  idBrainpoolP160t1: idBrainpoolP160t1,
  idBrainpoolP192r1: idBrainpoolP192r1,
  idBrainpoolP192t1: idBrainpoolP192t1,
  idBrainpoolP224r1: idBrainpoolP224r1,
  idBrainpoolP224t1: idBrainpoolP224t1,
  idBrainpoolP256r1: idBrainpoolP256r1,
  idBrainpoolP256t1: idBrainpoolP256t1,
  idBrainpoolP320r1: idBrainpoolP320r1,
  idBrainpoolP320t1: idBrainpoolP320t1,
  idBrainpoolP384r1: idBrainpoolP384r1,
  idBrainpoolP384t1: idBrainpoolP384t1,
  idBrainpoolP512r1: idBrainpoolP512r1,
  idBrainpoolP512t1: idBrainpoolP512t1,
  idEd25519: idEd25519,
  idEd448: idEd448,
  idEllipticCurve: idEllipticCurve,
  idSecp256k1: idSecp256k1,
  idSecp256r1: idSecp256r1,
  idSecp384r1: idSecp384r1,
  idSecp521r1: idSecp521r1,
  idVersionOne: idVersionOne,
  idX25519: idX25519,
  idX448: idX448
});

class EcCurves {
    constructor() { }
    static register(item) {
        const oid = new ObjectIdentifier();
        oid.value = item.id;
        const raw = AsnConvert.serialize(oid);
        this.items.push({
            ...item,
            raw,
        });
        this.names.push(item.name);
    }
    static find(nameOrId) {
        nameOrId = nameOrId.toUpperCase();
        for (const item of this.items) {
            if (item.name.toUpperCase() === nameOrId || item.id.toUpperCase() === nameOrId) {
                return item;
            }
        }
        return null;
    }
    static get(nameOrId) {
        const res = this.find(nameOrId);
        if (!res) {
            throw new Error(`Unsupported EC named curve '${nameOrId}'`);
        }
        return res;
    }
}
EcCurves.items = [];
EcCurves.names = [];
EcCurves.register({ name: "P-256", id: idSecp256r1, size: 256 });
EcCurves.register({ name: "P-384", id: idSecp384r1, size: 384 });
EcCurves.register({ name: "P-521", id: idSecp521r1, size: 521 });
EcCurves.register({ name: "K-256", id: idSecp256k1, size: 256 });
EcCurves.register({ name: "brainpoolP160r1", id: idBrainpoolP160r1, size: 160 });
EcCurves.register({ name: "brainpoolP160t1", id: idBrainpoolP160t1, size: 160 });
EcCurves.register({ name: "brainpoolP192r1", id: idBrainpoolP192r1, size: 192 });
EcCurves.register({ name: "brainpoolP192t1", id: idBrainpoolP192t1, size: 192 });
EcCurves.register({ name: "brainpoolP224r1", id: idBrainpoolP224r1, size: 224 });
EcCurves.register({ name: "brainpoolP224t1", id: idBrainpoolP224t1, size: 224 });
EcCurves.register({ name: "brainpoolP256r1", id: idBrainpoolP256r1, size: 256 });
EcCurves.register({ name: "brainpoolP256t1", id: idBrainpoolP256t1, size: 256 });
EcCurves.register({ name: "brainpoolP320r1", id: idBrainpoolP320r1, size: 320 });
EcCurves.register({ name: "brainpoolP320t1", id: idBrainpoolP320t1, size: 320 });
EcCurves.register({ name: "brainpoolP384r1", id: idBrainpoolP384r1, size: 384 });
EcCurves.register({ name: "brainpoolP384t1", id: idBrainpoolP384t1, size: 384 });
EcCurves.register({ name: "brainpoolP512r1", id: idBrainpoolP512r1, size: 512 });
EcCurves.register({ name: "brainpoolP512t1", id: idBrainpoolP512t1, size: 512 });

let HmacProvider$1 = class HmacProvider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "HMAC";
        this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
        this.usages = ["sign", "verify"];
    }
    getDefaultLength(algName) {
        switch (algName.toUpperCase()) {
            case "SHA-1":
            case "SHA-256":
            case "SHA-384":
            case "SHA-512":
                return 512;
            default:
                throw new Error(`Unknown algorithm name '${algName}'`);
        }
    }
    checkGenerateKeyParams(algorithm) {
        this.checkRequiredProperty(algorithm, "hash");
        this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
        if ("length" in algorithm) {
            if (typeof algorithm.length !== "number") {
                throw new TypeError("length: Is not a Number");
            }
            if (algorithm.length < 1) {
                throw new RangeError("length: Number is out of range");
            }
        }
    }
    checkImportParams(algorithm) {
        this.checkRequiredProperty(algorithm, "hash");
        this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
    }
};

let Pbkdf2Provider$1 = class Pbkdf2Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "PBKDF2";
        this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
        this.usages = ["deriveBits", "deriveKey"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "hash");
        this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
        this.checkRequiredProperty(algorithm, "salt");
        if (!(algorithm.salt instanceof ArrayBuffer || ArrayBuffer.isView(algorithm.salt))) {
            throw new TypeError("salt: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }
        this.checkRequiredProperty(algorithm, "iterations");
        if (typeof algorithm.iterations !== "number") {
            throw new TypeError("iterations: Is not a Number");
        }
        if (algorithm.iterations < 1) {
            throw new TypeError("iterations: Is less than 1");
        }
    }
    checkImportKey(format, keyData, algorithm, extractable, keyUsages, ...args) {
        super.checkImportKey(format, keyData, algorithm, extractable, keyUsages);
        if (extractable) {
            throw new SyntaxError("extractable: Must be 'false'");
        }
    }
};

let HkdfProvider$1 = class HkdfProvider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "HKDF";
        this.hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
        this.usages = ["deriveKey", "deriveBits"];
    }
    checkAlgorithmParams(algorithm) {
        this.checkRequiredProperty(algorithm, "hash");
        this.checkHashAlgorithm(algorithm.hash, this.hashAlgorithms);
        this.checkRequiredProperty(algorithm, "salt");
        if (!BufferSourceConverter.isBufferSource(algorithm.salt)) {
            throw new TypeError("salt: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }
        this.checkRequiredProperty(algorithm, "info");
        if (!BufferSourceConverter.isBufferSource(algorithm.info)) {
            throw new TypeError("salt: Is not of type '(ArrayBuffer or ArrayBufferView)'");
        }
    }
    checkImportKey(format, keyData, algorithm, extractable, keyUsages, ...args) {
        super.checkImportKey(format, keyData, algorithm, extractable, keyUsages);
        if (extractable) {
            throw new SyntaxError("extractable: Must be 'false'");
        }
    }
};

class ShakeProvider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.usages = [];
        this.defaultLength = 0;
    }
    digest(...args) {
        args[0] = { length: this.defaultLength, ...args[0] };
        return super.digest.apply(this, args);
    }
    checkDigest(algorithm, data) {
        super.checkDigest(algorithm, data);
        const length = algorithm.length || 0;
        if (typeof length !== "number") {
            throw new TypeError("length: Is not a Number");
        }
        if (length < 0) {
            throw new TypeError("length: Is negative");
        }
    }
}

let Shake128Provider$1 = class Shake128Provider extends ShakeProvider {
    constructor() {
        super(...arguments);
        this.name = "shake128";
        this.defaultLength = 16;
    }
};

let Shake256Provider$1 = class Shake256Provider extends ShakeProvider {
    constructor() {
        super(...arguments);
        this.name = "shake256";
        this.defaultLength = 32;
    }
};

let Crypto$1 = class Crypto {
    get [Symbol.toStringTag]() {
        return "Crypto";
    }
    randomUUID() {
        const b = this.getRandomValues(new Uint8Array(16));
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        const uuid = Convert.ToHex(b).toLowerCase();
        return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
    }
};

class ProviderStorage {
    constructor() {
        this.items = {};
    }
    get(algorithmName) {
        return this.items[algorithmName.toLowerCase()] || null;
    }
    set(provider) {
        this.items[provider.name.toLowerCase()] = provider;
    }
    removeAt(algorithmName) {
        const provider = this.get(algorithmName.toLowerCase());
        if (provider) {
            delete this.items[algorithmName];
        }
        return provider;
    }
    has(name) {
        return !!this.get(name);
    }
    get length() {
        return Object.keys(this.items).length;
    }
    get algorithms() {
        const algorithms = [];
        for (const key in this.items) {
            const provider = this.items[key];
            algorithms.push(provider.name);
        }
        return algorithms.sort();
    }
}

let SubtleCrypto$1 = class SubtleCrypto {
    constructor() {
        this.providers = new ProviderStorage();
    }
    static isHashedAlgorithm(data) {
        return data
            && typeof data === "object"
            && "name" in data
            && "hash" in data
            ? true
            : false;
    }
    get [Symbol.toStringTag]() {
        return "SubtleCrypto";
    }
    async digest(...args) {
        this.checkRequiredArguments(args, 2, "digest");
        const [algorithm, data, ...params] = args;
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const preparedData = BufferSourceConverter.toArrayBuffer(data);
        const provider = this.getProvider(preparedAlgorithm.name);
        const result = await provider.digest(preparedAlgorithm, preparedData, ...params);
        return result;
    }
    async generateKey(...args) {
        this.checkRequiredArguments(args, 3, "generateKey");
        const [algorithm, extractable, keyUsages, ...params] = args;
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const provider = this.getProvider(preparedAlgorithm.name);
        const result = await provider.generateKey({ ...preparedAlgorithm, name: provider.name }, extractable, keyUsages, ...params);
        return result;
    }
    async sign(...args) {
        this.checkRequiredArguments(args, 3, "sign");
        const [algorithm, key, data, ...params] = args;
        this.checkCryptoKey(key);
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const preparedData = BufferSourceConverter.toArrayBuffer(data);
        const provider = this.getProvider(preparedAlgorithm.name);
        const result = await provider.sign({ ...preparedAlgorithm, name: provider.name }, key, preparedData, ...params);
        return result;
    }
    async verify(...args) {
        this.checkRequiredArguments(args, 4, "verify");
        const [algorithm, key, signature, data, ...params] = args;
        this.checkCryptoKey(key);
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const preparedData = BufferSourceConverter.toArrayBuffer(data);
        const preparedSignature = BufferSourceConverter.toArrayBuffer(signature);
        const provider = this.getProvider(preparedAlgorithm.name);
        const result = await provider.verify({ ...preparedAlgorithm, name: provider.name }, key, preparedSignature, preparedData, ...params);
        return result;
    }
    async encrypt(...args) {
        this.checkRequiredArguments(args, 3, "encrypt");
        const [algorithm, key, data, ...params] = args;
        this.checkCryptoKey(key);
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const preparedData = BufferSourceConverter.toArrayBuffer(data);
        const provider = this.getProvider(preparedAlgorithm.name);
        const result = await provider.encrypt({ ...preparedAlgorithm, name: provider.name }, key, preparedData, { keyUsage: true }, ...params);
        return result;
    }
    async decrypt(...args) {
        this.checkRequiredArguments(args, 3, "decrypt");
        const [algorithm, key, data, ...params] = args;
        this.checkCryptoKey(key);
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const preparedData = BufferSourceConverter.toArrayBuffer(data);
        const provider = this.getProvider(preparedAlgorithm.name);
        const result = await provider.decrypt({ ...preparedAlgorithm, name: provider.name }, key, preparedData, { keyUsage: true }, ...params);
        return result;
    }
    async deriveBits(...args) {
        this.checkRequiredArguments(args, 3, "deriveBits");
        const [algorithm, baseKey, length, ...params] = args;
        this.checkCryptoKey(baseKey);
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const provider = this.getProvider(preparedAlgorithm.name);
        const result = await provider.deriveBits({ ...preparedAlgorithm, name: provider.name }, baseKey, length, { keyUsage: true }, ...params);
        return result;
    }
    async deriveKey(...args) {
        this.checkRequiredArguments(args, 5, "deriveKey");
        const [algorithm, baseKey, derivedKeyType, extractable, keyUsages, ...params] = args;
        const preparedDerivedKeyType = this.prepareAlgorithm(derivedKeyType);
        const importProvider = this.getProvider(preparedDerivedKeyType.name);
        importProvider.checkDerivedKeyParams(preparedDerivedKeyType);
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const provider = this.getProvider(preparedAlgorithm.name);
        provider.checkCryptoKey(baseKey, "deriveKey");
        const derivedBits = await provider.deriveBits({ ...preparedAlgorithm, name: provider.name }, baseKey, derivedKeyType.length || 512, { keyUsage: false }, ...params);
        return this.importKey("raw", derivedBits, derivedKeyType, extractable, keyUsages, ...params);
    }
    async exportKey(...args) {
        this.checkRequiredArguments(args, 2, "exportKey");
        const [format, key, ...params] = args;
        this.checkCryptoKey(key);
        const provider = this.getProvider(key.algorithm.name);
        const result = await provider.exportKey(format, key, ...params);
        return result;
    }
    async importKey(...args) {
        this.checkRequiredArguments(args, 5, "importKey");
        const [format, keyData, algorithm, extractable, keyUsages, ...params] = args;
        const preparedAlgorithm = this.prepareAlgorithm(algorithm);
        const provider = this.getProvider(preparedAlgorithm.name);
        if (["pkcs8", "spki", "raw"].indexOf(format) !== -1) {
            const preparedData = BufferSourceConverter.toArrayBuffer(keyData);
            return provider.importKey(format, preparedData, { ...preparedAlgorithm, name: provider.name }, extractable, keyUsages, ...params);
        }
        else {
            if (!keyData.kty) {
                throw new TypeError("keyData: Is not JSON");
            }
        }
        return provider.importKey(format, keyData, { ...preparedAlgorithm, name: provider.name }, extractable, keyUsages, ...params);
    }
    async wrapKey(format, key, wrappingKey, wrapAlgorithm, ...args) {
        let keyData = await this.exportKey(format, key, ...args);
        if (format === "jwk") {
            const json = JSON.stringify(keyData);
            keyData = Convert.FromUtf8String(json);
        }
        const preparedAlgorithm = this.prepareAlgorithm(wrapAlgorithm);
        const preparedData = BufferSourceConverter.toArrayBuffer(keyData);
        const provider = this.getProvider(preparedAlgorithm.name);
        return provider.encrypt({ ...preparedAlgorithm, name: provider.name }, wrappingKey, preparedData, { keyUsage: false }, ...args);
    }
    async unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages, ...args) {
        const preparedAlgorithm = this.prepareAlgorithm(unwrapAlgorithm);
        const preparedData = BufferSourceConverter.toArrayBuffer(wrappedKey);
        const provider = this.getProvider(preparedAlgorithm.name);
        let keyData = await provider.decrypt({ ...preparedAlgorithm, name: provider.name }, unwrappingKey, preparedData, { keyUsage: false }, ...args);
        if (format === "jwk") {
            try {
                keyData = JSON.parse(Convert.ToUtf8String(keyData));
            }
            catch (e) {
                const error = new TypeError("wrappedKey: Is not a JSON");
                error.internal = e;
                throw error;
            }
        }
        return this.importKey(format, keyData, unwrappedKeyAlgorithm, extractable, keyUsages, ...args);
    }
    checkRequiredArguments(args, size, methodName) {
        if (args.length < size) {
            throw new TypeError(`Failed to execute '${methodName}' on 'SubtleCrypto': ${size} arguments required, but only ${args.length} present`);
        }
    }
    prepareAlgorithm(algorithm) {
        if (typeof algorithm === "string") {
            return {
                name: algorithm,
            };
        }
        if (SubtleCrypto.isHashedAlgorithm(algorithm)) {
            const preparedAlgorithm = { ...algorithm };
            preparedAlgorithm.hash = this.prepareAlgorithm(algorithm.hash);
            return preparedAlgorithm;
        }
        return { ...algorithm };
    }
    getProvider(name) {
        const provider = this.providers.get(name);
        if (!provider) {
            throw new AlgorithmError("Unrecognized name");
        }
        return provider;
    }
    checkCryptoKey(key) {
        if (!(key instanceof CryptoKey$1)) {
            throw new TypeError(`Key is not of type 'CryptoKey'`);
        }
    }
};

/*!
 Copyright (c) Peculiar Ventures, LLC
*/


const JsonBase64UrlConverter = {
    fromJSON: (value) => Buffer.from(Convert.FromBase64Url(value)),
    toJSON: (value) => Convert.ToBase64Url(value),
};

class CryptoKey extends CryptoKey$1 {
    constructor() {
        super(...arguments);
        this.data = Buffer.alloc(0);
        this.algorithm = { name: "" };
        this.extractable = false;
        this.type = "secret";
        this.usages = [];
        this.kty = "oct";
        this.alg = "";
    }
}
__decorate([
    JsonProp({ name: "ext", type: JsonPropTypes.Boolean, optional: true })
], CryptoKey.prototype, "extractable", void 0);
__decorate([
    JsonProp({ name: "key_ops", type: JsonPropTypes.String, repeated: true, optional: true })
], CryptoKey.prototype, "usages", void 0);
__decorate([
    JsonProp({ type: JsonPropTypes.String })
], CryptoKey.prototype, "kty", void 0);
__decorate([
    JsonProp({ type: JsonPropTypes.String, optional: true })
], CryptoKey.prototype, "alg", void 0);

class SymmetricKey extends CryptoKey {
    constructor() {
        super(...arguments);
        this.kty = "oct";
        this.type = "secret";
    }
}

class AsymmetricKey extends CryptoKey {
}

class AesCryptoKey extends SymmetricKey {
    get alg() {
        switch (this.algorithm.name.toUpperCase()) {
            case "AES-CBC":
                return `A${this.algorithm.length}CBC`;
            case "AES-CTR":
                return `A${this.algorithm.length}CTR`;
            case "AES-GCM":
                return `A${this.algorithm.length}GCM`;
            case "AES-KW":
                return `A${this.algorithm.length}KW`;
            case "AES-CMAC":
                return `A${this.algorithm.length}CMAC`;
            case "AES-ECB":
                return `A${this.algorithm.length}ECB`;
            default:
                throw new AlgorithmError("Unsupported algorithm name");
        }
    }
    set alg(value) {
    }
}
__decorate([
    JsonProp({ name: "k", converter: JsonBase64UrlConverter })
], AesCryptoKey.prototype, "data", void 0);

const keyStorage = new WeakMap();
function getCryptoKey(key) {
    const res = keyStorage.get(key);
    if (!res) {
        throw new OperationError("Cannot get CryptoKey from secure storage");
    }
    return res;
}
function setCryptoKey(value) {
    const key = CryptoKey$1.create(value.algorithm, value.type, value.extractable, value.usages);
    Object.freeze(key);
    keyStorage.set(key, value);
    return key;
}

class AesCrypto {
    static async generateKey(algorithm, extractable, keyUsages) {
        const key = new AesCryptoKey();
        key.algorithm = algorithm;
        key.extractable = extractable;
        key.usages = keyUsages;
        key.data = crypto__default__default.randomBytes(algorithm.length >> 3);
        return key;
    }
    static async exportKey(format, key) {
        if (!(key instanceof AesCryptoKey)) {
            throw new Error("key: Is not AesCryptoKey");
        }
        switch (format.toLowerCase()) {
            case "jwk":
                return JsonSerializer.toJSON(key);
            case "raw":
                return new Uint8Array(key.data).buffer;
            default:
                throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
    }
    static async importKey(format, keyData, algorithm, extractable, keyUsages) {
        let key;
        switch (format.toLowerCase()) {
            case "jwk":
                key = JsonParser.fromJSON(keyData, { targetSchema: AesCryptoKey });
                break;
            case "raw":
                key = new AesCryptoKey();
                key.data = Buffer.from(keyData);
                break;
            default:
                throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
        key.algorithm = algorithm;
        key.algorithm.length = key.data.length << 3;
        key.extractable = extractable;
        key.usages = keyUsages;
        switch (key.algorithm.length) {
            case 128:
            case 192:
            case 256:
                break;
            default:
                throw new OperationError("keyData: Is wrong key length");
        }
        return key;
    }
    static async encrypt(algorithm, key, data) {
        switch (algorithm.name.toUpperCase()) {
            case "AES-CBC":
                return this.encryptAesCBC(algorithm, key, Buffer.from(data));
            case "AES-CTR":
                return this.encryptAesCTR(algorithm, key, Buffer.from(data));
            case "AES-GCM":
                return this.encryptAesGCM(algorithm, key, Buffer.from(data));
            case "AES-KW":
                return this.encryptAesKW(algorithm, key, Buffer.from(data));
            case "AES-ECB":
                return this.encryptAesECB(algorithm, key, Buffer.from(data));
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static async decrypt(algorithm, key, data) {
        if (!(key instanceof AesCryptoKey)) {
            throw new Error("key: Is not AesCryptoKey");
        }
        switch (algorithm.name.toUpperCase()) {
            case "AES-CBC":
                return this.decryptAesCBC(algorithm, key, Buffer.from(data));
            case "AES-CTR":
                return this.decryptAesCTR(algorithm, key, Buffer.from(data));
            case "AES-GCM":
                return this.decryptAesGCM(algorithm, key, Buffer.from(data));
            case "AES-KW":
                return this.decryptAesKW(algorithm, key, Buffer.from(data));
            case "AES-ECB":
                return this.decryptAesECB(algorithm, key, Buffer.from(data));
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static async encryptAesCBC(algorithm, key, data) {
        const cipher = crypto__default__default.createCipheriv(`aes-${key.algorithm.length}-cbc`, key.data, new Uint8Array(algorithm.iv));
        let enc = cipher.update(data);
        enc = Buffer.concat([enc, cipher.final()]);
        const res = new Uint8Array(enc).buffer;
        return res;
    }
    static async decryptAesCBC(algorithm, key, data) {
        const decipher = crypto__default__default.createDecipheriv(`aes-${key.algorithm.length}-cbc`, key.data, new Uint8Array(algorithm.iv));
        let dec = decipher.update(data);
        dec = Buffer.concat([dec, decipher.final()]);
        return new Uint8Array(dec).buffer;
    }
    static async encryptAesCTR(algorithm, key, data) {
        const cipher = crypto__default__default.createCipheriv(`aes-${key.algorithm.length}-ctr`, key.data, Buffer.from(algorithm.counter));
        let enc = cipher.update(data);
        enc = Buffer.concat([enc, cipher.final()]);
        const res = new Uint8Array(enc).buffer;
        return res;
    }
    static async decryptAesCTR(algorithm, key, data) {
        const decipher = crypto__default__default.createDecipheriv(`aes-${key.algorithm.length}-ctr`, key.data, new Uint8Array(algorithm.counter));
        let dec = decipher.update(data);
        dec = Buffer.concat([dec, decipher.final()]);
        return new Uint8Array(dec).buffer;
    }
    static async encryptAesGCM(algorithm, key, data) {
        const cipher = crypto__default__default.createCipheriv(`aes-${key.algorithm.length}-gcm`, key.data, Buffer.from(algorithm.iv), {
            authTagLength: (algorithm.tagLength || 128) >> 3,
        });
        if (algorithm.additionalData) {
            cipher.setAAD(Buffer.from(algorithm.additionalData));
        }
        let enc = cipher.update(data);
        enc = Buffer.concat([enc, cipher.final(), cipher.getAuthTag()]);
        const res = new Uint8Array(enc).buffer;
        return res;
    }
    static async decryptAesGCM(algorithm, key, data) {
        const decipher = crypto__default__default.createDecipheriv(`aes-${key.algorithm.length}-gcm`, key.data, new Uint8Array(algorithm.iv));
        const tagLength = (algorithm.tagLength || 128) >> 3;
        const enc = data.slice(0, data.length - tagLength);
        const tag = data.slice(data.length - tagLength);
        if (algorithm.additionalData) {
            decipher.setAAD(Buffer.from(algorithm.additionalData));
        }
        decipher.setAuthTag(tag);
        let dec = decipher.update(enc);
        dec = Buffer.concat([dec, decipher.final()]);
        return new Uint8Array(dec).buffer;
    }
    static async encryptAesKW(algorithm, key, data) {
        const cipher = crypto__default__default.createCipheriv(`id-aes${key.algorithm.length}-wrap`, key.data, this.AES_KW_IV);
        let enc = cipher.update(data);
        enc = Buffer.concat([enc, cipher.final()]);
        return new Uint8Array(enc).buffer;
    }
    static async decryptAesKW(algorithm, key, data) {
        const decipher = crypto__default__default.createDecipheriv(`id-aes${key.algorithm.length}-wrap`, key.data, this.AES_KW_IV);
        let dec = decipher.update(data);
        dec = Buffer.concat([dec, decipher.final()]);
        return new Uint8Array(dec).buffer;
    }
    static async encryptAesECB(algorithm, key, data) {
        const cipher = crypto__default__default.createCipheriv(`aes-${key.algorithm.length}-ecb`, key.data, new Uint8Array(0));
        let enc = cipher.update(data);
        enc = Buffer.concat([enc, cipher.final()]);
        const res = new Uint8Array(enc).buffer;
        return res;
    }
    static async decryptAesECB(algorithm, key, data) {
        const decipher = crypto__default__default.createDecipheriv(`aes-${key.algorithm.length}-ecb`, key.data, new Uint8Array(0));
        let dec = decipher.update(data);
        dec = Buffer.concat([dec, decipher.final()]);
        return new Uint8Array(dec).buffer;
    }
}
AesCrypto.AES_KW_IV = Buffer.from("A6A6A6A6A6A6A6A6", "hex");

class AesCbcProvider extends AesCbcProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const key = await AesCrypto.generateKey({
            name: this.name,
            length: algorithm.length,
        }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    async onEncrypt(algorithm, key, data) {
        return AesCrypto.encrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onDecrypt(algorithm, key, data) {
        return AesCrypto.decrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return AesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await AesCrypto.importKey(format, keyData, { name: algorithm.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof AesCryptoKey)) {
            throw new TypeError("key: Is not a AesCryptoKey");
        }
    }
}

const zero = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const rb = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 135]);
const blockSize = 16;
function bitShiftLeft(buffer) {
    const shifted = Buffer.alloc(buffer.length);
    const last = buffer.length - 1;
    for (let index = 0; index < last; index++) {
        shifted[index] = buffer[index] << 1;
        if (buffer[index + 1] & 0x80) {
            shifted[index] += 0x01;
        }
    }
    shifted[last] = buffer[last] << 1;
    return shifted;
}
function xor(a, b) {
    const length = Math.min(a.length, b.length);
    const output = Buffer.alloc(length);
    for (let index = 0; index < length; index++) {
        output[index] = a[index] ^ b[index];
    }
    return output;
}
function aes(key, message) {
    const cipher = crypto__default.createCipheriv(`aes${key.length << 3}`, key, zero);
    const result = cipher.update(message);
    cipher.final();
    return result;
}
function getMessageBlock(message, blockIndex) {
    const block = Buffer.alloc(blockSize);
    const start = blockIndex * blockSize;
    const end = start + blockSize;
    message.copy(block, 0, start, end);
    return block;
}
function getPaddedMessageBlock(message, blockIndex) {
    const block = Buffer.alloc(blockSize);
    const start = blockIndex * blockSize;
    const end = message.length;
    block.fill(0);
    message.copy(block, 0, start, end);
    block[end - start] = 0x80;
    return block;
}
function generateSubkeys(key) {
    const l = aes(key, zero);
    let subkey1 = bitShiftLeft(l);
    if (l[0] & 0x80) {
        subkey1 = xor(subkey1, rb);
    }
    let subkey2 = bitShiftLeft(subkey1);
    if (subkey1[0] & 0x80) {
        subkey2 = xor(subkey2, rb);
    }
    return { subkey1, subkey2 };
}
function aesCmac(key, message) {
    const subkeys = generateSubkeys(key);
    let blockCount = Math.ceil(message.length / blockSize);
    let lastBlockCompleteFlag;
    let lastBlock;
    if (blockCount === 0) {
        blockCount = 1;
        lastBlockCompleteFlag = false;
    }
    else {
        lastBlockCompleteFlag = (message.length % blockSize === 0);
    }
    const lastBlockIndex = blockCount - 1;
    if (lastBlockCompleteFlag) {
        lastBlock = xor(getMessageBlock(message, lastBlockIndex), subkeys.subkey1);
    }
    else {
        lastBlock = xor(getPaddedMessageBlock(message, lastBlockIndex), subkeys.subkey2);
    }
    let x = zero;
    let y;
    for (let index = 0; index < lastBlockIndex; index++) {
        y = xor(x, getMessageBlock(message, index));
        x = aes(key, y);
    }
    y = xor(lastBlock, x);
    return aes(key, y);
}
class AesCmacProvider extends AesCmacProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const key = await AesCrypto.generateKey({
            name: this.name,
            length: algorithm.length,
        }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    async onSign(algorithm, key, data) {
        const result = aesCmac(getCryptoKey(key).data, Buffer.from(data));
        return new Uint8Array(result).buffer;
    }
    async onVerify(algorithm, key, signature, data) {
        const signature2 = await this.sign(algorithm, key, data);
        return Buffer.from(signature).compare(Buffer.from(signature2)) === 0;
    }
    async onExportKey(format, key) {
        return AesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const res = await AesCrypto.importKey(format, keyData, { name: algorithm.name }, extractable, keyUsages);
        return setCryptoKey(res);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof AesCryptoKey)) {
            throw new TypeError("key: Is not a AesCryptoKey");
        }
    }
}

class AesCtrProvider extends AesCtrProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const key = await AesCrypto.generateKey({
            name: this.name,
            length: algorithm.length,
        }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    async onEncrypt(algorithm, key, data) {
        return AesCrypto.encrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onDecrypt(algorithm, key, data) {
        return AesCrypto.decrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return AesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const res = await AesCrypto.importKey(format, keyData, { name: algorithm.name }, extractable, keyUsages);
        return setCryptoKey(res);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof AesCryptoKey)) {
            throw new TypeError("key: Is not a AesCryptoKey");
        }
    }
}

class AesGcmProvider extends AesGcmProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const key = await AesCrypto.generateKey({
            name: this.name,
            length: algorithm.length,
        }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    async onEncrypt(algorithm, key, data) {
        return AesCrypto.encrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onDecrypt(algorithm, key, data) {
        return AesCrypto.decrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return AesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const res = await AesCrypto.importKey(format, keyData, { name: algorithm.name }, extractable, keyUsages);
        return setCryptoKey(res);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof AesCryptoKey)) {
            throw new TypeError("key: Is not a AesCryptoKey");
        }
    }
}

class AesKwProvider extends AesKwProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const res = await AesCrypto.generateKey({
            name: this.name,
            length: algorithm.length,
        }, extractable, keyUsages);
        return setCryptoKey(res);
    }
    async onExportKey(format, key) {
        return AesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const res = await AesCrypto.importKey(format, keyData, { name: algorithm.name }, extractable, keyUsages);
        return setCryptoKey(res);
    }
    async onEncrypt(algorithm, key, data) {
        return AesCrypto.encrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onDecrypt(algorithm, key, data) {
        return AesCrypto.decrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof AesCryptoKey)) {
            throw new TypeError("key: Is not a AesCryptoKey");
        }
    }
}

class AesEcbProvider extends AesEcbProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const key = await AesCrypto.generateKey({
            name: this.name,
            length: algorithm.length,
        }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    async onEncrypt(algorithm, key, data) {
        return AesCrypto.encrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onDecrypt(algorithm, key, data) {
        return AesCrypto.decrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return AesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const res = await AesCrypto.importKey(format, keyData, { name: algorithm.name }, extractable, keyUsages);
        return setCryptoKey(res);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof AesCryptoKey)) {
            throw new TypeError("key: Is not a AesCryptoKey");
        }
    }
}

class DesCryptoKey extends SymmetricKey {
    get alg() {
        switch (this.algorithm.name.toUpperCase()) {
            case "DES-CBC":
                return `DES-CBC`;
            case "DES-EDE3-CBC":
                return `3DES-CBC`;
            default:
                throw new AlgorithmError("Unsupported algorithm name");
        }
    }
    set alg(value) {
    }
}
__decorate([
    JsonProp({ name: "k", converter: JsonBase64UrlConverter })
], DesCryptoKey.prototype, "data", void 0);

class DesCrypto {
    static async generateKey(algorithm, extractable, keyUsages) {
        const key = new DesCryptoKey();
        key.algorithm = algorithm;
        key.extractable = extractable;
        key.usages = keyUsages;
        key.data = crypto__default__default.randomBytes(algorithm.length >> 3);
        return key;
    }
    static async exportKey(format, key) {
        switch (format.toLowerCase()) {
            case "jwk":
                return JsonSerializer.toJSON(key);
            case "raw":
                return new Uint8Array(key.data).buffer;
            default:
                throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
    }
    static async importKey(format, keyData, algorithm, extractable, keyUsages) {
        let key;
        switch (format.toLowerCase()) {
            case "jwk":
                key = JsonParser.fromJSON(keyData, { targetSchema: DesCryptoKey });
                break;
            case "raw":
                key = new DesCryptoKey();
                key.data = Buffer.from(keyData);
                break;
            default:
                throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
        key.algorithm = algorithm;
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
    }
    static async encrypt(algorithm, key, data) {
        switch (algorithm.name.toUpperCase()) {
            case "DES-CBC":
                return this.encryptDesCBC(algorithm, key, Buffer.from(data));
            case "DES-EDE3-CBC":
                return this.encryptDesEDE3CBC(algorithm, key, Buffer.from(data));
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static async decrypt(algorithm, key, data) {
        if (!(key instanceof DesCryptoKey)) {
            throw new Error("key: Is not DesCryptoKey");
        }
        switch (algorithm.name.toUpperCase()) {
            case "DES-CBC":
                return this.decryptDesCBC(algorithm, key, Buffer.from(data));
            case "DES-EDE3-CBC":
                return this.decryptDesEDE3CBC(algorithm, key, Buffer.from(data));
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static async encryptDesCBC(algorithm, key, data) {
        const cipher = crypto__default__default.createCipheriv(`des-cbc`, key.data, new Uint8Array(algorithm.iv));
        let enc = cipher.update(data);
        enc = Buffer.concat([enc, cipher.final()]);
        const res = new Uint8Array(enc).buffer;
        return res;
    }
    static async decryptDesCBC(algorithm, key, data) {
        const decipher = crypto__default__default.createDecipheriv(`des-cbc`, key.data, new Uint8Array(algorithm.iv));
        let dec = decipher.update(data);
        dec = Buffer.concat([dec, decipher.final()]);
        return new Uint8Array(dec).buffer;
    }
    static async encryptDesEDE3CBC(algorithm, key, data) {
        const cipher = crypto__default__default.createCipheriv(`des-ede3-cbc`, key.data, Buffer.from(algorithm.iv));
        let enc = cipher.update(data);
        enc = Buffer.concat([enc, cipher.final()]);
        const res = new Uint8Array(enc).buffer;
        return res;
    }
    static async decryptDesEDE3CBC(algorithm, key, data) {
        const decipher = crypto__default__default.createDecipheriv(`des-ede3-cbc`, key.data, new Uint8Array(algorithm.iv));
        let dec = decipher.update(data);
        dec = Buffer.concat([dec, decipher.final()]);
        return new Uint8Array(dec).buffer;
    }
}

class DesCbcProvider extends DesProvider {
    constructor() {
        super(...arguments);
        this.keySizeBits = 64;
        this.ivSize = 8;
        this.name = "DES-CBC";
    }
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const key = await DesCrypto.generateKey({
            name: this.name,
            length: this.keySizeBits,
        }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    async onEncrypt(algorithm, key, data) {
        return DesCrypto.encrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onDecrypt(algorithm, key, data) {
        return DesCrypto.decrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return DesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await DesCrypto.importKey(format, keyData, { name: this.name, length: this.keySizeBits }, extractable, keyUsages);
        if (key.data.length !== (this.keySizeBits >> 3)) {
            throw new OperationError("keyData: Wrong key size");
        }
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof DesCryptoKey)) {
            throw new TypeError("key: Is not a DesCryptoKey");
        }
    }
}

class DesEde3CbcProvider extends DesProvider {
    constructor() {
        super(...arguments);
        this.keySizeBits = 192;
        this.ivSize = 8;
        this.name = "DES-EDE3-CBC";
    }
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const key = await DesCrypto.generateKey({
            name: this.name,
            length: this.keySizeBits,
        }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    async onEncrypt(algorithm, key, data) {
        return DesCrypto.encrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onDecrypt(algorithm, key, data) {
        return DesCrypto.decrypt(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return DesCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await DesCrypto.importKey(format, keyData, { name: this.name, length: this.keySizeBits }, extractable, keyUsages);
        if (key.data.length !== (this.keySizeBits >> 3)) {
            throw new OperationError("keyData: Wrong key size");
        }
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof DesCryptoKey)) {
            throw new TypeError("key: Is not a DesCryptoKey");
        }
    }
}

function getJwkAlgorithm(algorithm) {
    switch (algorithm.name.toUpperCase()) {
        case "RSA-OAEP": {
            const mdSize = /(\d+)$/.exec(algorithm.hash.name)[1];
            return `RSA-OAEP${mdSize !== "1" ? `-${mdSize}` : ""}`;
        }
        case "RSASSA-PKCS1-V1_5":
            return `RS${/(\d+)$/.exec(algorithm.hash.name)[1]}`;
        case "RSA-PSS":
            return `PS${/(\d+)$/.exec(algorithm.hash.name)[1]}`;
        case "RSA-PKCS1":
            return `RS1`;
        default:
            throw new OperationError("algorithm: Is not recognized");
    }
}

class RsaPrivateKey extends AsymmetricKey {
    constructor() {
        super(...arguments);
        this.type = "private";
    }
    getKey() {
        const keyInfo = AsnParser.parse(this.data, index$1.PrivateKeyInfo);
        return AsnParser.parse(keyInfo.privateKey, index$1.RsaPrivateKey);
    }
    toJSON() {
        const key = this.getKey();
        const json = {
            kty: "RSA",
            alg: getJwkAlgorithm(this.algorithm),
            key_ops: this.usages,
            ext: this.extractable,
        };
        return Object.assign(json, JsonSerializer.toJSON(key));
    }
    fromJSON(json) {
        const key = JsonParser.fromJSON(json, { targetSchema: index$1.RsaPrivateKey });
        const keyInfo = new index$1.PrivateKeyInfo();
        keyInfo.privateKeyAlgorithm.algorithm = "1.2.840.113549.1.1.1";
        keyInfo.privateKeyAlgorithm.parameters = null;
        keyInfo.privateKey = AsnSerializer.serialize(key);
        this.data = Buffer.from(AsnSerializer.serialize(keyInfo));
    }
}

class RsaPublicKey extends AsymmetricKey {
    constructor() {
        super(...arguments);
        this.type = "public";
    }
    getKey() {
        const keyInfo = AsnParser.parse(this.data, index$1.PublicKeyInfo);
        return AsnParser.parse(keyInfo.publicKey, index$1.RsaPublicKey);
    }
    toJSON() {
        const key = this.getKey();
        const json = {
            kty: "RSA",
            alg: getJwkAlgorithm(this.algorithm),
            key_ops: this.usages,
            ext: this.extractable,
        };
        return Object.assign(json, JsonSerializer.toJSON(key));
    }
    fromJSON(json) {
        const key = JsonParser.fromJSON(json, { targetSchema: index$1.RsaPublicKey });
        const keyInfo = new index$1.PublicKeyInfo();
        keyInfo.publicKeyAlgorithm.algorithm = "1.2.840.113549.1.1.1";
        keyInfo.publicKeyAlgorithm.parameters = null;
        keyInfo.publicKey = AsnSerializer.serialize(key);
        this.data = Buffer.from(AsnSerializer.serialize(keyInfo));
    }
}

class RsaCrypto {
    static async generateKey(algorithm, extractable, keyUsages) {
        const privateKey = new RsaPrivateKey();
        privateKey.algorithm = algorithm;
        privateKey.extractable = extractable;
        privateKey.usages = keyUsages.filter((usage) => this.privateKeyUsages.indexOf(usage) !== -1);
        const publicKey = new RsaPublicKey();
        publicKey.algorithm = algorithm;
        publicKey.extractable = true;
        publicKey.usages = keyUsages.filter((usage) => this.publicKeyUsages.indexOf(usage) !== -1);
        const publicExponent = Buffer.concat([
            Buffer.alloc(4 - algorithm.publicExponent.byteLength, 0),
            Buffer.from(algorithm.publicExponent),
        ]).readInt32BE(0);
        const keys = crypto__default__default.generateKeyPairSync("rsa", {
            modulusLength: algorithm.modulusLength,
            publicExponent,
            publicKeyEncoding: {
                format: "der",
                type: "spki",
            },
            privateKeyEncoding: {
                format: "der",
                type: "pkcs8",
            },
        });
        privateKey.data = keys.privateKey;
        publicKey.data = keys.publicKey;
        const res = {
            privateKey,
            publicKey,
        };
        return res;
    }
    static async exportKey(format, key) {
        switch (format.toLowerCase()) {
            case "jwk":
                return JsonSerializer.toJSON(key);
            case "pkcs8":
            case "spki":
                return new Uint8Array(key.data).buffer;
            default:
                throw new OperationError("format: Must be 'jwk', 'pkcs8' or 'spki'");
        }
    }
    static async importKey(format, keyData, algorithm, extractable, keyUsages) {
        switch (format.toLowerCase()) {
            case "jwk": {
                const jwk = keyData;
                if (jwk.d) {
                    const asnKey = JsonParser.fromJSON(keyData, { targetSchema: index$1.RsaPrivateKey });
                    return this.importPrivateKey(asnKey, algorithm, extractable, keyUsages);
                }
                else {
                    const asnKey = JsonParser.fromJSON(keyData, { targetSchema: index$1.RsaPublicKey });
                    return this.importPublicKey(asnKey, algorithm, extractable, keyUsages);
                }
            }
            case "spki": {
                const keyInfo = AsnParser.parse(new Uint8Array(keyData), index$1.PublicKeyInfo);
                const asnKey = AsnParser.parse(keyInfo.publicKey, index$1.RsaPublicKey);
                return this.importPublicKey(asnKey, algorithm, extractable, keyUsages);
            }
            case "pkcs8": {
                const keyInfo = AsnParser.parse(new Uint8Array(keyData), index$1.PrivateKeyInfo);
                const asnKey = AsnParser.parse(keyInfo.privateKey, index$1.RsaPrivateKey);
                return this.importPrivateKey(asnKey, algorithm, extractable, keyUsages);
            }
            default:
                throw new OperationError("format: Must be 'jwk', 'pkcs8' or 'spki'");
        }
    }
    static async sign(algorithm, key, data) {
        switch (algorithm.name.toUpperCase()) {
            case "RSA-PSS":
            case "RSASSA-PKCS1-V1_5":
                return this.signRsa(algorithm, key, data);
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static async verify(algorithm, key, signature, data) {
        switch (algorithm.name.toUpperCase()) {
            case "RSA-PSS":
            case "RSASSA-PKCS1-V1_5":
                return this.verifySSA(algorithm, key, data, signature);
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static async encrypt(algorithm, key, data) {
        switch (algorithm.name.toUpperCase()) {
            case "RSA-OAEP":
                return this.encryptOAEP(algorithm, key, data);
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static async decrypt(algorithm, key, data) {
        switch (algorithm.name.toUpperCase()) {
            case "RSA-OAEP":
                return this.decryptOAEP(algorithm, key, data);
            default:
                throw new OperationError("algorithm: Is not recognized");
        }
    }
    static importPrivateKey(asnKey, algorithm, extractable, keyUsages) {
        const keyInfo = new index$1.PrivateKeyInfo();
        keyInfo.privateKeyAlgorithm.algorithm = "1.2.840.113549.1.1.1";
        keyInfo.privateKeyAlgorithm.parameters = null;
        keyInfo.privateKey = AsnSerializer.serialize(asnKey);
        const key = new RsaPrivateKey();
        key.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        key.algorithm = Object.assign({}, algorithm);
        key.algorithm.publicExponent = new Uint8Array(asnKey.publicExponent);
        key.algorithm.modulusLength = asnKey.modulus.byteLength << 3;
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
    }
    static importPublicKey(asnKey, algorithm, extractable, keyUsages) {
        const keyInfo = new index$1.PublicKeyInfo();
        keyInfo.publicKeyAlgorithm.algorithm = "1.2.840.113549.1.1.1";
        keyInfo.publicKeyAlgorithm.parameters = null;
        keyInfo.publicKey = AsnSerializer.serialize(asnKey);
        const key = new RsaPublicKey();
        key.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        key.algorithm = Object.assign({}, algorithm);
        key.algorithm.publicExponent = new Uint8Array(asnKey.publicExponent);
        key.algorithm.modulusLength = asnKey.modulus.byteLength << 3;
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
    }
    static getCryptoAlgorithm(alg) {
        switch (alg.hash.name.toUpperCase()) {
            case "SHA-1":
                return "RSA-SHA1";
            case "SHA-256":
                return "RSA-SHA256";
            case "SHA-384":
                return "RSA-SHA384";
            case "SHA-512":
                return "RSA-SHA512";
            case "SHA3-256":
                return "RSA-SHA3-256";
            case "SHA3-384":
                return "RSA-SHA3-384";
            case "SHA3-512":
                return "RSA-SHA3-512";
            default:
                throw new OperationError("algorithm.hash: Is not recognized");
        }
    }
    static signRsa(algorithm, key, data) {
        const cryptoAlg = this.getCryptoAlgorithm(key.algorithm);
        const signer = crypto__default__default.createSign(cryptoAlg);
        signer.update(Buffer.from(data));
        if (!key.pem) {
            key.pem = `-----BEGIN PRIVATE KEY-----\n${key.data.toString("base64")}\n-----END PRIVATE KEY-----`;
        }
        const options = {
            key: key.pem,
        };
        if (algorithm.name.toUpperCase() === "RSA-PSS") {
            options.padding = crypto__default__default.constants.RSA_PKCS1_PSS_PADDING;
            options.saltLength = algorithm.saltLength;
        }
        const signature = signer.sign(options);
        return new Uint8Array(signature).buffer;
    }
    static verifySSA(algorithm, key, data, signature) {
        const cryptoAlg = this.getCryptoAlgorithm(key.algorithm);
        const signer = crypto__default__default.createVerify(cryptoAlg);
        signer.update(Buffer.from(data));
        if (!key.pem) {
            key.pem = `-----BEGIN PUBLIC KEY-----\n${key.data.toString("base64")}\n-----END PUBLIC KEY-----`;
        }
        const options = {
            key: key.pem,
        };
        if (algorithm.name.toUpperCase() === "RSA-PSS") {
            options.padding = crypto__default__default.constants.RSA_PKCS1_PSS_PADDING;
            options.saltLength = algorithm.saltLength;
        }
        const ok = signer.verify(options, signature);
        return ok;
    }
    static encryptOAEP(algorithm, key, data) {
        const options = {
            key: `-----BEGIN PUBLIC KEY-----\n${key.data.toString("base64")}\n-----END PUBLIC KEY-----`,
            padding: crypto__default__default.constants.RSA_PKCS1_OAEP_PADDING,
        };
        if (algorithm.label) ;
        return new Uint8Array(crypto__default__default.publicEncrypt(options, data)).buffer;
    }
    static decryptOAEP(algorithm, key, data) {
        const options = {
            key: `-----BEGIN PRIVATE KEY-----\n${key.data.toString("base64")}\n-----END PRIVATE KEY-----`,
            padding: crypto__default__default.constants.RSA_PKCS1_OAEP_PADDING,
        };
        if (algorithm.label) ;
        return new Uint8Array(crypto__default__default.privateDecrypt(options, data)).buffer;
    }
}
RsaCrypto.publicKeyUsages = ["verify", "encrypt", "wrapKey"];
RsaCrypto.privateKeyUsages = ["sign", "decrypt", "unwrapKey"];

class RsaSsaProvider extends RsaSsaProvider$1 {
    constructor() {
        super(...arguments);
        this.hashAlgorithms = [
            "SHA-1", "SHA-256", "SHA-384", "SHA-512",
            "shake128", "shake256",
            "SHA3-256", "SHA3-384", "SHA3-512"
        ];
    }
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await RsaCrypto.generateKey({
            ...algorithm,
            name: this.name,
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    async onSign(algorithm, key, data) {
        return RsaCrypto.sign(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onVerify(algorithm, key, signature, data) {
        return RsaCrypto.verify(algorithm, getCryptoKey(key), new Uint8Array(signature), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return RsaCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await RsaCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        const internalKey = getCryptoKey(key);
        if (!(internalKey instanceof RsaPrivateKey || internalKey instanceof RsaPublicKey)) {
            throw new TypeError("key: Is not RSA CryptoKey");
        }
    }
}

class RsaPssProvider extends RsaPssProvider$1 {
    constructor() {
        super(...arguments);
        this.hashAlgorithms = [
            "SHA-1", "SHA-256", "SHA-384", "SHA-512",
            "shake128", "shake256",
            "SHA3-256", "SHA3-384", "SHA3-512"
        ];
    }
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await RsaCrypto.generateKey({
            ...algorithm,
            name: this.name,
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    async onSign(algorithm, key, data) {
        return RsaCrypto.sign(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onVerify(algorithm, key, signature, data) {
        return RsaCrypto.verify(algorithm, getCryptoKey(key), new Uint8Array(signature), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return RsaCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await RsaCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        const internalKey = getCryptoKey(key);
        if (!(internalKey instanceof RsaPrivateKey || internalKey instanceof RsaPublicKey)) {
            throw new TypeError("key: Is not RSA CryptoKey");
        }
    }
}

class ShaCrypto {
    static size(algorithm) {
        switch (algorithm.name.toUpperCase()) {
            case "SHA-1":
                return 160;
            case "SHA-256":
            case "SHA3-256":
                return 256;
            case "SHA-384":
            case "SHA3-384":
                return 384;
            case "SHA-512":
            case "SHA3-512":
                return 512;
            default:
                throw new Error("Unrecognized name");
        }
    }
    static getAlgorithmName(algorithm) {
        switch (algorithm.name.toUpperCase()) {
            case "SHA-1":
                return "sha1";
            case "SHA-256":
                return "sha256";
            case "SHA-384":
                return "sha384";
            case "SHA-512":
                return "sha512";
            case "SHA3-256":
                return "sha3-256";
            case "SHA3-384":
                return "sha3-384";
            case "SHA3-512":
                return "sha3-512";
            default:
                throw new Error("Unrecognized name");
        }
    }
    static digest(algorithm, data) {
        const hashAlg = this.getAlgorithmName(algorithm);
        const hash = crypto__default__default.createHash(hashAlg)
            .update(Buffer.from(data)).digest();
        return new Uint8Array(hash).buffer;
    }
}

class RsaOaepProvider extends RsaOaepProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await RsaCrypto.generateKey({
            ...algorithm,
            name: this.name,
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    async onEncrypt(algorithm, key, data) {
        const internalKey = getCryptoKey(key);
        const dataView = new Uint8Array(data);
        const keySize = Math.ceil(internalKey.algorithm.modulusLength >> 3);
        const hashSize = ShaCrypto.size(internalKey.algorithm.hash) >> 3;
        const dataLength = dataView.byteLength;
        const psLength = keySize - dataLength - 2 * hashSize - 2;
        if (dataLength > keySize - 2 * hashSize - 2) {
            throw new Error("Data too large");
        }
        const message = new Uint8Array(keySize);
        const seed = message.subarray(1, hashSize + 1);
        const dataBlock = message.subarray(hashSize + 1);
        dataBlock.set(dataView, hashSize + psLength + 1);
        const labelHash = crypto__default__default.createHash(internalKey.algorithm.hash.name.replace("-", ""))
            .update(BufferSourceConverter.toUint8Array(algorithm.label || new Uint8Array(0)))
            .digest();
        dataBlock.set(labelHash, 0);
        dataBlock[hashSize + psLength] = 1;
        crypto__default__default.randomFillSync(seed);
        const dataBlockMask = this.mgf1(internalKey.algorithm.hash, seed, dataBlock.length);
        for (let i = 0; i < dataBlock.length; i++) {
            dataBlock[i] ^= dataBlockMask[i];
        }
        const seedMask = this.mgf1(internalKey.algorithm.hash, dataBlock, seed.length);
        for (let i = 0; i < seed.length; i++) {
            seed[i] ^= seedMask[i];
        }
        if (!internalKey.pem) {
            internalKey.pem = `-----BEGIN PUBLIC KEY-----\n${internalKey.data.toString("base64")}\n-----END PUBLIC KEY-----`;
        }
        const pkcs0 = crypto__default__default.publicEncrypt({
            key: internalKey.pem,
            padding: crypto__default__default.constants.RSA_NO_PADDING,
        }, Buffer.from(message));
        return new Uint8Array(pkcs0).buffer;
    }
    async onDecrypt(algorithm, key, data) {
        const internalKey = getCryptoKey(key);
        const keySize = Math.ceil(internalKey.algorithm.modulusLength >> 3);
        const hashSize = ShaCrypto.size(internalKey.algorithm.hash) >> 3;
        const dataLength = data.byteLength;
        if (dataLength !== keySize) {
            throw new Error("Bad data");
        }
        if (!internalKey.pem) {
            internalKey.pem = `-----BEGIN PRIVATE KEY-----\n${internalKey.data.toString("base64")}\n-----END PRIVATE KEY-----`;
        }
        let pkcs0 = crypto__default__default.privateDecrypt({
            key: internalKey.pem,
            padding: crypto__default__default.constants.RSA_NO_PADDING,
        }, Buffer.from(data));
        const z = pkcs0[0];
        const seed = pkcs0.subarray(1, hashSize + 1);
        const dataBlock = pkcs0.subarray(hashSize + 1);
        if (z !== 0) {
            throw new Error("Decryption failed");
        }
        const seedMask = this.mgf1(internalKey.algorithm.hash, dataBlock, seed.length);
        for (let i = 0; i < seed.length; i++) {
            seed[i] ^= seedMask[i];
        }
        const dataBlockMask = this.mgf1(internalKey.algorithm.hash, seed, dataBlock.length);
        for (let i = 0; i < dataBlock.length; i++) {
            dataBlock[i] ^= dataBlockMask[i];
        }
        const labelHash = crypto__default__default.createHash(internalKey.algorithm.hash.name.replace("-", ""))
            .update(BufferSourceConverter.toUint8Array(algorithm.label || new Uint8Array(0)))
            .digest();
        for (let i = 0; i < hashSize; i++) {
            if (labelHash[i] !== dataBlock[i]) {
                throw new Error("Decryption failed");
            }
        }
        let psEnd = hashSize;
        for (; psEnd < dataBlock.length; psEnd++) {
            const psz = dataBlock[psEnd];
            if (psz === 1) {
                break;
            }
            if (psz !== 0) {
                throw new Error("Decryption failed");
            }
        }
        if (psEnd === dataBlock.length) {
            throw new Error("Decryption failed");
        }
        pkcs0 = dataBlock.subarray(psEnd + 1);
        return new Uint8Array(pkcs0).buffer;
    }
    async onExportKey(format, key) {
        return RsaCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await RsaCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        const internalKey = getCryptoKey(key);
        if (!(internalKey instanceof RsaPrivateKey || internalKey instanceof RsaPublicKey)) {
            throw new TypeError("key: Is not RSA CryptoKey");
        }
    }
    mgf1(algorithm, seed, length = 0) {
        const hashSize = ShaCrypto.size(algorithm) >> 3;
        const mask = new Uint8Array(length);
        const counter = new Uint8Array(4);
        const chunks = Math.ceil(length / hashSize);
        for (let i = 0; i < chunks; i++) {
            counter[0] = i >>> 24;
            counter[1] = (i >>> 16) & 255;
            counter[2] = (i >>> 8) & 255;
            counter[3] = i & 255;
            const submask = mask.subarray(i * hashSize);
            let chunk = crypto__default__default.createHash(algorithm.name.replace("-", ""))
                .update(seed)
                .update(counter)
                .digest();
            if (chunk.length > submask.length) {
                chunk = chunk.subarray(0, submask.length);
            }
            submask.set(chunk);
        }
        return mask;
    }
}

class RsaEsProvider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "RSAES-PKCS1-v1_5";
        this.usages = {
            publicKey: ["encrypt", "wrapKey"],
            privateKey: ["decrypt", "unwrapKey"],
        };
    }
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await RsaCrypto.generateKey({
            ...algorithm,
            name: this.name,
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    checkGenerateKeyParams(algorithm) {
        this.checkRequiredProperty(algorithm, "publicExponent");
        if (!(algorithm.publicExponent && algorithm.publicExponent instanceof Uint8Array)) {
            throw new TypeError("publicExponent: Missing or not a Uint8Array");
        }
        const publicExponent = Convert.ToBase64(algorithm.publicExponent);
        if (!(publicExponent === "Aw==" || publicExponent === "AQAB")) {
            throw new TypeError("publicExponent: Must be [3] or [1,0,1]");
        }
        this.checkRequiredProperty(algorithm, "modulusLength");
        switch (algorithm.modulusLength) {
            case 1024:
            case 2048:
            case 4096:
                break;
            default:
                throw new TypeError("modulusLength: Must be 1024, 2048, or 4096");
        }
    }
    async onEncrypt(algorithm, key, data) {
        const options = this.toCryptoOptions(key);
        const enc = crypto__default.publicEncrypt(options, new Uint8Array(data));
        return new Uint8Array(enc).buffer;
    }
    async onDecrypt(algorithm, key, data) {
        const options = this.toCryptoOptions(key);
        const dec = crypto__default.privateDecrypt(options, new Uint8Array(data));
        return new Uint8Array(dec).buffer;
    }
    async onExportKey(format, key) {
        return RsaCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await RsaCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        const internalKey = getCryptoKey(key);
        if (!(internalKey instanceof RsaPrivateKey || internalKey instanceof RsaPublicKey)) {
            throw new TypeError("key: Is not RSA CryptoKey");
        }
    }
    toCryptoOptions(key) {
        const type = key.type.toUpperCase();
        return {
            key: `-----BEGIN ${type} KEY-----\n${getCryptoKey(key).data.toString("base64")}\n-----END ${type} KEY-----`,
            padding: crypto__default.constants.RSA_PKCS1_PADDING,
        };
    }
}

const namedOIDs = {
    "1.2.840.10045.3.1.7": "P-256",
    "P-256": "1.2.840.10045.3.1.7",
    "1.3.132.0.34": "P-384",
    "P-384": "1.3.132.0.34",
    "1.3.132.0.35": "P-521",
    "P-521": "1.3.132.0.35",
    "1.3.132.0.10": "K-256",
    "K-256": "1.3.132.0.10",
    "brainpoolP160r1": "1.3.36.3.3.2.8.1.1.1",
    "1.3.36.3.3.2.8.1.1.1": "brainpoolP160r1",
    "brainpoolP160t1": "1.3.36.3.3.2.8.1.1.2",
    "1.3.36.3.3.2.8.1.1.2": "brainpoolP160t1",
    "brainpoolP192r1": "1.3.36.3.3.2.8.1.1.3",
    "1.3.36.3.3.2.8.1.1.3": "brainpoolP192r1",
    "brainpoolP192t1": "1.3.36.3.3.2.8.1.1.4",
    "1.3.36.3.3.2.8.1.1.4": "brainpoolP192t1",
    "brainpoolP224r1": "1.3.36.3.3.2.8.1.1.5",
    "1.3.36.3.3.2.8.1.1.5": "brainpoolP224r1",
    "brainpoolP224t1": "1.3.36.3.3.2.8.1.1.6",
    "1.3.36.3.3.2.8.1.1.6": "brainpoolP224t1",
    "brainpoolP256r1": "1.3.36.3.3.2.8.1.1.7",
    "1.3.36.3.3.2.8.1.1.7": "brainpoolP256r1",
    "brainpoolP256t1": "1.3.36.3.3.2.8.1.1.8",
    "1.3.36.3.3.2.8.1.1.8": "brainpoolP256t1",
    "brainpoolP320r1": "1.3.36.3.3.2.8.1.1.9",
    "1.3.36.3.3.2.8.1.1.9": "brainpoolP320r1",
    "brainpoolP320t1": "1.3.36.3.3.2.8.1.1.10",
    "1.3.36.3.3.2.8.1.1.10": "brainpoolP320t1",
    "brainpoolP384r1": "1.3.36.3.3.2.8.1.1.11",
    "1.3.36.3.3.2.8.1.1.11": "brainpoolP384r1",
    "brainpoolP384t1": "1.3.36.3.3.2.8.1.1.12",
    "1.3.36.3.3.2.8.1.1.12": "brainpoolP384t1",
    "brainpoolP512r1": "1.3.36.3.3.2.8.1.1.13",
    "1.3.36.3.3.2.8.1.1.13": "brainpoolP512r1",
    "brainpoolP512t1": "1.3.36.3.3.2.8.1.1.14",
    "1.3.36.3.3.2.8.1.1.14": "brainpoolP512t1",
};
function getOidByNamedCurve$1(namedCurve) {
    const oid = namedOIDs[namedCurve];
    if (!oid) {
        throw new OperationError(`Cannot convert WebCrypto named curve '${namedCurve}' to OID`);
    }
    return oid;
}

class EcPrivateKey extends AsymmetricKey {
    constructor() {
        super(...arguments);
        this.type = "private";
    }
    getKey() {
        const keyInfo = AsnParser.parse(this.data, index$1.PrivateKeyInfo);
        return AsnParser.parse(keyInfo.privateKey, index$1.EcPrivateKey);
    }
    toJSON() {
        const key = this.getKey();
        const json = {
            kty: "EC",
            crv: this.algorithm.namedCurve,
            key_ops: this.usages,
            ext: this.extractable,
        };
        return Object.assign(json, JsonSerializer.toJSON(key));
    }
    fromJSON(json) {
        if (!json.crv) {
            throw new OperationError(`Cannot get named curve from JWK. Property 'crv' is required`);
        }
        const keyInfo = new index$1.PrivateKeyInfo();
        keyInfo.privateKeyAlgorithm.algorithm = "1.2.840.10045.2.1";
        keyInfo.privateKeyAlgorithm.parameters = AsnSerializer.serialize(new index$1.ObjectIdentifier(getOidByNamedCurve$1(json.crv)));
        const key = JsonParser.fromJSON(json, { targetSchema: index$1.EcPrivateKey });
        keyInfo.privateKey = AsnSerializer.serialize(key);
        this.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        return this;
    }
}

class EcPublicKey extends AsymmetricKey {
    constructor() {
        super(...arguments);
        this.type = "public";
    }
    getKey() {
        const keyInfo = AsnParser.parse(this.data, index$1.PublicKeyInfo);
        return new index$1.EcPublicKey(keyInfo.publicKey);
    }
    toJSON() {
        const key = this.getKey();
        const json = {
            kty: "EC",
            crv: this.algorithm.namedCurve,
            key_ops: this.usages,
            ext: this.extractable,
        };
        return Object.assign(json, JsonSerializer.toJSON(key));
    }
    fromJSON(json) {
        if (!json.crv) {
            throw new OperationError(`Cannot get named curve from JWK. Property 'crv' is required`);
        }
        const key = JsonParser.fromJSON(json, { targetSchema: index$1.EcPublicKey });
        const keyInfo = new index$1.PublicKeyInfo();
        keyInfo.publicKeyAlgorithm.algorithm = "1.2.840.10045.2.1";
        keyInfo.publicKeyAlgorithm.parameters = AsnSerializer.serialize(new index$1.ObjectIdentifier(getOidByNamedCurve$1(json.crv)));
        keyInfo.publicKey = AsnSerializer.toASN(key).valueHex;
        this.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        return this;
    }
}

class Sha1Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "SHA-1";
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        return ShaCrypto.digest(algorithm, data);
    }
}

class Sha256Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "SHA-256";
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        return ShaCrypto.digest(algorithm, data);
    }
}

class Sha384Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "SHA-384";
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        return ShaCrypto.digest(algorithm, data);
    }
}

class Sha512Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "SHA-512";
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        return ShaCrypto.digest(algorithm, data);
    }
}

class Sha3256Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "SHA3-256";
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        return ShaCrypto.digest(algorithm, data);
    }
}

class Sha3384Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "SHA3-384";
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        return ShaCrypto.digest(algorithm, data);
    }
}

class Sha3512Provider extends ProviderCrypto {
    constructor() {
        super(...arguments);
        this.name = "SHA3-512";
        this.usages = [];
    }
    async onDigest(algorithm, data) {
        return ShaCrypto.digest(algorithm, data);
    }
}

class EcCrypto {
    static async generateKey(algorithm, extractable, keyUsages) {
        const privateKey = new EcPrivateKey();
        privateKey.algorithm = algorithm;
        privateKey.extractable = extractable;
        privateKey.usages = keyUsages.filter((usage) => this.privateKeyUsages.indexOf(usage) !== -1);
        const publicKey = new EcPublicKey();
        publicKey.algorithm = algorithm;
        publicKey.extractable = true;
        publicKey.usages = keyUsages.filter((usage) => this.publicKeyUsages.indexOf(usage) !== -1);
        const keys = crypto__default__default.generateKeyPairSync("ec", {
            namedCurve: this.getOpenSSLNamedCurve(algorithm.namedCurve),
            publicKeyEncoding: {
                format: "der",
                type: "spki",
            },
            privateKeyEncoding: {
                format: "der",
                type: "pkcs8",
            },
        });
        privateKey.data = keys.privateKey;
        publicKey.data = keys.publicKey;
        const res = {
            privateKey,
            publicKey,
        };
        return res;
    }
    static async sign(algorithm, key, data) {
        const cryptoAlg = ShaCrypto.getAlgorithmName(algorithm.hash);
        const signer = crypto__default__default.createSign(cryptoAlg);
        signer.update(Buffer.from(data));
        if (!key.pem) {
            key.pem = `-----BEGIN PRIVATE KEY-----\n${key.data.toString("base64")}\n-----END PRIVATE KEY-----`;
        }
        const options = {
            key: key.pem,
        };
        const signature = signer.sign(options);
        const ecSignature = AsnParser.parse(signature, index$1.EcDsaSignature);
        const signatureRaw = EcUtils.encodeSignature(ecSignature, EcCurves.get(key.algorithm.namedCurve).size);
        return signatureRaw.buffer;
    }
    static async verify(algorithm, key, signature, data) {
        const cryptoAlg = ShaCrypto.getAlgorithmName(algorithm.hash);
        const signer = crypto__default__default.createVerify(cryptoAlg);
        signer.update(Buffer.from(data));
        if (!key.pem) {
            key.pem = `-----BEGIN PUBLIC KEY-----\n${key.data.toString("base64")}\n-----END PUBLIC KEY-----`;
        }
        const options = {
            key: key.pem,
        };
        const ecSignature = new index$1.EcDsaSignature();
        const namedCurve = EcCurves.get(key.algorithm.namedCurve);
        const signaturePoint = EcUtils.decodeSignature(signature, namedCurve.size);
        ecSignature.r = BufferSourceConverter.toArrayBuffer(signaturePoint.r);
        ecSignature.s = BufferSourceConverter.toArrayBuffer(signaturePoint.s);
        const ecSignatureRaw = Buffer.from(AsnSerializer.serialize(ecSignature));
        const ok = signer.verify(options, ecSignatureRaw);
        return ok;
    }
    static async deriveBits(algorithm, baseKey, length) {
        const cryptoAlg = this.getOpenSSLNamedCurve(baseKey.algorithm.namedCurve);
        const ecdh = crypto__default__default.createECDH(cryptoAlg);
        const asnPrivateKey = AsnParser.parse(baseKey.data, index$1.PrivateKeyInfo);
        const asnEcPrivateKey = AsnParser.parse(asnPrivateKey.privateKey, index$1.EcPrivateKey);
        ecdh.setPrivateKey(Buffer.from(asnEcPrivateKey.privateKey));
        const asnPublicKey = AsnParser.parse(algorithm.public.data, index$1.PublicKeyInfo);
        const bits = ecdh.computeSecret(Buffer.from(asnPublicKey.publicKey));
        if (length === null) {
            return bits;
        }
        return new Uint8Array(bits).buffer.slice(0, length >> 3);
    }
    static async exportKey(format, key) {
        switch (format.toLowerCase()) {
            case "jwk":
                return JsonSerializer.toJSON(key);
            case "pkcs8":
            case "spki":
                return new Uint8Array(key.data).buffer;
            case "raw": {
                const publicKeyInfo = AsnParser.parse(key.data, index$1.PublicKeyInfo);
                return publicKeyInfo.publicKey;
            }
            default:
                throw new OperationError("format: Must be 'jwk', 'raw', pkcs8' or 'spki'");
        }
    }
    static async importKey(format, keyData, algorithm, extractable, keyUsages) {
        switch (format.toLowerCase()) {
            case "jwk": {
                const jwk = keyData;
                if (jwk.d) {
                    const asnKey = JsonParser.fromJSON(keyData, { targetSchema: index$1.EcPrivateKey });
                    return this.importPrivateKey(asnKey, algorithm, extractable, keyUsages);
                }
                else {
                    const asnKey = JsonParser.fromJSON(keyData, { targetSchema: index$1.EcPublicKey });
                    return this.importPublicKey(asnKey, algorithm, extractable, keyUsages);
                }
            }
            case "raw": {
                const asnKey = new index$1.EcPublicKey(keyData);
                return this.importPublicKey(asnKey, algorithm, extractable, keyUsages);
            }
            case "spki": {
                const keyInfo = AsnParser.parse(new Uint8Array(keyData), index$1.PublicKeyInfo);
                const asnKey = new index$1.EcPublicKey(keyInfo.publicKey);
                this.assertKeyParameters(keyInfo.publicKeyAlgorithm.parameters, algorithm.namedCurve);
                return this.importPublicKey(asnKey, algorithm, extractable, keyUsages);
            }
            case "pkcs8": {
                const keyInfo = AsnParser.parse(new Uint8Array(keyData), index$1.PrivateKeyInfo);
                const asnKey = AsnParser.parse(keyInfo.privateKey, index$1.EcPrivateKey);
                this.assertKeyParameters(keyInfo.privateKeyAlgorithm.parameters, algorithm.namedCurve);
                return this.importPrivateKey(asnKey, algorithm, extractable, keyUsages);
            }
            default:
                throw new OperationError("format: Must be 'jwk', 'raw', 'pkcs8' or 'spki'");
        }
    }
    static assertKeyParameters(parameters, namedCurve) {
        if (!parameters) {
            throw new CryptoError("Key info doesn't have required parameters");
        }
        let namedCurveIdentifier = "";
        try {
            namedCurveIdentifier = AsnParser.parse(parameters, index$1.ObjectIdentifier).value;
        }
        catch (e) {
            throw new CryptoError("Cannot read key info parameters");
        }
        if (getOidByNamedCurve$1(namedCurve) !== namedCurveIdentifier) {
            throw new CryptoError("Key info parameter doesn't match to named curve");
        }
    }
    static async importPrivateKey(asnKey, algorithm, extractable, keyUsages) {
        const keyInfo = new index$1.PrivateKeyInfo();
        keyInfo.privateKeyAlgorithm.algorithm = "1.2.840.10045.2.1";
        keyInfo.privateKeyAlgorithm.parameters = AsnSerializer.serialize(new index$1.ObjectIdentifier(getOidByNamedCurve$1(algorithm.namedCurve)));
        keyInfo.privateKey = AsnSerializer.serialize(asnKey);
        const key = new EcPrivateKey();
        key.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        key.algorithm = Object.assign({}, algorithm);
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
    }
    static async importPublicKey(asnKey, algorithm, extractable, keyUsages) {
        const keyInfo = new index$1.PublicKeyInfo();
        keyInfo.publicKeyAlgorithm.algorithm = "1.2.840.10045.2.1";
        const namedCurve = getOidByNamedCurve$1(algorithm.namedCurve);
        keyInfo.publicKeyAlgorithm.parameters = AsnSerializer.serialize(new index$1.ObjectIdentifier(namedCurve));
        keyInfo.publicKey = asnKey.value;
        const key = new EcPublicKey();
        key.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        key.algorithm = Object.assign({}, algorithm);
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
    }
    static getOpenSSLNamedCurve(curve) {
        switch (curve.toUpperCase()) {
            case "P-256":
                return "prime256v1";
            case "K-256":
                return "secp256k1";
            case "P-384":
                return "secp384r1";
            case "P-521":
                return "secp521r1";
            default:
                return curve;
        }
    }
}
EcCrypto.publicKeyUsages = ["verify"];
EcCrypto.privateKeyUsages = ["sign", "deriveKey", "deriveBits"];

class EcdsaProvider extends EcdsaProvider$1 {
    constructor() {
        super(...arguments);
        this.namedCurves = EcCurves.names;
        this.hashAlgorithms = [
            "SHA-1", "SHA-256", "SHA-384", "SHA-512",
            "shake128", "shake256",
            "SHA3-256", "SHA3-384", "SHA3-512"
        ];
    }
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await EcCrypto.generateKey({
            ...algorithm,
            name: this.name,
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    async onSign(algorithm, key, data) {
        return EcCrypto.sign(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onVerify(algorithm, key, signature, data) {
        return EcCrypto.verify(algorithm, getCryptoKey(key), new Uint8Array(signature), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return EcCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await EcCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        const internalKey = getCryptoKey(key);
        if (!(internalKey instanceof EcPrivateKey || internalKey instanceof EcPublicKey)) {
            throw new TypeError("key: Is not EC CryptoKey");
        }
    }
}

class EcdhProvider extends EcdhProvider$1 {
    constructor() {
        super(...arguments);
        this.namedCurves = EcCurves.names;
    }
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await EcCrypto.generateKey({
            ...algorithm,
            name: this.name,
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    async onExportKey(format, key) {
        return EcCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await EcCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        const internalKey = getCryptoKey(key);
        if (!(internalKey instanceof EcPrivateKey || internalKey instanceof EcPublicKey)) {
            throw new TypeError("key: Is not EC CryptoKey");
        }
    }
    async onDeriveBits(algorithm, baseKey, length) {
        const bits = await EcCrypto.deriveBits({ ...algorithm, public: getCryptoKey(algorithm.public) }, getCryptoKey(baseKey), length);
        return bits;
    }
}

const edOIDs = {
    [index$1.idEd448]: "Ed448",
    "ed448": index$1.idEd448,
    [index$1.idX448]: "X448",
    "x448": index$1.idX448,
    [index$1.idEd25519]: "Ed25519",
    "ed25519": index$1.idEd25519,
    [index$1.idX25519]: "X25519",
    "x25519": index$1.idX25519,
};
function getOidByNamedCurve(namedCurve) {
    const oid = edOIDs[namedCurve.toLowerCase()];
    if (!oid) {
        throw new OperationError(`Cannot convert WebCrypto named curve '${namedCurve}' to OID`);
    }
    return oid;
}

class EdPrivateKey extends AsymmetricKey {
    constructor() {
        super(...arguments);
        this.type = "private";
    }
    getKey() {
        const keyInfo = AsnParser.parse(this.data, index$1.PrivateKeyInfo);
        return AsnParser.parse(keyInfo.privateKey, index$1.CurvePrivateKey);
    }
    toJSON() {
        const key = this.getKey();
        const json = {
            kty: "OKP",
            crv: this.algorithm.namedCurve,
            key_ops: this.usages,
            ext: this.extractable,
        };
        return Object.assign(json, JsonSerializer.toJSON(key));
    }
    fromJSON(json) {
        if (!json.crv) {
            throw new OperationError(`Cannot get named curve from JWK. Property 'crv' is required`);
        }
        const keyInfo = new index$1.PrivateKeyInfo();
        keyInfo.privateKeyAlgorithm.algorithm = getOidByNamedCurve(json.crv);
        const key = JsonParser.fromJSON(json, { targetSchema: index$1.CurvePrivateKey });
        keyInfo.privateKey = AsnSerializer.serialize(key);
        this.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        return this;
    }
}

class EdPublicKey extends AsymmetricKey {
    constructor() {
        super(...arguments);
        this.type = "public";
    }
    getKey() {
        const keyInfo = AsnParser.parse(this.data, index$1.PublicKeyInfo);
        return keyInfo.publicKey;
    }
    toJSON() {
        const key = this.getKey();
        const json = {
            kty: "OKP",
            crv: this.algorithm.namedCurve,
            key_ops: this.usages,
            ext: this.extractable,
        };
        return Object.assign(json, {
            x: Convert.ToBase64Url(key)
        });
    }
    fromJSON(json) {
        if (!json.crv) {
            throw new OperationError(`Cannot get named curve from JWK. Property 'crv' is required`);
        }
        if (!json.x) {
            throw new OperationError(`Cannot get property from JWK. Property 'x' is required`);
        }
        const keyInfo = new index$1.PublicKeyInfo();
        keyInfo.publicKeyAlgorithm.algorithm = getOidByNamedCurve(json.crv);
        keyInfo.publicKey = Convert.FromBase64Url(json.x);
        this.data = Buffer.from(AsnSerializer.serialize(keyInfo));
        return this;
    }
}

class EdCrypto {
    static async generateKey(algorithm, extractable, keyUsages) {
        const privateKey = new EdPrivateKey();
        privateKey.algorithm = algorithm;
        privateKey.extractable = extractable;
        privateKey.usages = keyUsages.filter((usage) => this.privateKeyUsages.indexOf(usage) !== -1);
        const publicKey = new EdPublicKey();
        publicKey.algorithm = algorithm;
        publicKey.extractable = true;
        publicKey.usages = keyUsages.filter((usage) => this.publicKeyUsages.indexOf(usage) !== -1);
        const type = algorithm.namedCurve.toLowerCase();
        const keys = crypto__default__default.generateKeyPairSync(type, {
            publicKeyEncoding: {
                format: "der",
                type: "spki",
            },
            privateKeyEncoding: {
                format: "der",
                type: "pkcs8",
            },
        });
        privateKey.data = keys.privateKey;
        publicKey.data = keys.publicKey;
        const res = {
            privateKey,
            publicKey,
        };
        return res;
    }
    static async sign(algorithm, key, data) {
        if (!key.pem) {
            key.pem = `-----BEGIN PRIVATE KEY-----\n${key.data.toString("base64")}\n-----END PRIVATE KEY-----`;
        }
        const options = {
            key: key.pem,
        };
        const signature = crypto__default__default.sign(null, Buffer.from(data), options);
        return BufferSourceConverter.toArrayBuffer(signature);
    }
    static async verify(algorithm, key, signature, data) {
        if (!key.pem) {
            key.pem = `-----BEGIN PUBLIC KEY-----\n${key.data.toString("base64")}\n-----END PUBLIC KEY-----`;
        }
        const options = {
            key: key.pem,
        };
        const ok = crypto__default__default.verify(null, Buffer.from(data), options, Buffer.from(signature));
        return ok;
    }
    static async deriveBits(algorithm, baseKey, length) {
        const publicKey = crypto__default__default.createPublicKey({
            key: algorithm.public.data,
            format: "der",
            type: "spki",
        });
        const privateKey = crypto__default__default.createPrivateKey({
            key: baseKey.data,
            format: "der",
            type: "pkcs8",
        });
        const bits = crypto__default__default.diffieHellman({
            publicKey,
            privateKey,
        });
        return new Uint8Array(bits).buffer.slice(0, length >> 3);
    }
    static async exportKey(format, key) {
        switch (format.toLowerCase()) {
            case "jwk":
                return JsonSerializer.toJSON(key);
            case "pkcs8":
            case "spki":
                return new Uint8Array(key.data).buffer;
            case "raw": {
                const publicKeyInfo = AsnParser.parse(key.data, index$1.PublicKeyInfo);
                return publicKeyInfo.publicKey;
            }
            default:
                throw new OperationError("format: Must be 'jwk', 'raw', pkcs8' or 'spki'");
        }
    }
    static async importKey(format, keyData, algorithm, extractable, keyUsages) {
        switch (format.toLowerCase()) {
            case "jwk": {
                const jwk = keyData;
                if (jwk.d) {
                    const asnKey = JsonParser.fromJSON(keyData, { targetSchema: index$1.CurvePrivateKey });
                    return this.importPrivateKey(asnKey, algorithm, extractable, keyUsages);
                }
                else {
                    if (!jwk.x) {
                        throw new TypeError("keyData: Cannot get required 'x' filed");
                    }
                    return this.importPublicKey(Convert.FromBase64Url(jwk.x), algorithm, extractable, keyUsages);
                }
            }
            case "raw": {
                return this.importPublicKey(keyData, algorithm, extractable, keyUsages);
            }
            case "spki": {
                const keyInfo = AsnParser.parse(new Uint8Array(keyData), index$1.PublicKeyInfo);
                return this.importPublicKey(keyInfo.publicKey, algorithm, extractable, keyUsages);
            }
            case "pkcs8": {
                const keyInfo = AsnParser.parse(new Uint8Array(keyData), index$1.PrivateKeyInfo);
                const asnKey = AsnParser.parse(keyInfo.privateKey, index$1.CurvePrivateKey);
                return this.importPrivateKey(asnKey, algorithm, extractable, keyUsages);
            }
            default:
                throw new OperationError("format: Must be 'jwk', 'raw', 'pkcs8' or 'spki'");
        }
    }
    static importPrivateKey(asnKey, algorithm, extractable, keyUsages) {
        const key = new EdPrivateKey();
        key.fromJSON({
            crv: algorithm.namedCurve,
            d: Convert.ToBase64Url(asnKey.d),
        });
        key.algorithm = Object.assign({}, algorithm);
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
    }
    static async importPublicKey(asnKey, algorithm, extractable, keyUsages) {
        const key = new EdPublicKey();
        key.fromJSON({
            crv: algorithm.namedCurve,
            x: Convert.ToBase64Url(asnKey),
        });
        key.algorithm = Object.assign({}, algorithm);
        key.extractable = extractable;
        key.usages = keyUsages;
        return key;
    }
}
EdCrypto.publicKeyUsages = ["verify"];
EdCrypto.privateKeyUsages = ["sign", "deriveKey", "deriveBits"];

class EdDsaProvider extends EdDsaProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await EdCrypto.generateKey({
            name: this.name,
            namedCurve: algorithm.namedCurve.replace(/^ed/i, "Ed"),
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    async onSign(algorithm, key, data) {
        return EdCrypto.sign(algorithm, getCryptoKey(key), new Uint8Array(data));
    }
    async onVerify(algorithm, key, signature, data) {
        return EdCrypto.verify(algorithm, getCryptoKey(key), new Uint8Array(signature), new Uint8Array(data));
    }
    async onExportKey(format, key) {
        return EdCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await EdCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
}

class EcdhEsProvider extends EcdhEsProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const keys = await EdCrypto.generateKey({
            name: this.name,
            namedCurve: algorithm.namedCurve.toUpperCase(),
        }, extractable, keyUsages);
        return {
            privateKey: setCryptoKey(keys.privateKey),
            publicKey: setCryptoKey(keys.publicKey),
        };
    }
    async onDeriveBits(algorithm, baseKey, length) {
        const bits = await EdCrypto.deriveBits({ ...algorithm, public: getCryptoKey(algorithm.public) }, getCryptoKey(baseKey), length);
        return bits;
    }
    async onExportKey(format, key) {
        return EdCrypto.exportKey(format, getCryptoKey(key));
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        const key = await EdCrypto.importKey(format, keyData, { ...algorithm, name: this.name }, extractable, keyUsages);
        return setCryptoKey(key);
    }
}

class PbkdfCryptoKey extends CryptoKey {
}

class Pbkdf2Provider extends Pbkdf2Provider$1 {
    async onDeriveBits(algorithm, baseKey, length) {
        return new Promise((resolve, reject) => {
            const salt = BufferSourceConverter.toArrayBuffer(algorithm.salt);
            const hash = algorithm.hash.name.replace("-", "");
            crypto__default__default.pbkdf2(getCryptoKey(baseKey).data, Buffer.from(salt), algorithm.iterations, length >> 3, hash, (err, derivedBits) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(new Uint8Array(derivedBits).buffer);
                }
            });
        });
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        if (format === "raw") {
            const key = new PbkdfCryptoKey();
            key.data = Buffer.from(keyData);
            key.algorithm = { name: this.name };
            key.extractable = false;
            key.usages = keyUsages;
            return setCryptoKey(key);
        }
        throw new OperationError("format: Must be 'raw'");
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof PbkdfCryptoKey)) {
            throw new TypeError("key: Is not PBKDF CryptoKey");
        }
    }
}

class HmacCryptoKey extends CryptoKey {
    get alg() {
        const hash = this.algorithm.hash.name.toUpperCase();
        return `HS${hash.replace("SHA-", "")}`;
    }
    set alg(value) {
    }
}
__decorate([
    JsonProp({ name: "k", converter: JsonBase64UrlConverter })
], HmacCryptoKey.prototype, "data", void 0);

class HmacProvider extends HmacProvider$1 {
    async onGenerateKey(algorithm, extractable, keyUsages) {
        const length = (algorithm.length || this.getDefaultLength(algorithm.hash.name)) >> 3 << 3;
        const key = new HmacCryptoKey();
        key.algorithm = {
            ...algorithm,
            length,
            name: this.name,
        };
        key.extractable = extractable;
        key.usages = keyUsages;
        key.data = crypto__default__default.randomBytes(length >> 3);
        return setCryptoKey(key);
    }
    async onSign(algorithm, key, data) {
        const cryptoAlg = ShaCrypto.getAlgorithmName(key.algorithm.hash);
        const hmac = crypto__default__default.createHmac(cryptoAlg, getCryptoKey(key).data)
            .update(Buffer.from(data)).digest();
        return new Uint8Array(hmac).buffer;
    }
    async onVerify(algorithm, key, signature, data) {
        const cryptoAlg = ShaCrypto.getAlgorithmName(key.algorithm.hash);
        const hmac = crypto__default__default.createHmac(cryptoAlg, getCryptoKey(key).data)
            .update(Buffer.from(data)).digest();
        return hmac.compare(Buffer.from(signature)) === 0;
    }
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        let key;
        switch (format.toLowerCase()) {
            case "jwk":
                key = JsonParser.fromJSON(keyData, { targetSchema: HmacCryptoKey });
                break;
            case "raw":
                key = new HmacCryptoKey();
                key.data = Buffer.from(keyData);
                break;
            default:
                throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
        key.algorithm = {
            hash: { name: algorithm.hash.name },
            name: this.name,
            length: key.data.length << 3,
        };
        key.extractable = extractable;
        key.usages = keyUsages;
        return setCryptoKey(key);
    }
    async onExportKey(format, key) {
        switch (format.toLowerCase()) {
            case "jwk":
                return JsonSerializer.toJSON(getCryptoKey(key));
            case "raw":
                return new Uint8Array(getCryptoKey(key).data).buffer;
            default:
                throw new OperationError("format: Must be 'jwk' or 'raw'");
        }
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof HmacCryptoKey)) {
            throw new TypeError("key: Is not HMAC CryptoKey");
        }
    }
}

class HkdfCryptoKey extends CryptoKey {
}

class HkdfProvider extends HkdfProvider$1 {
    async onImportKey(format, keyData, algorithm, extractable, keyUsages) {
        if (format.toLowerCase() !== "raw") {
            throw new OperationError("Operation not supported");
        }
        const key = new HkdfCryptoKey();
        key.data = Buffer.from(keyData);
        key.algorithm = { name: this.name };
        key.extractable = extractable;
        key.usages = keyUsages;
        return setCryptoKey(key);
    }
    async onDeriveBits(params, baseKey, length) {
        const hash = params.hash.name.replace("-", "");
        const hashLength = crypto__default__default.createHash(hash).digest().length;
        const byteLength = length / 8;
        const info = BufferSourceConverter.toUint8Array(params.info);
        const PRK = crypto__default__default.createHmac(hash, BufferSourceConverter.toUint8Array(params.salt))
            .update(BufferSourceConverter.toUint8Array(getCryptoKey(baseKey).data))
            .digest();
        const blocks = [Buffer.alloc(0)];
        const blockCount = Math.ceil(byteLength / hashLength) + 1;
        for (let i = 1; i < blockCount; ++i) {
            blocks.push(crypto__default__default.createHmac(hash, PRK)
                .update(Buffer.concat([blocks[i - 1], info, Buffer.from([i])]))
                .digest());
        }
        return Buffer.concat(blocks).slice(0, byteLength);
    }
    checkCryptoKey(key, keyUsage) {
        super.checkCryptoKey(key, keyUsage);
        if (!(getCryptoKey(key) instanceof HkdfCryptoKey)) {
            throw new TypeError("key: Is not HKDF CryptoKey");
        }
    }
}

class ShakeCrypto {
    static digest(algorithm, data) {
        const hash = crypto__default__default.createHash(algorithm.name.toLowerCase(), { outputLength: algorithm.length })
            .update(Buffer.from(data)).digest();
        return new Uint8Array(hash).buffer;
    }
}

class Shake128Provider extends Shake128Provider$1 {
    async onDigest(algorithm, data) {
        return ShakeCrypto.digest(algorithm, data);
    }
}

class Shake256Provider extends Shake256Provider$1 {
    async onDigest(algorithm, data) {
        return ShakeCrypto.digest(algorithm, data);
    }
}

class SubtleCrypto extends SubtleCrypto$1 {
    constructor() {
        var _a;
        super();
        this.providers.set(new AesCbcProvider());
        this.providers.set(new AesCtrProvider());
        this.providers.set(new AesGcmProvider());
        this.providers.set(new AesCmacProvider());
        this.providers.set(new AesKwProvider());
        this.providers.set(new AesEcbProvider());
        this.providers.set(new DesCbcProvider());
        this.providers.set(new DesEde3CbcProvider());
        this.providers.set(new RsaSsaProvider());
        this.providers.set(new RsaPssProvider());
        this.providers.set(new RsaOaepProvider());
        this.providers.set(new RsaEsProvider());
        this.providers.set(new EcdsaProvider());
        this.providers.set(new EcdhProvider());
        this.providers.set(new Sha1Provider());
        this.providers.set(new Sha256Provider());
        this.providers.set(new Sha384Provider());
        this.providers.set(new Sha512Provider());
        this.providers.set(new Pbkdf2Provider());
        this.providers.set(new HmacProvider());
        this.providers.set(new HkdfProvider());
        const nodeMajorVersion = (_a = /^v(\d+)/.exec(process$1.version)) === null || _a === void 0 ? void 0 : _a[1];
        if (nodeMajorVersion && parseInt(nodeMajorVersion, 10) >= 12) {
            this.providers.set(new Shake128Provider());
            this.providers.set(new Shake256Provider());
        }
        const hashes = crypto__default.getHashes();
        if (hashes.includes("sha3-256")) {
            this.providers.set(new Sha3256Provider());
        }
        if (hashes.includes("sha3-384")) {
            this.providers.set(new Sha3384Provider());
        }
        if (hashes.includes("sha3-512")) {
            this.providers.set(new Sha3512Provider());
        }
        if (nodeMajorVersion && parseInt(nodeMajorVersion, 10) >= 14) {
            this.providers.set(new EdDsaProvider());
            this.providers.set(new EcdhEsProvider());
        }
    }
}

class Crypto extends Crypto$1 {
    constructor() {
        super(...arguments);
        this.subtle = new SubtleCrypto();
    }
    getRandomValues(array) {
        if (!ArrayBuffer.isView(array)) {
            throw new TypeError("Failed to execute 'getRandomValues' on 'Crypto': parameter 1 is not of type 'ArrayBufferView'");
        }
        const buffer = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
        crypto__default__default.randomFillSync(buffer);
        return array;
    }
}

var webcrypto_es = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Crypto: Crypto,
	CryptoKey: CryptoKey$1
});

var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(webcrypto_es);

/* eslint-disable @typescript-eslint/no-var-requires */

var crypto$1;
var hasRequiredCrypto;

function requireCrypto () {
	if (hasRequiredCrypto) return crypto$1;
	hasRequiredCrypto = 1;
	let webcrypto;
	try {
	  webcrypto = require('node:crypto').webcrypto;
	  if (!webcrypto) {
	    webcrypto = new (require$$1$1.Crypto)();
	  }
	} catch (e) {
	  webcrypto = new (require$$1$1.Crypto)();
	}

	crypto$1 = webcrypto;
	return crypto$1;
}

var cryptoExports = requireCrypto();
var crypto = /*@__PURE__*/getDefaultExportFromCjs(cryptoExports);

var fetch$1 = {exports: {}};

var dist = {};

var nodeFetchNative_8afd3fea = {};

var hasRequiredNodeFetchNative_8afd3fea;

function requireNodeFetchNative_8afd3fea () {
	if (hasRequiredNodeFetchNative_8afd3fea) return nodeFetchNative_8afd3fea;
	hasRequiredNodeFetchNative_8afd3fea = 1;
	(function (exports) {

		const http = require$$0;
		const https = require$$1$2;
		const zlib = require$$2;
		const Stream = require$$3;
		const node_buffer = require$$4;
		const node_util = require$$5;
		const node_url = require$$6;
		const node_net = require$$7;



		/**
		 * Returns a `Buffer` instance from the given data URI `uri`.
		 *
		 * @param {String} uri Data URI to turn into a Buffer instance
		 * @returns {Buffer} Buffer instance from Data URI
		 * @api public
		 */
		function dataUriToBuffer(uri) {
		    if (!/^data:/i.test(uri)) {
		        throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
		    }
		    // strip newlines
		    uri = uri.replace(/\r?\n/g, '');
		    // split the URI up into the "metadata" and the "data" portions
		    const firstComma = uri.indexOf(',');
		    if (firstComma === -1 || firstComma <= 4) {
		        throw new TypeError('malformed data: URI');
		    }
		    // remove the "data:" scheme and parse the metadata
		    const meta = uri.substring(5, firstComma).split(';');
		    let charset = '';
		    let base64 = false;
		    const type = meta[0] || 'text/plain';
		    let typeFull = type;
		    for (let i = 1; i < meta.length; i++) {
		        if (meta[i] === 'base64') {
		            base64 = true;
		        }
		        else {
		            typeFull += `;${meta[i]}`;
		            if (meta[i].indexOf('charset=') === 0) {
		                charset = meta[i].substring(8);
		            }
		        }
		    }
		    // defaults to US-ASCII only if type is not provided
		    if (!meta[0] && !charset.length) {
		        typeFull += ';charset=US-ASCII';
		        charset = 'US-ASCII';
		    }
		    // get the encoded data portion and decode URI-encoded chars
		    const encoding = base64 ? 'base64' : 'ascii';
		    const data = unescape(uri.substring(firstComma + 1));
		    const buffer = Buffer.from(data, encoding);
		    // set `.type` and `.typeFull` properties to MIME type
		    buffer.type = type;
		    buffer.typeFull = typeFull;
		    // set the `.charset` property
		    buffer.charset = charset;
		    return buffer;
		}

		var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

		var ponyfill_es2018 = {exports: {}};

		/**
		 * web-streams-polyfill v3.2.1
		 */

		var hasRequiredPonyfill_es2018;

		function requirePonyfill_es2018 () {
			if (hasRequiredPonyfill_es2018) return ponyfill_es2018.exports;
			hasRequiredPonyfill_es2018 = 1;
			(function (module, exports) {
				(function (global, factory) {
				    factory(exports) ;
				}(commonjsGlobal$1, (function (exports) {
				    /// <reference lib="es2015.symbol" />
				    const SymbolPolyfill = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ?
				        Symbol :
				        description => `Symbol(${description})`;

				    /// <reference lib="dom" />
				    function noop() {
				        return undefined;
				    }
				    function getGlobals() {
				        if (typeof self !== 'undefined') {
				            return self;
				        }
				        else if (typeof window !== 'undefined') {
				            return window;
				        }
				        else if (typeof commonjsGlobal$1 !== 'undefined') {
				            return commonjsGlobal$1;
				        }
				        return undefined;
				    }
				    const globals = getGlobals();

				    function typeIsObject(x) {
				        return (typeof x === 'object' && x !== null) || typeof x === 'function';
				    }
				    const rethrowAssertionErrorRejection = noop;

				    const originalPromise = Promise;
				    const originalPromiseThen = Promise.prototype.then;
				    const originalPromiseResolve = Promise.resolve.bind(originalPromise);
				    const originalPromiseReject = Promise.reject.bind(originalPromise);
				    function newPromise(executor) {
				        return new originalPromise(executor);
				    }
				    function promiseResolvedWith(value) {
				        return originalPromiseResolve(value);
				    }
				    function promiseRejectedWith(reason) {
				        return originalPromiseReject(reason);
				    }
				    function PerformPromiseThen(promise, onFulfilled, onRejected) {
				        // There doesn't appear to be any way to correctly emulate the behaviour from JavaScript, so this is just an
				        // approximation.
				        return originalPromiseThen.call(promise, onFulfilled, onRejected);
				    }
				    function uponPromise(promise, onFulfilled, onRejected) {
				        PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), undefined, rethrowAssertionErrorRejection);
				    }
				    function uponFulfillment(promise, onFulfilled) {
				        uponPromise(promise, onFulfilled);
				    }
				    function uponRejection(promise, onRejected) {
				        uponPromise(promise, undefined, onRejected);
				    }
				    function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
				        return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
				    }
				    function setPromiseIsHandledToTrue(promise) {
				        PerformPromiseThen(promise, undefined, rethrowAssertionErrorRejection);
				    }
				    const queueMicrotask = (() => {
				        const globalQueueMicrotask = globals && globals.queueMicrotask;
				        if (typeof globalQueueMicrotask === 'function') {
				            return globalQueueMicrotask;
				        }
				        const resolvedPromise = promiseResolvedWith(undefined);
				        return (fn) => PerformPromiseThen(resolvedPromise, fn);
				    })();
				    function reflectCall(F, V, args) {
				        if (typeof F !== 'function') {
				            throw new TypeError('Argument is not a function');
				        }
				        return Function.prototype.apply.call(F, V, args);
				    }
				    function promiseCall(F, V, args) {
				        try {
				            return promiseResolvedWith(reflectCall(F, V, args));
				        }
				        catch (value) {
				            return promiseRejectedWith(value);
				        }
				    }

				    // Original from Chromium
				    // https://chromium.googlesource.com/chromium/src/+/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/core/streams/SimpleQueue.js
				    const QUEUE_MAX_ARRAY_SIZE = 16384;
				    /**
				     * Simple queue structure.
				     *
				     * Avoids scalability issues with using a packed array directly by using
				     * multiple arrays in a linked list and keeping the array size bounded.
				     */
				    class SimpleQueue {
				        constructor() {
				            this._cursor = 0;
				            this._size = 0;
				            // _front and _back are always defined.
				            this._front = {
				                _elements: [],
				                _next: undefined
				            };
				            this._back = this._front;
				            // The cursor is used to avoid calling Array.shift().
				            // It contains the index of the front element of the array inside the
				            // front-most node. It is always in the range [0, QUEUE_MAX_ARRAY_SIZE).
				            this._cursor = 0;
				            // When there is only one node, size === elements.length - cursor.
				            this._size = 0;
				        }
				        get length() {
				            return this._size;
				        }
				        // For exception safety, this method is structured in order:
				        // 1. Read state
				        // 2. Calculate required state mutations
				        // 3. Perform state mutations
				        push(element) {
				            const oldBack = this._back;
				            let newBack = oldBack;
				            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
				                newBack = {
				                    _elements: [],
				                    _next: undefined
				                };
				            }
				            // push() is the mutation most likely to throw an exception, so it
				            // goes first.
				            oldBack._elements.push(element);
				            if (newBack !== oldBack) {
				                this._back = newBack;
				                oldBack._next = newBack;
				            }
				            ++this._size;
				        }
				        // Like push(), shift() follows the read -> calculate -> mutate pattern for
				        // exception safety.
				        shift() { // must not be called on an empty queue
				            const oldFront = this._front;
				            let newFront = oldFront;
				            const oldCursor = this._cursor;
				            let newCursor = oldCursor + 1;
				            const elements = oldFront._elements;
				            const element = elements[oldCursor];
				            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
				                newFront = oldFront._next;
				                newCursor = 0;
				            }
				            // No mutations before this point.
				            --this._size;
				            this._cursor = newCursor;
				            if (oldFront !== newFront) {
				                this._front = newFront;
				            }
				            // Permit shifted element to be garbage collected.
				            elements[oldCursor] = undefined;
				            return element;
				        }
				        // The tricky thing about forEach() is that it can be called
				        // re-entrantly. The queue may be mutated inside the callback. It is easy to
				        // see that push() within the callback has no negative effects since the end
				        // of the queue is checked for on every iteration. If shift() is called
				        // repeatedly within the callback then the next iteration may return an
				        // element that has been removed. In this case the callback will be called
				        // with undefined values until we either "catch up" with elements that still
				        // exist or reach the back of the queue.
				        forEach(callback) {
				            let i = this._cursor;
				            let node = this._front;
				            let elements = node._elements;
				            while (i !== elements.length || node._next !== undefined) {
				                if (i === elements.length) {
				                    node = node._next;
				                    elements = node._elements;
				                    i = 0;
				                    if (elements.length === 0) {
				                        break;
				                    }
				                }
				                callback(elements[i]);
				                ++i;
				            }
				        }
				        // Return the element that would be returned if shift() was called now,
				        // without modifying the queue.
				        peek() { // must not be called on an empty queue
				            const front = this._front;
				            const cursor = this._cursor;
				            return front._elements[cursor];
				        }
				    }

				    function ReadableStreamReaderGenericInitialize(reader, stream) {
				        reader._ownerReadableStream = stream;
				        stream._reader = reader;
				        if (stream._state === 'readable') {
				            defaultReaderClosedPromiseInitialize(reader);
				        }
				        else if (stream._state === 'closed') {
				            defaultReaderClosedPromiseInitializeAsResolved(reader);
				        }
				        else {
				            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
				        }
				    }
				    // A client of ReadableStreamDefaultReader and ReadableStreamBYOBReader may use these functions directly to bypass state
				    // check.
				    function ReadableStreamReaderGenericCancel(reader, reason) {
				        const stream = reader._ownerReadableStream;
				        return ReadableStreamCancel(stream, reason);
				    }
				    function ReadableStreamReaderGenericRelease(reader) {
				        if (reader._ownerReadableStream._state === 'readable') {
				            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
				        }
				        else {
				            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
				        }
				        reader._ownerReadableStream._reader = undefined;
				        reader._ownerReadableStream = undefined;
				    }
				    // Helper functions for the readers.
				    function readerLockException(name) {
				        return new TypeError('Cannot ' + name + ' a stream using a released reader');
				    }
				    // Helper functions for the ReadableStreamDefaultReader.
				    function defaultReaderClosedPromiseInitialize(reader) {
				        reader._closedPromise = newPromise((resolve, reject) => {
				            reader._closedPromise_resolve = resolve;
				            reader._closedPromise_reject = reject;
				        });
				    }
				    function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
				        defaultReaderClosedPromiseInitialize(reader);
				        defaultReaderClosedPromiseReject(reader, reason);
				    }
				    function defaultReaderClosedPromiseInitializeAsResolved(reader) {
				        defaultReaderClosedPromiseInitialize(reader);
				        defaultReaderClosedPromiseResolve(reader);
				    }
				    function defaultReaderClosedPromiseReject(reader, reason) {
				        if (reader._closedPromise_reject === undefined) {
				            return;
				        }
				        setPromiseIsHandledToTrue(reader._closedPromise);
				        reader._closedPromise_reject(reason);
				        reader._closedPromise_resolve = undefined;
				        reader._closedPromise_reject = undefined;
				    }
				    function defaultReaderClosedPromiseResetToRejected(reader, reason) {
				        defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
				    }
				    function defaultReaderClosedPromiseResolve(reader) {
				        if (reader._closedPromise_resolve === undefined) {
				            return;
				        }
				        reader._closedPromise_resolve(undefined);
				        reader._closedPromise_resolve = undefined;
				        reader._closedPromise_reject = undefined;
				    }

				    const AbortSteps = SymbolPolyfill('[[AbortSteps]]');
				    const ErrorSteps = SymbolPolyfill('[[ErrorSteps]]');
				    const CancelSteps = SymbolPolyfill('[[CancelSteps]]');
				    const PullSteps = SymbolPolyfill('[[PullSteps]]');

				    /// <reference lib="es2015.core" />
				    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite#Polyfill
				    const NumberIsFinite = Number.isFinite || function (x) {
				        return typeof x === 'number' && isFinite(x);
				    };

				    /// <reference lib="es2015.core" />
				    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc#Polyfill
				    const MathTrunc = Math.trunc || function (v) {
				        return v < 0 ? Math.ceil(v) : Math.floor(v);
				    };

				    // https://heycam.github.io/webidl/#idl-dictionaries
				    function isDictionary(x) {
				        return typeof x === 'object' || typeof x === 'function';
				    }
				    function assertDictionary(obj, context) {
				        if (obj !== undefined && !isDictionary(obj)) {
				            throw new TypeError(`${context} is not an object.`);
				        }
				    }
				    // https://heycam.github.io/webidl/#idl-callback-functions
				    function assertFunction(x, context) {
				        if (typeof x !== 'function') {
				            throw new TypeError(`${context} is not a function.`);
				        }
				    }
				    // https://heycam.github.io/webidl/#idl-object
				    function isObject(x) {
				        return (typeof x === 'object' && x !== null) || typeof x === 'function';
				    }
				    function assertObject(x, context) {
				        if (!isObject(x)) {
				            throw new TypeError(`${context} is not an object.`);
				        }
				    }
				    function assertRequiredArgument(x, position, context) {
				        if (x === undefined) {
				            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
				        }
				    }
				    function assertRequiredField(x, field, context) {
				        if (x === undefined) {
				            throw new TypeError(`${field} is required in '${context}'.`);
				        }
				    }
				    // https://heycam.github.io/webidl/#idl-unrestricted-double
				    function convertUnrestrictedDouble(value) {
				        return Number(value);
				    }
				    function censorNegativeZero(x) {
				        return x === 0 ? 0 : x;
				    }
				    function integerPart(x) {
				        return censorNegativeZero(MathTrunc(x));
				    }
				    // https://heycam.github.io/webidl/#idl-unsigned-long-long
				    function convertUnsignedLongLongWithEnforceRange(value, context) {
				        const lowerBound = 0;
				        const upperBound = Number.MAX_SAFE_INTEGER;
				        let x = Number(value);
				        x = censorNegativeZero(x);
				        if (!NumberIsFinite(x)) {
				            throw new TypeError(`${context} is not a finite number`);
				        }
				        x = integerPart(x);
				        if (x < lowerBound || x > upperBound) {
				            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
				        }
				        if (!NumberIsFinite(x) || x === 0) {
				            return 0;
				        }
				        // TODO Use BigInt if supported?
				        // let xBigInt = BigInt(integerPart(x));
				        // xBigInt = BigInt.asUintN(64, xBigInt);
				        // return Number(xBigInt);
				        return x;
				    }

				    function assertReadableStream(x, context) {
				        if (!IsReadableStream(x)) {
				            throw new TypeError(`${context} is not a ReadableStream.`);
				        }
				    }

				    // Abstract operations for the ReadableStream.
				    function AcquireReadableStreamDefaultReader(stream) {
				        return new ReadableStreamDefaultReader(stream);
				    }
				    // ReadableStream API exposed for controllers.
				    function ReadableStreamAddReadRequest(stream, readRequest) {
				        stream._reader._readRequests.push(readRequest);
				    }
				    function ReadableStreamFulfillReadRequest(stream, chunk, done) {
				        const reader = stream._reader;
				        const readRequest = reader._readRequests.shift();
				        if (done) {
				            readRequest._closeSteps();
				        }
				        else {
				            readRequest._chunkSteps(chunk);
				        }
				    }
				    function ReadableStreamGetNumReadRequests(stream) {
				        return stream._reader._readRequests.length;
				    }
				    function ReadableStreamHasDefaultReader(stream) {
				        const reader = stream._reader;
				        if (reader === undefined) {
				            return false;
				        }
				        if (!IsReadableStreamDefaultReader(reader)) {
				            return false;
				        }
				        return true;
				    }
				    /**
				     * A default reader vended by a {@link ReadableStream}.
				     *
				     * @public
				     */
				    class ReadableStreamDefaultReader {
				        constructor(stream) {
				            assertRequiredArgument(stream, 1, 'ReadableStreamDefaultReader');
				            assertReadableStream(stream, 'First parameter');
				            if (IsReadableStreamLocked(stream)) {
				                throw new TypeError('This stream has already been locked for exclusive reading by another reader');
				            }
				            ReadableStreamReaderGenericInitialize(this, stream);
				            this._readRequests = new SimpleQueue();
				        }
				        /**
				         * Returns a promise that will be fulfilled when the stream becomes closed,
				         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
				         */
				        get closed() {
				            if (!IsReadableStreamDefaultReader(this)) {
				                return promiseRejectedWith(defaultReaderBrandCheckException('closed'));
				            }
				            return this._closedPromise;
				        }
				        /**
				         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
				         */
				        cancel(reason = undefined) {
				            if (!IsReadableStreamDefaultReader(this)) {
				                return promiseRejectedWith(defaultReaderBrandCheckException('cancel'));
				            }
				            if (this._ownerReadableStream === undefined) {
				                return promiseRejectedWith(readerLockException('cancel'));
				            }
				            return ReadableStreamReaderGenericCancel(this, reason);
				        }
				        /**
				         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
				         *
				         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
				         */
				        read() {
				            if (!IsReadableStreamDefaultReader(this)) {
				                return promiseRejectedWith(defaultReaderBrandCheckException('read'));
				            }
				            if (this._ownerReadableStream === undefined) {
				                return promiseRejectedWith(readerLockException('read from'));
				            }
				            let resolvePromise;
				            let rejectPromise;
				            const promise = newPromise((resolve, reject) => {
				                resolvePromise = resolve;
				                rejectPromise = reject;
				            });
				            const readRequest = {
				                _chunkSteps: chunk => resolvePromise({ value: chunk, done: false }),
				                _closeSteps: () => resolvePromise({ value: undefined, done: true }),
				                _errorSteps: e => rejectPromise(e)
				            };
				            ReadableStreamDefaultReaderRead(this, readRequest);
				            return promise;
				        }
				        /**
				         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
				         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
				         * from now on; otherwise, the reader will appear closed.
				         *
				         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
				         * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
				         * do so will throw a `TypeError` and leave the reader locked to the stream.
				         */
				        releaseLock() {
				            if (!IsReadableStreamDefaultReader(this)) {
				                throw defaultReaderBrandCheckException('releaseLock');
				            }
				            if (this._ownerReadableStream === undefined) {
				                return;
				            }
				            if (this._readRequests.length > 0) {
				                throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
				            }
				            ReadableStreamReaderGenericRelease(this);
				        }
				    }
				    Object.defineProperties(ReadableStreamDefaultReader.prototype, {
				        cancel: { enumerable: true },
				        read: { enumerable: true },
				        releaseLock: { enumerable: true },
				        closed: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
				            value: 'ReadableStreamDefaultReader',
				            configurable: true
				        });
				    }
				    // Abstract operations for the readers.
				    function IsReadableStreamDefaultReader(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_readRequests')) {
				            return false;
				        }
				        return x instanceof ReadableStreamDefaultReader;
				    }
				    function ReadableStreamDefaultReaderRead(reader, readRequest) {
				        const stream = reader._ownerReadableStream;
				        stream._disturbed = true;
				        if (stream._state === 'closed') {
				            readRequest._closeSteps();
				        }
				        else if (stream._state === 'errored') {
				            readRequest._errorSteps(stream._storedError);
				        }
				        else {
				            stream._readableStreamController[PullSteps](readRequest);
				        }
				    }
				    // Helper functions for the ReadableStreamDefaultReader.
				    function defaultReaderBrandCheckException(name) {
				        return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
				    }

				    /// <reference lib="es2018.asynciterable" />
				    /* eslint-disable @typescript-eslint/no-empty-function */
				    const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () { }).prototype);

				    /// <reference lib="es2018.asynciterable" />
				    class ReadableStreamAsyncIteratorImpl {
				        constructor(reader, preventCancel) {
				            this._ongoingPromise = undefined;
				            this._isFinished = false;
				            this._reader = reader;
				            this._preventCancel = preventCancel;
				        }
				        next() {
				            const nextSteps = () => this._nextSteps();
				            this._ongoingPromise = this._ongoingPromise ?
				                transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) :
				                nextSteps();
				            return this._ongoingPromise;
				        }
				        return(value) {
				            const returnSteps = () => this._returnSteps(value);
				            return this._ongoingPromise ?
				                transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) :
				                returnSteps();
				        }
				        _nextSteps() {
				            if (this._isFinished) {
				                return Promise.resolve({ value: undefined, done: true });
				            }
				            const reader = this._reader;
				            if (reader._ownerReadableStream === undefined) {
				                return promiseRejectedWith(readerLockException('iterate'));
				            }
				            let resolvePromise;
				            let rejectPromise;
				            const promise = newPromise((resolve, reject) => {
				                resolvePromise = resolve;
				                rejectPromise = reject;
				            });
				            const readRequest = {
				                _chunkSteps: chunk => {
				                    this._ongoingPromise = undefined;
				                    // This needs to be delayed by one microtask, otherwise we stop pulling too early which breaks a test.
				                    // FIXME Is this a bug in the specification, or in the test?
				                    queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
				                },
				                _closeSteps: () => {
				                    this._ongoingPromise = undefined;
				                    this._isFinished = true;
				                    ReadableStreamReaderGenericRelease(reader);
				                    resolvePromise({ value: undefined, done: true });
				                },
				                _errorSteps: reason => {
				                    this._ongoingPromise = undefined;
				                    this._isFinished = true;
				                    ReadableStreamReaderGenericRelease(reader);
				                    rejectPromise(reason);
				                }
				            };
				            ReadableStreamDefaultReaderRead(reader, readRequest);
				            return promise;
				        }
				        _returnSteps(value) {
				            if (this._isFinished) {
				                return Promise.resolve({ value, done: true });
				            }
				            this._isFinished = true;
				            const reader = this._reader;
				            if (reader._ownerReadableStream === undefined) {
				                return promiseRejectedWith(readerLockException('finish iterating'));
				            }
				            if (!this._preventCancel) {
				                const result = ReadableStreamReaderGenericCancel(reader, value);
				                ReadableStreamReaderGenericRelease(reader);
				                return transformPromiseWith(result, () => ({ value, done: true }));
				            }
				            ReadableStreamReaderGenericRelease(reader);
				            return promiseResolvedWith({ value, done: true });
				        }
				    }
				    const ReadableStreamAsyncIteratorPrototype = {
				        next() {
				            if (!IsReadableStreamAsyncIterator(this)) {
				                return promiseRejectedWith(streamAsyncIteratorBrandCheckException('next'));
				            }
				            return this._asyncIteratorImpl.next();
				        },
				        return(value) {
				            if (!IsReadableStreamAsyncIterator(this)) {
				                return promiseRejectedWith(streamAsyncIteratorBrandCheckException('return'));
				            }
				            return this._asyncIteratorImpl.return(value);
				        }
				    };
				    if (AsyncIteratorPrototype !== undefined) {
				        Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
				    }
				    // Abstract operations for the ReadableStream.
				    function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
				        const reader = AcquireReadableStreamDefaultReader(stream);
				        const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
				        const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
				        iterator._asyncIteratorImpl = impl;
				        return iterator;
				    }
				    function IsReadableStreamAsyncIterator(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_asyncIteratorImpl')) {
				            return false;
				        }
				        try {
				            // noinspection SuspiciousTypeOfGuard
				            return x._asyncIteratorImpl instanceof
				                ReadableStreamAsyncIteratorImpl;
				        }
				        catch (_a) {
				            return false;
				        }
				    }
				    // Helper functions for the ReadableStream.
				    function streamAsyncIteratorBrandCheckException(name) {
				        return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
				    }

				    /// <reference lib="es2015.core" />
				    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Polyfill
				    const NumberIsNaN = Number.isNaN || function (x) {
				        // eslint-disable-next-line no-self-compare
				        return x !== x;
				    };

				    function CreateArrayFromList(elements) {
				        // We use arrays to represent lists, so this is basically a no-op.
				        // Do a slice though just in case we happen to depend on the unique-ness.
				        return elements.slice();
				    }
				    function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
				        new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
				    }
				    // Not implemented correctly
				    function TransferArrayBuffer(O) {
				        return O;
				    }
				    // Not implemented correctly
				    // eslint-disable-next-line @typescript-eslint/no-unused-vars
				    function IsDetachedBuffer(O) {
				        return false;
				    }
				    function ArrayBufferSlice(buffer, begin, end) {
				        // ArrayBuffer.prototype.slice is not available on IE10
				        // https://www.caniuse.com/mdn-javascript_builtins_arraybuffer_slice
				        if (buffer.slice) {
				            return buffer.slice(begin, end);
				        }
				        const length = end - begin;
				        const slice = new ArrayBuffer(length);
				        CopyDataBlockBytes(slice, 0, buffer, begin, length);
				        return slice;
				    }

				    function IsNonNegativeNumber(v) {
				        if (typeof v !== 'number') {
				            return false;
				        }
				        if (NumberIsNaN(v)) {
				            return false;
				        }
				        if (v < 0) {
				            return false;
				        }
				        return true;
				    }
				    function CloneAsUint8Array(O) {
				        const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
				        return new Uint8Array(buffer);
				    }

				    function DequeueValue(container) {
				        const pair = container._queue.shift();
				        container._queueTotalSize -= pair.size;
				        if (container._queueTotalSize < 0) {
				            container._queueTotalSize = 0;
				        }
				        return pair.value;
				    }
				    function EnqueueValueWithSize(container, value, size) {
				        if (!IsNonNegativeNumber(size) || size === Infinity) {
				            throw new RangeError('Size must be a finite, non-NaN, non-negative number.');
				        }
				        container._queue.push({ value, size });
				        container._queueTotalSize += size;
				    }
				    function PeekQueueValue(container) {
				        const pair = container._queue.peek();
				        return pair.value;
				    }
				    function ResetQueue(container) {
				        container._queue = new SimpleQueue();
				        container._queueTotalSize = 0;
				    }

				    /**
				     * A pull-into request in a {@link ReadableByteStreamController}.
				     *
				     * @public
				     */
				    class ReadableStreamBYOBRequest {
				        constructor() {
				            throw new TypeError('Illegal constructor');
				        }
				        /**
				         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
				         */
				        get view() {
				            if (!IsReadableStreamBYOBRequest(this)) {
				                throw byobRequestBrandCheckException('view');
				            }
				            return this._view;
				        }
				        respond(bytesWritten) {
				            if (!IsReadableStreamBYOBRequest(this)) {
				                throw byobRequestBrandCheckException('respond');
				            }
				            assertRequiredArgument(bytesWritten, 1, 'respond');
				            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, 'First parameter');
				            if (this._associatedReadableByteStreamController === undefined) {
				                throw new TypeError('This BYOB request has been invalidated');
				            }
				            if (IsDetachedBuffer(this._view.buffer)) ;
				            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
				        }
				        respondWithNewView(view) {
				            if (!IsReadableStreamBYOBRequest(this)) {
				                throw byobRequestBrandCheckException('respondWithNewView');
				            }
				            assertRequiredArgument(view, 1, 'respondWithNewView');
				            if (!ArrayBuffer.isView(view)) {
				                throw new TypeError('You can only respond with array buffer views');
				            }
				            if (this._associatedReadableByteStreamController === undefined) {
				                throw new TypeError('This BYOB request has been invalidated');
				            }
				            if (IsDetachedBuffer(view.buffer)) ;
				            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
				        }
				    }
				    Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
				        respond: { enumerable: true },
				        respondWithNewView: { enumerable: true },
				        view: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
				            value: 'ReadableStreamBYOBRequest',
				            configurable: true
				        });
				    }
				    /**
				     * Allows control of a {@link ReadableStream | readable byte stream}'s state and internal queue.
				     *
				     * @public
				     */
				    class ReadableByteStreamController {
				        constructor() {
				            throw new TypeError('Illegal constructor');
				        }
				        /**
				         * Returns the current BYOB pull request, or `null` if there isn't one.
				         */
				        get byobRequest() {
				            if (!IsReadableByteStreamController(this)) {
				                throw byteStreamControllerBrandCheckException('byobRequest');
				            }
				            return ReadableByteStreamControllerGetBYOBRequest(this);
				        }
				        /**
				         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
				         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
				         */
				        get desiredSize() {
				            if (!IsReadableByteStreamController(this)) {
				                throw byteStreamControllerBrandCheckException('desiredSize');
				            }
				            return ReadableByteStreamControllerGetDesiredSize(this);
				        }
				        /**
				         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
				         * the stream, but once those are read, the stream will become closed.
				         */
				        close() {
				            if (!IsReadableByteStreamController(this)) {
				                throw byteStreamControllerBrandCheckException('close');
				            }
				            if (this._closeRequested) {
				                throw new TypeError('The stream has already been closed; do not close it again!');
				            }
				            const state = this._controlledReadableByteStream._state;
				            if (state !== 'readable') {
				                throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
				            }
				            ReadableByteStreamControllerClose(this);
				        }
				        enqueue(chunk) {
				            if (!IsReadableByteStreamController(this)) {
				                throw byteStreamControllerBrandCheckException('enqueue');
				            }
				            assertRequiredArgument(chunk, 1, 'enqueue');
				            if (!ArrayBuffer.isView(chunk)) {
				                throw new TypeError('chunk must be an array buffer view');
				            }
				            if (chunk.byteLength === 0) {
				                throw new TypeError('chunk must have non-zero byteLength');
				            }
				            if (chunk.buffer.byteLength === 0) {
				                throw new TypeError(`chunk's buffer must have non-zero byteLength`);
				            }
				            if (this._closeRequested) {
				                throw new TypeError('stream is closed or draining');
				            }
				            const state = this._controlledReadableByteStream._state;
				            if (state !== 'readable') {
				                throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
				            }
				            ReadableByteStreamControllerEnqueue(this, chunk);
				        }
				        /**
				         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
				         */
				        error(e = undefined) {
				            if (!IsReadableByteStreamController(this)) {
				                throw byteStreamControllerBrandCheckException('error');
				            }
				            ReadableByteStreamControllerError(this, e);
				        }
				        /** @internal */
				        [CancelSteps](reason) {
				            ReadableByteStreamControllerClearPendingPullIntos(this);
				            ResetQueue(this);
				            const result = this._cancelAlgorithm(reason);
				            ReadableByteStreamControllerClearAlgorithms(this);
				            return result;
				        }
				        /** @internal */
				        [PullSteps](readRequest) {
				            const stream = this._controlledReadableByteStream;
				            if (this._queueTotalSize > 0) {
				                const entry = this._queue.shift();
				                this._queueTotalSize -= entry.byteLength;
				                ReadableByteStreamControllerHandleQueueDrain(this);
				                const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
				                readRequest._chunkSteps(view);
				                return;
				            }
				            const autoAllocateChunkSize = this._autoAllocateChunkSize;
				            if (autoAllocateChunkSize !== undefined) {
				                let buffer;
				                try {
				                    buffer = new ArrayBuffer(autoAllocateChunkSize);
				                }
				                catch (bufferE) {
				                    readRequest._errorSteps(bufferE);
				                    return;
				                }
				                const pullIntoDescriptor = {
				                    buffer,
				                    bufferByteLength: autoAllocateChunkSize,
				                    byteOffset: 0,
				                    byteLength: autoAllocateChunkSize,
				                    bytesFilled: 0,
				                    elementSize: 1,
				                    viewConstructor: Uint8Array,
				                    readerType: 'default'
				                };
				                this._pendingPullIntos.push(pullIntoDescriptor);
				            }
				            ReadableStreamAddReadRequest(stream, readRequest);
				            ReadableByteStreamControllerCallPullIfNeeded(this);
				        }
				    }
				    Object.defineProperties(ReadableByteStreamController.prototype, {
				        close: { enumerable: true },
				        enqueue: { enumerable: true },
				        error: { enumerable: true },
				        byobRequest: { enumerable: true },
				        desiredSize: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
				            value: 'ReadableByteStreamController',
				            configurable: true
				        });
				    }
				    // Abstract operations for the ReadableByteStreamController.
				    function IsReadableByteStreamController(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableByteStream')) {
				            return false;
				        }
				        return x instanceof ReadableByteStreamController;
				    }
				    function IsReadableStreamBYOBRequest(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_associatedReadableByteStreamController')) {
				            return false;
				        }
				        return x instanceof ReadableStreamBYOBRequest;
				    }
				    function ReadableByteStreamControllerCallPullIfNeeded(controller) {
				        const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
				        if (!shouldPull) {
				            return;
				        }
				        if (controller._pulling) {
				            controller._pullAgain = true;
				            return;
				        }
				        controller._pulling = true;
				        // TODO: Test controller argument
				        const pullPromise = controller._pullAlgorithm();
				        uponPromise(pullPromise, () => {
				            controller._pulling = false;
				            if (controller._pullAgain) {
				                controller._pullAgain = false;
				                ReadableByteStreamControllerCallPullIfNeeded(controller);
				            }
				        }, e => {
				            ReadableByteStreamControllerError(controller, e);
				        });
				    }
				    function ReadableByteStreamControllerClearPendingPullIntos(controller) {
				        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
				        controller._pendingPullIntos = new SimpleQueue();
				    }
				    function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
				        let done = false;
				        if (stream._state === 'closed') {
				            done = true;
				        }
				        const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
				        if (pullIntoDescriptor.readerType === 'default') {
				            ReadableStreamFulfillReadRequest(stream, filledView, done);
				        }
				        else {
				            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
				        }
				    }
				    function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
				        const bytesFilled = pullIntoDescriptor.bytesFilled;
				        const elementSize = pullIntoDescriptor.elementSize;
				        return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
				    }
				    function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
				        controller._queue.push({ buffer, byteOffset, byteLength });
				        controller._queueTotalSize += byteLength;
				    }
				    function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
				        const elementSize = pullIntoDescriptor.elementSize;
				        const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
				        const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
				        const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
				        const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
				        let totalBytesToCopyRemaining = maxBytesToCopy;
				        let ready = false;
				        if (maxAlignedBytes > currentAlignedBytes) {
				            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
				            ready = true;
				        }
				        const queue = controller._queue;
				        while (totalBytesToCopyRemaining > 0) {
				            const headOfQueue = queue.peek();
				            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
				            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
				            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
				            if (headOfQueue.byteLength === bytesToCopy) {
				                queue.shift();
				            }
				            else {
				                headOfQueue.byteOffset += bytesToCopy;
				                headOfQueue.byteLength -= bytesToCopy;
				            }
				            controller._queueTotalSize -= bytesToCopy;
				            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
				            totalBytesToCopyRemaining -= bytesToCopy;
				        }
				        return ready;
				    }
				    function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
				        pullIntoDescriptor.bytesFilled += size;
				    }
				    function ReadableByteStreamControllerHandleQueueDrain(controller) {
				        if (controller._queueTotalSize === 0 && controller._closeRequested) {
				            ReadableByteStreamControllerClearAlgorithms(controller);
				            ReadableStreamClose(controller._controlledReadableByteStream);
				        }
				        else {
				            ReadableByteStreamControllerCallPullIfNeeded(controller);
				        }
				    }
				    function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
				        if (controller._byobRequest === null) {
				            return;
				        }
				        controller._byobRequest._associatedReadableByteStreamController = undefined;
				        controller._byobRequest._view = null;
				        controller._byobRequest = null;
				    }
				    function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
				        while (controller._pendingPullIntos.length > 0) {
				            if (controller._queueTotalSize === 0) {
				                return;
				            }
				            const pullIntoDescriptor = controller._pendingPullIntos.peek();
				            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
				                ReadableByteStreamControllerShiftPendingPullInto(controller);
				                ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
				            }
				        }
				    }
				    function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
				        const stream = controller._controlledReadableByteStream;
				        let elementSize = 1;
				        if (view.constructor !== DataView) {
				            elementSize = view.constructor.BYTES_PER_ELEMENT;
				        }
				        const ctor = view.constructor;
				        // try {
				        const buffer = TransferArrayBuffer(view.buffer);
				        // } catch (e) {
				        //   readIntoRequest._errorSteps(e);
				        //   return;
				        // }
				        const pullIntoDescriptor = {
				            buffer,
				            bufferByteLength: buffer.byteLength,
				            byteOffset: view.byteOffset,
				            byteLength: view.byteLength,
				            bytesFilled: 0,
				            elementSize,
				            viewConstructor: ctor,
				            readerType: 'byob'
				        };
				        if (controller._pendingPullIntos.length > 0) {
				            controller._pendingPullIntos.push(pullIntoDescriptor);
				            // No ReadableByteStreamControllerCallPullIfNeeded() call since:
				            // - No change happens on desiredSize
				            // - The source has already been notified of that there's at least 1 pending read(view)
				            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
				            return;
				        }
				        if (stream._state === 'closed') {
				            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
				            readIntoRequest._closeSteps(emptyView);
				            return;
				        }
				        if (controller._queueTotalSize > 0) {
				            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
				                const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
				                ReadableByteStreamControllerHandleQueueDrain(controller);
				                readIntoRequest._chunkSteps(filledView);
				                return;
				            }
				            if (controller._closeRequested) {
				                const e = new TypeError('Insufficient bytes to fill elements in the given buffer');
				                ReadableByteStreamControllerError(controller, e);
				                readIntoRequest._errorSteps(e);
				                return;
				            }
				        }
				        controller._pendingPullIntos.push(pullIntoDescriptor);
				        ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
				        ReadableByteStreamControllerCallPullIfNeeded(controller);
				    }
				    function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
				        const stream = controller._controlledReadableByteStream;
				        if (ReadableStreamHasBYOBReader(stream)) {
				            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
				                const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
				                ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
				            }
				        }
				    }
				    function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
				        ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
				        if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
				            return;
				        }
				        ReadableByteStreamControllerShiftPendingPullInto(controller);
				        const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
				        if (remainderSize > 0) {
				            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
				            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
				            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
				        }
				        pullIntoDescriptor.bytesFilled -= remainderSize;
				        ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
				        ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
				    }
				    function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
				        const firstDescriptor = controller._pendingPullIntos.peek();
				        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
				        const state = controller._controlledReadableByteStream._state;
				        if (state === 'closed') {
				            ReadableByteStreamControllerRespondInClosedState(controller);
				        }
				        else {
				            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
				        }
				        ReadableByteStreamControllerCallPullIfNeeded(controller);
				    }
				    function ReadableByteStreamControllerShiftPendingPullInto(controller) {
				        const descriptor = controller._pendingPullIntos.shift();
				        return descriptor;
				    }
				    function ReadableByteStreamControllerShouldCallPull(controller) {
				        const stream = controller._controlledReadableByteStream;
				        if (stream._state !== 'readable') {
				            return false;
				        }
				        if (controller._closeRequested) {
				            return false;
				        }
				        if (!controller._started) {
				            return false;
				        }
				        if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
				            return true;
				        }
				        if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
				            return true;
				        }
				        const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
				        if (desiredSize > 0) {
				            return true;
				        }
				        return false;
				    }
				    function ReadableByteStreamControllerClearAlgorithms(controller) {
				        controller._pullAlgorithm = undefined;
				        controller._cancelAlgorithm = undefined;
				    }
				    // A client of ReadableByteStreamController may use these functions directly to bypass state check.
				    function ReadableByteStreamControllerClose(controller) {
				        const stream = controller._controlledReadableByteStream;
				        if (controller._closeRequested || stream._state !== 'readable') {
				            return;
				        }
				        if (controller._queueTotalSize > 0) {
				            controller._closeRequested = true;
				            return;
				        }
				        if (controller._pendingPullIntos.length > 0) {
				            const firstPendingPullInto = controller._pendingPullIntos.peek();
				            if (firstPendingPullInto.bytesFilled > 0) {
				                const e = new TypeError('Insufficient bytes to fill elements in the given buffer');
				                ReadableByteStreamControllerError(controller, e);
				                throw e;
				            }
				        }
				        ReadableByteStreamControllerClearAlgorithms(controller);
				        ReadableStreamClose(stream);
				    }
				    function ReadableByteStreamControllerEnqueue(controller, chunk) {
				        const stream = controller._controlledReadableByteStream;
				        if (controller._closeRequested || stream._state !== 'readable') {
				            return;
				        }
				        const buffer = chunk.buffer;
				        const byteOffset = chunk.byteOffset;
				        const byteLength = chunk.byteLength;
				        const transferredBuffer = TransferArrayBuffer(buffer);
				        if (controller._pendingPullIntos.length > 0) {
				            const firstPendingPullInto = controller._pendingPullIntos.peek();
				            if (IsDetachedBuffer(firstPendingPullInto.buffer)) ;
				            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
				        }
				        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
				        if (ReadableStreamHasDefaultReader(stream)) {
				            if (ReadableStreamGetNumReadRequests(stream) === 0) {
				                ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
				            }
				            else {
				                if (controller._pendingPullIntos.length > 0) {
				                    ReadableByteStreamControllerShiftPendingPullInto(controller);
				                }
				                const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
				                ReadableStreamFulfillReadRequest(stream, transferredView, false);
				            }
				        }
				        else if (ReadableStreamHasBYOBReader(stream)) {
				            // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
				            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
				            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
				        }
				        else {
				            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
				        }
				        ReadableByteStreamControllerCallPullIfNeeded(controller);
				    }
				    function ReadableByteStreamControllerError(controller, e) {
				        const stream = controller._controlledReadableByteStream;
				        if (stream._state !== 'readable') {
				            return;
				        }
				        ReadableByteStreamControllerClearPendingPullIntos(controller);
				        ResetQueue(controller);
				        ReadableByteStreamControllerClearAlgorithms(controller);
				        ReadableStreamError(stream, e);
				    }
				    function ReadableByteStreamControllerGetBYOBRequest(controller) {
				        if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
				            const firstDescriptor = controller._pendingPullIntos.peek();
				            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
				            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
				            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
				            controller._byobRequest = byobRequest;
				        }
				        return controller._byobRequest;
				    }
				    function ReadableByteStreamControllerGetDesiredSize(controller) {
				        const state = controller._controlledReadableByteStream._state;
				        if (state === 'errored') {
				            return null;
				        }
				        if (state === 'closed') {
				            return 0;
				        }
				        return controller._strategyHWM - controller._queueTotalSize;
				    }
				    function ReadableByteStreamControllerRespond(controller, bytesWritten) {
				        const firstDescriptor = controller._pendingPullIntos.peek();
				        const state = controller._controlledReadableByteStream._state;
				        if (state === 'closed') {
				            if (bytesWritten !== 0) {
				                throw new TypeError('bytesWritten must be 0 when calling respond() on a closed stream');
				            }
				        }
				        else {
				            if (bytesWritten === 0) {
				                throw new TypeError('bytesWritten must be greater than 0 when calling respond() on a readable stream');
				            }
				            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
				                throw new RangeError('bytesWritten out of range');
				            }
				        }
				        firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
				        ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
				    }
				    function ReadableByteStreamControllerRespondWithNewView(controller, view) {
				        const firstDescriptor = controller._pendingPullIntos.peek();
				        const state = controller._controlledReadableByteStream._state;
				        if (state === 'closed') {
				            if (view.byteLength !== 0) {
				                throw new TypeError('The view\'s length must be 0 when calling respondWithNewView() on a closed stream');
				            }
				        }
				        else {
				            if (view.byteLength === 0) {
				                throw new TypeError('The view\'s length must be greater than 0 when calling respondWithNewView() on a readable stream');
				            }
				        }
				        if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
				            throw new RangeError('The region specified by view does not match byobRequest');
				        }
				        if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
				            throw new RangeError('The buffer of view has different capacity than byobRequest');
				        }
				        if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
				            throw new RangeError('The region specified by view is larger than byobRequest');
				        }
				        const viewByteLength = view.byteLength;
				        firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
				        ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
				    }
				    function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
				        controller._controlledReadableByteStream = stream;
				        controller._pullAgain = false;
				        controller._pulling = false;
				        controller._byobRequest = null;
				        // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
				        controller._queue = controller._queueTotalSize = undefined;
				        ResetQueue(controller);
				        controller._closeRequested = false;
				        controller._started = false;
				        controller._strategyHWM = highWaterMark;
				        controller._pullAlgorithm = pullAlgorithm;
				        controller._cancelAlgorithm = cancelAlgorithm;
				        controller._autoAllocateChunkSize = autoAllocateChunkSize;
				        controller._pendingPullIntos = new SimpleQueue();
				        stream._readableStreamController = controller;
				        const startResult = startAlgorithm();
				        uponPromise(promiseResolvedWith(startResult), () => {
				            controller._started = true;
				            ReadableByteStreamControllerCallPullIfNeeded(controller);
				        }, r => {
				            ReadableByteStreamControllerError(controller, r);
				        });
				    }
				    function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
				        const controller = Object.create(ReadableByteStreamController.prototype);
				        let startAlgorithm = () => undefined;
				        let pullAlgorithm = () => promiseResolvedWith(undefined);
				        let cancelAlgorithm = () => promiseResolvedWith(undefined);
				        if (underlyingByteSource.start !== undefined) {
				            startAlgorithm = () => underlyingByteSource.start(controller);
				        }
				        if (underlyingByteSource.pull !== undefined) {
				            pullAlgorithm = () => underlyingByteSource.pull(controller);
				        }
				        if (underlyingByteSource.cancel !== undefined) {
				            cancelAlgorithm = reason => underlyingByteSource.cancel(reason);
				        }
				        const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
				        if (autoAllocateChunkSize === 0) {
				            throw new TypeError('autoAllocateChunkSize must be greater than 0');
				        }
				        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
				    }
				    function SetUpReadableStreamBYOBRequest(request, controller, view) {
				        request._associatedReadableByteStreamController = controller;
				        request._view = view;
				    }
				    // Helper functions for the ReadableStreamBYOBRequest.
				    function byobRequestBrandCheckException(name) {
				        return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
				    }
				    // Helper functions for the ReadableByteStreamController.
				    function byteStreamControllerBrandCheckException(name) {
				        return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
				    }

				    // Abstract operations for the ReadableStream.
				    function AcquireReadableStreamBYOBReader(stream) {
				        return new ReadableStreamBYOBReader(stream);
				    }
				    // ReadableStream API exposed for controllers.
				    function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
				        stream._reader._readIntoRequests.push(readIntoRequest);
				    }
				    function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
				        const reader = stream._reader;
				        const readIntoRequest = reader._readIntoRequests.shift();
				        if (done) {
				            readIntoRequest._closeSteps(chunk);
				        }
				        else {
				            readIntoRequest._chunkSteps(chunk);
				        }
				    }
				    function ReadableStreamGetNumReadIntoRequests(stream) {
				        return stream._reader._readIntoRequests.length;
				    }
				    function ReadableStreamHasBYOBReader(stream) {
				        const reader = stream._reader;
				        if (reader === undefined) {
				            return false;
				        }
				        if (!IsReadableStreamBYOBReader(reader)) {
				            return false;
				        }
				        return true;
				    }
				    /**
				     * A BYOB reader vended by a {@link ReadableStream}.
				     *
				     * @public
				     */
				    class ReadableStreamBYOBReader {
				        constructor(stream) {
				            assertRequiredArgument(stream, 1, 'ReadableStreamBYOBReader');
				            assertReadableStream(stream, 'First parameter');
				            if (IsReadableStreamLocked(stream)) {
				                throw new TypeError('This stream has already been locked for exclusive reading by another reader');
				            }
				            if (!IsReadableByteStreamController(stream._readableStreamController)) {
				                throw new TypeError('Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte ' +
				                    'source');
				            }
				            ReadableStreamReaderGenericInitialize(this, stream);
				            this._readIntoRequests = new SimpleQueue();
				        }
				        /**
				         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
				         * the reader's lock is released before the stream finishes closing.
				         */
				        get closed() {
				            if (!IsReadableStreamBYOBReader(this)) {
				                return promiseRejectedWith(byobReaderBrandCheckException('closed'));
				            }
				            return this._closedPromise;
				        }
				        /**
				         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
				         */
				        cancel(reason = undefined) {
				            if (!IsReadableStreamBYOBReader(this)) {
				                return promiseRejectedWith(byobReaderBrandCheckException('cancel'));
				            }
				            if (this._ownerReadableStream === undefined) {
				                return promiseRejectedWith(readerLockException('cancel'));
				            }
				            return ReadableStreamReaderGenericCancel(this, reason);
				        }
				        /**
				         * Attempts to reads bytes into view, and returns a promise resolved with the result.
				         *
				         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
				         */
				        read(view) {
				            if (!IsReadableStreamBYOBReader(this)) {
				                return promiseRejectedWith(byobReaderBrandCheckException('read'));
				            }
				            if (!ArrayBuffer.isView(view)) {
				                return promiseRejectedWith(new TypeError('view must be an array buffer view'));
				            }
				            if (view.byteLength === 0) {
				                return promiseRejectedWith(new TypeError('view must have non-zero byteLength'));
				            }
				            if (view.buffer.byteLength === 0) {
				                return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
				            }
				            if (IsDetachedBuffer(view.buffer)) ;
				            if (this._ownerReadableStream === undefined) {
				                return promiseRejectedWith(readerLockException('read from'));
				            }
				            let resolvePromise;
				            let rejectPromise;
				            const promise = newPromise((resolve, reject) => {
				                resolvePromise = resolve;
				                rejectPromise = reject;
				            });
				            const readIntoRequest = {
				                _chunkSteps: chunk => resolvePromise({ value: chunk, done: false }),
				                _closeSteps: chunk => resolvePromise({ value: chunk, done: true }),
				                _errorSteps: e => rejectPromise(e)
				            };
				            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
				            return promise;
				        }
				        /**
				         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
				         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
				         * from now on; otherwise, the reader will appear closed.
				         *
				         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
				         * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
				         * do so will throw a `TypeError` and leave the reader locked to the stream.
				         */
				        releaseLock() {
				            if (!IsReadableStreamBYOBReader(this)) {
				                throw byobReaderBrandCheckException('releaseLock');
				            }
				            if (this._ownerReadableStream === undefined) {
				                return;
				            }
				            if (this._readIntoRequests.length > 0) {
				                throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
				            }
				            ReadableStreamReaderGenericRelease(this);
				        }
				    }
				    Object.defineProperties(ReadableStreamBYOBReader.prototype, {
				        cancel: { enumerable: true },
				        read: { enumerable: true },
				        releaseLock: { enumerable: true },
				        closed: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
				            value: 'ReadableStreamBYOBReader',
				            configurable: true
				        });
				    }
				    // Abstract operations for the readers.
				    function IsReadableStreamBYOBReader(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_readIntoRequests')) {
				            return false;
				        }
				        return x instanceof ReadableStreamBYOBReader;
				    }
				    function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
				        const stream = reader._ownerReadableStream;
				        stream._disturbed = true;
				        if (stream._state === 'errored') {
				            readIntoRequest._errorSteps(stream._storedError);
				        }
				        else {
				            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
				        }
				    }
				    // Helper functions for the ReadableStreamBYOBReader.
				    function byobReaderBrandCheckException(name) {
				        return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
				    }

				    function ExtractHighWaterMark(strategy, defaultHWM) {
				        const { highWaterMark } = strategy;
				        if (highWaterMark === undefined) {
				            return defaultHWM;
				        }
				        if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
				            throw new RangeError('Invalid highWaterMark');
				        }
				        return highWaterMark;
				    }
				    function ExtractSizeAlgorithm(strategy) {
				        const { size } = strategy;
				        if (!size) {
				            return () => 1;
				        }
				        return size;
				    }

				    function convertQueuingStrategy(init, context) {
				        assertDictionary(init, context);
				        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
				        const size = init === null || init === void 0 ? void 0 : init.size;
				        return {
				            highWaterMark: highWaterMark === undefined ? undefined : convertUnrestrictedDouble(highWaterMark),
				            size: size === undefined ? undefined : convertQueuingStrategySize(size, `${context} has member 'size' that`)
				        };
				    }
				    function convertQueuingStrategySize(fn, context) {
				        assertFunction(fn, context);
				        return chunk => convertUnrestrictedDouble(fn(chunk));
				    }

				    function convertUnderlyingSink(original, context) {
				        assertDictionary(original, context);
				        const abort = original === null || original === void 0 ? void 0 : original.abort;
				        const close = original === null || original === void 0 ? void 0 : original.close;
				        const start = original === null || original === void 0 ? void 0 : original.start;
				        const type = original === null || original === void 0 ? void 0 : original.type;
				        const write = original === null || original === void 0 ? void 0 : original.write;
				        return {
				            abort: abort === undefined ?
				                undefined :
				                convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
				            close: close === undefined ?
				                undefined :
				                convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
				            start: start === undefined ?
				                undefined :
				                convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
				            write: write === undefined ?
				                undefined :
				                convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
				            type
				        };
				    }
				    function convertUnderlyingSinkAbortCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (reason) => promiseCall(fn, original, [reason]);
				    }
				    function convertUnderlyingSinkCloseCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return () => promiseCall(fn, original, []);
				    }
				    function convertUnderlyingSinkStartCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (controller) => reflectCall(fn, original, [controller]);
				    }
				    function convertUnderlyingSinkWriteCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
				    }

				    function assertWritableStream(x, context) {
				        if (!IsWritableStream(x)) {
				            throw new TypeError(`${context} is not a WritableStream.`);
				        }
				    }

				    function isAbortSignal(value) {
				        if (typeof value !== 'object' || value === null) {
				            return false;
				        }
				        try {
				            return typeof value.aborted === 'boolean';
				        }
				        catch (_a) {
				            // AbortSignal.prototype.aborted throws if its brand check fails
				            return false;
				        }
				    }
				    const supportsAbortController = typeof AbortController === 'function';
				    /**
				     * Construct a new AbortController, if supported by the platform.
				     *
				     * @internal
				     */
				    function createAbortController() {
				        if (supportsAbortController) {
				            return new AbortController();
				        }
				        return undefined;
				    }

				    /**
				     * A writable stream represents a destination for data, into which you can write.
				     *
				     * @public
				     */
				    class WritableStream {
				        constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
				            if (rawUnderlyingSink === undefined) {
				                rawUnderlyingSink = null;
				            }
				            else {
				                assertObject(rawUnderlyingSink, 'First parameter');
				            }
				            const strategy = convertQueuingStrategy(rawStrategy, 'Second parameter');
				            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, 'First parameter');
				            InitializeWritableStream(this);
				            const type = underlyingSink.type;
				            if (type !== undefined) {
				                throw new RangeError('Invalid type is specified');
				            }
				            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
				            const highWaterMark = ExtractHighWaterMark(strategy, 1);
				            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
				        }
				        /**
				         * Returns whether or not the writable stream is locked to a writer.
				         */
				        get locked() {
				            if (!IsWritableStream(this)) {
				                throw streamBrandCheckException$2('locked');
				            }
				            return IsWritableStreamLocked(this);
				        }
				        /**
				         * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
				         * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
				         * mechanism of the underlying sink.
				         *
				         * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
				         * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
				         * the stream) if the stream is currently locked.
				         */
				        abort(reason = undefined) {
				            if (!IsWritableStream(this)) {
				                return promiseRejectedWith(streamBrandCheckException$2('abort'));
				            }
				            if (IsWritableStreamLocked(this)) {
				                return promiseRejectedWith(new TypeError('Cannot abort a stream that already has a writer'));
				            }
				            return WritableStreamAbort(this, reason);
				        }
				        /**
				         * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
				         * close behavior. During this time any further attempts to write will fail (without erroring the stream).
				         *
				         * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
				         * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
				         * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
				         */
				        close() {
				            if (!IsWritableStream(this)) {
				                return promiseRejectedWith(streamBrandCheckException$2('close'));
				            }
				            if (IsWritableStreamLocked(this)) {
				                return promiseRejectedWith(new TypeError('Cannot close a stream that already has a writer'));
				            }
				            if (WritableStreamCloseQueuedOrInFlight(this)) {
				                return promiseRejectedWith(new TypeError('Cannot close an already-closing stream'));
				            }
				            return WritableStreamClose(this);
				        }
				        /**
				         * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
				         * is locked, no other writer can be acquired until this one is released.
				         *
				         * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
				         * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
				         * the same time, which would cause the resulting written data to be unpredictable and probably useless.
				         */
				        getWriter() {
				            if (!IsWritableStream(this)) {
				                throw streamBrandCheckException$2('getWriter');
				            }
				            return AcquireWritableStreamDefaultWriter(this);
				        }
				    }
				    Object.defineProperties(WritableStream.prototype, {
				        abort: { enumerable: true },
				        close: { enumerable: true },
				        getWriter: { enumerable: true },
				        locked: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
				            value: 'WritableStream',
				            configurable: true
				        });
				    }
				    // Abstract operations for the WritableStream.
				    function AcquireWritableStreamDefaultWriter(stream) {
				        return new WritableStreamDefaultWriter(stream);
				    }
				    // Throws if and only if startAlgorithm throws.
				    function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
				        const stream = Object.create(WritableStream.prototype);
				        InitializeWritableStream(stream);
				        const controller = Object.create(WritableStreamDefaultController.prototype);
				        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
				        return stream;
				    }
				    function InitializeWritableStream(stream) {
				        stream._state = 'writable';
				        // The error that will be reported by new method calls once the state becomes errored. Only set when [[state]] is
				        // 'erroring' or 'errored'. May be set to an undefined value.
				        stream._storedError = undefined;
				        stream._writer = undefined;
				        // Initialize to undefined first because the constructor of the controller checks this
				        // variable to validate the caller.
				        stream._writableStreamController = undefined;
				        // This queue is placed here instead of the writer class in order to allow for passing a writer to the next data
				        // producer without waiting for the queued writes to finish.
				        stream._writeRequests = new SimpleQueue();
				        // Write requests are removed from _writeRequests when write() is called on the underlying sink. This prevents
				        // them from being erroneously rejected on error. If a write() call is in-flight, the request is stored here.
				        stream._inFlightWriteRequest = undefined;
				        // The promise that was returned from writer.close(). Stored here because it may be fulfilled after the writer
				        // has been detached.
				        stream._closeRequest = undefined;
				        // Close request is removed from _closeRequest when close() is called on the underlying sink. This prevents it
				        // from being erroneously rejected on error. If a close() call is in-flight, the request is stored here.
				        stream._inFlightCloseRequest = undefined;
				        // The promise that was returned from writer.abort(). This may also be fulfilled after the writer has detached.
				        stream._pendingAbortRequest = undefined;
				        // The backpressure signal set by the controller.
				        stream._backpressure = false;
				    }
				    function IsWritableStream(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_writableStreamController')) {
				            return false;
				        }
				        return x instanceof WritableStream;
				    }
				    function IsWritableStreamLocked(stream) {
				        if (stream._writer === undefined) {
				            return false;
				        }
				        return true;
				    }
				    function WritableStreamAbort(stream, reason) {
				        var _a;
				        if (stream._state === 'closed' || stream._state === 'errored') {
				            return promiseResolvedWith(undefined);
				        }
				        stream._writableStreamController._abortReason = reason;
				        (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
				        // TypeScript narrows the type of `stream._state` down to 'writable' | 'erroring',
				        // but it doesn't know that signaling abort runs author code that might have changed the state.
				        // Widen the type again by casting to WritableStreamState.
				        const state = stream._state;
				        if (state === 'closed' || state === 'errored') {
				            return promiseResolvedWith(undefined);
				        }
				        if (stream._pendingAbortRequest !== undefined) {
				            return stream._pendingAbortRequest._promise;
				        }
				        let wasAlreadyErroring = false;
				        if (state === 'erroring') {
				            wasAlreadyErroring = true;
				            // reason will not be used, so don't keep a reference to it.
				            reason = undefined;
				        }
				        const promise = newPromise((resolve, reject) => {
				            stream._pendingAbortRequest = {
				                _promise: undefined,
				                _resolve: resolve,
				                _reject: reject,
				                _reason: reason,
				                _wasAlreadyErroring: wasAlreadyErroring
				            };
				        });
				        stream._pendingAbortRequest._promise = promise;
				        if (!wasAlreadyErroring) {
				            WritableStreamStartErroring(stream, reason);
				        }
				        return promise;
				    }
				    function WritableStreamClose(stream) {
				        const state = stream._state;
				        if (state === 'closed' || state === 'errored') {
				            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
				        }
				        const promise = newPromise((resolve, reject) => {
				            const closeRequest = {
				                _resolve: resolve,
				                _reject: reject
				            };
				            stream._closeRequest = closeRequest;
				        });
				        const writer = stream._writer;
				        if (writer !== undefined && stream._backpressure && state === 'writable') {
				            defaultWriterReadyPromiseResolve(writer);
				        }
				        WritableStreamDefaultControllerClose(stream._writableStreamController);
				        return promise;
				    }
				    // WritableStream API exposed for controllers.
				    function WritableStreamAddWriteRequest(stream) {
				        const promise = newPromise((resolve, reject) => {
				            const writeRequest = {
				                _resolve: resolve,
				                _reject: reject
				            };
				            stream._writeRequests.push(writeRequest);
				        });
				        return promise;
				    }
				    function WritableStreamDealWithRejection(stream, error) {
				        const state = stream._state;
				        if (state === 'writable') {
				            WritableStreamStartErroring(stream, error);
				            return;
				        }
				        WritableStreamFinishErroring(stream);
				    }
				    function WritableStreamStartErroring(stream, reason) {
				        const controller = stream._writableStreamController;
				        stream._state = 'erroring';
				        stream._storedError = reason;
				        const writer = stream._writer;
				        if (writer !== undefined) {
				            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
				        }
				        if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
				            WritableStreamFinishErroring(stream);
				        }
				    }
				    function WritableStreamFinishErroring(stream) {
				        stream._state = 'errored';
				        stream._writableStreamController[ErrorSteps]();
				        const storedError = stream._storedError;
				        stream._writeRequests.forEach(writeRequest => {
				            writeRequest._reject(storedError);
				        });
				        stream._writeRequests = new SimpleQueue();
				        if (stream._pendingAbortRequest === undefined) {
				            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				            return;
				        }
				        const abortRequest = stream._pendingAbortRequest;
				        stream._pendingAbortRequest = undefined;
				        if (abortRequest._wasAlreadyErroring) {
				            abortRequest._reject(storedError);
				            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				            return;
				        }
				        const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
				        uponPromise(promise, () => {
				            abortRequest._resolve();
				            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				        }, (reason) => {
				            abortRequest._reject(reason);
				            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				        });
				    }
				    function WritableStreamFinishInFlightWrite(stream) {
				        stream._inFlightWriteRequest._resolve(undefined);
				        stream._inFlightWriteRequest = undefined;
				    }
				    function WritableStreamFinishInFlightWriteWithError(stream, error) {
				        stream._inFlightWriteRequest._reject(error);
				        stream._inFlightWriteRequest = undefined;
				        WritableStreamDealWithRejection(stream, error);
				    }
				    function WritableStreamFinishInFlightClose(stream) {
				        stream._inFlightCloseRequest._resolve(undefined);
				        stream._inFlightCloseRequest = undefined;
				        const state = stream._state;
				        if (state === 'erroring') {
				            // The error was too late to do anything, so it is ignored.
				            stream._storedError = undefined;
				            if (stream._pendingAbortRequest !== undefined) {
				                stream._pendingAbortRequest._resolve();
				                stream._pendingAbortRequest = undefined;
				            }
				        }
				        stream._state = 'closed';
				        const writer = stream._writer;
				        if (writer !== undefined) {
				            defaultWriterClosedPromiseResolve(writer);
				        }
				    }
				    function WritableStreamFinishInFlightCloseWithError(stream, error) {
				        stream._inFlightCloseRequest._reject(error);
				        stream._inFlightCloseRequest = undefined;
				        // Never execute sink abort() after sink close().
				        if (stream._pendingAbortRequest !== undefined) {
				            stream._pendingAbortRequest._reject(error);
				            stream._pendingAbortRequest = undefined;
				        }
				        WritableStreamDealWithRejection(stream, error);
				    }
				    // TODO(ricea): Fix alphabetical order.
				    function WritableStreamCloseQueuedOrInFlight(stream) {
				        if (stream._closeRequest === undefined && stream._inFlightCloseRequest === undefined) {
				            return false;
				        }
				        return true;
				    }
				    function WritableStreamHasOperationMarkedInFlight(stream) {
				        if (stream._inFlightWriteRequest === undefined && stream._inFlightCloseRequest === undefined) {
				            return false;
				        }
				        return true;
				    }
				    function WritableStreamMarkCloseRequestInFlight(stream) {
				        stream._inFlightCloseRequest = stream._closeRequest;
				        stream._closeRequest = undefined;
				    }
				    function WritableStreamMarkFirstWriteRequestInFlight(stream) {
				        stream._inFlightWriteRequest = stream._writeRequests.shift();
				    }
				    function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
				        if (stream._closeRequest !== undefined) {
				            stream._closeRequest._reject(stream._storedError);
				            stream._closeRequest = undefined;
				        }
				        const writer = stream._writer;
				        if (writer !== undefined) {
				            defaultWriterClosedPromiseReject(writer, stream._storedError);
				        }
				    }
				    function WritableStreamUpdateBackpressure(stream, backpressure) {
				        const writer = stream._writer;
				        if (writer !== undefined && backpressure !== stream._backpressure) {
				            if (backpressure) {
				                defaultWriterReadyPromiseReset(writer);
				            }
				            else {
				                defaultWriterReadyPromiseResolve(writer);
				            }
				        }
				        stream._backpressure = backpressure;
				    }
				    /**
				     * A default writer vended by a {@link WritableStream}.
				     *
				     * @public
				     */
				    class WritableStreamDefaultWriter {
				        constructor(stream) {
				            assertRequiredArgument(stream, 1, 'WritableStreamDefaultWriter');
				            assertWritableStream(stream, 'First parameter');
				            if (IsWritableStreamLocked(stream)) {
				                throw new TypeError('This stream has already been locked for exclusive writing by another writer');
				            }
				            this._ownerWritableStream = stream;
				            stream._writer = this;
				            const state = stream._state;
				            if (state === 'writable') {
				                if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
				                    defaultWriterReadyPromiseInitialize(this);
				                }
				                else {
				                    defaultWriterReadyPromiseInitializeAsResolved(this);
				                }
				                defaultWriterClosedPromiseInitialize(this);
				            }
				            else if (state === 'erroring') {
				                defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
				                defaultWriterClosedPromiseInitialize(this);
				            }
				            else if (state === 'closed') {
				                defaultWriterReadyPromiseInitializeAsResolved(this);
				                defaultWriterClosedPromiseInitializeAsResolved(this);
				            }
				            else {
				                const storedError = stream._storedError;
				                defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
				                defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
				            }
				        }
				        /**
				         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
				         * the writer’s lock is released before the stream finishes closing.
				         */
				        get closed() {
				            if (!IsWritableStreamDefaultWriter(this)) {
				                return promiseRejectedWith(defaultWriterBrandCheckException('closed'));
				            }
				            return this._closedPromise;
				        }
				        /**
				         * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
				         * A producer can use this information to determine the right amount of data to write.
				         *
				         * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
				         * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
				         * the writer’s lock is released.
				         */
				        get desiredSize() {
				            if (!IsWritableStreamDefaultWriter(this)) {
				                throw defaultWriterBrandCheckException('desiredSize');
				            }
				            if (this._ownerWritableStream === undefined) {
				                throw defaultWriterLockException('desiredSize');
				            }
				            return WritableStreamDefaultWriterGetDesiredSize(this);
				        }
				        /**
				         * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
				         * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
				         * back to zero or below, the getter will return a new promise that stays pending until the next transition.
				         *
				         * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
				         * rejected.
				         */
				        get ready() {
				            if (!IsWritableStreamDefaultWriter(this)) {
				                return promiseRejectedWith(defaultWriterBrandCheckException('ready'));
				            }
				            return this._readyPromise;
				        }
				        /**
				         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
				         */
				        abort(reason = undefined) {
				            if (!IsWritableStreamDefaultWriter(this)) {
				                return promiseRejectedWith(defaultWriterBrandCheckException('abort'));
				            }
				            if (this._ownerWritableStream === undefined) {
				                return promiseRejectedWith(defaultWriterLockException('abort'));
				            }
				            return WritableStreamDefaultWriterAbort(this, reason);
				        }
				        /**
				         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
				         */
				        close() {
				            if (!IsWritableStreamDefaultWriter(this)) {
				                return promiseRejectedWith(defaultWriterBrandCheckException('close'));
				            }
				            const stream = this._ownerWritableStream;
				            if (stream === undefined) {
				                return promiseRejectedWith(defaultWriterLockException('close'));
				            }
				            if (WritableStreamCloseQueuedOrInFlight(stream)) {
				                return promiseRejectedWith(new TypeError('Cannot close an already-closing stream'));
				            }
				            return WritableStreamDefaultWriterClose(this);
				        }
				        /**
				         * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
				         * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
				         * now on; otherwise, the writer will appear closed.
				         *
				         * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
				         * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
				         * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
				         * other producers from writing in an interleaved manner.
				         */
				        releaseLock() {
				            if (!IsWritableStreamDefaultWriter(this)) {
				                throw defaultWriterBrandCheckException('releaseLock');
				            }
				            const stream = this._ownerWritableStream;
				            if (stream === undefined) {
				                return;
				            }
				            WritableStreamDefaultWriterRelease(this);
				        }
				        write(chunk = undefined) {
				            if (!IsWritableStreamDefaultWriter(this)) {
				                return promiseRejectedWith(defaultWriterBrandCheckException('write'));
				            }
				            if (this._ownerWritableStream === undefined) {
				                return promiseRejectedWith(defaultWriterLockException('write to'));
				            }
				            return WritableStreamDefaultWriterWrite(this, chunk);
				        }
				    }
				    Object.defineProperties(WritableStreamDefaultWriter.prototype, {
				        abort: { enumerable: true },
				        close: { enumerable: true },
				        releaseLock: { enumerable: true },
				        write: { enumerable: true },
				        closed: { enumerable: true },
				        desiredSize: { enumerable: true },
				        ready: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
				            value: 'WritableStreamDefaultWriter',
				            configurable: true
				        });
				    }
				    // Abstract operations for the WritableStreamDefaultWriter.
				    function IsWritableStreamDefaultWriter(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_ownerWritableStream')) {
				            return false;
				        }
				        return x instanceof WritableStreamDefaultWriter;
				    }
				    // A client of WritableStreamDefaultWriter may use these functions directly to bypass state check.
				    function WritableStreamDefaultWriterAbort(writer, reason) {
				        const stream = writer._ownerWritableStream;
				        return WritableStreamAbort(stream, reason);
				    }
				    function WritableStreamDefaultWriterClose(writer) {
				        const stream = writer._ownerWritableStream;
				        return WritableStreamClose(stream);
				    }
				    function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
				        const stream = writer._ownerWritableStream;
				        const state = stream._state;
				        if (WritableStreamCloseQueuedOrInFlight(stream) || state === 'closed') {
				            return promiseResolvedWith(undefined);
				        }
				        if (state === 'errored') {
				            return promiseRejectedWith(stream._storedError);
				        }
				        return WritableStreamDefaultWriterClose(writer);
				    }
				    function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
				        if (writer._closedPromiseState === 'pending') {
				            defaultWriterClosedPromiseReject(writer, error);
				        }
				        else {
				            defaultWriterClosedPromiseResetToRejected(writer, error);
				        }
				    }
				    function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
				        if (writer._readyPromiseState === 'pending') {
				            defaultWriterReadyPromiseReject(writer, error);
				        }
				        else {
				            defaultWriterReadyPromiseResetToRejected(writer, error);
				        }
				    }
				    function WritableStreamDefaultWriterGetDesiredSize(writer) {
				        const stream = writer._ownerWritableStream;
				        const state = stream._state;
				        if (state === 'errored' || state === 'erroring') {
				            return null;
				        }
				        if (state === 'closed') {
				            return 0;
				        }
				        return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
				    }
				    function WritableStreamDefaultWriterRelease(writer) {
				        const stream = writer._ownerWritableStream;
				        const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
				        WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
				        // The state transitions to "errored" before the sink abort() method runs, but the writer.closed promise is not
				        // rejected until afterwards. This means that simply testing state will not work.
				        WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
				        stream._writer = undefined;
				        writer._ownerWritableStream = undefined;
				    }
				    function WritableStreamDefaultWriterWrite(writer, chunk) {
				        const stream = writer._ownerWritableStream;
				        const controller = stream._writableStreamController;
				        const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
				        if (stream !== writer._ownerWritableStream) {
				            return promiseRejectedWith(defaultWriterLockException('write to'));
				        }
				        const state = stream._state;
				        if (state === 'errored') {
				            return promiseRejectedWith(stream._storedError);
				        }
				        if (WritableStreamCloseQueuedOrInFlight(stream) || state === 'closed') {
				            return promiseRejectedWith(new TypeError('The stream is closing or closed and cannot be written to'));
				        }
				        if (state === 'erroring') {
				            return promiseRejectedWith(stream._storedError);
				        }
				        const promise = WritableStreamAddWriteRequest(stream);
				        WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
				        return promise;
				    }
				    const closeSentinel = {};
				    /**
				     * Allows control of a {@link WritableStream | writable stream}'s state and internal queue.
				     *
				     * @public
				     */
				    class WritableStreamDefaultController {
				        constructor() {
				            throw new TypeError('Illegal constructor');
				        }
				        /**
				         * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
				         *
				         * @deprecated
				         *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
				         *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
				         */
				        get abortReason() {
				            if (!IsWritableStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException$2('abortReason');
				            }
				            return this._abortReason;
				        }
				        /**
				         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
				         */
				        get signal() {
				            if (!IsWritableStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException$2('signal');
				            }
				            if (this._abortController === undefined) {
				                // Older browsers or older Node versions may not support `AbortController` or `AbortSignal`.
				                // We don't want to bundle and ship an `AbortController` polyfill together with our polyfill,
				                // so instead we only implement support for `signal` if we find a global `AbortController` constructor.
				                throw new TypeError('WritableStreamDefaultController.prototype.signal is not supported');
				            }
				            return this._abortController.signal;
				        }
				        /**
				         * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
				         *
				         * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
				         * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
				         * normal lifecycle of interactions with the underlying sink.
				         */
				        error(e = undefined) {
				            if (!IsWritableStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException$2('error');
				            }
				            const state = this._controlledWritableStream._state;
				            if (state !== 'writable') {
				                // The stream is closed, errored or will be soon. The sink can't do anything useful if it gets an error here, so
				                // just treat it as a no-op.
				                return;
				            }
				            WritableStreamDefaultControllerError(this, e);
				        }
				        /** @internal */
				        [AbortSteps](reason) {
				            const result = this._abortAlgorithm(reason);
				            WritableStreamDefaultControllerClearAlgorithms(this);
				            return result;
				        }
				        /** @internal */
				        [ErrorSteps]() {
				            ResetQueue(this);
				        }
				    }
				    Object.defineProperties(WritableStreamDefaultController.prototype, {
				        abortReason: { enumerable: true },
				        signal: { enumerable: true },
				        error: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
				            value: 'WritableStreamDefaultController',
				            configurable: true
				        });
				    }
				    // Abstract operations implementing interface required by the WritableStream.
				    function IsWritableStreamDefaultController(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_controlledWritableStream')) {
				            return false;
				        }
				        return x instanceof WritableStreamDefaultController;
				    }
				    function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
				        controller._controlledWritableStream = stream;
				        stream._writableStreamController = controller;
				        // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
				        controller._queue = undefined;
				        controller._queueTotalSize = undefined;
				        ResetQueue(controller);
				        controller._abortReason = undefined;
				        controller._abortController = createAbortController();
				        controller._started = false;
				        controller._strategySizeAlgorithm = sizeAlgorithm;
				        controller._strategyHWM = highWaterMark;
				        controller._writeAlgorithm = writeAlgorithm;
				        controller._closeAlgorithm = closeAlgorithm;
				        controller._abortAlgorithm = abortAlgorithm;
				        const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
				        WritableStreamUpdateBackpressure(stream, backpressure);
				        const startResult = startAlgorithm();
				        const startPromise = promiseResolvedWith(startResult);
				        uponPromise(startPromise, () => {
				            controller._started = true;
				            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
				        }, r => {
				            controller._started = true;
				            WritableStreamDealWithRejection(stream, r);
				        });
				    }
				    function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
				        const controller = Object.create(WritableStreamDefaultController.prototype);
				        let startAlgorithm = () => undefined;
				        let writeAlgorithm = () => promiseResolvedWith(undefined);
				        let closeAlgorithm = () => promiseResolvedWith(undefined);
				        let abortAlgorithm = () => promiseResolvedWith(undefined);
				        if (underlyingSink.start !== undefined) {
				            startAlgorithm = () => underlyingSink.start(controller);
				        }
				        if (underlyingSink.write !== undefined) {
				            writeAlgorithm = chunk => underlyingSink.write(chunk, controller);
				        }
				        if (underlyingSink.close !== undefined) {
				            closeAlgorithm = () => underlyingSink.close();
				        }
				        if (underlyingSink.abort !== undefined) {
				            abortAlgorithm = reason => underlyingSink.abort(reason);
				        }
				        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
				    }
				    // ClearAlgorithms may be called twice. Erroring the same stream in multiple ways will often result in redundant calls.
				    function WritableStreamDefaultControllerClearAlgorithms(controller) {
				        controller._writeAlgorithm = undefined;
				        controller._closeAlgorithm = undefined;
				        controller._abortAlgorithm = undefined;
				        controller._strategySizeAlgorithm = undefined;
				    }
				    function WritableStreamDefaultControllerClose(controller) {
				        EnqueueValueWithSize(controller, closeSentinel, 0);
				        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
				    }
				    function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
				        try {
				            return controller._strategySizeAlgorithm(chunk);
				        }
				        catch (chunkSizeE) {
				            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
				            return 1;
				        }
				    }
				    function WritableStreamDefaultControllerGetDesiredSize(controller) {
				        return controller._strategyHWM - controller._queueTotalSize;
				    }
				    function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
				        try {
				            EnqueueValueWithSize(controller, chunk, chunkSize);
				        }
				        catch (enqueueE) {
				            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
				            return;
				        }
				        const stream = controller._controlledWritableStream;
				        if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === 'writable') {
				            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
				            WritableStreamUpdateBackpressure(stream, backpressure);
				        }
				        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
				    }
				    // Abstract operations for the WritableStreamDefaultController.
				    function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
				        const stream = controller._controlledWritableStream;
				        if (!controller._started) {
				            return;
				        }
				        if (stream._inFlightWriteRequest !== undefined) {
				            return;
				        }
				        const state = stream._state;
				        if (state === 'erroring') {
				            WritableStreamFinishErroring(stream);
				            return;
				        }
				        if (controller._queue.length === 0) {
				            return;
				        }
				        const value = PeekQueueValue(controller);
				        if (value === closeSentinel) {
				            WritableStreamDefaultControllerProcessClose(controller);
				        }
				        else {
				            WritableStreamDefaultControllerProcessWrite(controller, value);
				        }
				    }
				    function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
				        if (controller._controlledWritableStream._state === 'writable') {
				            WritableStreamDefaultControllerError(controller, error);
				        }
				    }
				    function WritableStreamDefaultControllerProcessClose(controller) {
				        const stream = controller._controlledWritableStream;
				        WritableStreamMarkCloseRequestInFlight(stream);
				        DequeueValue(controller);
				        const sinkClosePromise = controller._closeAlgorithm();
				        WritableStreamDefaultControllerClearAlgorithms(controller);
				        uponPromise(sinkClosePromise, () => {
				            WritableStreamFinishInFlightClose(stream);
				        }, reason => {
				            WritableStreamFinishInFlightCloseWithError(stream, reason);
				        });
				    }
				    function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
				        const stream = controller._controlledWritableStream;
				        WritableStreamMarkFirstWriteRequestInFlight(stream);
				        const sinkWritePromise = controller._writeAlgorithm(chunk);
				        uponPromise(sinkWritePromise, () => {
				            WritableStreamFinishInFlightWrite(stream);
				            const state = stream._state;
				            DequeueValue(controller);
				            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === 'writable') {
				                const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
				                WritableStreamUpdateBackpressure(stream, backpressure);
				            }
				            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
				        }, reason => {
				            if (stream._state === 'writable') {
				                WritableStreamDefaultControllerClearAlgorithms(controller);
				            }
				            WritableStreamFinishInFlightWriteWithError(stream, reason);
				        });
				    }
				    function WritableStreamDefaultControllerGetBackpressure(controller) {
				        const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
				        return desiredSize <= 0;
				    }
				    // A client of WritableStreamDefaultController may use these functions directly to bypass state check.
				    function WritableStreamDefaultControllerError(controller, error) {
				        const stream = controller._controlledWritableStream;
				        WritableStreamDefaultControllerClearAlgorithms(controller);
				        WritableStreamStartErroring(stream, error);
				    }
				    // Helper functions for the WritableStream.
				    function streamBrandCheckException$2(name) {
				        return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
				    }
				    // Helper functions for the WritableStreamDefaultController.
				    function defaultControllerBrandCheckException$2(name) {
				        return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
				    }
				    // Helper functions for the WritableStreamDefaultWriter.
				    function defaultWriterBrandCheckException(name) {
				        return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
				    }
				    function defaultWriterLockException(name) {
				        return new TypeError('Cannot ' + name + ' a stream using a released writer');
				    }
				    function defaultWriterClosedPromiseInitialize(writer) {
				        writer._closedPromise = newPromise((resolve, reject) => {
				            writer._closedPromise_resolve = resolve;
				            writer._closedPromise_reject = reject;
				            writer._closedPromiseState = 'pending';
				        });
				    }
				    function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
				        defaultWriterClosedPromiseInitialize(writer);
				        defaultWriterClosedPromiseReject(writer, reason);
				    }
				    function defaultWriterClosedPromiseInitializeAsResolved(writer) {
				        defaultWriterClosedPromiseInitialize(writer);
				        defaultWriterClosedPromiseResolve(writer);
				    }
				    function defaultWriterClosedPromiseReject(writer, reason) {
				        if (writer._closedPromise_reject === undefined) {
				            return;
				        }
				        setPromiseIsHandledToTrue(writer._closedPromise);
				        writer._closedPromise_reject(reason);
				        writer._closedPromise_resolve = undefined;
				        writer._closedPromise_reject = undefined;
				        writer._closedPromiseState = 'rejected';
				    }
				    function defaultWriterClosedPromiseResetToRejected(writer, reason) {
				        defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
				    }
				    function defaultWriterClosedPromiseResolve(writer) {
				        if (writer._closedPromise_resolve === undefined) {
				            return;
				        }
				        writer._closedPromise_resolve(undefined);
				        writer._closedPromise_resolve = undefined;
				        writer._closedPromise_reject = undefined;
				        writer._closedPromiseState = 'resolved';
				    }
				    function defaultWriterReadyPromiseInitialize(writer) {
				        writer._readyPromise = newPromise((resolve, reject) => {
				            writer._readyPromise_resolve = resolve;
				            writer._readyPromise_reject = reject;
				        });
				        writer._readyPromiseState = 'pending';
				    }
				    function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
				        defaultWriterReadyPromiseInitialize(writer);
				        defaultWriterReadyPromiseReject(writer, reason);
				    }
				    function defaultWriterReadyPromiseInitializeAsResolved(writer) {
				        defaultWriterReadyPromiseInitialize(writer);
				        defaultWriterReadyPromiseResolve(writer);
				    }
				    function defaultWriterReadyPromiseReject(writer, reason) {
				        if (writer._readyPromise_reject === undefined) {
				            return;
				        }
				        setPromiseIsHandledToTrue(writer._readyPromise);
				        writer._readyPromise_reject(reason);
				        writer._readyPromise_resolve = undefined;
				        writer._readyPromise_reject = undefined;
				        writer._readyPromiseState = 'rejected';
				    }
				    function defaultWriterReadyPromiseReset(writer) {
				        defaultWriterReadyPromiseInitialize(writer);
				    }
				    function defaultWriterReadyPromiseResetToRejected(writer, reason) {
				        defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
				    }
				    function defaultWriterReadyPromiseResolve(writer) {
				        if (writer._readyPromise_resolve === undefined) {
				            return;
				        }
				        writer._readyPromise_resolve(undefined);
				        writer._readyPromise_resolve = undefined;
				        writer._readyPromise_reject = undefined;
				        writer._readyPromiseState = 'fulfilled';
				    }

				    /// <reference lib="dom" />
				    const NativeDOMException = typeof DOMException !== 'undefined' ? DOMException : undefined;

				    /// <reference types="node" />
				    function isDOMExceptionConstructor(ctor) {
				        if (!(typeof ctor === 'function' || typeof ctor === 'object')) {
				            return false;
				        }
				        try {
				            new ctor();
				            return true;
				        }
				        catch (_a) {
				            return false;
				        }
				    }
				    function createDOMExceptionPolyfill() {
				        // eslint-disable-next-line no-shadow
				        const ctor = function DOMException(message, name) {
				            this.message = message || '';
				            this.name = name || 'Error';
				            if (Error.captureStackTrace) {
				                Error.captureStackTrace(this, this.constructor);
				            }
				        };
				        ctor.prototype = Object.create(Error.prototype);
				        Object.defineProperty(ctor.prototype, 'constructor', { value: ctor, writable: true, configurable: true });
				        return ctor;
				    }
				    // eslint-disable-next-line no-redeclare
				    const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();

				    function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
				        const reader = AcquireReadableStreamDefaultReader(source);
				        const writer = AcquireWritableStreamDefaultWriter(dest);
				        source._disturbed = true;
				        let shuttingDown = false;
				        // This is used to keep track of the spec's requirement that we wait for ongoing writes during shutdown.
				        let currentWrite = promiseResolvedWith(undefined);
				        return newPromise((resolve, reject) => {
				            let abortAlgorithm;
				            if (signal !== undefined) {
				                abortAlgorithm = () => {
				                    const error = new DOMException$1('Aborted', 'AbortError');
				                    const actions = [];
				                    if (!preventAbort) {
				                        actions.push(() => {
				                            if (dest._state === 'writable') {
				                                return WritableStreamAbort(dest, error);
				                            }
				                            return promiseResolvedWith(undefined);
				                        });
				                    }
				                    if (!preventCancel) {
				                        actions.push(() => {
				                            if (source._state === 'readable') {
				                                return ReadableStreamCancel(source, error);
				                            }
				                            return promiseResolvedWith(undefined);
				                        });
				                    }
				                    shutdownWithAction(() => Promise.all(actions.map(action => action())), true, error);
				                };
				                if (signal.aborted) {
				                    abortAlgorithm();
				                    return;
				                }
				                signal.addEventListener('abort', abortAlgorithm);
				            }
				            // Using reader and writer, read all chunks from this and write them to dest
				            // - Backpressure must be enforced
				            // - Shutdown must stop all activity
				            function pipeLoop() {
				                return newPromise((resolveLoop, rejectLoop) => {
				                    function next(done) {
				                        if (done) {
				                            resolveLoop();
				                        }
				                        else {
				                            // Use `PerformPromiseThen` instead of `uponPromise` to avoid
				                            // adding unnecessary `.catch(rethrowAssertionErrorRejection)` handlers
				                            PerformPromiseThen(pipeStep(), next, rejectLoop);
				                        }
				                    }
				                    next(false);
				                });
				            }
				            function pipeStep() {
				                if (shuttingDown) {
				                    return promiseResolvedWith(true);
				                }
				                return PerformPromiseThen(writer._readyPromise, () => {
				                    return newPromise((resolveRead, rejectRead) => {
				                        ReadableStreamDefaultReaderRead(reader, {
				                            _chunkSteps: chunk => {
				                                currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), undefined, noop);
				                                resolveRead(false);
				                            },
				                            _closeSteps: () => resolveRead(true),
				                            _errorSteps: rejectRead
				                        });
				                    });
				                });
				            }
				            // Errors must be propagated forward
				            isOrBecomesErrored(source, reader._closedPromise, storedError => {
				                if (!preventAbort) {
				                    shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
				                }
				                else {
				                    shutdown(true, storedError);
				                }
				            });
				            // Errors must be propagated backward
				            isOrBecomesErrored(dest, writer._closedPromise, storedError => {
				                if (!preventCancel) {
				                    shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
				                }
				                else {
				                    shutdown(true, storedError);
				                }
				            });
				            // Closing must be propagated forward
				            isOrBecomesClosed(source, reader._closedPromise, () => {
				                if (!preventClose) {
				                    shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
				                }
				                else {
				                    shutdown();
				                }
				            });
				            // Closing must be propagated backward
				            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === 'closed') {
				                const destClosed = new TypeError('the destination writable stream closed before all data could be piped to it');
				                if (!preventCancel) {
				                    shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
				                }
				                else {
				                    shutdown(true, destClosed);
				                }
				            }
				            setPromiseIsHandledToTrue(pipeLoop());
				            function waitForWritesToFinish() {
				                // Another write may have started while we were waiting on this currentWrite, so we have to be sure to wait
				                // for that too.
				                const oldCurrentWrite = currentWrite;
				                return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : undefined);
				            }
				            function isOrBecomesErrored(stream, promise, action) {
				                if (stream._state === 'errored') {
				                    action(stream._storedError);
				                }
				                else {
				                    uponRejection(promise, action);
				                }
				            }
				            function isOrBecomesClosed(stream, promise, action) {
				                if (stream._state === 'closed') {
				                    action();
				                }
				                else {
				                    uponFulfillment(promise, action);
				                }
				            }
				            function shutdownWithAction(action, originalIsError, originalError) {
				                if (shuttingDown) {
				                    return;
				                }
				                shuttingDown = true;
				                if (dest._state === 'writable' && !WritableStreamCloseQueuedOrInFlight(dest)) {
				                    uponFulfillment(waitForWritesToFinish(), doTheRest);
				                }
				                else {
				                    doTheRest();
				                }
				                function doTheRest() {
				                    uponPromise(action(), () => finalize(originalIsError, originalError), newError => finalize(true, newError));
				                }
				            }
				            function shutdown(isError, error) {
				                if (shuttingDown) {
				                    return;
				                }
				                shuttingDown = true;
				                if (dest._state === 'writable' && !WritableStreamCloseQueuedOrInFlight(dest)) {
				                    uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
				                }
				                else {
				                    finalize(isError, error);
				                }
				            }
				            function finalize(isError, error) {
				                WritableStreamDefaultWriterRelease(writer);
				                ReadableStreamReaderGenericRelease(reader);
				                if (signal !== undefined) {
				                    signal.removeEventListener('abort', abortAlgorithm);
				                }
				                if (isError) {
				                    reject(error);
				                }
				                else {
				                    resolve(undefined);
				                }
				            }
				        });
				    }

				    /**
				     * Allows control of a {@link ReadableStream | readable stream}'s state and internal queue.
				     *
				     * @public
				     */
				    class ReadableStreamDefaultController {
				        constructor() {
				            throw new TypeError('Illegal constructor');
				        }
				        /**
				         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
				         * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
				         */
				        get desiredSize() {
				            if (!IsReadableStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException$1('desiredSize');
				            }
				            return ReadableStreamDefaultControllerGetDesiredSize(this);
				        }
				        /**
				         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
				         * the stream, but once those are read, the stream will become closed.
				         */
				        close() {
				            if (!IsReadableStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException$1('close');
				            }
				            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
				                throw new TypeError('The stream is not in a state that permits close');
				            }
				            ReadableStreamDefaultControllerClose(this);
				        }
				        enqueue(chunk = undefined) {
				            if (!IsReadableStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException$1('enqueue');
				            }
				            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
				                throw new TypeError('The stream is not in a state that permits enqueue');
				            }
				            return ReadableStreamDefaultControllerEnqueue(this, chunk);
				        }
				        /**
				         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
				         */
				        error(e = undefined) {
				            if (!IsReadableStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException$1('error');
				            }
				            ReadableStreamDefaultControllerError(this, e);
				        }
				        /** @internal */
				        [CancelSteps](reason) {
				            ResetQueue(this);
				            const result = this._cancelAlgorithm(reason);
				            ReadableStreamDefaultControllerClearAlgorithms(this);
				            return result;
				        }
				        /** @internal */
				        [PullSteps](readRequest) {
				            const stream = this._controlledReadableStream;
				            if (this._queue.length > 0) {
				                const chunk = DequeueValue(this);
				                if (this._closeRequested && this._queue.length === 0) {
				                    ReadableStreamDefaultControllerClearAlgorithms(this);
				                    ReadableStreamClose(stream);
				                }
				                else {
				                    ReadableStreamDefaultControllerCallPullIfNeeded(this);
				                }
				                readRequest._chunkSteps(chunk);
				            }
				            else {
				                ReadableStreamAddReadRequest(stream, readRequest);
				                ReadableStreamDefaultControllerCallPullIfNeeded(this);
				            }
				        }
				    }
				    Object.defineProperties(ReadableStreamDefaultController.prototype, {
				        close: { enumerable: true },
				        enqueue: { enumerable: true },
				        error: { enumerable: true },
				        desiredSize: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
				            value: 'ReadableStreamDefaultController',
				            configurable: true
				        });
				    }
				    // Abstract operations for the ReadableStreamDefaultController.
				    function IsReadableStreamDefaultController(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableStream')) {
				            return false;
				        }
				        return x instanceof ReadableStreamDefaultController;
				    }
				    function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
				        const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
				        if (!shouldPull) {
				            return;
				        }
				        if (controller._pulling) {
				            controller._pullAgain = true;
				            return;
				        }
				        controller._pulling = true;
				        const pullPromise = controller._pullAlgorithm();
				        uponPromise(pullPromise, () => {
				            controller._pulling = false;
				            if (controller._pullAgain) {
				                controller._pullAgain = false;
				                ReadableStreamDefaultControllerCallPullIfNeeded(controller);
				            }
				        }, e => {
				            ReadableStreamDefaultControllerError(controller, e);
				        });
				    }
				    function ReadableStreamDefaultControllerShouldCallPull(controller) {
				        const stream = controller._controlledReadableStream;
				        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
				            return false;
				        }
				        if (!controller._started) {
				            return false;
				        }
				        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
				            return true;
				        }
				        const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
				        if (desiredSize > 0) {
				            return true;
				        }
				        return false;
				    }
				    function ReadableStreamDefaultControllerClearAlgorithms(controller) {
				        controller._pullAlgorithm = undefined;
				        controller._cancelAlgorithm = undefined;
				        controller._strategySizeAlgorithm = undefined;
				    }
				    // A client of ReadableStreamDefaultController may use these functions directly to bypass state check.
				    function ReadableStreamDefaultControllerClose(controller) {
				        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
				            return;
				        }
				        const stream = controller._controlledReadableStream;
				        controller._closeRequested = true;
				        if (controller._queue.length === 0) {
				            ReadableStreamDefaultControllerClearAlgorithms(controller);
				            ReadableStreamClose(stream);
				        }
				    }
				    function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
				        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
				            return;
				        }
				        const stream = controller._controlledReadableStream;
				        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
				            ReadableStreamFulfillReadRequest(stream, chunk, false);
				        }
				        else {
				            let chunkSize;
				            try {
				                chunkSize = controller._strategySizeAlgorithm(chunk);
				            }
				            catch (chunkSizeE) {
				                ReadableStreamDefaultControllerError(controller, chunkSizeE);
				                throw chunkSizeE;
				            }
				            try {
				                EnqueueValueWithSize(controller, chunk, chunkSize);
				            }
				            catch (enqueueE) {
				                ReadableStreamDefaultControllerError(controller, enqueueE);
				                throw enqueueE;
				            }
				        }
				        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
				    }
				    function ReadableStreamDefaultControllerError(controller, e) {
				        const stream = controller._controlledReadableStream;
				        if (stream._state !== 'readable') {
				            return;
				        }
				        ResetQueue(controller);
				        ReadableStreamDefaultControllerClearAlgorithms(controller);
				        ReadableStreamError(stream, e);
				    }
				    function ReadableStreamDefaultControllerGetDesiredSize(controller) {
				        const state = controller._controlledReadableStream._state;
				        if (state === 'errored') {
				            return null;
				        }
				        if (state === 'closed') {
				            return 0;
				        }
				        return controller._strategyHWM - controller._queueTotalSize;
				    }
				    // This is used in the implementation of TransformStream.
				    function ReadableStreamDefaultControllerHasBackpressure(controller) {
				        if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
				            return false;
				        }
				        return true;
				    }
				    function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
				        const state = controller._controlledReadableStream._state;
				        if (!controller._closeRequested && state === 'readable') {
				            return true;
				        }
				        return false;
				    }
				    function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
				        controller._controlledReadableStream = stream;
				        controller._queue = undefined;
				        controller._queueTotalSize = undefined;
				        ResetQueue(controller);
				        controller._started = false;
				        controller._closeRequested = false;
				        controller._pullAgain = false;
				        controller._pulling = false;
				        controller._strategySizeAlgorithm = sizeAlgorithm;
				        controller._strategyHWM = highWaterMark;
				        controller._pullAlgorithm = pullAlgorithm;
				        controller._cancelAlgorithm = cancelAlgorithm;
				        stream._readableStreamController = controller;
				        const startResult = startAlgorithm();
				        uponPromise(promiseResolvedWith(startResult), () => {
				            controller._started = true;
				            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
				        }, r => {
				            ReadableStreamDefaultControllerError(controller, r);
				        });
				    }
				    function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
				        const controller = Object.create(ReadableStreamDefaultController.prototype);
				        let startAlgorithm = () => undefined;
				        let pullAlgorithm = () => promiseResolvedWith(undefined);
				        let cancelAlgorithm = () => promiseResolvedWith(undefined);
				        if (underlyingSource.start !== undefined) {
				            startAlgorithm = () => underlyingSource.start(controller);
				        }
				        if (underlyingSource.pull !== undefined) {
				            pullAlgorithm = () => underlyingSource.pull(controller);
				        }
				        if (underlyingSource.cancel !== undefined) {
				            cancelAlgorithm = reason => underlyingSource.cancel(reason);
				        }
				        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
				    }
				    // Helper functions for the ReadableStreamDefaultController.
				    function defaultControllerBrandCheckException$1(name) {
				        return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
				    }

				    function ReadableStreamTee(stream, cloneForBranch2) {
				        if (IsReadableByteStreamController(stream._readableStreamController)) {
				            return ReadableByteStreamTee(stream);
				        }
				        return ReadableStreamDefaultTee(stream);
				    }
				    function ReadableStreamDefaultTee(stream, cloneForBranch2) {
				        const reader = AcquireReadableStreamDefaultReader(stream);
				        let reading = false;
				        let readAgain = false;
				        let canceled1 = false;
				        let canceled2 = false;
				        let reason1;
				        let reason2;
				        let branch1;
				        let branch2;
				        let resolveCancelPromise;
				        const cancelPromise = newPromise(resolve => {
				            resolveCancelPromise = resolve;
				        });
				        function pullAlgorithm() {
				            if (reading) {
				                readAgain = true;
				                return promiseResolvedWith(undefined);
				            }
				            reading = true;
				            const readRequest = {
				                _chunkSteps: chunk => {
				                    // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
				                    // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
				                    // successful synchronously-available reads get ahead of asynchronously-available errors.
				                    queueMicrotask(() => {
				                        readAgain = false;
				                        const chunk1 = chunk;
				                        const chunk2 = chunk;
				                        // There is no way to access the cloning code right now in the reference implementation.
				                        // If we add one then we'll need an implementation for serializable objects.
				                        // if (!canceled2 && cloneForBranch2) {
				                        //   chunk2 = StructuredDeserialize(StructuredSerialize(chunk2));
				                        // }
				                        if (!canceled1) {
				                            ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
				                        }
				                        if (!canceled2) {
				                            ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
				                        }
				                        reading = false;
				                        if (readAgain) {
				                            pullAlgorithm();
				                        }
				                    });
				                },
				                _closeSteps: () => {
				                    reading = false;
				                    if (!canceled1) {
				                        ReadableStreamDefaultControllerClose(branch1._readableStreamController);
				                    }
				                    if (!canceled2) {
				                        ReadableStreamDefaultControllerClose(branch2._readableStreamController);
				                    }
				                    if (!canceled1 || !canceled2) {
				                        resolveCancelPromise(undefined);
				                    }
				                },
				                _errorSteps: () => {
				                    reading = false;
				                }
				            };
				            ReadableStreamDefaultReaderRead(reader, readRequest);
				            return promiseResolvedWith(undefined);
				        }
				        function cancel1Algorithm(reason) {
				            canceled1 = true;
				            reason1 = reason;
				            if (canceled2) {
				                const compositeReason = CreateArrayFromList([reason1, reason2]);
				                const cancelResult = ReadableStreamCancel(stream, compositeReason);
				                resolveCancelPromise(cancelResult);
				            }
				            return cancelPromise;
				        }
				        function cancel2Algorithm(reason) {
				            canceled2 = true;
				            reason2 = reason;
				            if (canceled1) {
				                const compositeReason = CreateArrayFromList([reason1, reason2]);
				                const cancelResult = ReadableStreamCancel(stream, compositeReason);
				                resolveCancelPromise(cancelResult);
				            }
				            return cancelPromise;
				        }
				        function startAlgorithm() {
				            // do nothing
				        }
				        branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
				        branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
				        uponRejection(reader._closedPromise, (r) => {
				            ReadableStreamDefaultControllerError(branch1._readableStreamController, r);
				            ReadableStreamDefaultControllerError(branch2._readableStreamController, r);
				            if (!canceled1 || !canceled2) {
				                resolveCancelPromise(undefined);
				            }
				        });
				        return [branch1, branch2];
				    }
				    function ReadableByteStreamTee(stream) {
				        let reader = AcquireReadableStreamDefaultReader(stream);
				        let reading = false;
				        let readAgainForBranch1 = false;
				        let readAgainForBranch2 = false;
				        let canceled1 = false;
				        let canceled2 = false;
				        let reason1;
				        let reason2;
				        let branch1;
				        let branch2;
				        let resolveCancelPromise;
				        const cancelPromise = newPromise(resolve => {
				            resolveCancelPromise = resolve;
				        });
				        function forwardReaderError(thisReader) {
				            uponRejection(thisReader._closedPromise, r => {
				                if (thisReader !== reader) {
				                    return;
				                }
				                ReadableByteStreamControllerError(branch1._readableStreamController, r);
				                ReadableByteStreamControllerError(branch2._readableStreamController, r);
				                if (!canceled1 || !canceled2) {
				                    resolveCancelPromise(undefined);
				                }
				            });
				        }
				        function pullWithDefaultReader() {
				            if (IsReadableStreamBYOBReader(reader)) {
				                ReadableStreamReaderGenericRelease(reader);
				                reader = AcquireReadableStreamDefaultReader(stream);
				                forwardReaderError(reader);
				            }
				            const readRequest = {
				                _chunkSteps: chunk => {
				                    // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
				                    // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
				                    // successful synchronously-available reads get ahead of asynchronously-available errors.
				                    queueMicrotask(() => {
				                        readAgainForBranch1 = false;
				                        readAgainForBranch2 = false;
				                        const chunk1 = chunk;
				                        let chunk2 = chunk;
				                        if (!canceled1 && !canceled2) {
				                            try {
				                                chunk2 = CloneAsUint8Array(chunk);
				                            }
				                            catch (cloneE) {
				                                ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
				                                ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
				                                resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
				                                return;
				                            }
				                        }
				                        if (!canceled1) {
				                            ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
				                        }
				                        if (!canceled2) {
				                            ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
				                        }
				                        reading = false;
				                        if (readAgainForBranch1) {
				                            pull1Algorithm();
				                        }
				                        else if (readAgainForBranch2) {
				                            pull2Algorithm();
				                        }
				                    });
				                },
				                _closeSteps: () => {
				                    reading = false;
				                    if (!canceled1) {
				                        ReadableByteStreamControllerClose(branch1._readableStreamController);
				                    }
				                    if (!canceled2) {
				                        ReadableByteStreamControllerClose(branch2._readableStreamController);
				                    }
				                    if (branch1._readableStreamController._pendingPullIntos.length > 0) {
				                        ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
				                    }
				                    if (branch2._readableStreamController._pendingPullIntos.length > 0) {
				                        ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
				                    }
				                    if (!canceled1 || !canceled2) {
				                        resolveCancelPromise(undefined);
				                    }
				                },
				                _errorSteps: () => {
				                    reading = false;
				                }
				            };
				            ReadableStreamDefaultReaderRead(reader, readRequest);
				        }
				        function pullWithBYOBReader(view, forBranch2) {
				            if (IsReadableStreamDefaultReader(reader)) {
				                ReadableStreamReaderGenericRelease(reader);
				                reader = AcquireReadableStreamBYOBReader(stream);
				                forwardReaderError(reader);
				            }
				            const byobBranch = forBranch2 ? branch2 : branch1;
				            const otherBranch = forBranch2 ? branch1 : branch2;
				            const readIntoRequest = {
				                _chunkSteps: chunk => {
				                    // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
				                    // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
				                    // successful synchronously-available reads get ahead of asynchronously-available errors.
				                    queueMicrotask(() => {
				                        readAgainForBranch1 = false;
				                        readAgainForBranch2 = false;
				                        const byobCanceled = forBranch2 ? canceled2 : canceled1;
				                        const otherCanceled = forBranch2 ? canceled1 : canceled2;
				                        if (!otherCanceled) {
				                            let clonedChunk;
				                            try {
				                                clonedChunk = CloneAsUint8Array(chunk);
				                            }
				                            catch (cloneE) {
				                                ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
				                                ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
				                                resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
				                                return;
				                            }
				                            if (!byobCanceled) {
				                                ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
				                            }
				                            ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
				                        }
				                        else if (!byobCanceled) {
				                            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
				                        }
				                        reading = false;
				                        if (readAgainForBranch1) {
				                            pull1Algorithm();
				                        }
				                        else if (readAgainForBranch2) {
				                            pull2Algorithm();
				                        }
				                    });
				                },
				                _closeSteps: chunk => {
				                    reading = false;
				                    const byobCanceled = forBranch2 ? canceled2 : canceled1;
				                    const otherCanceled = forBranch2 ? canceled1 : canceled2;
				                    if (!byobCanceled) {
				                        ReadableByteStreamControllerClose(byobBranch._readableStreamController);
				                    }
				                    if (!otherCanceled) {
				                        ReadableByteStreamControllerClose(otherBranch._readableStreamController);
				                    }
				                    if (chunk !== undefined) {
				                        if (!byobCanceled) {
				                            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
				                        }
				                        if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
				                            ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
				                        }
				                    }
				                    if (!byobCanceled || !otherCanceled) {
				                        resolveCancelPromise(undefined);
				                    }
				                },
				                _errorSteps: () => {
				                    reading = false;
				                }
				            };
				            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
				        }
				        function pull1Algorithm() {
				            if (reading) {
				                readAgainForBranch1 = true;
				                return promiseResolvedWith(undefined);
				            }
				            reading = true;
				            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
				            if (byobRequest === null) {
				                pullWithDefaultReader();
				            }
				            else {
				                pullWithBYOBReader(byobRequest._view, false);
				            }
				            return promiseResolvedWith(undefined);
				        }
				        function pull2Algorithm() {
				            if (reading) {
				                readAgainForBranch2 = true;
				                return promiseResolvedWith(undefined);
				            }
				            reading = true;
				            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
				            if (byobRequest === null) {
				                pullWithDefaultReader();
				            }
				            else {
				                pullWithBYOBReader(byobRequest._view, true);
				            }
				            return promiseResolvedWith(undefined);
				        }
				        function cancel1Algorithm(reason) {
				            canceled1 = true;
				            reason1 = reason;
				            if (canceled2) {
				                const compositeReason = CreateArrayFromList([reason1, reason2]);
				                const cancelResult = ReadableStreamCancel(stream, compositeReason);
				                resolveCancelPromise(cancelResult);
				            }
				            return cancelPromise;
				        }
				        function cancel2Algorithm(reason) {
				            canceled2 = true;
				            reason2 = reason;
				            if (canceled1) {
				                const compositeReason = CreateArrayFromList([reason1, reason2]);
				                const cancelResult = ReadableStreamCancel(stream, compositeReason);
				                resolveCancelPromise(cancelResult);
				            }
				            return cancelPromise;
				        }
				        function startAlgorithm() {
				            return;
				        }
				        branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
				        branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
				        forwardReaderError(reader);
				        return [branch1, branch2];
				    }

				    function convertUnderlyingDefaultOrByteSource(source, context) {
				        assertDictionary(source, context);
				        const original = source;
				        const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
				        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
				        const pull = original === null || original === void 0 ? void 0 : original.pull;
				        const start = original === null || original === void 0 ? void 0 : original.start;
				        const type = original === null || original === void 0 ? void 0 : original.type;
				        return {
				            autoAllocateChunkSize: autoAllocateChunkSize === undefined ?
				                undefined :
				                convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
				            cancel: cancel === undefined ?
				                undefined :
				                convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
				            pull: pull === undefined ?
				                undefined :
				                convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
				            start: start === undefined ?
				                undefined :
				                convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
				            type: type === undefined ? undefined : convertReadableStreamType(type, `${context} has member 'type' that`)
				        };
				    }
				    function convertUnderlyingSourceCancelCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (reason) => promiseCall(fn, original, [reason]);
				    }
				    function convertUnderlyingSourcePullCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (controller) => promiseCall(fn, original, [controller]);
				    }
				    function convertUnderlyingSourceStartCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (controller) => reflectCall(fn, original, [controller]);
				    }
				    function convertReadableStreamType(type, context) {
				        type = `${type}`;
				        if (type !== 'bytes') {
				            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
				        }
				        return type;
				    }

				    function convertReaderOptions(options, context) {
				        assertDictionary(options, context);
				        const mode = options === null || options === void 0 ? void 0 : options.mode;
				        return {
				            mode: mode === undefined ? undefined : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
				        };
				    }
				    function convertReadableStreamReaderMode(mode, context) {
				        mode = `${mode}`;
				        if (mode !== 'byob') {
				            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
				        }
				        return mode;
				    }

				    function convertIteratorOptions(options, context) {
				        assertDictionary(options, context);
				        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
				        return { preventCancel: Boolean(preventCancel) };
				    }

				    function convertPipeOptions(options, context) {
				        assertDictionary(options, context);
				        const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
				        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
				        const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
				        const signal = options === null || options === void 0 ? void 0 : options.signal;
				        if (signal !== undefined) {
				            assertAbortSignal(signal, `${context} has member 'signal' that`);
				        }
				        return {
				            preventAbort: Boolean(preventAbort),
				            preventCancel: Boolean(preventCancel),
				            preventClose: Boolean(preventClose),
				            signal
				        };
				    }
				    function assertAbortSignal(signal, context) {
				        if (!isAbortSignal(signal)) {
				            throw new TypeError(`${context} is not an AbortSignal.`);
				        }
				    }

				    function convertReadableWritablePair(pair, context) {
				        assertDictionary(pair, context);
				        const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
				        assertRequiredField(readable, 'readable', 'ReadableWritablePair');
				        assertReadableStream(readable, `${context} has member 'readable' that`);
				        const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
				        assertRequiredField(writable, 'writable', 'ReadableWritablePair');
				        assertWritableStream(writable, `${context} has member 'writable' that`);
				        return { readable, writable };
				    }

				    /**
				     * A readable stream represents a source of data, from which you can read.
				     *
				     * @public
				     */
				    class ReadableStream {
				        constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
				            if (rawUnderlyingSource === undefined) {
				                rawUnderlyingSource = null;
				            }
				            else {
				                assertObject(rawUnderlyingSource, 'First parameter');
				            }
				            const strategy = convertQueuingStrategy(rawStrategy, 'Second parameter');
				            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, 'First parameter');
				            InitializeReadableStream(this);
				            if (underlyingSource.type === 'bytes') {
				                if (strategy.size !== undefined) {
				                    throw new RangeError('The strategy for a byte stream cannot have a size function');
				                }
				                const highWaterMark = ExtractHighWaterMark(strategy, 0);
				                SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
				            }
				            else {
				                const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
				                const highWaterMark = ExtractHighWaterMark(strategy, 1);
				                SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
				            }
				        }
				        /**
				         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
				         */
				        get locked() {
				            if (!IsReadableStream(this)) {
				                throw streamBrandCheckException$1('locked');
				            }
				            return IsReadableStreamLocked(this);
				        }
				        /**
				         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
				         *
				         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
				         * method, which might or might not use it.
				         */
				        cancel(reason = undefined) {
				            if (!IsReadableStream(this)) {
				                return promiseRejectedWith(streamBrandCheckException$1('cancel'));
				            }
				            if (IsReadableStreamLocked(this)) {
				                return promiseRejectedWith(new TypeError('Cannot cancel a stream that already has a reader'));
				            }
				            return ReadableStreamCancel(this, reason);
				        }
				        getReader(rawOptions = undefined) {
				            if (!IsReadableStream(this)) {
				                throw streamBrandCheckException$1('getReader');
				            }
				            const options = convertReaderOptions(rawOptions, 'First parameter');
				            if (options.mode === undefined) {
				                return AcquireReadableStreamDefaultReader(this);
				            }
				            return AcquireReadableStreamBYOBReader(this);
				        }
				        pipeThrough(rawTransform, rawOptions = {}) {
				            if (!IsReadableStream(this)) {
				                throw streamBrandCheckException$1('pipeThrough');
				            }
				            assertRequiredArgument(rawTransform, 1, 'pipeThrough');
				            const transform = convertReadableWritablePair(rawTransform, 'First parameter');
				            const options = convertPipeOptions(rawOptions, 'Second parameter');
				            if (IsReadableStreamLocked(this)) {
				                throw new TypeError('ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream');
				            }
				            if (IsWritableStreamLocked(transform.writable)) {
				                throw new TypeError('ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream');
				            }
				            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
				            setPromiseIsHandledToTrue(promise);
				            return transform.readable;
				        }
				        pipeTo(destination, rawOptions = {}) {
				            if (!IsReadableStream(this)) {
				                return promiseRejectedWith(streamBrandCheckException$1('pipeTo'));
				            }
				            if (destination === undefined) {
				                return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
				            }
				            if (!IsWritableStream(destination)) {
				                return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
				            }
				            let options;
				            try {
				                options = convertPipeOptions(rawOptions, 'Second parameter');
				            }
				            catch (e) {
				                return promiseRejectedWith(e);
				            }
				            if (IsReadableStreamLocked(this)) {
				                return promiseRejectedWith(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream'));
				            }
				            if (IsWritableStreamLocked(destination)) {
				                return promiseRejectedWith(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream'));
				            }
				            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
				        }
				        /**
				         * Tees this readable stream, returning a two-element array containing the two resulting branches as
				         * new {@link ReadableStream} instances.
				         *
				         * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
				         * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
				         * propagated to the stream's underlying source.
				         *
				         * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
				         * this could allow interference between the two branches.
				         */
				        tee() {
				            if (!IsReadableStream(this)) {
				                throw streamBrandCheckException$1('tee');
				            }
				            const branches = ReadableStreamTee(this);
				            return CreateArrayFromList(branches);
				        }
				        values(rawOptions = undefined) {
				            if (!IsReadableStream(this)) {
				                throw streamBrandCheckException$1('values');
				            }
				            const options = convertIteratorOptions(rawOptions, 'First parameter');
				            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
				        }
				    }
				    Object.defineProperties(ReadableStream.prototype, {
				        cancel: { enumerable: true },
				        getReader: { enumerable: true },
				        pipeThrough: { enumerable: true },
				        pipeTo: { enumerable: true },
				        tee: { enumerable: true },
				        values: { enumerable: true },
				        locked: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(ReadableStream.prototype, SymbolPolyfill.toStringTag, {
				            value: 'ReadableStream',
				            configurable: true
				        });
				    }
				    if (typeof SymbolPolyfill.asyncIterator === 'symbol') {
				        Object.defineProperty(ReadableStream.prototype, SymbolPolyfill.asyncIterator, {
				            value: ReadableStream.prototype.values,
				            writable: true,
				            configurable: true
				        });
				    }
				    // Abstract operations for the ReadableStream.
				    // Throws if and only if startAlgorithm throws.
				    function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
				        const stream = Object.create(ReadableStream.prototype);
				        InitializeReadableStream(stream);
				        const controller = Object.create(ReadableStreamDefaultController.prototype);
				        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
				        return stream;
				    }
				    // Throws if and only if startAlgorithm throws.
				    function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
				        const stream = Object.create(ReadableStream.prototype);
				        InitializeReadableStream(stream);
				        const controller = Object.create(ReadableByteStreamController.prototype);
				        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, undefined);
				        return stream;
				    }
				    function InitializeReadableStream(stream) {
				        stream._state = 'readable';
				        stream._reader = undefined;
				        stream._storedError = undefined;
				        stream._disturbed = false;
				    }
				    function IsReadableStream(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_readableStreamController')) {
				            return false;
				        }
				        return x instanceof ReadableStream;
				    }
				    function IsReadableStreamLocked(stream) {
				        if (stream._reader === undefined) {
				            return false;
				        }
				        return true;
				    }
				    // ReadableStream API exposed for controllers.
				    function ReadableStreamCancel(stream, reason) {
				        stream._disturbed = true;
				        if (stream._state === 'closed') {
				            return promiseResolvedWith(undefined);
				        }
				        if (stream._state === 'errored') {
				            return promiseRejectedWith(stream._storedError);
				        }
				        ReadableStreamClose(stream);
				        const reader = stream._reader;
				        if (reader !== undefined && IsReadableStreamBYOBReader(reader)) {
				            reader._readIntoRequests.forEach(readIntoRequest => {
				                readIntoRequest._closeSteps(undefined);
				            });
				            reader._readIntoRequests = new SimpleQueue();
				        }
				        const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
				        return transformPromiseWith(sourceCancelPromise, noop);
				    }
				    function ReadableStreamClose(stream) {
				        stream._state = 'closed';
				        const reader = stream._reader;
				        if (reader === undefined) {
				            return;
				        }
				        defaultReaderClosedPromiseResolve(reader);
				        if (IsReadableStreamDefaultReader(reader)) {
				            reader._readRequests.forEach(readRequest => {
				                readRequest._closeSteps();
				            });
				            reader._readRequests = new SimpleQueue();
				        }
				    }
				    function ReadableStreamError(stream, e) {
				        stream._state = 'errored';
				        stream._storedError = e;
				        const reader = stream._reader;
				        if (reader === undefined) {
				            return;
				        }
				        defaultReaderClosedPromiseReject(reader, e);
				        if (IsReadableStreamDefaultReader(reader)) {
				            reader._readRequests.forEach(readRequest => {
				                readRequest._errorSteps(e);
				            });
				            reader._readRequests = new SimpleQueue();
				        }
				        else {
				            reader._readIntoRequests.forEach(readIntoRequest => {
				                readIntoRequest._errorSteps(e);
				            });
				            reader._readIntoRequests = new SimpleQueue();
				        }
				    }
				    // Helper functions for the ReadableStream.
				    function streamBrandCheckException$1(name) {
				        return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
				    }

				    function convertQueuingStrategyInit(init, context) {
				        assertDictionary(init, context);
				        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
				        assertRequiredField(highWaterMark, 'highWaterMark', 'QueuingStrategyInit');
				        return {
				            highWaterMark: convertUnrestrictedDouble(highWaterMark)
				        };
				    }

				    // The size function must not have a prototype property nor be a constructor
				    const byteLengthSizeFunction = (chunk) => {
				        return chunk.byteLength;
				    };
				    try {
				        Object.defineProperty(byteLengthSizeFunction, 'name', {
				            value: 'size',
				            configurable: true
				        });
				    }
				    catch (_a) {
				        // This property is non-configurable in older browsers, so ignore if this throws.
				        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#browser_compatibility
				    }
				    /**
				     * A queuing strategy that counts the number of bytes in each chunk.
				     *
				     * @public
				     */
				    class ByteLengthQueuingStrategy {
				        constructor(options) {
				            assertRequiredArgument(options, 1, 'ByteLengthQueuingStrategy');
				            options = convertQueuingStrategyInit(options, 'First parameter');
				            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
				        }
				        /**
				         * Returns the high water mark provided to the constructor.
				         */
				        get highWaterMark() {
				            if (!IsByteLengthQueuingStrategy(this)) {
				                throw byteLengthBrandCheckException('highWaterMark');
				            }
				            return this._byteLengthQueuingStrategyHighWaterMark;
				        }
				        /**
				         * Measures the size of `chunk` by returning the value of its `byteLength` property.
				         */
				        get size() {
				            if (!IsByteLengthQueuingStrategy(this)) {
				                throw byteLengthBrandCheckException('size');
				            }
				            return byteLengthSizeFunction;
				        }
				    }
				    Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
				        highWaterMark: { enumerable: true },
				        size: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
				            value: 'ByteLengthQueuingStrategy',
				            configurable: true
				        });
				    }
				    // Helper functions for the ByteLengthQueuingStrategy.
				    function byteLengthBrandCheckException(name) {
				        return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
				    }
				    function IsByteLengthQueuingStrategy(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_byteLengthQueuingStrategyHighWaterMark')) {
				            return false;
				        }
				        return x instanceof ByteLengthQueuingStrategy;
				    }

				    // The size function must not have a prototype property nor be a constructor
				    const countSizeFunction = () => {
				        return 1;
				    };
				    try {
				        Object.defineProperty(countSizeFunction, 'name', {
				            value: 'size',
				            configurable: true
				        });
				    }
				    catch (_a) {
				        // This property is non-configurable in older browsers, so ignore if this throws.
				        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#browser_compatibility
				    }
				    /**
				     * A queuing strategy that counts the number of chunks.
				     *
				     * @public
				     */
				    class CountQueuingStrategy {
				        constructor(options) {
				            assertRequiredArgument(options, 1, 'CountQueuingStrategy');
				            options = convertQueuingStrategyInit(options, 'First parameter');
				            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
				        }
				        /**
				         * Returns the high water mark provided to the constructor.
				         */
				        get highWaterMark() {
				            if (!IsCountQueuingStrategy(this)) {
				                throw countBrandCheckException('highWaterMark');
				            }
				            return this._countQueuingStrategyHighWaterMark;
				        }
				        /**
				         * Measures the size of `chunk` by always returning 1.
				         * This ensures that the total queue size is a count of the number of chunks in the queue.
				         */
				        get size() {
				            if (!IsCountQueuingStrategy(this)) {
				                throw countBrandCheckException('size');
				            }
				            return countSizeFunction;
				        }
				    }
				    Object.defineProperties(CountQueuingStrategy.prototype, {
				        highWaterMark: { enumerable: true },
				        size: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
				            value: 'CountQueuingStrategy',
				            configurable: true
				        });
				    }
				    // Helper functions for the CountQueuingStrategy.
				    function countBrandCheckException(name) {
				        return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
				    }
				    function IsCountQueuingStrategy(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_countQueuingStrategyHighWaterMark')) {
				            return false;
				        }
				        return x instanceof CountQueuingStrategy;
				    }

				    function convertTransformer(original, context) {
				        assertDictionary(original, context);
				        const flush = original === null || original === void 0 ? void 0 : original.flush;
				        const readableType = original === null || original === void 0 ? void 0 : original.readableType;
				        const start = original === null || original === void 0 ? void 0 : original.start;
				        const transform = original === null || original === void 0 ? void 0 : original.transform;
				        const writableType = original === null || original === void 0 ? void 0 : original.writableType;
				        return {
				            flush: flush === undefined ?
				                undefined :
				                convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
				            readableType,
				            start: start === undefined ?
				                undefined :
				                convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
				            transform: transform === undefined ?
				                undefined :
				                convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
				            writableType
				        };
				    }
				    function convertTransformerFlushCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (controller) => promiseCall(fn, original, [controller]);
				    }
				    function convertTransformerStartCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (controller) => reflectCall(fn, original, [controller]);
				    }
				    function convertTransformerTransformCallback(fn, original, context) {
				        assertFunction(fn, context);
				        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
				    }

				    // Class TransformStream
				    /**
				     * A transform stream consists of a pair of streams: a {@link WritableStream | writable stream},
				     * known as its writable side, and a {@link ReadableStream | readable stream}, known as its readable side.
				     * In a manner specific to the transform stream in question, writes to the writable side result in new data being
				     * made available for reading from the readable side.
				     *
				     * @public
				     */
				    class TransformStream {
				        constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
				            if (rawTransformer === undefined) {
				                rawTransformer = null;
				            }
				            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, 'Second parameter');
				            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, 'Third parameter');
				            const transformer = convertTransformer(rawTransformer, 'First parameter');
				            if (transformer.readableType !== undefined) {
				                throw new RangeError('Invalid readableType specified');
				            }
				            if (transformer.writableType !== undefined) {
				                throw new RangeError('Invalid writableType specified');
				            }
				            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
				            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
				            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
				            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
				            let startPromise_resolve;
				            const startPromise = newPromise(resolve => {
				                startPromise_resolve = resolve;
				            });
				            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
				            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
				            if (transformer.start !== undefined) {
				                startPromise_resolve(transformer.start(this._transformStreamController));
				            }
				            else {
				                startPromise_resolve(undefined);
				            }
				        }
				        /**
				         * The readable side of the transform stream.
				         */
				        get readable() {
				            if (!IsTransformStream(this)) {
				                throw streamBrandCheckException('readable');
				            }
				            return this._readable;
				        }
				        /**
				         * The writable side of the transform stream.
				         */
				        get writable() {
				            if (!IsTransformStream(this)) {
				                throw streamBrandCheckException('writable');
				            }
				            return this._writable;
				        }
				    }
				    Object.defineProperties(TransformStream.prototype, {
				        readable: { enumerable: true },
				        writable: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
				            value: 'TransformStream',
				            configurable: true
				        });
				    }
				    function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
				        function startAlgorithm() {
				            return startPromise;
				        }
				        function writeAlgorithm(chunk) {
				            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
				        }
				        function abortAlgorithm(reason) {
				            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
				        }
				        function closeAlgorithm() {
				            return TransformStreamDefaultSinkCloseAlgorithm(stream);
				        }
				        stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
				        function pullAlgorithm() {
				            return TransformStreamDefaultSourcePullAlgorithm(stream);
				        }
				        function cancelAlgorithm(reason) {
				            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
				            return promiseResolvedWith(undefined);
				        }
				        stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
				        // The [[backpressure]] slot is set to undefined so that it can be initialised by TransformStreamSetBackpressure.
				        stream._backpressure = undefined;
				        stream._backpressureChangePromise = undefined;
				        stream._backpressureChangePromise_resolve = undefined;
				        TransformStreamSetBackpressure(stream, true);
				        stream._transformStreamController = undefined;
				    }
				    function IsTransformStream(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_transformStreamController')) {
				            return false;
				        }
				        return x instanceof TransformStream;
				    }
				    // This is a no-op if both sides are already errored.
				    function TransformStreamError(stream, e) {
				        ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e);
				        TransformStreamErrorWritableAndUnblockWrite(stream, e);
				    }
				    function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
				        TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
				        WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e);
				        if (stream._backpressure) {
				            // Pretend that pull() was called to permit any pending write() calls to complete. TransformStreamSetBackpressure()
				            // cannot be called from enqueue() or pull() once the ReadableStream is errored, so this will will be the final time
				            // _backpressure is set.
				            TransformStreamSetBackpressure(stream, false);
				        }
				    }
				    function TransformStreamSetBackpressure(stream, backpressure) {
				        // Passes also when called during construction.
				        if (stream._backpressureChangePromise !== undefined) {
				            stream._backpressureChangePromise_resolve();
				        }
				        stream._backpressureChangePromise = newPromise(resolve => {
				            stream._backpressureChangePromise_resolve = resolve;
				        });
				        stream._backpressure = backpressure;
				    }
				    // Class TransformStreamDefaultController
				    /**
				     * Allows control of the {@link ReadableStream} and {@link WritableStream} of the associated {@link TransformStream}.
				     *
				     * @public
				     */
				    class TransformStreamDefaultController {
				        constructor() {
				            throw new TypeError('Illegal constructor');
				        }
				        /**
				         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
				         */
				        get desiredSize() {
				            if (!IsTransformStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException('desiredSize');
				            }
				            const readableController = this._controlledTransformStream._readable._readableStreamController;
				            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
				        }
				        enqueue(chunk = undefined) {
				            if (!IsTransformStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException('enqueue');
				            }
				            TransformStreamDefaultControllerEnqueue(this, chunk);
				        }
				        /**
				         * Errors both the readable side and the writable side of the controlled transform stream, making all future
				         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
				         */
				        error(reason = undefined) {
				            if (!IsTransformStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException('error');
				            }
				            TransformStreamDefaultControllerError(this, reason);
				        }
				        /**
				         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
				         * transformer only needs to consume a portion of the chunks written to the writable side.
				         */
				        terminate() {
				            if (!IsTransformStreamDefaultController(this)) {
				                throw defaultControllerBrandCheckException('terminate');
				            }
				            TransformStreamDefaultControllerTerminate(this);
				        }
				    }
				    Object.defineProperties(TransformStreamDefaultController.prototype, {
				        enqueue: { enumerable: true },
				        error: { enumerable: true },
				        terminate: { enumerable: true },
				        desiredSize: { enumerable: true }
				    });
				    if (typeof SymbolPolyfill.toStringTag === 'symbol') {
				        Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
				            value: 'TransformStreamDefaultController',
				            configurable: true
				        });
				    }
				    // Transform Stream Default Controller Abstract Operations
				    function IsTransformStreamDefaultController(x) {
				        if (!typeIsObject(x)) {
				            return false;
				        }
				        if (!Object.prototype.hasOwnProperty.call(x, '_controlledTransformStream')) {
				            return false;
				        }
				        return x instanceof TransformStreamDefaultController;
				    }
				    function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
				        controller._controlledTransformStream = stream;
				        stream._transformStreamController = controller;
				        controller._transformAlgorithm = transformAlgorithm;
				        controller._flushAlgorithm = flushAlgorithm;
				    }
				    function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
				        const controller = Object.create(TransformStreamDefaultController.prototype);
				        let transformAlgorithm = (chunk) => {
				            try {
				                TransformStreamDefaultControllerEnqueue(controller, chunk);
				                return promiseResolvedWith(undefined);
				            }
				            catch (transformResultE) {
				                return promiseRejectedWith(transformResultE);
				            }
				        };
				        let flushAlgorithm = () => promiseResolvedWith(undefined);
				        if (transformer.transform !== undefined) {
				            transformAlgorithm = chunk => transformer.transform(chunk, controller);
				        }
				        if (transformer.flush !== undefined) {
				            flushAlgorithm = () => transformer.flush(controller);
				        }
				        SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
				    }
				    function TransformStreamDefaultControllerClearAlgorithms(controller) {
				        controller._transformAlgorithm = undefined;
				        controller._flushAlgorithm = undefined;
				    }
				    function TransformStreamDefaultControllerEnqueue(controller, chunk) {
				        const stream = controller._controlledTransformStream;
				        const readableController = stream._readable._readableStreamController;
				        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
				            throw new TypeError('Readable side is not in a state that permits enqueue');
				        }
				        // We throttle transform invocations based on the backpressure of the ReadableStream, but we still
				        // accept TransformStreamDefaultControllerEnqueue() calls.
				        try {
				            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
				        }
				        catch (e) {
				            // This happens when readableStrategy.size() throws.
				            TransformStreamErrorWritableAndUnblockWrite(stream, e);
				            throw stream._readable._storedError;
				        }
				        const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
				        if (backpressure !== stream._backpressure) {
				            TransformStreamSetBackpressure(stream, true);
				        }
				    }
				    function TransformStreamDefaultControllerError(controller, e) {
				        TransformStreamError(controller._controlledTransformStream, e);
				    }
				    function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
				        const transformPromise = controller._transformAlgorithm(chunk);
				        return transformPromiseWith(transformPromise, undefined, r => {
				            TransformStreamError(controller._controlledTransformStream, r);
				            throw r;
				        });
				    }
				    function TransformStreamDefaultControllerTerminate(controller) {
				        const stream = controller._controlledTransformStream;
				        const readableController = stream._readable._readableStreamController;
				        ReadableStreamDefaultControllerClose(readableController);
				        const error = new TypeError('TransformStream terminated');
				        TransformStreamErrorWritableAndUnblockWrite(stream, error);
				    }
				    // TransformStreamDefaultSink Algorithms
				    function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
				        const controller = stream._transformStreamController;
				        if (stream._backpressure) {
				            const backpressureChangePromise = stream._backpressureChangePromise;
				            return transformPromiseWith(backpressureChangePromise, () => {
				                const writable = stream._writable;
				                const state = writable._state;
				                if (state === 'erroring') {
				                    throw writable._storedError;
				                }
				                return TransformStreamDefaultControllerPerformTransform(controller, chunk);
				            });
				        }
				        return TransformStreamDefaultControllerPerformTransform(controller, chunk);
				    }
				    function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
				        // abort() is not called synchronously, so it is possible for abort() to be called when the stream is already
				        // errored.
				        TransformStreamError(stream, reason);
				        return promiseResolvedWith(undefined);
				    }
				    function TransformStreamDefaultSinkCloseAlgorithm(stream) {
				        // stream._readable cannot change after construction, so caching it across a call to user code is safe.
				        const readable = stream._readable;
				        const controller = stream._transformStreamController;
				        const flushPromise = controller._flushAlgorithm();
				        TransformStreamDefaultControllerClearAlgorithms(controller);
				        // Return a promise that is fulfilled with undefined on success.
				        return transformPromiseWith(flushPromise, () => {
				            if (readable._state === 'errored') {
				                throw readable._storedError;
				            }
				            ReadableStreamDefaultControllerClose(readable._readableStreamController);
				        }, r => {
				            TransformStreamError(stream, r);
				            throw readable._storedError;
				        });
				    }
				    // TransformStreamDefaultSource Algorithms
				    function TransformStreamDefaultSourcePullAlgorithm(stream) {
				        // Invariant. Enforced by the promises returned by start() and pull().
				        TransformStreamSetBackpressure(stream, false);
				        // Prevent the next pull() call until there is backpressure.
				        return stream._backpressureChangePromise;
				    }
				    // Helper functions for the TransformStreamDefaultController.
				    function defaultControllerBrandCheckException(name) {
				        return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
				    }
				    // Helper functions for the TransformStream.
				    function streamBrandCheckException(name) {
				        return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
				    }

				    exports.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
				    exports.CountQueuingStrategy = CountQueuingStrategy;
				    exports.ReadableByteStreamController = ReadableByteStreamController;
				    exports.ReadableStream = ReadableStream;
				    exports.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
				    exports.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
				    exports.ReadableStreamDefaultController = ReadableStreamDefaultController;
				    exports.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
				    exports.TransformStream = TransformStream;
				    exports.TransformStreamDefaultController = TransformStreamDefaultController;
				    exports.WritableStream = WritableStream;
				    exports.WritableStreamDefaultController = WritableStreamDefaultController;
				    exports.WritableStreamDefaultWriter = WritableStreamDefaultWriter;

				    Object.defineProperty(exports, '__esModule', { value: true });

				})));
				
		} (ponyfill_es2018, ponyfill_es2018.exports));
			return ponyfill_es2018.exports;
		}

		/* c8 ignore start */

		// 64 KiB (same size chrome slice theirs blob into Uint8array's)
		const POOL_SIZE$1 = 65536;

		if (!globalThis.ReadableStream) {
		  // `node:stream/web` got introduced in v16.5.0 as experimental
		  // and it's preferred over the polyfilled version. So we also
		  // suppress the warning that gets emitted by NodeJS for using it.
		  try {
		    const process = require('node:process');
		    const { emitWarning } = process;
		    try {
		      process.emitWarning = () => {};
		      Object.assign(globalThis, require('node:stream/web'));
		      process.emitWarning = emitWarning;
		    } catch (error) {
		      process.emitWarning = emitWarning;
		      throw error
		    }
		  } catch (error) {
		    // fallback to polyfill implementation
		    Object.assign(globalThis, requirePonyfill_es2018());
		  }
		}

		try {
		  // Don't use node: prefix for this, require+node: is not supported until node v14.14
		  // Only `import()` can use prefix in 12.20 and later
		  const { Blob } = require('buffer');
		  if (Blob && !Blob.prototype.stream) {
		    Blob.prototype.stream = function name (params) {
		      let position = 0;
		      const blob = this;

		      return new ReadableStream({
		        type: 'bytes',
		        async pull (ctrl) {
		          const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
		          const buffer = await chunk.arrayBuffer();
		          position += buffer.byteLength;
		          ctrl.enqueue(new Uint8Array(buffer));

		          if (position === blob.size) {
		            ctrl.close();
		          }
		        }
		      })
		    };
		  }
		} catch (error) {}

		/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

		// 64 KiB (same size chrome slice theirs blob into Uint8array's)
		const POOL_SIZE = 65536;

		/** @param {(Blob | Uint8Array)[]} parts */
		async function * toIterator (parts, clone = true) {
		  for (const part of parts) {
		    if ('stream' in part) {
		      yield * (/** @type {AsyncIterableIterator<Uint8Array>} */ (part.stream()));
		    } else if (ArrayBuffer.isView(part)) {
		      if (clone) {
		        let position = part.byteOffset;
		        const end = part.byteOffset + part.byteLength;
		        while (position !== end) {
		          const size = Math.min(end - position, POOL_SIZE);
		          const chunk = part.buffer.slice(position, position + size);
		          position += chunk.byteLength;
		          yield new Uint8Array(chunk);
		        }
		      } else {
		        yield part;
		      }
		    /* c8 ignore next 10 */
		    } else {
		      // For blobs that have arrayBuffer but no stream method (nodes buffer.Blob)
		      let position = 0, b = (/** @type {Blob} */ (part));
		      while (position !== b.size) {
		        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
		        const buffer = await chunk.arrayBuffer();
		        position += buffer.byteLength;
		        yield new Uint8Array(buffer);
		      }
		    }
		  }
		}

		const _Blob = class Blob {
		  /** @type {Array.<(Blob|Uint8Array)>} */
		  #parts = []
		  #type = ''
		  #size = 0
		  #endings = 'transparent'

		  /**
		   * The Blob() constructor returns a new Blob object. The content
		   * of the blob consists of the concatenation of the values given
		   * in the parameter array.
		   *
		   * @param {*} blobParts
		   * @param {{ type?: string, endings?: string }} [options]
		   */
		  constructor (blobParts = [], options = {}) {
		    if (typeof blobParts !== 'object' || blobParts === null) {
		      throw new TypeError('Failed to construct \'Blob\': The provided value cannot be converted to a sequence.')
		    }

		    if (typeof blobParts[Symbol.iterator] !== 'function') {
		      throw new TypeError('Failed to construct \'Blob\': The object must have a callable @@iterator property.')
		    }

		    if (typeof options !== 'object' && typeof options !== 'function') {
		      throw new TypeError('Failed to construct \'Blob\': parameter 2 cannot convert to dictionary.')
		    }

		    if (options === null) options = {};

		    const encoder = new TextEncoder();
		    for (const element of blobParts) {
		      let part;
		      if (ArrayBuffer.isView(element)) {
		        part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
		      } else if (element instanceof ArrayBuffer) {
		        part = new Uint8Array(element.slice(0));
		      } else if (element instanceof Blob) {
		        part = element;
		      } else {
		        part = encoder.encode(`${element}`);
		      }

		      const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
		      // Avoid pushing empty parts into the array to better GC them
		      if (size) {
		        this.#size += size;
		        this.#parts.push(part);
		      }
		    }

		    this.#endings = `${options.endings === undefined ? 'transparent' : options.endings}`;
		    const type = options.type === undefined ? '' : String(options.type);
		    this.#type = /^[\x20-\x7E]*$/.test(type) ? type : '';
		  }

		  /**
		   * The Blob interface's size property returns the
		   * size of the Blob in bytes.
		   */
		  get size () {
		    return this.#size
		  }

		  /**
		   * The type property of a Blob object returns the MIME type of the file.
		   */
		  get type () {
		    return this.#type
		  }

		  /**
		   * The text() method in the Blob interface returns a Promise
		   * that resolves with a string containing the contents of
		   * the blob, interpreted as UTF-8.
		   *
		   * @return {Promise<string>}
		   */
		  async text () {
		    // More optimized than using this.arrayBuffer()
		    // that requires twice as much ram
		    const decoder = new TextDecoder();
		    let str = '';
		    for await (const part of toIterator(this.#parts, false)) {
		      str += decoder.decode(part, { stream: true });
		    }
		    // Remaining
		    str += decoder.decode();
		    return str
		  }

		  /**
		   * The arrayBuffer() method in the Blob interface returns a
		   * Promise that resolves with the contents of the blob as
		   * binary data contained in an ArrayBuffer.
		   *
		   * @return {Promise<ArrayBuffer>}
		   */
		  async arrayBuffer () {
		    // Easier way... Just a unnecessary overhead
		    // const view = new Uint8Array(this.size);
		    // await this.stream().getReader({mode: 'byob'}).read(view);
		    // return view.buffer;

		    const data = new Uint8Array(this.size);
		    let offset = 0;
		    for await (const chunk of toIterator(this.#parts, false)) {
		      data.set(chunk, offset);
		      offset += chunk.length;
		    }

		    return data.buffer
		  }

		  stream () {
		    const it = toIterator(this.#parts, true);

		    return new globalThis.ReadableStream({
		      // @ts-ignore
		      type: 'bytes',
		      async pull (ctrl) {
		        const chunk = await it.next();
		        chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
		      },

		      async cancel () {
		        await it.return();
		      }
		    })
		  }

		  /**
		   * The Blob interface's slice() method creates and returns a
		   * new Blob object which contains data from a subset of the
		   * blob on which it's called.
		   *
		   * @param {number} [start]
		   * @param {number} [end]
		   * @param {string} [type]
		   */
		  slice (start = 0, end = this.size, type = '') {
		    const { size } = this;

		    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
		    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);

		    const span = Math.max(relativeEnd - relativeStart, 0);
		    const parts = this.#parts;
		    const blobParts = [];
		    let added = 0;

		    for (const part of parts) {
		      // don't add the overflow to new blobParts
		      if (added >= span) {
		        break
		      }

		      const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
		      if (relativeStart && size <= relativeStart) {
		        // Skip the beginning and change the relative
		        // start & end position as we skip the unwanted parts
		        relativeStart -= size;
		        relativeEnd -= size;
		      } else {
		        let chunk;
		        if (ArrayBuffer.isView(part)) {
		          chunk = part.subarray(relativeStart, Math.min(size, relativeEnd));
		          added += chunk.byteLength;
		        } else {
		          chunk = part.slice(relativeStart, Math.min(size, relativeEnd));
		          added += chunk.size;
		        }
		        relativeEnd -= size;
		        blobParts.push(chunk);
		        relativeStart = 0; // All next sequential parts should start at 0
		      }
		    }

		    const blob = new Blob([], { type: String(type).toLowerCase() });
		    blob.#size = span;
		    blob.#parts = blobParts;

		    return blob
		  }

		  get [Symbol.toStringTag] () {
		    return 'Blob'
		  }

		  static [Symbol.hasInstance] (object) {
		    return (
		      object &&
		      typeof object === 'object' &&
		      typeof object.constructor === 'function' &&
		      (
		        typeof object.stream === 'function' ||
		        typeof object.arrayBuffer === 'function'
		      ) &&
		      /^(Blob|File)$/.test(object[Symbol.toStringTag])
		    )
		  }
		};

		Object.defineProperties(_Blob.prototype, {
		  size: { enumerable: true },
		  type: { enumerable: true },
		  slice: { enumerable: true }
		});

		/** @type {typeof globalThis.Blob} */
		const Blob = _Blob;
		const _Blob$1 = Blob;

		const _File = class File extends _Blob$1 {
		  #lastModified = 0
		  #name = ''

		  /**
		   * @param {*[]} fileBits
		   * @param {string} fileName
		   * @param {{lastModified?: number, type?: string}} options
		   */// @ts-ignore
		  constructor (fileBits, fileName, options = {}) {
		    if (arguments.length < 2) {
		      throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`)
		    }
		    super(fileBits, options);

		    if (options === null) options = {};

		    // Simulate WebIDL type casting for NaN value in lastModified option.
		    const lastModified = options.lastModified === undefined ? Date.now() : Number(options.lastModified);
		    if (!Number.isNaN(lastModified)) {
		      this.#lastModified = lastModified;
		    }

		    this.#name = String(fileName);
		  }

		  get name () {
		    return this.#name
		  }

		  get lastModified () {
		    return this.#lastModified
		  }

		  get [Symbol.toStringTag] () {
		    return 'File'
		  }

		  static [Symbol.hasInstance] (object) {
		    return !!object && object instanceof _Blob$1 &&
		      /^(File)$/.test(object[Symbol.toStringTag])
		  }
		};

		/** @type {typeof globalThis.File} */// @ts-ignore
		const File = _File;
		const File$1 = File;

		/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

		var {toStringTag:t,iterator:i,hasInstance:h}=Symbol,
		r=Math.random,
		m='append,set,get,getAll,delete,keys,values,entries,forEach,constructor'.split(','),
		f=(a,b,c)=>(a+='',/^(Blob|File)$/.test(b && b[t])?[(c=c!==void 0?c+'':b[t]=='File'?b.name:'blob',a),b.name!==c||b[t]=='blob'?new File$1([b],c,b):b]:[a,b+'']),
		e=(c,f)=>(f?c:c.replace(/\r?\n|\r/g,'\r\n')).replace(/\n/g,'%0A').replace(/\r/g,'%0D').replace(/"/g,'%22'),
		x=(n, a, e)=>{if(a.length<e){throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e} arguments required, but only ${a.length} present.`)}};

		/** @type {typeof globalThis.FormData} */
		const FormData = class FormData {
		#d=[];
		constructor(...a){if(a.length)throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`)}
		get [t]() {return 'FormData'}
		[i](){return this.entries()}
		static [h](o) {return o&&typeof o==='object'&&o[t]==='FormData'&&!m.some(m=>typeof o[m]!='function')}
		append(...a){x('append',arguments,2);this.#d.push(f(...a));}
		delete(a){x('delete',arguments,1);a+='';this.#d=this.#d.filter(([b])=>b!==a);}
		get(a){x('get',arguments,1);a+='';for(var b=this.#d,l=b.length,c=0;c<l;c++)if(b[c][0]===a)return b[c][1];return null}
		getAll(a,b){x('getAll',arguments,1);b=[];a+='';this.#d.forEach(c=>c[0]===a&&b.push(c[1]));return b}
		has(a){x('has',arguments,1);a+='';return this.#d.some(b=>b[0]===a)}
		forEach(a,b){x('forEach',arguments,1);for(var [c,d]of this)a.call(b,d,c,this);}
		set(...a){x('set',arguments,2);var b=[],c=!0;a=f(...a);this.#d.forEach(d=>{d[0]===a[0]?c&&(c=!b.push(a)):b.push(d);});c&&b.push(a);this.#d=b;}
		*entries(){yield*this.#d;}
		*keys(){for(var[a]of this)yield a;}
		*values(){for(var[,a]of this)yield a;}};

		/** @param {FormData} F */
		function formDataToBlob (F,B=_Blob$1){
		var b=`${r()}${r()}`.replace(/\./g, '').slice(-28).padStart(32, '-'),c=[],p=`--${b}\r\nContent-Disposition: form-data; name="`;
		F.forEach((v,n)=>typeof v=='string'
		?c.push(p+e(n)+`"\r\n\r\n${v.replace(/\r(?!\n)|(?<!\r)\n/g, '\r\n')}\r\n`)
		:c.push(p+e(n)+`"; filename="${e(v.name, 1)}"\r\nContent-Type: ${v.type||"application/octet-stream"}\r\n\r\n`, v, '\r\n'));
		c.push(`--${b}--`);
		return new B(c,{type:"multipart/form-data; boundary="+b})}

		class FetchBaseError extends Error {
			constructor(message, type) {
				super(message);
				// Hide custom error implementation details from end-users
				Error.captureStackTrace(this, this.constructor);

				this.type = type;
			}

			get name() {
				return this.constructor.name;
			}

			get [Symbol.toStringTag]() {
				return this.constructor.name;
			}
		}

		/**
		 * @typedef {{ address?: string, code: string, dest?: string, errno: number, info?: object, message: string, path?: string, port?: number, syscall: string}} SystemError
		*/

		/**
		 * FetchError interface for operational errors
		 */
		class FetchError extends FetchBaseError {
			/**
			 * @param  {string} message -      Error message for human
			 * @param  {string} [type] -        Error type for machine
			 * @param  {SystemError} [systemError] - For Node.js system error
			 */
			constructor(message, type, systemError) {
				super(message, type);
				// When err.type is `system`, err.erroredSysCall contains system error and err.code contains system error code
				if (systemError) {
					// eslint-disable-next-line no-multi-assign
					this.code = this.errno = systemError.code;
					this.erroredSysCall = systemError.syscall;
				}
			}
		}

		/**
		 * Is.js
		 *
		 * Object type checks.
		 */

		const NAME = Symbol.toStringTag;

		/**
		 * Check if `obj` is a URLSearchParams object
		 * ref: https://github.com/node-fetch/node-fetch/issues/296#issuecomment-307598143
		 * @param {*} object - Object to check for
		 * @return {boolean}
		 */
		const isURLSearchParameters = object => {
			return (
				typeof object === 'object' &&
				typeof object.append === 'function' &&
				typeof object.delete === 'function' &&
				typeof object.get === 'function' &&
				typeof object.getAll === 'function' &&
				typeof object.has === 'function' &&
				typeof object.set === 'function' &&
				typeof object.sort === 'function' &&
				object[NAME] === 'URLSearchParams'
			);
		};

		/**
		 * Check if `object` is a W3C `Blob` object (which `File` inherits from)
		 * @param {*} object - Object to check for
		 * @return {boolean}
		 */
		const isBlob = object => {
			return (
				object &&
				typeof object === 'object' &&
				typeof object.arrayBuffer === 'function' &&
				typeof object.type === 'string' &&
				typeof object.stream === 'function' &&
				typeof object.constructor === 'function' &&
				/^(Blob|File)$/.test(object[NAME])
			);
		};

		/**
		 * Check if `obj` is an instance of AbortSignal.
		 * @param {*} object - Object to check for
		 * @return {boolean}
		 */
		const isAbortSignal = object => {
			return (
				typeof object === 'object' && (
					object[NAME] === 'AbortSignal' ||
					object[NAME] === 'EventTarget'
				)
			);
		};

		/**
		 * isDomainOrSubdomain reports whether sub is a subdomain (or exact match) of
		 * the parent domain.
		 *
		 * Both domains must already be in canonical form.
		 * @param {string|URL} original
		 * @param {string|URL} destination
		 */
		const isDomainOrSubdomain = (destination, original) => {
			const orig = new URL(original).hostname;
			const dest = new URL(destination).hostname;

			return orig === dest || orig.endsWith(`.${dest}`);
		};

		/**
		 * isSameProtocol reports whether the two provided URLs use the same protocol.
		 *
		 * Both domains must already be in canonical form.
		 * @param {string|URL} original
		 * @param {string|URL} destination
		 */
		const isSameProtocol = (destination, original) => {
			const orig = new URL(original).protocol;
			const dest = new URL(destination).protocol;

			return orig === dest;
		};

		const pipeline = node_util.promisify(Stream.pipeline);
		const INTERNALS$2 = Symbol('Body internals');

		/**
		 * Body mixin
		 *
		 * Ref: https://fetch.spec.whatwg.org/#body
		 *
		 * @param   Stream  body  Readable stream
		 * @param   Object  opts  Response options
		 * @return  Void
		 */
		class Body {
			constructor(body, {
				size = 0
			} = {}) {
				let boundary = null;

				if (body === null) {
					// Body is undefined or null
					body = null;
				} else if (isURLSearchParameters(body)) {
					// Body is a URLSearchParams
					body = node_buffer.Buffer.from(body.toString());
				} else if (isBlob(body)) ; else if (node_buffer.Buffer.isBuffer(body)) ; else if (node_util.types.isAnyArrayBuffer(body)) {
					// Body is ArrayBuffer
					body = node_buffer.Buffer.from(body);
				} else if (ArrayBuffer.isView(body)) {
					// Body is ArrayBufferView
					body = node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
				} else if (body instanceof Stream) ; else if (body instanceof FormData) {
					// Body is FormData
					body = formDataToBlob(body);
					boundary = body.type.split('=')[1];
				} else {
					// None of the above
					// coerce to string then buffer
					body = node_buffer.Buffer.from(String(body));
				}

				let stream = body;

				if (node_buffer.Buffer.isBuffer(body)) {
					stream = Stream.Readable.from(body);
				} else if (isBlob(body)) {
					stream = Stream.Readable.from(body.stream());
				}

				this[INTERNALS$2] = {
					body,
					stream,
					boundary,
					disturbed: false,
					error: null
				};
				this.size = size;

				if (body instanceof Stream) {
					body.on('error', error_ => {
						const error = error_ instanceof FetchBaseError ?
							error_ :
							new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, 'system', error_);
						this[INTERNALS$2].error = error;
					});
				}
			}

			get body() {
				return this[INTERNALS$2].stream;
			}

			get bodyUsed() {
				return this[INTERNALS$2].disturbed;
			}

			/**
			 * Decode response as ArrayBuffer
			 *
			 * @return  Promise
			 */
			async arrayBuffer() {
				const {buffer, byteOffset, byteLength} = await consumeBody(this);
				return buffer.slice(byteOffset, byteOffset + byteLength);
			}

			async formData() {
				const ct = this.headers.get('content-type');

				if (ct.startsWith('application/x-www-form-urlencoded')) {
					const formData = new FormData();
					const parameters = new URLSearchParams(await this.text());

					for (const [name, value] of parameters) {
						formData.append(name, value);
					}

					return formData;
				}

				const {toFormData} = await import('./multipart-parser-1523cd03.js').then(function (n) { return n.m; });
				return toFormData(this.body, ct);
			}

			/**
			 * Return raw response as Blob
			 *
			 * @return Promise
			 */
			async blob() {
				const ct = (this.headers && this.headers.get('content-type')) || (this[INTERNALS$2].body && this[INTERNALS$2].body.type) || '';
				const buf = await this.arrayBuffer();

				return new _Blob$1([buf], {
					type: ct
				});
			}

			/**
			 * Decode response as json
			 *
			 * @return  Promise
			 */
			async json() {
				const text = await this.text();
				return JSON.parse(text);
			}

			/**
			 * Decode response as text
			 *
			 * @return  Promise
			 */
			async text() {
				const buffer = await consumeBody(this);
				return new TextDecoder().decode(buffer);
			}

			/**
			 * Decode response as buffer (non-spec api)
			 *
			 * @return  Promise
			 */
			buffer() {
				return consumeBody(this);
			}
		}

		Body.prototype.buffer = node_util.deprecate(Body.prototype.buffer, 'Please use \'response.arrayBuffer()\' instead of \'response.buffer()\'', 'node-fetch#buffer');

		// In browsers, all properties are enumerable.
		Object.defineProperties(Body.prototype, {
			body: {enumerable: true},
			bodyUsed: {enumerable: true},
			arrayBuffer: {enumerable: true},
			blob: {enumerable: true},
			json: {enumerable: true},
			text: {enumerable: true},
			data: {get: node_util.deprecate(() => {},
				'data doesn\'t exist, use json(), text(), arrayBuffer(), or body instead',
				'https://github.com/node-fetch/node-fetch/issues/1000 (response)')}
		});

		/**
		 * Consume and convert an entire Body to a Buffer.
		 *
		 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
		 *
		 * @return Promise
		 */
		async function consumeBody(data) {
			if (data[INTERNALS$2].disturbed) {
				throw new TypeError(`body used already for: ${data.url}`);
			}

			data[INTERNALS$2].disturbed = true;

			if (data[INTERNALS$2].error) {
				throw data[INTERNALS$2].error;
			}

			const {body} = data;

			// Body is null
			if (body === null) {
				return node_buffer.Buffer.alloc(0);
			}

			/* c8 ignore next 3 */
			if (!(body instanceof Stream)) {
				return node_buffer.Buffer.alloc(0);
			}

			// Body is stream
			// get ready to actually consume the body
			const accum = [];
			let accumBytes = 0;

			try {
				for await (const chunk of body) {
					if (data.size > 0 && accumBytes + chunk.length > data.size) {
						const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, 'max-size');
						body.destroy(error);
						throw error;
					}

					accumBytes += chunk.length;
					accum.push(chunk);
				}
			} catch (error) {
				const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, 'system', error);
				throw error_;
			}

			if (body.readableEnded === true || body._readableState.ended === true) {
				try {
					if (accum.every(c => typeof c === 'string')) {
						return node_buffer.Buffer.from(accum.join(''));
					}

					return node_buffer.Buffer.concat(accum, accumBytes);
				} catch (error) {
					throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, 'system', error);
				}
			} else {
				throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
			}
		}

		/**
		 * Clone body given Res/Req instance
		 *
		 * @param   Mixed   instance       Response or Request instance
		 * @param   String  highWaterMark  highWaterMark for both PassThrough body streams
		 * @return  Mixed
		 */
		const clone = (instance, highWaterMark) => {
			let p1;
			let p2;
			let {body} = instance[INTERNALS$2];

			// Don't allow cloning a used body
			if (instance.bodyUsed) {
				throw new Error('cannot clone body after it is used');
			}

			// Check that body is a stream and not form-data object
			// note: we can't clone the form-data object without having it as a dependency
			if ((body instanceof Stream) && (typeof body.getBoundary !== 'function')) {
				// Tee instance body
				p1 = new Stream.PassThrough({highWaterMark});
				p2 = new Stream.PassThrough({highWaterMark});
				body.pipe(p1);
				body.pipe(p2);
				// Set instance body to teed body and return the other teed body
				instance[INTERNALS$2].stream = p1;
				body = p2;
			}

			return body;
		};

		const getNonSpecFormDataBoundary = node_util.deprecate(
			body => body.getBoundary(),
			'form-data doesn\'t follow the spec and requires special treatment. Use alternative package',
			'https://github.com/node-fetch/node-fetch/issues/1167'
		);

		/**
		 * Performs the operation "extract a `Content-Type` value from |object|" as
		 * specified in the specification:
		 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
		 *
		 * This function assumes that instance.body is present.
		 *
		 * @param {any} body Any options.body input
		 * @returns {string | null}
		 */
		const extractContentType = (body, request) => {
			// Body is null or undefined
			if (body === null) {
				return null;
			}

			// Body is string
			if (typeof body === 'string') {
				return 'text/plain;charset=UTF-8';
			}

			// Body is a URLSearchParams
			if (isURLSearchParameters(body)) {
				return 'application/x-www-form-urlencoded;charset=UTF-8';
			}

			// Body is blob
			if (isBlob(body)) {
				return body.type || null;
			}

			// Body is a Buffer (Buffer, ArrayBuffer or ArrayBufferView)
			if (node_buffer.Buffer.isBuffer(body) || node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
				return null;
			}

			if (body instanceof FormData) {
				return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
			}

			// Detect form data input from form-data module
			if (body && typeof body.getBoundary === 'function') {
				return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
			}

			// Body is stream - can't really do much about this
			if (body instanceof Stream) {
				return null;
			}

			// Body constructor defaults other things to string
			return 'text/plain;charset=UTF-8';
		};

		/**
		 * The Fetch Standard treats this as if "total bytes" is a property on the body.
		 * For us, we have to explicitly get it with a function.
		 *
		 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
		 *
		 * @param {any} obj.body Body object from the Body instance.
		 * @returns {number | null}
		 */
		const getTotalBytes = request => {
			const {body} = request[INTERNALS$2];

			// Body is null or undefined
			if (body === null) {
				return 0;
			}

			// Body is Blob
			if (isBlob(body)) {
				return body.size;
			}

			// Body is Buffer
			if (node_buffer.Buffer.isBuffer(body)) {
				return body.length;
			}

			// Detect form data input from form-data module
			if (body && typeof body.getLengthSync === 'function') {
				return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
			}

			// Body is stream
			return null;
		};

		/**
		 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
		 *
		 * @param {Stream.Writable} dest The stream to write to.
		 * @param obj.body Body object from the Body instance.
		 * @returns {Promise<void>}
		 */
		const writeToStream = async (dest, {body}) => {
			if (body === null) {
				// Body is null
				dest.end();
			} else {
				// Body is stream
				await pipeline(body, dest);
			}
		};

		/**
		 * Headers.js
		 *
		 * Headers class offers convenient helpers
		 */

		/* c8 ignore next 9 */
		const validateHeaderName = typeof http.validateHeaderName === 'function' ?
			http.validateHeaderName :
			name => {
				if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
					const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
					Object.defineProperty(error, 'code', {value: 'ERR_INVALID_HTTP_TOKEN'});
					throw error;
				}
			};

		/* c8 ignore next 9 */
		const validateHeaderValue = typeof http.validateHeaderValue === 'function' ?
			http.validateHeaderValue :
			(name, value) => {
				if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
					const error = new TypeError(`Invalid character in header content ["${name}"]`);
					Object.defineProperty(error, 'code', {value: 'ERR_INVALID_CHAR'});
					throw error;
				}
			};

		/**
		 * @typedef {Headers | Record<string, string> | Iterable<readonly [string, string]> | Iterable<Iterable<string>>} HeadersInit
		 */

		/**
		 * This Fetch API interface allows you to perform various actions on HTTP request and response headers.
		 * These actions include retrieving, setting, adding to, and removing.
		 * A Headers object has an associated header list, which is initially empty and consists of zero or more name and value pairs.
		 * You can add to this using methods like append() (see Examples.)
		 * In all methods of this interface, header names are matched by case-insensitive byte sequence.
		 *
		 */
		class Headers extends URLSearchParams {
			/**
			 * Headers class
			 *
			 * @constructor
			 * @param {HeadersInit} [init] - Response headers
			 */
			constructor(init) {
				// Validate and normalize init object in [name, value(s)][]
				/** @type {string[][]} */
				let result = [];
				if (init instanceof Headers) {
					const raw = init.raw();
					for (const [name, values] of Object.entries(raw)) {
						result.push(...values.map(value => [name, value]));
					}
				} else if (init == null) ; else if (typeof init === 'object' && !node_util.types.isBoxedPrimitive(init)) {
					const method = init[Symbol.iterator];
					// eslint-disable-next-line no-eq-null, eqeqeq
					if (method == null) {
						// Record<ByteString, ByteString>
						result.push(...Object.entries(init));
					} else {
						if (typeof method !== 'function') {
							throw new TypeError('Header pairs must be iterable');
						}

						// Sequence<sequence<ByteString>>
						// Note: per spec we have to first exhaust the lists then process them
						result = [...init]
							.map(pair => {
								if (
									typeof pair !== 'object' || node_util.types.isBoxedPrimitive(pair)
								) {
									throw new TypeError('Each header pair must be an iterable object');
								}

								return [...pair];
							}).map(pair => {
								if (pair.length !== 2) {
									throw new TypeError('Each header pair must be a name/value tuple');
								}

								return [...pair];
							});
					}
				} else {
					throw new TypeError('Failed to construct \'Headers\': The provided value is not of type \'(sequence<sequence<ByteString>> or record<ByteString, ByteString>)');
				}

				// Validate and lowercase
				result =
					result.length > 0 ?
						result.map(([name, value]) => {
							validateHeaderName(name);
							validateHeaderValue(name, String(value));
							return [String(name).toLowerCase(), String(value)];
						}) :
						undefined;

				super(result);

				// Returning a Proxy that will lowercase key names, validate parameters and sort keys
				// eslint-disable-next-line no-constructor-return
				return new Proxy(this, {
					get(target, p, receiver) {
						switch (p) {
							case 'append':
							case 'set':
								return (name, value) => {
									validateHeaderName(name);
									validateHeaderValue(name, String(value));
									return URLSearchParams.prototype[p].call(
										target,
										String(name).toLowerCase(),
										String(value)
									);
								};

							case 'delete':
							case 'has':
							case 'getAll':
								return name => {
									validateHeaderName(name);
									return URLSearchParams.prototype[p].call(
										target,
										String(name).toLowerCase()
									);
								};

							case 'keys':
								return () => {
									target.sort();
									return new Set(URLSearchParams.prototype.keys.call(target)).keys();
								};

							default:
								return Reflect.get(target, p, receiver);
						}
					}
				});
				/* c8 ignore next */
			}

			get [Symbol.toStringTag]() {
				return this.constructor.name;
			}

			toString() {
				return Object.prototype.toString.call(this);
			}

			get(name) {
				const values = this.getAll(name);
				if (values.length === 0) {
					return null;
				}

				let value = values.join(', ');
				if (/^content-encoding$/i.test(name)) {
					value = value.toLowerCase();
				}

				return value;
			}

			forEach(callback, thisArg = undefined) {
				for (const name of this.keys()) {
					Reflect.apply(callback, thisArg, [this.get(name), name, this]);
				}
			}

			* values() {
				for (const name of this.keys()) {
					yield this.get(name);
				}
			}

			/**
			 * @type {() => IterableIterator<[string, string]>}
			 */
			* entries() {
				for (const name of this.keys()) {
					yield [name, this.get(name)];
				}
			}

			[Symbol.iterator]() {
				return this.entries();
			}

			/**
			 * Node-fetch non-spec method
			 * returning all headers and their values as array
			 * @returns {Record<string, string[]>}
			 */
			raw() {
				return [...this.keys()].reduce((result, key) => {
					result[key] = this.getAll(key);
					return result;
				}, {});
			}

			/**
			 * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
			 */
			[Symbol.for('nodejs.util.inspect.custom')]() {
				return [...this.keys()].reduce((result, key) => {
					const values = this.getAll(key);
					// Http.request() only supports string as Host header.
					// This hack makes specifying custom Host header possible.
					if (key === 'host') {
						result[key] = values[0];
					} else {
						result[key] = values.length > 1 ? values : values[0];
					}

					return result;
				}, {});
			}
		}

		/**
		 * Re-shaping object for Web IDL tests
		 * Only need to do it for overridden methods
		 */
		Object.defineProperties(
			Headers.prototype,
			['get', 'entries', 'forEach', 'values'].reduce((result, property) => {
				result[property] = {enumerable: true};
				return result;
			}, {})
		);

		/**
		 * Create a Headers object from an http.IncomingMessage.rawHeaders, ignoring those that do
		 * not conform to HTTP grammar productions.
		 * @param {import('http').IncomingMessage['rawHeaders']} headers
		 */
		function fromRawHeaders(headers = []) {
			return new Headers(
				headers
					// Split into pairs
					.reduce((result, value, index, array) => {
						if (index % 2 === 0) {
							result.push(array.slice(index, index + 2));
						}

						return result;
					}, [])
					.filter(([name, value]) => {
						try {
							validateHeaderName(name);
							validateHeaderValue(name, String(value));
							return true;
						} catch {
							return false;
						}
					})

			);
		}

		const redirectStatus = new Set([301, 302, 303, 307, 308]);

		/**
		 * Redirect code matching
		 *
		 * @param {number} code - Status code
		 * @return {boolean}
		 */
		const isRedirect = code => {
			return redirectStatus.has(code);
		};

		/**
		 * Response.js
		 *
		 * Response class provides content decoding
		 */

		const INTERNALS$1 = Symbol('Response internals');

		/**
		 * Response class
		 *
		 * Ref: https://fetch.spec.whatwg.org/#response-class
		 *
		 * @param   Stream  body  Readable stream
		 * @param   Object  opts  Response options
		 * @return  Void
		 */
		class Response extends Body {
			constructor(body = null, options = {}) {
				super(body, options);

				// eslint-disable-next-line no-eq-null, eqeqeq, no-negated-condition
				const status = options.status != null ? options.status : 200;

				const headers = new Headers(options.headers);

				if (body !== null && !headers.has('Content-Type')) {
					const contentType = extractContentType(body, this);
					if (contentType) {
						headers.append('Content-Type', contentType);
					}
				}

				this[INTERNALS$1] = {
					type: 'default',
					url: options.url,
					status,
					statusText: options.statusText || '',
					headers,
					counter: options.counter,
					highWaterMark: options.highWaterMark
				};
			}

			get type() {
				return this[INTERNALS$1].type;
			}

			get url() {
				return this[INTERNALS$1].url || '';
			}

			get status() {
				return this[INTERNALS$1].status;
			}

			/**
			 * Convenience property representing if the request ended normally
			 */
			get ok() {
				return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
			}

			get redirected() {
				return this[INTERNALS$1].counter > 0;
			}

			get statusText() {
				return this[INTERNALS$1].statusText;
			}

			get headers() {
				return this[INTERNALS$1].headers;
			}

			get highWaterMark() {
				return this[INTERNALS$1].highWaterMark;
			}

			/**
			 * Clone this response
			 *
			 * @return  Response
			 */
			clone() {
				return new Response(clone(this, this.highWaterMark), {
					type: this.type,
					url: this.url,
					status: this.status,
					statusText: this.statusText,
					headers: this.headers,
					ok: this.ok,
					redirected: this.redirected,
					size: this.size,
					highWaterMark: this.highWaterMark
				});
			}

			/**
			 * @param {string} url    The URL that the new response is to originate from.
			 * @param {number} status An optional status code for the response (e.g., 302.)
			 * @returns {Response}    A Response object.
			 */
			static redirect(url, status = 302) {
				if (!isRedirect(status)) {
					throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
				}

				return new Response(null, {
					headers: {
						location: new URL(url).toString()
					},
					status
				});
			}

			static error() {
				const response = new Response(null, {status: 0, statusText: ''});
				response[INTERNALS$1].type = 'error';
				return response;
			}

			static json(data = undefined, init = {}) {
				const body = JSON.stringify(data);

				if (body === undefined) {
					throw new TypeError('data is not JSON serializable');
				}

				const headers = new Headers(init && init.headers);

				if (!headers.has('content-type')) {
					headers.set('content-type', 'application/json');
				}

				return new Response(body, {
					...init,
					headers
				});
			}

			get [Symbol.toStringTag]() {
				return 'Response';
			}
		}

		Object.defineProperties(Response.prototype, {
			type: {enumerable: true},
			url: {enumerable: true},
			status: {enumerable: true},
			ok: {enumerable: true},
			redirected: {enumerable: true},
			statusText: {enumerable: true},
			headers: {enumerable: true},
			clone: {enumerable: true}
		});

		const getSearch = parsedURL => {
			if (parsedURL.search) {
				return parsedURL.search;
			}

			const lastOffset = parsedURL.href.length - 1;
			const hash = parsedURL.hash || (parsedURL.href[lastOffset] === '#' ? '#' : '');
			return parsedURL.href[lastOffset - hash.length] === '?' ? '?' : '';
		};

		/**
		 * @external URL
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URL|URL}
		 */

		/**
		 * @module utils/referrer
		 * @private
		 */

		/**
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#strip-url|Referrer Policy §8.4. Strip url for use as a referrer}
		 * @param {string} URL
		 * @param {boolean} [originOnly=false]
		 */
		function stripURLForUseAsAReferrer(url, originOnly = false) {
			// 1. If url is null, return no referrer.
			if (url == null) { // eslint-disable-line no-eq-null, eqeqeq
				return 'no-referrer';
			}

			url = new URL(url);

			// 2. If url's scheme is a local scheme, then return no referrer.
			if (/^(about|blob|data):$/.test(url.protocol)) {
				return 'no-referrer';
			}

			// 3. Set url's username to the empty string.
			url.username = '';

			// 4. Set url's password to null.
			// Note: `null` appears to be a mistake as this actually results in the password being `"null"`.
			url.password = '';

			// 5. Set url's fragment to null.
			// Note: `null` appears to be a mistake as this actually results in the fragment being `"#null"`.
			url.hash = '';

			// 6. If the origin-only flag is true, then:
			if (originOnly) {
				// 6.1. Set url's path to null.
				// Note: `null` appears to be a mistake as this actually results in the path being `"/null"`.
				url.pathname = '';

				// 6.2. Set url's query to null.
				// Note: `null` appears to be a mistake as this actually results in the query being `"?null"`.
				url.search = '';
			}

			// 7. Return url.
			return url;
		}

		/**
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#enumdef-referrerpolicy|enum ReferrerPolicy}
		 */
		const ReferrerPolicy = new Set([
			'',
			'no-referrer',
			'no-referrer-when-downgrade',
			'same-origin',
			'origin',
			'strict-origin',
			'origin-when-cross-origin',
			'strict-origin-when-cross-origin',
			'unsafe-url'
		]);

		/**
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#default-referrer-policy|default referrer policy}
		 */
		const DEFAULT_REFERRER_POLICY = 'strict-origin-when-cross-origin';

		/**
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#referrer-policies|Referrer Policy §3. Referrer Policies}
		 * @param {string} referrerPolicy
		 * @returns {string} referrerPolicy
		 */
		function validateReferrerPolicy(referrerPolicy) {
			if (!ReferrerPolicy.has(referrerPolicy)) {
				throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
			}

			return referrerPolicy;
		}

		/**
		 * @see {@link https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy|Referrer Policy §3.2. Is origin potentially trustworthy?}
		 * @param {external:URL} url
		 * @returns `true`: "Potentially Trustworthy", `false`: "Not Trustworthy"
		 */
		function isOriginPotentiallyTrustworthy(url) {
			// 1. If origin is an opaque origin, return "Not Trustworthy".
			// Not applicable

			// 2. Assert: origin is a tuple origin.
			// Not for implementations

			// 3. If origin's scheme is either "https" or "wss", return "Potentially Trustworthy".
			if (/^(http|ws)s:$/.test(url.protocol)) {
				return true;
			}

			// 4. If origin's host component matches one of the CIDR notations 127.0.0.0/8 or ::1/128 [RFC4632], return "Potentially Trustworthy".
			const hostIp = url.host.replace(/(^\[)|(]$)/g, '');
			const hostIPVersion = node_net.isIP(hostIp);

			if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
				return true;
			}

			if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
				return true;
			}

			// 5. If origin's host component is "localhost" or falls within ".localhost", and the user agent conforms to the name resolution rules in [let-localhost-be-localhost], return "Potentially Trustworthy".
			// We are returning FALSE here because we cannot ensure conformance to
			// let-localhost-be-loalhost (https://tools.ietf.org/html/draft-west-let-localhost-be-localhost)
			if (url.host === 'localhost' || url.host.endsWith('.localhost')) {
				return false;
			}

			// 6. If origin's scheme component is file, return "Potentially Trustworthy".
			if (url.protocol === 'file:') {
				return true;
			}

			// 7. If origin's scheme component is one which the user agent considers to be authenticated, return "Potentially Trustworthy".
			// Not supported

			// 8. If origin has been configured as a trustworthy origin, return "Potentially Trustworthy".
			// Not supported

			// 9. Return "Not Trustworthy".
			return false;
		}

		/**
		 * @see {@link https://w3c.github.io/webappsec-secure-contexts/#is-url-trustworthy|Referrer Policy §3.3. Is url potentially trustworthy?}
		 * @param {external:URL} url
		 * @returns `true`: "Potentially Trustworthy", `false`: "Not Trustworthy"
		 */
		function isUrlPotentiallyTrustworthy(url) {
			// 1. If url is "about:blank" or "about:srcdoc", return "Potentially Trustworthy".
			if (/^about:(blank|srcdoc)$/.test(url)) {
				return true;
			}

			// 2. If url's scheme is "data", return "Potentially Trustworthy".
			if (url.protocol === 'data:') {
				return true;
			}

			// Note: The origin of blob: and filesystem: URLs is the origin of the context in which they were
			// created. Therefore, blobs created in a trustworthy origin will themselves be potentially
			// trustworthy.
			if (/^(blob|filesystem):$/.test(url.protocol)) {
				return true;
			}

			// 3. Return the result of executing §3.2 Is origin potentially trustworthy? on url's origin.
			return isOriginPotentiallyTrustworthy(url);
		}

		/**
		 * Modifies the referrerURL to enforce any extra security policy considerations.
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#determine-requests-referrer|Referrer Policy §8.3. Determine request's Referrer}, step 7
		 * @callback module:utils/referrer~referrerURLCallback
		 * @param {external:URL} referrerURL
		 * @returns {external:URL} modified referrerURL
		 */

		/**
		 * Modifies the referrerOrigin to enforce any extra security policy considerations.
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#determine-requests-referrer|Referrer Policy §8.3. Determine request's Referrer}, step 7
		 * @callback module:utils/referrer~referrerOriginCallback
		 * @param {external:URL} referrerOrigin
		 * @returns {external:URL} modified referrerOrigin
		 */

		/**
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#determine-requests-referrer|Referrer Policy §8.3. Determine request's Referrer}
		 * @param {Request} request
		 * @param {object} o
		 * @param {module:utils/referrer~referrerURLCallback} o.referrerURLCallback
		 * @param {module:utils/referrer~referrerOriginCallback} o.referrerOriginCallback
		 * @returns {external:URL} Request's referrer
		 */
		function determineRequestsReferrer(request, {referrerURLCallback, referrerOriginCallback} = {}) {
			// There are 2 notes in the specification about invalid pre-conditions.  We return null, here, for
			// these cases:
			// > Note: If request's referrer is "no-referrer", Fetch will not call into this algorithm.
			// > Note: If request's referrer policy is the empty string, Fetch will not call into this
			// > algorithm.
			if (request.referrer === 'no-referrer' || request.referrerPolicy === '') {
				return null;
			}

			// 1. Let policy be request's associated referrer policy.
			const policy = request.referrerPolicy;

			// 2. Let environment be request's client.
			// not applicable to node.js

			// 3. Switch on request's referrer:
			if (request.referrer === 'about:client') {
				return 'no-referrer';
			}

			// "a URL": Let referrerSource be request's referrer.
			const referrerSource = request.referrer;

			// 4. Let request's referrerURL be the result of stripping referrerSource for use as a referrer.
			let referrerURL = stripURLForUseAsAReferrer(referrerSource);

			// 5. Let referrerOrigin be the result of stripping referrerSource for use as a referrer, with the
			//    origin-only flag set to true.
			let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);

			// 6. If the result of serializing referrerURL is a string whose length is greater than 4096, set
			//    referrerURL to referrerOrigin.
			if (referrerURL.toString().length > 4096) {
				referrerURL = referrerOrigin;
			}

			// 7. The user agent MAY alter referrerURL or referrerOrigin at this point to enforce arbitrary
			//    policy considerations in the interests of minimizing data leakage. For example, the user
			//    agent could strip the URL down to an origin, modify its host, replace it with an empty
			//    string, etc.
			if (referrerURLCallback) {
				referrerURL = referrerURLCallback(referrerURL);
			}

			if (referrerOriginCallback) {
				referrerOrigin = referrerOriginCallback(referrerOrigin);
			}

			// 8.Execute the statements corresponding to the value of policy:
			const currentURL = new URL(request.url);

			switch (policy) {
				case 'no-referrer':
					return 'no-referrer';

				case 'origin':
					return referrerOrigin;

				case 'unsafe-url':
					return referrerURL;

				case 'strict-origin':
					// 1. If referrerURL is a potentially trustworthy URL and request's current URL is not a
					//    potentially trustworthy URL, then return no referrer.
					if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
						return 'no-referrer';
					}

					// 2. Return referrerOrigin.
					return referrerOrigin.toString();

				case 'strict-origin-when-cross-origin':
					// 1. If the origin of referrerURL and the origin of request's current URL are the same, then
					//    return referrerURL.
					if (referrerURL.origin === currentURL.origin) {
						return referrerURL;
					}

					// 2. If referrerURL is a potentially trustworthy URL and request's current URL is not a
					//    potentially trustworthy URL, then return no referrer.
					if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
						return 'no-referrer';
					}

					// 3. Return referrerOrigin.
					return referrerOrigin;

				case 'same-origin':
					// 1. If the origin of referrerURL and the origin of request's current URL are the same, then
					//    return referrerURL.
					if (referrerURL.origin === currentURL.origin) {
						return referrerURL;
					}

					// 2. Return no referrer.
					return 'no-referrer';

				case 'origin-when-cross-origin':
					// 1. If the origin of referrerURL and the origin of request's current URL are the same, then
					//    return referrerURL.
					if (referrerURL.origin === currentURL.origin) {
						return referrerURL;
					}

					// Return referrerOrigin.
					return referrerOrigin;

				case 'no-referrer-when-downgrade':
					// 1. If referrerURL is a potentially trustworthy URL and request's current URL is not a
					//    potentially trustworthy URL, then return no referrer.
					if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
						return 'no-referrer';
					}

					// 2. Return referrerURL.
					return referrerURL;

				default:
					throw new TypeError(`Invalid referrerPolicy: ${policy}`);
			}
		}

		/**
		 * @see {@link https://w3c.github.io/webappsec-referrer-policy/#parse-referrer-policy-from-header|Referrer Policy §8.1. Parse a referrer policy from a Referrer-Policy header}
		 * @param {Headers} headers Response headers
		 * @returns {string} policy
		 */
		function parseReferrerPolicyFromHeader(headers) {
			// 1. Let policy-tokens be the result of extracting header list values given `Referrer-Policy`
			//    and response’s header list.
			const policyTokens = (headers.get('referrer-policy') || '').split(/[,\s]+/);

			// 2. Let policy be the empty string.
			let policy = '';

			// 3. For each token in policy-tokens, if token is a referrer policy and token is not the empty
			//    string, then set policy to token.
			// Note: This algorithm loops over multiple policy values to allow deployment of new policy
			// values with fallbacks for older user agents, as described in § 11.1 Unknown Policy Values.
			for (const token of policyTokens) {
				if (token && ReferrerPolicy.has(token)) {
					policy = token;
				}
			}

			// 4. Return policy.
			return policy;
		}

		/**
		 * Request.js
		 *
		 * Request class contains server only options
		 *
		 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
		 */

		const INTERNALS = Symbol('Request internals');

		/**
		 * Check if `obj` is an instance of Request.
		 *
		 * @param  {*} object
		 * @return {boolean}
		 */
		const isRequest = object => {
			return (
				typeof object === 'object' &&
				typeof object[INTERNALS] === 'object'
			);
		};

		const doBadDataWarn = node_util.deprecate(() => {},
			'.data is not a valid RequestInit property, use .body instead',
			'https://github.com/node-fetch/node-fetch/issues/1000 (request)');

		/**
		 * Request class
		 *
		 * Ref: https://fetch.spec.whatwg.org/#request-class
		 *
		 * @param   Mixed   input  Url or Request instance
		 * @param   Object  init   Custom options
		 * @return  Void
		 */
		class Request extends Body {
			constructor(input, init = {}) {
				let parsedURL;

				// Normalize input and force URL to be encoded as UTF-8 (https://github.com/node-fetch/node-fetch/issues/245)
				if (isRequest(input)) {
					parsedURL = new URL(input.url);
				} else {
					parsedURL = new URL(input);
					input = {};
				}

				if (parsedURL.username !== '' || parsedURL.password !== '') {
					throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
				}

				let method = init.method || input.method || 'GET';
				if (/^(delete|get|head|options|post|put)$/i.test(method)) {
					method = method.toUpperCase();
				}

				if (!isRequest(init) && 'data' in init) {
					doBadDataWarn();
				}

				// eslint-disable-next-line no-eq-null, eqeqeq
				if ((init.body != null || (isRequest(input) && input.body !== null)) &&
					(method === 'GET' || method === 'HEAD')) {
					throw new TypeError('Request with GET/HEAD method cannot have body');
				}

				const inputBody = init.body ?
					init.body :
					(isRequest(input) && input.body !== null ?
						clone(input) :
						null);

				super(inputBody, {
					size: init.size || input.size || 0
				});

				const headers = new Headers(init.headers || input.headers || {});

				if (inputBody !== null && !headers.has('Content-Type')) {
					const contentType = extractContentType(inputBody, this);
					if (contentType) {
						headers.set('Content-Type', contentType);
					}
				}

				let signal = isRequest(input) ?
					input.signal :
					null;
				if ('signal' in init) {
					signal = init.signal;
				}

				// eslint-disable-next-line no-eq-null, eqeqeq
				if (signal != null && !isAbortSignal(signal)) {
					throw new TypeError('Expected signal to be an instanceof AbortSignal or EventTarget');
				}

				// §5.4, Request constructor steps, step 15.1
				// eslint-disable-next-line no-eq-null, eqeqeq
				let referrer = init.referrer == null ? input.referrer : init.referrer;
				if (referrer === '') {
					// §5.4, Request constructor steps, step 15.2
					referrer = 'no-referrer';
				} else if (referrer) {
					// §5.4, Request constructor steps, step 15.3.1, 15.3.2
					const parsedReferrer = new URL(referrer);
					// §5.4, Request constructor steps, step 15.3.3, 15.3.4
					referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? 'client' : parsedReferrer;
				} else {
					referrer = undefined;
				}

				this[INTERNALS] = {
					method,
					redirect: init.redirect || input.redirect || 'follow',
					headers,
					parsedURL,
					signal,
					referrer
				};

				// Node-fetch-only options
				this.follow = init.follow === undefined ? (input.follow === undefined ? 20 : input.follow) : init.follow;
				this.compress = init.compress === undefined ? (input.compress === undefined ? true : input.compress) : init.compress;
				this.counter = init.counter || input.counter || 0;
				this.agent = init.agent || input.agent;
				this.highWaterMark = init.highWaterMark || input.highWaterMark || 16384;
				this.insecureHTTPParser = init.insecureHTTPParser || input.insecureHTTPParser || false;

				// §5.4, Request constructor steps, step 16.
				// Default is empty string per https://fetch.spec.whatwg.org/#concept-request-referrer-policy
				this.referrerPolicy = init.referrerPolicy || input.referrerPolicy || '';
			}

			/** @returns {string} */
			get method() {
				return this[INTERNALS].method;
			}

			/** @returns {string} */
			get url() {
				return node_url.format(this[INTERNALS].parsedURL);
			}

			/** @returns {Headers} */
			get headers() {
				return this[INTERNALS].headers;
			}

			get redirect() {
				return this[INTERNALS].redirect;
			}

			/** @returns {AbortSignal} */
			get signal() {
				return this[INTERNALS].signal;
			}

			// https://fetch.spec.whatwg.org/#dom-request-referrer
			get referrer() {
				if (this[INTERNALS].referrer === 'no-referrer') {
					return '';
				}

				if (this[INTERNALS].referrer === 'client') {
					return 'about:client';
				}

				if (this[INTERNALS].referrer) {
					return this[INTERNALS].referrer.toString();
				}

				return undefined;
			}

			get referrerPolicy() {
				return this[INTERNALS].referrerPolicy;
			}

			set referrerPolicy(referrerPolicy) {
				this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
			}

			/**
			 * Clone this request
			 *
			 * @return  Request
			 */
			clone() {
				return new Request(this);
			}

			get [Symbol.toStringTag]() {
				return 'Request';
			}
		}

		Object.defineProperties(Request.prototype, {
			method: {enumerable: true},
			url: {enumerable: true},
			headers: {enumerable: true},
			redirect: {enumerable: true},
			clone: {enumerable: true},
			signal: {enumerable: true},
			referrer: {enumerable: true},
			referrerPolicy: {enumerable: true}
		});

		/**
		 * Convert a Request to Node.js http request options.
		 *
		 * @param {Request} request - A Request instance
		 * @return The options object to be passed to http.request
		 */
		const getNodeRequestOptions = request => {
			const {parsedURL} = request[INTERNALS];
			const headers = new Headers(request[INTERNALS].headers);

			// Fetch step 1.3
			if (!headers.has('Accept')) {
				headers.set('Accept', '*/*');
			}

			// HTTP-network-or-cache fetch steps 2.4-2.7
			let contentLengthValue = null;
			if (request.body === null && /^(post|put)$/i.test(request.method)) {
				contentLengthValue = '0';
			}

			if (request.body !== null) {
				const totalBytes = getTotalBytes(request);
				// Set Content-Length if totalBytes is a number (that is not NaN)
				if (typeof totalBytes === 'number' && !Number.isNaN(totalBytes)) {
					contentLengthValue = String(totalBytes);
				}
			}

			if (contentLengthValue) {
				headers.set('Content-Length', contentLengthValue);
			}

			// 4.1. Main fetch, step 2.6
			// > If request's referrer policy is the empty string, then set request's referrer policy to the
			// > default referrer policy.
			if (request.referrerPolicy === '') {
				request.referrerPolicy = DEFAULT_REFERRER_POLICY;
			}

			// 4.1. Main fetch, step 2.7
			// > If request's referrer is not "no-referrer", set request's referrer to the result of invoking
			// > determine request's referrer.
			if (request.referrer && request.referrer !== 'no-referrer') {
				request[INTERNALS].referrer = determineRequestsReferrer(request);
			} else {
				request[INTERNALS].referrer = 'no-referrer';
			}

			// 4.5. HTTP-network-or-cache fetch, step 6.9
			// > If httpRequest's referrer is a URL, then append `Referer`/httpRequest's referrer, serialized
			// >  and isomorphic encoded, to httpRequest's header list.
			if (request[INTERNALS].referrer instanceof URL) {
				headers.set('Referer', request.referrer);
			}

			// HTTP-network-or-cache fetch step 2.11
			if (!headers.has('User-Agent')) {
				headers.set('User-Agent', 'node-fetch');
			}

			// HTTP-network-or-cache fetch step 2.15
			if (request.compress && !headers.has('Accept-Encoding')) {
				headers.set('Accept-Encoding', 'gzip, deflate, br');
			}

			let {agent} = request;
			if (typeof agent === 'function') {
				agent = agent(parsedURL);
			}

			if (!headers.has('Connection') && !agent) {
				headers.set('Connection', 'close');
			}

			// HTTP-network fetch step 4.2
			// chunked encoding is handled by Node.js

			const search = getSearch(parsedURL);

			// Pass the full URL directly to request(), but overwrite the following
			// options:
			const options = {
				// Overwrite search to retain trailing ? (issue #776)
				path: parsedURL.pathname + search,
				// The following options are not expressed in the URL
				method: request.method,
				headers: headers[Symbol.for('nodejs.util.inspect.custom')](),
				insecureHTTPParser: request.insecureHTTPParser,
				agent
			};

			return {
				/** @type {URL} */
				parsedURL,
				options
			};
		};

		/**
		 * AbortError interface for cancelled requests
		 */
		class AbortError extends FetchBaseError {
			constructor(message, type = 'aborted') {
				super(message, type);
			}
		}

		/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

		if (!globalThis.DOMException) {
		  try {
		    const { MessageChannel } = require('worker_threads'),
		    port = new MessageChannel().port1,
		    ab = new ArrayBuffer();
		    port.postMessage(ab, [ab, ab]);
		  } catch (err) {
		    err.constructor.name === 'DOMException' && (
		      globalThis.DOMException = err.constructor
		    );
		  }
		}

		var nodeDomexception = globalThis.DOMException;

		/**
		 * Index.js
		 *
		 * a request API compatible with window.fetch
		 *
		 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
		 */

		const supportedSchemas = new Set(['data:', 'http:', 'https:']);

		/**
		 * Fetch function
		 *
		 * @param   {string | URL | import('./request').default} url - Absolute url or Request instance
		 * @param   {*} [options_] - Fetch options
		 * @return  {Promise<import('./response').default>}
		 */
		async function fetch(url, options_) {
			return new Promise((resolve, reject) => {
				// Build request object
				const request = new Request(url, options_);
				const {parsedURL, options} = getNodeRequestOptions(request);
				if (!supportedSchemas.has(parsedURL.protocol)) {
					throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, '')}" is not supported.`);
				}

				if (parsedURL.protocol === 'data:') {
					const data = dataUriToBuffer(request.url);
					const response = new Response(data, {headers: {'Content-Type': data.typeFull}});
					resolve(response);
					return;
				}

				// Wrap http.request into fetch
				const send = (parsedURL.protocol === 'https:' ? https : http).request;
				const {signal} = request;
				let response = null;

				const abort = () => {
					const error = new AbortError('The operation was aborted.');
					reject(error);
					if (request.body && request.body instanceof Stream.Readable) {
						request.body.destroy(error);
					}

					if (!response || !response.body) {
						return;
					}

					response.body.emit('error', error);
				};

				if (signal && signal.aborted) {
					abort();
					return;
				}

				const abortAndFinalize = () => {
					abort();
					finalize();
				};

				// Send request
				const request_ = send(parsedURL.toString(), options);

				if (signal) {
					signal.addEventListener('abort', abortAndFinalize);
				}

				const finalize = () => {
					request_.abort();
					if (signal) {
						signal.removeEventListener('abort', abortAndFinalize);
					}
				};

				request_.on('error', error => {
					reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, 'system', error));
					finalize();
				});

				fixResponseChunkedTransferBadEnding(request_, error => {
					if (response && response.body) {
						response.body.destroy(error);
					}
				});

				/* c8 ignore next 18 */
				if (process.version < 'v14') {
					// Before Node.js 14, pipeline() does not fully support async iterators and does not always
					// properly handle when the socket close/end events are out of order.
					request_.on('socket', s => {
						let endedWithEventsCount;
						s.prependListener('end', () => {
							endedWithEventsCount = s._eventsCount;
						});
						s.prependListener('close', hadError => {
							// if end happened before close but the socket didn't emit an error, do it now
							if (response && endedWithEventsCount < s._eventsCount && !hadError) {
								const error = new Error('Premature close');
								error.code = 'ERR_STREAM_PREMATURE_CLOSE';
								response.body.emit('error', error);
							}
						});
					});
				}

				request_.on('response', response_ => {
					request_.setTimeout(0);
					const headers = fromRawHeaders(response_.rawHeaders);

					// HTTP fetch step 5
					if (isRedirect(response_.statusCode)) {
						// HTTP fetch step 5.2
						const location = headers.get('Location');

						// HTTP fetch step 5.3
						let locationURL = null;
						try {
							locationURL = location === null ? null : new URL(location, request.url);
						} catch {
							// error here can only be invalid URL in Location: header
							// do not throw when options.redirect == manual
							// let the user extract the errorneous redirect URL
							if (request.redirect !== 'manual') {
								reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, 'invalid-redirect'));
								finalize();
								return;
							}
						}

						// HTTP fetch step 5.5
						switch (request.redirect) {
							case 'error':
								reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
								finalize();
								return;
							case 'manual':
								// Nothing to do
								break;
							case 'follow': {
								// HTTP-redirect fetch step 2
								if (locationURL === null) {
									break;
								}

								// HTTP-redirect fetch step 5
								if (request.counter >= request.follow) {
									reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
									finalize();
									return;
								}

								// HTTP-redirect fetch step 6 (counter increment)
								// Create a new Request object.
								const requestOptions = {
									headers: new Headers(request.headers),
									follow: request.follow,
									counter: request.counter + 1,
									agent: request.agent,
									compress: request.compress,
									method: request.method,
									body: clone(request),
									signal: request.signal,
									size: request.size,
									referrer: request.referrer,
									referrerPolicy: request.referrerPolicy
								};

								// when forwarding sensitive headers like "Authorization",
								// "WWW-Authenticate", and "Cookie" to untrusted targets,
								// headers will be ignored when following a redirect to a domain
								// that is not a subdomain match or exact match of the initial domain.
								// For example, a redirect from "foo.com" to either "foo.com" or "sub.foo.com"
								// will forward the sensitive headers, but a redirect to "bar.com" will not.
								// headers will also be ignored when following a redirect to a domain using
								// a different protocol. For example, a redirect from "https://foo.com" to "http://foo.com"
								// will not forward the sensitive headers
								if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
									for (const name of ['authorization', 'www-authenticate', 'cookie', 'cookie2']) {
										requestOptions.headers.delete(name);
									}
								}

								// HTTP-redirect fetch step 9
								if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream.Readable) {
									reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
									finalize();
									return;
								}

								// HTTP-redirect fetch step 11
								if (response_.statusCode === 303 || ((response_.statusCode === 301 || response_.statusCode === 302) && request.method === 'POST')) {
									requestOptions.method = 'GET';
									requestOptions.body = undefined;
									requestOptions.headers.delete('content-length');
								}

								// HTTP-redirect fetch step 14
								const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
								if (responseReferrerPolicy) {
									requestOptions.referrerPolicy = responseReferrerPolicy;
								}

								// HTTP-redirect fetch step 15
								resolve(fetch(new Request(locationURL, requestOptions)));
								finalize();
								return;
							}

							default:
								return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
						}
					}

					// Prepare response
					if (signal) {
						response_.once('end', () => {
							signal.removeEventListener('abort', abortAndFinalize);
						});
					}

					let body = Stream.pipeline(response_, new Stream.PassThrough(), error => {
						if (error) {
							reject(error);
						}
					});
					// see https://github.com/nodejs/node/pull/29376
					/* c8 ignore next 3 */
					if (process.version < 'v12.10') {
						response_.on('aborted', abortAndFinalize);
					}

					const responseOptions = {
						url: request.url,
						status: response_.statusCode,
						statusText: response_.statusMessage,
						headers,
						size: request.size,
						counter: request.counter,
						highWaterMark: request.highWaterMark
					};

					// HTTP-network fetch step 12.1.1.3
					const codings = headers.get('Content-Encoding');

					// HTTP-network fetch step 12.1.1.4: handle content codings

					// in following scenarios we ignore compression support
					// 1. compression support is disabled
					// 2. HEAD request
					// 3. no Content-Encoding header
					// 4. no content response (204)
					// 5. content not modified response (304)
					if (!request.compress || request.method === 'HEAD' || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
						response = new Response(body, responseOptions);
						resolve(response);
						return;
					}

					// For Node v6+
					// Be less strict when decoding compressed responses, since sometimes
					// servers send slightly invalid responses that are still accepted
					// by common browsers.
					// Always using Z_SYNC_FLUSH is what cURL does.
					const zlibOptions = {
						flush: zlib.Z_SYNC_FLUSH,
						finishFlush: zlib.Z_SYNC_FLUSH
					};

					// For gzip
					if (codings === 'gzip' || codings === 'x-gzip') {
						body = Stream.pipeline(body, zlib.createGunzip(zlibOptions), error => {
							if (error) {
								reject(error);
							}
						});
						response = new Response(body, responseOptions);
						resolve(response);
						return;
					}

					// For deflate
					if (codings === 'deflate' || codings === 'x-deflate') {
						// Handle the infamous raw deflate response from old servers
						// a hack for old IIS and Apache servers
						const raw = Stream.pipeline(response_, new Stream.PassThrough(), error => {
							if (error) {
								reject(error);
							}
						});
						raw.once('data', chunk => {
							// See http://stackoverflow.com/questions/37519828
							if ((chunk[0] & 0x0F) === 0x08) {
								body = Stream.pipeline(body, zlib.createInflate(), error => {
									if (error) {
										reject(error);
									}
								});
							} else {
								body = Stream.pipeline(body, zlib.createInflateRaw(), error => {
									if (error) {
										reject(error);
									}
								});
							}

							response = new Response(body, responseOptions);
							resolve(response);
						});
						raw.once('end', () => {
							// Some old IIS servers return zero-length OK deflate responses, so
							// 'data' is never emitted. See https://github.com/node-fetch/node-fetch/pull/903
							if (!response) {
								response = new Response(body, responseOptions);
								resolve(response);
							}
						});
						return;
					}

					// For br
					if (codings === 'br') {
						body = Stream.pipeline(body, zlib.createBrotliDecompress(), error => {
							if (error) {
								reject(error);
							}
						});
						response = new Response(body, responseOptions);
						resolve(response);
						return;
					}

					// Otherwise, use response as-is
					response = new Response(body, responseOptions);
					resolve(response);
				});

				// eslint-disable-next-line promise/prefer-await-to-then
				writeToStream(request_, request).catch(reject);
			});
		}

		function fixResponseChunkedTransferBadEnding(request, errorCallback) {
			const LAST_CHUNK = node_buffer.Buffer.from('0\r\n\r\n');

			let isChunkedTransfer = false;
			let properLastChunkReceived = false;
			let previousChunk;

			request.on('response', response => {
				const {headers} = response;
				isChunkedTransfer = headers['transfer-encoding'] === 'chunked' && !headers['content-length'];
			});

			request.on('socket', socket => {
				const onSocketClose = () => {
					if (isChunkedTransfer && !properLastChunkReceived) {
						const error = new Error('Premature close');
						error.code = 'ERR_STREAM_PREMATURE_CLOSE';
						errorCallback(error);
					}
				};

				const onData = buf => {
					properLastChunkReceived = node_buffer.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;

					// Sometimes final 0-length chunk and end of message code are in separate packets
					if (!properLastChunkReceived && previousChunk) {
						properLastChunkReceived = (
							node_buffer.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 &&
							node_buffer.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0
						);
					}

					previousChunk = buf;
				};

				socket.prependListener('close', onSocketClose);
				socket.on('data', onData);

				request.on('close', () => {
					socket.removeListener('close', onSocketClose);
					socket.removeListener('data', onData);
				});
			});
		}

		/**
		 * @author Toru Nagashima <https://github.com/mysticatea>
		 * @copyright 2015 Toru Nagashima. All rights reserved.
		 * See LICENSE file in root directory for full license.
		 */
		/**
		 * @typedef {object} PrivateData
		 * @property {EventTarget} eventTarget The event target.
		 * @property {{type:string}} event The original event object.
		 * @property {number} eventPhase The current event phase.
		 * @property {EventTarget|null} currentTarget The current event target.
		 * @property {boolean} canceled The flag to prevent default.
		 * @property {boolean} stopped The flag to stop propagation.
		 * @property {boolean} immediateStopped The flag to stop propagation immediately.
		 * @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
		 * @property {number} timeStamp The unix time.
		 * @private
		 */

		/**
		 * Private data for event wrappers.
		 * @type {WeakMap<Event, PrivateData>}
		 * @private
		 */
		const privateData = new WeakMap();

		/**
		 * Cache for wrapper classes.
		 * @type {WeakMap<Object, Function>}
		 * @private
		 */
		const wrappers = new WeakMap();

		/**
		 * Get private data.
		 * @param {Event} event The event object to get private data.
		 * @returns {PrivateData} The private data of the event.
		 * @private
		 */
		function pd(event) {
		    const retv = privateData.get(event);
		    console.assert(
		        retv != null,
		        "'this' is expected an Event object, but got",
		        event
		    );
		    return retv
		}

		/**
		 * https://dom.spec.whatwg.org/#set-the-canceled-flag
		 * @param data {PrivateData} private data.
		 */
		function setCancelFlag(data) {
		    if (data.passiveListener != null) {
		        if (
		            typeof console !== "undefined" &&
		            typeof console.error === "function"
		        ) {
		            console.error(
		                "Unable to preventDefault inside passive event listener invocation.",
		                data.passiveListener
		            );
		        }
		        return
		    }
		    if (!data.event.cancelable) {
		        return
		    }

		    data.canceled = true;
		    if (typeof data.event.preventDefault === "function") {
		        data.event.preventDefault();
		    }
		}

		/**
		 * @see https://dom.spec.whatwg.org/#interface-event
		 * @private
		 */
		/**
		 * The event wrapper.
		 * @constructor
		 * @param {EventTarget} eventTarget The event target of this dispatching.
		 * @param {Event|{type:string}} event The original event to wrap.
		 */
		function Event(eventTarget, event) {
		    privateData.set(this, {
		        eventTarget,
		        event,
		        eventPhase: 2,
		        currentTarget: eventTarget,
		        canceled: false,
		        stopped: false,
		        immediateStopped: false,
		        passiveListener: null,
		        timeStamp: event.timeStamp || Date.now(),
		    });

		    // https://heycam.github.io/webidl/#Unforgeable
		    Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });

		    // Define accessors
		    const keys = Object.keys(event);
		    for (let i = 0; i < keys.length; ++i) {
		        const key = keys[i];
		        if (!(key in this)) {
		            Object.defineProperty(this, key, defineRedirectDescriptor(key));
		        }
		    }
		}

		// Should be enumerable, but class methods are not enumerable.
		Event.prototype = {
		    /**
		     * The type of this event.
		     * @type {string}
		     */
		    get type() {
		        return pd(this).event.type
		    },

		    /**
		     * The target of this event.
		     * @type {EventTarget}
		     */
		    get target() {
		        return pd(this).eventTarget
		    },

		    /**
		     * The target of this event.
		     * @type {EventTarget}
		     */
		    get currentTarget() {
		        return pd(this).currentTarget
		    },

		    /**
		     * @returns {EventTarget[]} The composed path of this event.
		     */
		    composedPath() {
		        const currentTarget = pd(this).currentTarget;
		        if (currentTarget == null) {
		            return []
		        }
		        return [currentTarget]
		    },

		    /**
		     * Constant of NONE.
		     * @type {number}
		     */
		    get NONE() {
		        return 0
		    },

		    /**
		     * Constant of CAPTURING_PHASE.
		     * @type {number}
		     */
		    get CAPTURING_PHASE() {
		        return 1
		    },

		    /**
		     * Constant of AT_TARGET.
		     * @type {number}
		     */
		    get AT_TARGET() {
		        return 2
		    },

		    /**
		     * Constant of BUBBLING_PHASE.
		     * @type {number}
		     */
		    get BUBBLING_PHASE() {
		        return 3
		    },

		    /**
		     * The target of this event.
		     * @type {number}
		     */
		    get eventPhase() {
		        return pd(this).eventPhase
		    },

		    /**
		     * Stop event bubbling.
		     * @returns {void}
		     */
		    stopPropagation() {
		        const data = pd(this);

		        data.stopped = true;
		        if (typeof data.event.stopPropagation === "function") {
		            data.event.stopPropagation();
		        }
		    },

		    /**
		     * Stop event bubbling.
		     * @returns {void}
		     */
		    stopImmediatePropagation() {
		        const data = pd(this);

		        data.stopped = true;
		        data.immediateStopped = true;
		        if (typeof data.event.stopImmediatePropagation === "function") {
		            data.event.stopImmediatePropagation();
		        }
		    },

		    /**
		     * The flag to be bubbling.
		     * @type {boolean}
		     */
		    get bubbles() {
		        return Boolean(pd(this).event.bubbles)
		    },

		    /**
		     * The flag to be cancelable.
		     * @type {boolean}
		     */
		    get cancelable() {
		        return Boolean(pd(this).event.cancelable)
		    },

		    /**
		     * Cancel this event.
		     * @returns {void}
		     */
		    preventDefault() {
		        setCancelFlag(pd(this));
		    },

		    /**
		     * The flag to indicate cancellation state.
		     * @type {boolean}
		     */
		    get defaultPrevented() {
		        return pd(this).canceled
		    },

		    /**
		     * The flag to be composed.
		     * @type {boolean}
		     */
		    get composed() {
		        return Boolean(pd(this).event.composed)
		    },

		    /**
		     * The unix time of this event.
		     * @type {number}
		     */
		    get timeStamp() {
		        return pd(this).timeStamp
		    },

		    /**
		     * The target of this event.
		     * @type {EventTarget}
		     * @deprecated
		     */
		    get srcElement() {
		        return pd(this).eventTarget
		    },

		    /**
		     * The flag to stop event bubbling.
		     * @type {boolean}
		     * @deprecated
		     */
		    get cancelBubble() {
		        return pd(this).stopped
		    },
		    set cancelBubble(value) {
		        if (!value) {
		            return
		        }
		        const data = pd(this);

		        data.stopped = true;
		        if (typeof data.event.cancelBubble === "boolean") {
		            data.event.cancelBubble = true;
		        }
		    },

		    /**
		     * The flag to indicate cancellation state.
		     * @type {boolean}
		     * @deprecated
		     */
		    get returnValue() {
		        return !pd(this).canceled
		    },
		    set returnValue(value) {
		        if (!value) {
		            setCancelFlag(pd(this));
		        }
		    },

		    /**
		     * Initialize this event object. But do nothing under event dispatching.
		     * @param {string} type The event type.
		     * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
		     * @param {boolean} [cancelable=false] The flag to be possible to cancel.
		     * @deprecated
		     */
		    initEvent() {
		        // Do nothing.
		    },
		};

		// `constructor` is not enumerable.
		Object.defineProperty(Event.prototype, "constructor", {
		    value: Event,
		    configurable: true,
		    writable: true,
		});

		// Ensure `event instanceof window.Event` is `true`.
		if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
		    Object.setPrototypeOf(Event.prototype, window.Event.prototype);

		    // Make association for wrappers.
		    wrappers.set(window.Event.prototype, Event);
		}

		/**
		 * Get the property descriptor to redirect a given property.
		 * @param {string} key Property name to define property descriptor.
		 * @returns {PropertyDescriptor} The property descriptor to redirect the property.
		 * @private
		 */
		function defineRedirectDescriptor(key) {
		    return {
		        get() {
		            return pd(this).event[key]
		        },
		        set(value) {
		            pd(this).event[key] = value;
		        },
		        configurable: true,
		        enumerable: true,
		    }
		}

		/**
		 * Get the property descriptor to call a given method property.
		 * @param {string} key Property name to define property descriptor.
		 * @returns {PropertyDescriptor} The property descriptor to call the method property.
		 * @private
		 */
		function defineCallDescriptor(key) {
		    return {
		        value() {
		            const event = pd(this).event;
		            return event[key].apply(event, arguments)
		        },
		        configurable: true,
		        enumerable: true,
		    }
		}

		/**
		 * Define new wrapper class.
		 * @param {Function} BaseEvent The base wrapper class.
		 * @param {Object} proto The prototype of the original event.
		 * @returns {Function} The defined wrapper class.
		 * @private
		 */
		function defineWrapper(BaseEvent, proto) {
		    const keys = Object.keys(proto);
		    if (keys.length === 0) {
		        return BaseEvent
		    }

		    /** CustomEvent */
		    function CustomEvent(eventTarget, event) {
		        BaseEvent.call(this, eventTarget, event);
		    }

		    CustomEvent.prototype = Object.create(BaseEvent.prototype, {
		        constructor: { value: CustomEvent, configurable: true, writable: true },
		    });

		    // Define accessors.
		    for (let i = 0; i < keys.length; ++i) {
		        const key = keys[i];
		        if (!(key in BaseEvent.prototype)) {
		            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
		            const isFunc = typeof descriptor.value === "function";
		            Object.defineProperty(
		                CustomEvent.prototype,
		                key,
		                isFunc
		                    ? defineCallDescriptor(key)
		                    : defineRedirectDescriptor(key)
		            );
		        }
		    }

		    return CustomEvent
		}

		/**
		 * Get the wrapper class of a given prototype.
		 * @param {Object} proto The prototype of the original event to get its wrapper.
		 * @returns {Function} The wrapper class.
		 * @private
		 */
		function getWrapper(proto) {
		    if (proto == null || proto === Object.prototype) {
		        return Event
		    }

		    let wrapper = wrappers.get(proto);
		    if (wrapper == null) {
		        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
		        wrappers.set(proto, wrapper);
		    }
		    return wrapper
		}

		/**
		 * Wrap a given event to management a dispatching.
		 * @param {EventTarget} eventTarget The event target of this dispatching.
		 * @param {Object} event The event to wrap.
		 * @returns {Event} The wrapper instance.
		 * @private
		 */
		function wrapEvent(eventTarget, event) {
		    const Wrapper = getWrapper(Object.getPrototypeOf(event));
		    return new Wrapper(eventTarget, event)
		}

		/**
		 * Get the immediateStopped flag of a given event.
		 * @param {Event} event The event to get.
		 * @returns {boolean} The flag to stop propagation immediately.
		 * @private
		 */
		function isStopped(event) {
		    return pd(event).immediateStopped
		}

		/**
		 * Set the current event phase of a given event.
		 * @param {Event} event The event to set current target.
		 * @param {number} eventPhase New event phase.
		 * @returns {void}
		 * @private
		 */
		function setEventPhase(event, eventPhase) {
		    pd(event).eventPhase = eventPhase;
		}

		/**
		 * Set the current target of a given event.
		 * @param {Event} event The event to set current target.
		 * @param {EventTarget|null} currentTarget New current target.
		 * @returns {void}
		 * @private
		 */
		function setCurrentTarget(event, currentTarget) {
		    pd(event).currentTarget = currentTarget;
		}

		/**
		 * Set a passive listener of a given event.
		 * @param {Event} event The event to set current target.
		 * @param {Function|null} passiveListener New passive listener.
		 * @returns {void}
		 * @private
		 */
		function setPassiveListener(event, passiveListener) {
		    pd(event).passiveListener = passiveListener;
		}

		/**
		 * @typedef {object} ListenerNode
		 * @property {Function} listener
		 * @property {1|2|3} listenerType
		 * @property {boolean} passive
		 * @property {boolean} once
		 * @property {ListenerNode|null} next
		 * @private
		 */

		/**
		 * @type {WeakMap<object, Map<string, ListenerNode>>}
		 * @private
		 */
		const listenersMap = new WeakMap();

		// Listener types
		const CAPTURE = 1;
		const BUBBLE = 2;
		const ATTRIBUTE = 3;

		/**
		 * Check whether a given value is an object or not.
		 * @param {any} x The value to check.
		 * @returns {boolean} `true` if the value is an object.
		 */
		function isObject(x) {
		    return x !== null && typeof x === "object" //eslint-disable-line no-restricted-syntax
		}

		/**
		 * Get listeners.
		 * @param {EventTarget} eventTarget The event target to get.
		 * @returns {Map<string, ListenerNode>} The listeners.
		 * @private
		 */
		function getListeners(eventTarget) {
		    const listeners = listenersMap.get(eventTarget);
		    if (listeners == null) {
		        throw new TypeError(
		            "'this' is expected an EventTarget object, but got another value."
		        )
		    }
		    return listeners
		}

		/**
		 * Get the property descriptor for the event attribute of a given event.
		 * @param {string} eventName The event name to get property descriptor.
		 * @returns {PropertyDescriptor} The property descriptor.
		 * @private
		 */
		function defineEventAttributeDescriptor(eventName) {
		    return {
		        get() {
		            const listeners = getListeners(this);
		            let node = listeners.get(eventName);
		            while (node != null) {
		                if (node.listenerType === ATTRIBUTE) {
		                    return node.listener
		                }
		                node = node.next;
		            }
		            return null
		        },

		        set(listener) {
		            if (typeof listener !== "function" && !isObject(listener)) {
		                listener = null; // eslint-disable-line no-param-reassign
		            }
		            const listeners = getListeners(this);

		            // Traverse to the tail while removing old value.
		            let prev = null;
		            let node = listeners.get(eventName);
		            while (node != null) {
		                if (node.listenerType === ATTRIBUTE) {
		                    // Remove old value.
		                    if (prev !== null) {
		                        prev.next = node.next;
		                    } else if (node.next !== null) {
		                        listeners.set(eventName, node.next);
		                    } else {
		                        listeners.delete(eventName);
		                    }
		                } else {
		                    prev = node;
		                }

		                node = node.next;
		            }

		            // Add new value.
		            if (listener !== null) {
		                const newNode = {
		                    listener,
		                    listenerType: ATTRIBUTE,
		                    passive: false,
		                    once: false,
		                    next: null,
		                };
		                if (prev === null) {
		                    listeners.set(eventName, newNode);
		                } else {
		                    prev.next = newNode;
		                }
		            }
		        },
		        configurable: true,
		        enumerable: true,
		    }
		}

		/**
		 * Define an event attribute (e.g. `eventTarget.onclick`).
		 * @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
		 * @param {string} eventName The event name to define.
		 * @returns {void}
		 */
		function defineEventAttribute(eventTargetPrototype, eventName) {
		    Object.defineProperty(
		        eventTargetPrototype,
		        `on${eventName}`,
		        defineEventAttributeDescriptor(eventName)
		    );
		}

		/**
		 * Define a custom EventTarget with event attributes.
		 * @param {string[]} eventNames Event names for event attributes.
		 * @returns {EventTarget} The custom EventTarget.
		 * @private
		 */
		function defineCustomEventTarget(eventNames) {
		    /** CustomEventTarget */
		    function CustomEventTarget() {
		        EventTarget.call(this);
		    }

		    CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
		        constructor: {
		            value: CustomEventTarget,
		            configurable: true,
		            writable: true,
		        },
		    });

		    for (let i = 0; i < eventNames.length; ++i) {
		        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
		    }

		    return CustomEventTarget
		}

		/**
		 * EventTarget.
		 *
		 * - This is constructor if no arguments.
		 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
		 *
		 * For example:
		 *
		 *     class A extends EventTarget {}
		 *     class B extends EventTarget("message") {}
		 *     class C extends EventTarget("message", "error") {}
		 *     class D extends EventTarget(["message", "error"]) {}
		 */
		function EventTarget() {
		    /*eslint-disable consistent-return */
		    if (this instanceof EventTarget) {
		        listenersMap.set(this, new Map());
		        return
		    }
		    if (arguments.length === 1 && Array.isArray(arguments[0])) {
		        return defineCustomEventTarget(arguments[0])
		    }
		    if (arguments.length > 0) {
		        const types = new Array(arguments.length);
		        for (let i = 0; i < arguments.length; ++i) {
		            types[i] = arguments[i];
		        }
		        return defineCustomEventTarget(types)
		    }
		    throw new TypeError("Cannot call a class as a function")
		    /*eslint-enable consistent-return */
		}

		// Should be enumerable, but class methods are not enumerable.
		EventTarget.prototype = {
		    /**
		     * Add a given listener to this event target.
		     * @param {string} eventName The event name to add.
		     * @param {Function} listener The listener to add.
		     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
		     * @returns {void}
		     */
		    addEventListener(eventName, listener, options) {
		        if (listener == null) {
		            return
		        }
		        if (typeof listener !== "function" && !isObject(listener)) {
		            throw new TypeError("'listener' should be a function or an object.")
		        }

		        const listeners = getListeners(this);
		        const optionsIsObj = isObject(options);
		        const capture = optionsIsObj
		            ? Boolean(options.capture)
		            : Boolean(options);
		        const listenerType = capture ? CAPTURE : BUBBLE;
		        const newNode = {
		            listener,
		            listenerType,
		            passive: optionsIsObj && Boolean(options.passive),
		            once: optionsIsObj && Boolean(options.once),
		            next: null,
		        };

		        // Set it as the first node if the first node is null.
		        let node = listeners.get(eventName);
		        if (node === undefined) {
		            listeners.set(eventName, newNode);
		            return
		        }

		        // Traverse to the tail while checking duplication..
		        let prev = null;
		        while (node != null) {
		            if (
		                node.listener === listener &&
		                node.listenerType === listenerType
		            ) {
		                // Should ignore duplication.
		                return
		            }
		            prev = node;
		            node = node.next;
		        }

		        // Add it.
		        prev.next = newNode;
		    },

		    /**
		     * Remove a given listener from this event target.
		     * @param {string} eventName The event name to remove.
		     * @param {Function} listener The listener to remove.
		     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
		     * @returns {void}
		     */
		    removeEventListener(eventName, listener, options) {
		        if (listener == null) {
		            return
		        }

		        const listeners = getListeners(this);
		        const capture = isObject(options)
		            ? Boolean(options.capture)
		            : Boolean(options);
		        const listenerType = capture ? CAPTURE : BUBBLE;

		        let prev = null;
		        let node = listeners.get(eventName);
		        while (node != null) {
		            if (
		                node.listener === listener &&
		                node.listenerType === listenerType
		            ) {
		                if (prev !== null) {
		                    prev.next = node.next;
		                } else if (node.next !== null) {
		                    listeners.set(eventName, node.next);
		                } else {
		                    listeners.delete(eventName);
		                }
		                return
		            }

		            prev = node;
		            node = node.next;
		        }
		    },

		    /**
		     * Dispatch a given event.
		     * @param {Event|{type:string}} event The event to dispatch.
		     * @returns {boolean} `false` if canceled.
		     */
		    dispatchEvent(event) {
		        if (event == null || typeof event.type !== "string") {
		            throw new TypeError('"event.type" should be a string.')
		        }

		        // If listeners aren't registered, terminate.
		        const listeners = getListeners(this);
		        const eventName = event.type;
		        let node = listeners.get(eventName);
		        if (node == null) {
		            return true
		        }

		        // Since we cannot rewrite several properties, so wrap object.
		        const wrappedEvent = wrapEvent(this, event);

		        // This doesn't process capturing phase and bubbling phase.
		        // This isn't participating in a tree.
		        let prev = null;
		        while (node != null) {
		            // Remove this listener if it's once
		            if (node.once) {
		                if (prev !== null) {
		                    prev.next = node.next;
		                } else if (node.next !== null) {
		                    listeners.set(eventName, node.next);
		                } else {
		                    listeners.delete(eventName);
		                }
		            } else {
		                prev = node;
		            }

		            // Call this listener
		            setPassiveListener(
		                wrappedEvent,
		                node.passive ? node.listener : null
		            );
		            if (typeof node.listener === "function") {
		                try {
		                    node.listener.call(this, wrappedEvent);
		                } catch (err) {
		                    if (
		                        typeof console !== "undefined" &&
		                        typeof console.error === "function"
		                    ) {
		                        console.error(err);
		                    }
		                }
		            } else if (
		                node.listenerType !== ATTRIBUTE &&
		                typeof node.listener.handleEvent === "function"
		            ) {
		                node.listener.handleEvent(wrappedEvent);
		            }

		            // Break if `event.stopImmediatePropagation` was called.
		            if (isStopped(wrappedEvent)) {
		                break
		            }

		            node = node.next;
		        }
		        setPassiveListener(wrappedEvent, null);
		        setEventPhase(wrappedEvent, 0);
		        setCurrentTarget(wrappedEvent, null);

		        return !wrappedEvent.defaultPrevented
		    },
		};

		// `constructor` is not enumerable.
		Object.defineProperty(EventTarget.prototype, "constructor", {
		    value: EventTarget,
		    configurable: true,
		    writable: true,
		});

		// Ensure `eventTarget instanceof window.EventTarget` is `true`.
		if (
		    typeof window !== "undefined" &&
		    typeof window.EventTarget !== "undefined"
		) {
		    Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
		}

		/**
		 * @author Toru Nagashima <https://github.com/mysticatea>
		 * See LICENSE file in root directory for full license.
		 */

		/**
		 * The signal class.
		 * @see https://dom.spec.whatwg.org/#abortsignal
		 */
		class AbortSignal extends EventTarget {
		    /**
		     * AbortSignal cannot be constructed directly.
		     */
		    constructor() {
		        super();
		        throw new TypeError("AbortSignal cannot be constructed directly");
		    }
		    /**
		     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
		     */
		    get aborted() {
		        const aborted = abortedFlags.get(this);
		        if (typeof aborted !== "boolean") {
		            throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
		        }
		        return aborted;
		    }
		}
		defineEventAttribute(AbortSignal.prototype, "abort");
		/**
		 * Create an AbortSignal object.
		 */
		function createAbortSignal() {
		    const signal = Object.create(AbortSignal.prototype);
		    EventTarget.call(signal);
		    abortedFlags.set(signal, false);
		    return signal;
		}
		/**
		 * Abort a given signal.
		 */
		function abortSignal(signal) {
		    if (abortedFlags.get(signal) !== false) {
		        return;
		    }
		    abortedFlags.set(signal, true);
		    signal.dispatchEvent({ type: "abort" });
		}
		/**
		 * Aborted flag for each instances.
		 */
		const abortedFlags = new WeakMap();
		// Properties should be enumerable.
		Object.defineProperties(AbortSignal.prototype, {
		    aborted: { enumerable: true },
		});
		// `toString()` should return `"[object AbortSignal]"`
		if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
		    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
		        configurable: true,
		        value: "AbortSignal",
		    });
		}

		/**
		 * The AbortController.
		 * @see https://dom.spec.whatwg.org/#abortcontroller
		 */
		class AbortController$1 {
		    /**
		     * Initialize this controller.
		     */
		    constructor() {
		        signals.set(this, createAbortSignal());
		    }
		    /**
		     * Returns the `AbortSignal` object associated with this object.
		     */
		    get signal() {
		        return getSignal(this);
		    }
		    /**
		     * Abort and signal to any observers that the associated activity is to be aborted.
		     */
		    abort() {
		        abortSignal(getSignal(this));
		    }
		}
		/**
		 * Associated signals.
		 */
		const signals = new WeakMap();
		/**
		 * Get the associated signal of a given controller.
		 */
		function getSignal(controller) {
		    const signal = signals.get(controller);
		    if (signal == null) {
		        throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
		    }
		    return signal;
		}
		// Properties should be enumerable.
		Object.defineProperties(AbortController$1.prototype, {
		    signal: { enumerable: true },
		    abort: { enumerable: true },
		});
		if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
		    Object.defineProperty(AbortController$1.prototype, Symbol.toStringTag, {
		        configurable: true,
		        value: "AbortController",
		    });
		}

		exports.AbortController = AbortController$1;
		exports.AbortError = AbortError;
		exports.FetchError = FetchError;
		exports.File = File$1;
		exports.FormData = FormData;
		exports.Headers = Headers;
		exports.Request = Request;
		exports.Response = Response;
		exports._Blob = _Blob$1;
		exports.fetch = fetch;
		exports.isRedirect = isRedirect;
		exports.nodeDomexception = nodeDomexception; 
	} (nodeFetchNative_8afd3fea));
	return nodeFetchNative_8afd3fea;
}

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;

	Object.defineProperty(dist, '__esModule', { value: true });

	const abortController = requireNodeFetchNative_8afd3fea();
	const node_fs = require$$1$3;
	const node_path = require$$2$1;









	const { stat } = node_fs.promises;

	/**
	 * @param {string} path filepath on the disk
	 * @param {string} [type] mimetype to use
	 */
	const blobFromSync = (path, type) => fromBlob(node_fs.statSync(path), path, type);

	/**
	 * @param {string} path filepath on the disk
	 * @param {string} [type] mimetype to use
	 * @returns {Promise<Blob>}
	 */
	const blobFrom = (path, type) => stat(path).then(stat => fromBlob(stat, path, type));

	/**
	 * @param {string} path filepath on the disk
	 * @param {string} [type] mimetype to use
	 * @returns {Promise<File>}
	 */
	const fileFrom = (path, type) => stat(path).then(stat => fromFile(stat, path, type));

	/**
	 * @param {string} path filepath on the disk
	 * @param {string} [type] mimetype to use
	 */
	const fileFromSync = (path, type) => fromFile(node_fs.statSync(path), path, type);

	// @ts-ignore
	const fromBlob = (stat, path, type = '') => new abortController._Blob([new BlobDataItem({
	  path,
	  size: stat.size,
	  lastModified: stat.mtimeMs,
	  start: 0
	})], { type });

	// @ts-ignore
	const fromFile = (stat, path, type = '') => new abortController.File([new BlobDataItem({
	  path,
	  size: stat.size,
	  lastModified: stat.mtimeMs,
	  start: 0
	})], node_path.basename(path), { type, lastModified: stat.mtimeMs });

	/**
	 * This is a blob backed up by a file on the disk
	 * with minium requirement. Its wrapped around a Blob as a blobPart
	 * so you have no direct access to this.
	 *
	 * @private
	 */
	class BlobDataItem {
	  #path
	  #start

	  constructor (options) {
	    this.#path = options.path;
	    this.#start = options.start;
	    this.size = options.size;
	    this.lastModified = options.lastModified;
	    this.originalSize = options.originalSize === undefined
	      ? options.size
	      : options.originalSize;
	  }

	  /**
	   * Slicing arguments is first validated and formatted
	   * to not be out of range by Blob.prototype.slice
	   */
	  slice (start, end) {
	    return new BlobDataItem({
	      path: this.#path,
	      lastModified: this.lastModified,
	      originalSize: this.originalSize,
	      size: end - start,
	      start: this.#start + start
	    })
	  }

	  async * stream () {
	    const { mtimeMs, size } = await stat(this.#path);

	    if (mtimeMs > this.lastModified || this.originalSize !== size) {
	      throw new abortController.nodeDomexception('The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.', 'NotReadableError')
	    }

	    yield * node_fs.createReadStream(this.#path, {
	      start: this.#start,
	      end: this.#start + this.size - 1
	    });
	  }

	  get [Symbol.toStringTag] () {
	    return 'Blob'
	  }
	}

	const fetch = globalThis.fetch || abortController.fetch;
	const Blob = globalThis.Blob || abortController._Blob;
	const File = globalThis.File || abortController.File;
	const FormData = globalThis.FormData || abortController.FormData;
	const Headers = globalThis.Headers || abortController.Headers;
	const Request = globalThis.Request || abortController.Request;
	const Response = globalThis.Response || abortController.Response;
	const AbortController = globalThis.AbortController || abortController.AbortController;

	dist.AbortError = abortController.AbortError;
	dist.FetchError = abortController.FetchError;
	dist.isRedirect = abortController.isRedirect;
	dist.AbortController = AbortController;
	dist.Blob = Blob;
	dist.File = File;
	dist.FormData = FormData;
	dist.Headers = Headers;
	dist.Request = Request;
	dist.Response = Response;
	dist.blobFrom = blobFrom;
	dist.blobFromSync = blobFromSync;
	dist.default = fetch;
	dist.fetch = fetch;
	dist.fileFrom = fileFrom;
	dist.fileFromSync = fileFromSync;
	return dist;
}

var lib;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	const nodeFetch = requireDist();

	function fetch (input, options) {
	  return nodeFetch.fetch(input, options);
	}

	for (const key in nodeFetch) {
	  fetch[key] = nodeFetch[key];
	}

	lib = fetch;
	return lib;
}

/* eslint-disable @typescript-eslint/no-var-requires */

var hasRequiredFetch;

function requireFetch () {
	if (hasRequiredFetch) return fetch$1.exports;
	hasRequiredFetch = 1;
	const { fetch, Blob, FormData, Headers, Request, Response, AbortController } = requireLib();

	fetch$1.exports = fetch;
	fetch$1.exports.RuntimeBlob = Blob;
	fetch$1.exports.RuntimeFormData = FormData;
	fetch$1.exports.RuntimeHeaders = Headers;
	fetch$1.exports.RuntimeRequest = Request;
	fetch$1.exports.RuntimeResponse = Response;
	fetch$1.exports.RuntimeAbortController = AbortController;
	fetch$1.exports.RuntimeFetch = fetch;
	return fetch$1.exports;
}

var fetchExports = requireFetch();
var fetch = /*@__PURE__*/getDefaultExportFromCjs(fetchExports);

var fetchApisPolyfill = /*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	default: fetch
}, [fetchExports]);

var cjs;
var hasRequiredCjs;

function requireCjs () {
	if (hasRequiredCjs) return cjs;
	hasRequiredCjs = 1;

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key);
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object, property) {
		try {
			return property in object
		} catch(_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			} else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
		// implementations can use it. The caller may not replace it.
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	cjs = deepmerge_1;
	return cjs;
}

requireCjs();

var mapObj = {exports: {}};

var hasRequiredMapObj;

function requireMapObj () {
	if (hasRequiredMapObj) return mapObj.exports;
	hasRequiredMapObj = 1;

	const isObject = value => typeof value === 'object' && value !== null;
	const mapObjectSkip = Symbol('skip');

	// Customized for this use-case
	const isObjectCustom = value =>
		isObject(value) &&
		!(value instanceof RegExp) &&
		!(value instanceof Error) &&
		!(value instanceof Date);

	const mapObject = (object, mapper, options, isSeen = new WeakMap()) => {
		options = {
			deep: false,
			target: {},
			...options
		};

		if (isSeen.has(object)) {
			return isSeen.get(object);
		}

		isSeen.set(object, options.target);

		const {target} = options;
		delete options.target;

		const mapArray = array => array.map(element => isObjectCustom(element) ? mapObject(element, mapper, options, isSeen) : element);
		if (Array.isArray(object)) {
			return mapArray(object);
		}

		for (const [key, value] of Object.entries(object)) {
			const mapResult = mapper(key, value, object);

			if (mapResult === mapObjectSkip) {
				continue;
			}

			let [newKey, newValue, {shouldRecurse = true} = {}] = mapResult;

			// Drop `__proto__` keys.
			if (newKey === '__proto__') {
				continue;
			}

			if (options.deep && shouldRecurse && isObjectCustom(newValue)) {
				newValue = Array.isArray(newValue) ?
					mapArray(newValue) :
					mapObject(newValue, mapper, options, isSeen);
			}

			target[newKey] = newValue;
		}

		return target;
	};

	mapObj.exports = (object, mapper, options) => {
		if (!isObject(object)) {
			throw new TypeError(`Expected an object, got \`${object}\` (${typeof object})`);
		}

		return mapObject(object, mapper, options);
	};

	mapObj.exports.mapObjectSkip = mapObjectSkip;
	return mapObj.exports;
}

/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}

function dotCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: "." }, options));
}

function snakeCase(input, options) {
    if (options === void 0) { options = {}; }
    return dotCase(input, __assign({ delimiter: "_" }, options));
}

var dist_es2015 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	snakeCase: snakeCase
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(dist_es2015);

var snakecaseKeys;
var hasRequiredSnakecaseKeys;

function requireSnakecaseKeys () {
	if (hasRequiredSnakecaseKeys) return snakecaseKeys;
	hasRequiredSnakecaseKeys = 1;

	const map = requireMapObj();
	const { snakeCase } = require$$1;

	snakecaseKeys = function (obj, options) {
	  options = Object.assign({ deep: true, exclude: [], parsingOptions: {} }, options);

	  return map(obj, function (key, val) {
	    return [
	      matches(options.exclude, key) ? key : snakeCase(key, options.parsingOptions),
	      val
	    ]
	  }, options)
	};

	function matches (patterns, value) {
	  return patterns.some(function (pattern) {
	    return typeof pattern === 'string'
	      ? pattern === value
	      : pattern.test(value)
	  })
	}
	return snakecaseKeys;
}

requireSnakecaseKeys();

// src/index.ts

// src/util/path.ts
var SEPARATOR = "/";
var MULTIPLE_SEPARATOR_REGEX = new RegExp(SEPARATOR + "{1,}", "g");
function joinPaths(...args) {
  return args.filter((p) => p).join(SEPARATOR).replace(MULTIPLE_SEPARATOR_REGEX, SEPARATOR);
}
buildErrorThrower({ packageName: "@clerk/backend" });
var {
  RuntimeFetch,
  RuntimeAbortController,
  RuntimeBlob,
  RuntimeFormData,
  RuntimeHeaders,
  RuntimeRequest,
  RuntimeResponse
} = fetchApisPolyfill;
var globalFetch = RuntimeFetch.bind(globalThis);
var runtime = {
  crypto,
  fetch: globalFetch,
  AbortController: RuntimeAbortController,
  Blob: RuntimeBlob,
  FormData: RuntimeFormData,
  Headers: RuntimeHeaders,
  Request: RuntimeRequest,
  Response: RuntimeResponse
};
var runtime_default = runtime;

// src/constants.ts
var API_URL = "https://api.clerk.dev";
var API_VERSION = "v1";
var MAX_CACHE_LAST_UPDATED_AT_SECONDS = 5 * 60;

// src/api/resources/IdentificationLink.ts
var IdentificationLink = class _IdentificationLink {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
  static fromJSON(data) {
    return new _IdentificationLink(data.id, data.type);
  }
};

// src/api/resources/Verification.ts
var Verification = class _Verification {
  constructor(status, strategy, externalVerificationRedirectURL = null, attempts = null, expireAt = null, nonce = null) {
    this.status = status;
    this.strategy = strategy;
    this.externalVerificationRedirectURL = externalVerificationRedirectURL;
    this.attempts = attempts;
    this.expireAt = expireAt;
    this.nonce = nonce;
  }
  static fromJSON(data) {
    return new _Verification(
      data.status,
      data.strategy,
      data.external_verification_redirect_url ? new URL(data.external_verification_redirect_url) : null,
      data.attempts,
      data.expire_at,
      data.nonce
    );
  }
};

// src/api/resources/EmailAddress.ts
var EmailAddress = class _EmailAddress {
  constructor(id, emailAddress, verification, linkedTo) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.verification = verification;
    this.linkedTo = linkedTo;
  }
  static fromJSON(data) {
    return new _EmailAddress(
      data.id,
      data.email_address,
      data.verification && Verification.fromJSON(data.verification),
      data.linked_to.map((link) => IdentificationLink.fromJSON(link))
    );
  }
};

// src/api/resources/ExternalAccount.ts
var ExternalAccount = class _ExternalAccount {
  constructor(id, provider, identificationId, externalId, approvedScopes, emailAddress, firstName, lastName, picture, imageUrl, username, publicMetadata = {}, label, verification) {
    this.id = id;
    this.provider = provider;
    this.identificationId = identificationId;
    this.externalId = externalId;
    this.approvedScopes = approvedScopes;
    this.emailAddress = emailAddress;
    this.firstName = firstName;
    this.lastName = lastName;
    this.picture = picture;
    this.imageUrl = imageUrl;
    this.username = username;
    this.publicMetadata = publicMetadata;
    this.label = label;
    this.verification = verification;
  }
  static fromJSON(data) {
    return new _ExternalAccount(
      data.id,
      data.provider,
      data.identification_id,
      data.provider_user_id,
      data.approved_scopes,
      data.email_address,
      data.first_name,
      data.last_name,
      data.avatar_url,
      data.image_url,
      data.username,
      data.public_metadata,
      data.label,
      data.verification && Verification.fromJSON(data.verification)
    );
  }
};
deprecatedProperty(ExternalAccount, "picture", "Use `imageUrl` instead.");

// src/api/resources/Organization.ts
var Organization = class _Organization {
  constructor(id, name, slug, logoUrl, imageUrl, hasImage, createdBy, createdAt, updatedAt, publicMetadata = {}, privateMetadata = {}, maxAllowedMemberships, adminDeleteEnabled, members_count) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.logoUrl = logoUrl;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.maxAllowedMemberships = maxAllowedMemberships;
    this.adminDeleteEnabled = adminDeleteEnabled;
    this.members_count = members_count;
  }
  static fromJSON(data) {
    return new _Organization(
      data.id,
      data.name,
      data.slug,
      data.logo_url,
      data.image_url,
      data.has_image,
      data.created_by,
      data.created_at,
      data.updated_at,
      data.public_metadata,
      data.private_metadata,
      data.max_allowed_memberships,
      data.admin_delete_enabled,
      data.members_count
    );
  }
};
deprecatedProperty(Organization, "logoUrl", "Use `imageUrl` instead.");
var OrganizationMembershipPublicUserData = class _OrganizationMembershipPublicUserData {
  constructor(identifier, firstName, lastName, profileImageUrl, imageUrl, hasImage, userId) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profileImageUrl = profileImageUrl;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.userId = userId;
  }
  static fromJSON(data) {
    return new _OrganizationMembershipPublicUserData(
      data.identifier,
      data.first_name,
      data.last_name,
      data.profile_image_url,
      data.image_url,
      data.has_image,
      data.user_id
    );
  }
};
deprecatedProperty(OrganizationMembershipPublicUserData, "profileImageUrl", "Use `imageUrl` instead.");

// src/api/resources/PhoneNumber.ts
var PhoneNumber = class _PhoneNumber {
  constructor(id, phoneNumber, reservedForSecondFactor, defaultSecondFactor, verification, linkedTo) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.reservedForSecondFactor = reservedForSecondFactor;
    this.defaultSecondFactor = defaultSecondFactor;
    this.verification = verification;
    this.linkedTo = linkedTo;
  }
  static fromJSON(data) {
    return new _PhoneNumber(
      data.id,
      data.phone_number,
      data.reserved_for_second_factor,
      data.default_second_factor,
      data.verification && Verification.fromJSON(data.verification),
      data.linked_to.map((link) => IdentificationLink.fromJSON(link))
    );
  }
};

// src/api/resources/Web3Wallet.ts
var Web3Wallet = class _Web3Wallet {
  constructor(id, web3Wallet, verification) {
    this.id = id;
    this.web3Wallet = web3Wallet;
    this.verification = verification;
  }
  static fromJSON(data) {
    return new _Web3Wallet(data.id, data.web3_wallet, data.verification && Verification.fromJSON(data.verification));
  }
};

// src/api/resources/User.ts
var User = class _User {
  constructor(id, passwordEnabled, totpEnabled, backupCodeEnabled, twoFactorEnabled, banned, createdAt, updatedAt, profileImageUrl, imageUrl, hasImage, gender, birthday, primaryEmailAddressId, primaryPhoneNumberId, primaryWeb3WalletId, lastSignInAt, externalId, username, firstName, lastName, publicMetadata = {}, privateMetadata = {}, unsafeMetadata = {}, emailAddresses = [], phoneNumbers = [], web3Wallets = [], externalAccounts = []) {
    this.id = id;
    this.passwordEnabled = passwordEnabled;
    this.totpEnabled = totpEnabled;
    this.backupCodeEnabled = backupCodeEnabled;
    this.twoFactorEnabled = twoFactorEnabled;
    this.banned = banned;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.profileImageUrl = profileImageUrl;
    this.imageUrl = imageUrl;
    this.hasImage = hasImage;
    this.gender = gender;
    this.birthday = birthday;
    this.primaryEmailAddressId = primaryEmailAddressId;
    this.primaryPhoneNumberId = primaryPhoneNumberId;
    this.primaryWeb3WalletId = primaryWeb3WalletId;
    this.lastSignInAt = lastSignInAt;
    this.externalId = externalId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.publicMetadata = publicMetadata;
    this.privateMetadata = privateMetadata;
    this.unsafeMetadata = unsafeMetadata;
    this.emailAddresses = emailAddresses;
    this.phoneNumbers = phoneNumbers;
    this.web3Wallets = web3Wallets;
    this.externalAccounts = externalAccounts;
  }
  static fromJSON(data) {
    return new _User(
      data.id,
      data.password_enabled,
      data.totp_enabled,
      data.backup_code_enabled,
      data.two_factor_enabled,
      data.banned,
      data.created_at,
      data.updated_at,
      data.profile_image_url,
      data.image_url,
      data.has_image,
      data.gender,
      data.birthday,
      data.primary_email_address_id,
      data.primary_phone_number_id,
      data.primary_web3_wallet_id,
      data.last_sign_in_at,
      data.external_id,
      data.username,
      data.first_name,
      data.last_name,
      data.public_metadata,
      data.private_metadata,
      data.unsafe_metadata,
      (data.email_addresses || []).map((x) => EmailAddress.fromJSON(x)),
      (data.phone_numbers || []).map((x) => PhoneNumber.fromJSON(x)),
      (data.web3_wallets || []).map((x) => Web3Wallet.fromJSON(x)),
      (data.external_accounts || []).map((x) => ExternalAccount.fromJSON(x))
    );
  }
};
deprecatedProperty(User, "profileImageUrl", "Use `imageUrl` instead.");

// src/tokens/errors.ts
var TokenVerificationError = class _TokenVerificationError extends Error {
  constructor({
    action,
    message,
    reason
  }) {
    super(message);
    Object.setPrototypeOf(this, _TokenVerificationError.prototype);
    this.reason = reason;
    this.message = message;
    this.action = action;
  }
  getFullMessage() {
    return `${[this.message, this.action].filter((m) => m).join(" ")} (reason=${this.reason}, token-carrier=${this.tokenCarrier})`;
  }
};
var getErrorObjectByCode = (errors, code) => {
  if (!errors) {
    return null;
  }
  return errors.find((err) => err.code === code);
};

// src/util/rfc4648.ts
var base64url = {
  parse(string, opts) {
    return parse2(string, base64UrlEncoding, opts);
  },
  stringify(data, opts) {
    return stringify(data, base64UrlEncoding, opts);
  }
};
var base64UrlEncoding = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bits: 6
};
function parse2(string, encoding, opts = {}) {
  if (!encoding.codes) {
    encoding.codes = {};
    for (let i = 0; i < encoding.chars.length; ++i) {
      encoding.codes[encoding.chars[i]] = i;
    }
  }
  if (!opts.loose && string.length * encoding.bits & 7) {
    throw new SyntaxError("Invalid padding");
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
    if (!opts.loose && !((string.length - end) * encoding.bits & 7)) {
      throw new SyntaxError("Invalid padding");
    }
  }
  const out = new (opts.out ?? Uint8Array)(end * encoding.bits / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = encoding.codes[string[i]];
    if (value === void 0) {
      throw new SyntaxError("Invalid character " + string[i]);
    }
    buffer = buffer << encoding.bits | value;
    bits += encoding.bits;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= encoding.bits || 255 & buffer << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function stringify(data, encoding, opts = {}) {
  const { pad = true } = opts;
  const mask = (1 << encoding.bits) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | 255 & data[i];
    bits += 8;
    while (bits > encoding.bits) {
      bits -= encoding.bits;
      out += encoding.chars[mask & buffer >> bits];
    }
  }
  if (bits) {
    out += encoding.chars[mask & buffer << encoding.bits - bits];
  }
  if (pad) {
    while (out.length * encoding.bits & 7) {
      out += "=";
    }
  }
  return out;
}

// src/tokens/jwt/algorithms.ts
var algToHash = {
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512"
};
var RSA_ALGORITHM_NAME = "RSASSA-PKCS1-v1_5";
var jwksAlgToCryptoAlg = {
  RS256: RSA_ALGORITHM_NAME,
  RS384: RSA_ALGORITHM_NAME,
  RS512: RSA_ALGORITHM_NAME
};
var algs = Object.keys(algToHash);
function getCryptoAlgorithm(algorithmName) {
  const hash = algToHash[algorithmName];
  const name = jwksAlgToCryptoAlg[algorithmName];
  if (!hash || !name) {
    throw new Error(`Unsupported algorithm ${algorithmName}, expected one of ${algs.join(",")}.`);
  }
  return {
    hash: { name: algToHash[algorithmName] },
    name: jwksAlgToCryptoAlg[algorithmName]
  };
}

// src/tokens/jwt/assertions.ts
var isArrayString = (s) => {
  return Array.isArray(s) && s.length > 0 && s.every((a) => typeof a === "string");
};
var assertAudienceClaim = (aud, audience) => {
  const audienceList = [audience].flat().filter((a) => !!a);
  const audList = [aud].flat().filter((a) => !!a);
  const shouldVerifyAudience = audienceList.length > 0 && audList.length > 0;
  if (!shouldVerifyAudience) {
    return;
  }
  if (typeof aud === "string") {
    if (!audienceList.includes(aud)) {
      throw new TokenVerificationError({
        action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
        reason: "token-verification-failed" /* TokenVerificationFailed */,
        message: `Invalid JWT audience claim (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(
          audienceList
        )}".`
      });
    }
  } else if (isArrayString(aud)) {
    if (!aud.some((a) => audienceList.includes(a))) {
      throw new TokenVerificationError({
        action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
        reason: "token-verification-failed" /* TokenVerificationFailed */,
        message: `Invalid JWT audience claim array (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(
          audienceList
        )}".`
      });
    }
  }
};
var assertHeaderType = (typ) => {
  if (typeof typ === "undefined") {
    return;
  }
  if (typ !== "JWT") {
    throw new TokenVerificationError({
      action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
      reason: "token-invalid" /* TokenInvalid */,
      message: `Invalid JWT type ${JSON.stringify(typ)}. Expected "JWT".`
    });
  }
};
var assertHeaderAlgorithm = (alg) => {
  if (!algs.includes(alg)) {
    throw new TokenVerificationError({
      action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
      reason: "token-invalid-algorithm" /* TokenInvalidAlgorithm */,
      message: `Invalid JWT algorithm ${JSON.stringify(alg)}. Supported: ${algs}.`
    });
  }
};
var assertSubClaim = (sub) => {
  if (typeof sub !== "string") {
    throw new TokenVerificationError({
      action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
      reason: "token-verification-failed" /* TokenVerificationFailed */,
      message: `Subject claim (sub) is required and must be a string. Received ${JSON.stringify(sub)}.`
    });
  }
};
var assertAuthorizedPartiesClaim = (azp, authorizedParties) => {
  if (!azp || !authorizedParties || authorizedParties.length === 0) {
    return;
  }
  if (!authorizedParties.includes(azp)) {
    throw new TokenVerificationError({
      reason: "token-invalid-authorized-parties" /* TokenInvalidAuthorizedParties */,
      message: `Invalid JWT Authorized party claim (azp) ${JSON.stringify(azp)}. Expected "${authorizedParties}".`
    });
  }
};
var assertIssuerClaim = (iss, issuer) => {
  if (typeof issuer === "function" && !issuer(iss)) {
    throw new TokenVerificationError({
      reason: "token-invalid-issuer" /* TokenInvalidIssuer */,
      message: "Failed JWT issuer resolver. Make sure that the resolver returns a truthy value."
    });
  } else if (typeof issuer === "string" && iss && iss !== issuer) {
    throw new TokenVerificationError({
      reason: "token-invalid-issuer" /* TokenInvalidIssuer */,
      message: `Invalid JWT issuer claim (iss) ${JSON.stringify(iss)}. Expected "${issuer}".`
    });
  }
};
var assertExpirationClaim = (exp, clockSkewInMs) => {
  if (typeof exp !== "number") {
    throw new TokenVerificationError({
      action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
      reason: "token-verification-failed" /* TokenVerificationFailed */,
      message: `Invalid JWT expiry date claim (exp) ${JSON.stringify(exp)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const expiryDate = /* @__PURE__ */ new Date(0);
  expiryDate.setUTCSeconds(exp);
  const expired = expiryDate.getTime() <= currentDate.getTime() - clockSkewInMs;
  if (expired) {
    throw new TokenVerificationError({
      reason: "token-expired" /* TokenExpired */,
      message: `JWT is expired. Expiry date: ${expiryDate.toUTCString()}, Current date: ${currentDate.toUTCString()}.`
    });
  }
};
var assertActivationClaim = (nbf, clockSkewInMs) => {
  if (typeof nbf === "undefined") {
    return;
  }
  if (typeof nbf !== "number") {
    throw new TokenVerificationError({
      action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
      reason: "token-verification-failed" /* TokenVerificationFailed */,
      message: `Invalid JWT not before date claim (nbf) ${JSON.stringify(nbf)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const notBeforeDate = /* @__PURE__ */ new Date(0);
  notBeforeDate.setUTCSeconds(nbf);
  const early = notBeforeDate.getTime() > currentDate.getTime() + clockSkewInMs;
  if (early) {
    throw new TokenVerificationError({
      reason: "token-not-active-yet" /* TokenNotActiveYet */,
      message: `JWT cannot be used prior to not before date claim (nbf). Not before date: ${notBeforeDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
    });
  }
};
var assertIssuedAtClaim = (iat, clockSkewInMs) => {
  if (typeof iat === "undefined") {
    return;
  }
  if (typeof iat !== "number") {
    throw new TokenVerificationError({
      action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
      reason: "token-verification-failed" /* TokenVerificationFailed */,
      message: `Invalid JWT issued at date claim (iat) ${JSON.stringify(iat)}. Expected number.`
    });
  }
  const currentDate = new Date(Date.now());
  const issuedAtDate = /* @__PURE__ */ new Date(0);
  issuedAtDate.setUTCSeconds(iat);
  const postIssued = issuedAtDate.getTime() > currentDate.getTime() + clockSkewInMs;
  if (postIssued) {
    throw new TokenVerificationError({
      reason: "token-not-active-yet" /* TokenNotActiveYet */,
      message: `JWT issued at date claim (iat) is in the future. Issued at date: ${issuedAtDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
    });
  }
};
function pemToBuffer(secret) {
  const trimmed = secret.replace(/-----BEGIN.*?-----/g, "").replace(/-----END.*?-----/g, "").replace(/\s/g, "");
  const decoded = isomorphicAtob(trimmed);
  const buffer = new ArrayBuffer(decoded.length);
  const bufView = new Uint8Array(buffer);
  for (let i = 0, strLen = decoded.length; i < strLen; i++) {
    bufView[i] = decoded.charCodeAt(i);
  }
  return bufView;
}
function importKey(key, algorithm, keyUsage) {
  if (typeof key === "object") {
    return runtime_default.crypto.subtle.importKey("jwk", key, algorithm, false, [keyUsage]);
  }
  const keyData = pemToBuffer(key);
  const format = keyUsage === "sign" ? "pkcs8" : "spki";
  return runtime_default.crypto.subtle.importKey(format, keyData, algorithm, false, [keyUsage]);
}

// src/tokens/jwt/verifyJwt.ts
var DEFAULT_CLOCK_SKEW_IN_SECONDS = 5 * 1e3;
async function hasValidSignature(jwt, key) {
  const { header, signature, raw } = jwt;
  const encoder = new TextEncoder();
  const data = encoder.encode([raw.header, raw.payload].join("."));
  const algorithm = getCryptoAlgorithm(header.alg);
  const cryptoKey = await importKey(key, algorithm, "verify");
  return runtime_default.crypto.subtle.verify(algorithm.name, cryptoKey, signature, data);
}
function decodeJwt(token) {
  const tokenParts = (token || "").toString().split(".");
  if (tokenParts.length !== 3) {
    throw new TokenVerificationError({
      reason: "token-invalid" /* TokenInvalid */,
      message: `Invalid JWT form. A JWT consists of three parts separated by dots.`
    });
  }
  const [rawHeader, rawPayload, rawSignature] = tokenParts;
  const decoder = new TextDecoder();
  const header = JSON.parse(decoder.decode(base64url.parse(rawHeader, { loose: true })));
  const payload = JSON.parse(decoder.decode(base64url.parse(rawPayload, { loose: true })));
  const signature = base64url.parse(rawSignature, { loose: true });
  deprecatedObjectProperty(
    payload,
    "orgs",
    'Add orgs to your session token using the "user.organizations" shortcode in JWT Templates instead.',
    "decodeJwt:orgs"
  );
  return {
    header,
    payload,
    signature,
    raw: {
      header: rawHeader,
      payload: rawPayload,
      signature: rawSignature,
      text: token
    }
  };
}
async function verifyJwt(token, { audience, authorizedParties, clockSkewInSeconds, clockSkewInMs, issuer, key }) {
  if (clockSkewInSeconds) {
    deprecated("clockSkewInSeconds", "Use `clockSkewInMs` instead.");
  }
  const clockSkew = clockSkewInMs || clockSkewInSeconds || DEFAULT_CLOCK_SKEW_IN_SECONDS;
  const decoded = decodeJwt(token);
  const { header, payload } = decoded;
  const { typ, alg } = header;
  assertHeaderType(typ);
  assertHeaderAlgorithm(alg);
  const { azp, sub, aud, iss, iat, exp, nbf } = payload;
  assertSubClaim(sub);
  assertAudienceClaim([aud], [audience]);
  assertAuthorizedPartiesClaim(azp, authorizedParties);
  assertIssuerClaim(iss, issuer);
  assertExpirationClaim(exp, clockSkew);
  assertActivationClaim(nbf, clockSkew);
  assertIssuedAtClaim(iat, clockSkew);
  let signatureValid;
  try {
    signatureValid = await hasValidSignature(decoded, key);
  } catch (err) {
    throw new TokenVerificationError({
      action: "Make sure that this is a valid Clerk generate JWT." /* EnsureClerkJWT */,
      reason: "token-verification-failed" /* TokenVerificationFailed */,
      message: `Error verifying JWT signature. ${err}`
    });
  }
  if (!signatureValid) {
    throw new TokenVerificationError({
      reason: "token-invalid-signature" /* TokenInvalidSignature */,
      message: "JWT signature is invalid."
    });
  }
  return payload;
}

// src/tokens/keys.ts
var cache = {};
var lastUpdatedAt = 0;
function getFromCache(kid) {
  return cache[kid];
}
function getCacheValues() {
  return Object.values(cache);
}
function setInCache(jwk, jwksCacheTtlInMs = 1e3 * 60 * 60) {
  cache[jwk.kid] = jwk;
  lastUpdatedAt = Date.now();
  if (jwksCacheTtlInMs >= 0) {
    setTimeout(() => {
      if (jwk) {
        delete cache[jwk.kid];
      } else {
        cache = {};
      }
    }, jwksCacheTtlInMs);
  }
}
var LocalJwkKid = "local";
var PEM_HEADER = "-----BEGIN PUBLIC KEY-----";
var PEM_TRAILER = "-----END PUBLIC KEY-----";
var RSA_PREFIX = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA";
var RSA_SUFFIX = "IDAQAB";
function loadClerkJWKFromLocal(localKey) {
  if (!getFromCache(LocalJwkKid)) {
    if (!localKey) {
      throw new TokenVerificationError({
        action: "Set the CLERK_JWT_KEY environment variable." /* SetClerkJWTKey */,
        message: "Missing local JWK.",
        reason: "jwk-local-missing" /* LocalJWKMissing */
      });
    }
    const modulus = localKey.replace(/(\r\n|\n|\r)/gm, "").replace(PEM_HEADER, "").replace(PEM_TRAILER, "").replace(RSA_PREFIX, "").replace(RSA_SUFFIX, "").replace(/\+/g, "-").replace(/\//g, "_");
    setInCache(
      {
        kid: "local",
        kty: "RSA",
        alg: "RS256",
        n: modulus,
        e: "AQAB"
      },
      -1
      // local key never expires in cache
    );
  }
  return getFromCache(LocalJwkKid);
}
async function loadClerkJWKFromRemote({
  apiKey,
  secretKey,
  apiUrl = API_URL,
  apiVersion = API_VERSION,
  issuer,
  kid,
  jwksCacheTtlInMs = 1e3 * 60 * 60,
  // 1 hour,
  skipJwksCache
}) {
  const shouldRefreshCache = !getFromCache(kid) && reachedMaxCacheUpdatedAt();
  if (skipJwksCache || shouldRefreshCache) {
    let fetcher;
    const key = secretKey || apiKey;
    if (key) {
      fetcher = () => fetchJWKSFromBAPI(apiUrl, key, apiVersion);
    } else if (issuer) {
      fetcher = () => fetchJWKSFromFAPI(issuer);
    } else {
      throw new TokenVerificationError({
        action: "Contact support@clerk.com" /* ContactSupport */,
        message: "Failed to load JWKS from Clerk Backend or Frontend API.",
        reason: "jwk-remote-failed-to-load" /* RemoteJWKFailedToLoad */
      });
    }
    const { keys } = await callWithRetry(fetcher);
    if (!keys || !keys.length) {
      throw new TokenVerificationError({
        action: "Contact support@clerk.com" /* ContactSupport */,
        message: "The JWKS endpoint did not contain any signing keys. Contact support@clerk.com.",
        reason: "jwk-remote-failed-to-load" /* RemoteJWKFailedToLoad */
      });
    }
    keys.forEach((key2) => setInCache(key2, jwksCacheTtlInMs));
  }
  const jwk = getFromCache(kid);
  if (!jwk) {
    const cacheValues = getCacheValues();
    const jwkKeys = cacheValues.map((jwk2) => jwk2.kid).join(", ");
    throw new TokenVerificationError({
      action: "Contact support@clerk.com" /* ContactSupport */,
      message: `Unable to find a signing key in JWKS that matches the kid='${kid}' of the provided session token. Please make sure that the __session cookie or the HTTP authorization header contain a Clerk-generated session JWT.${jwkKeys ? ` The following kid are available: ${jwkKeys}` : ""}`,
      reason: "jwk-remote-missing" /* RemoteJWKMissing */
    });
  }
  return jwk;
}
async function fetchJWKSFromFAPI(issuer) {
  const url = new URL(issuer);
  url.pathname = joinPaths(url.pathname, ".well-known/jwks.json");
  const response = await runtime_default.fetch(url.href);
  if (!response.ok) {
    throw new TokenVerificationError({
      action: "Contact support@clerk.com" /* ContactSupport */,
      message: `Error loading Clerk JWKS from ${url.href} with code=${response.status}`,
      reason: "jwk-remote-failed-to-load" /* RemoteJWKFailedToLoad */
    });
  }
  return response.json();
}
async function fetchJWKSFromBAPI(apiUrl, key, apiVersion) {
  if (!key) {
    throw new TokenVerificationError({
      action: "Set the CLERK_SECRET_KEY or CLERK_API_KEY environment variable." /* SetClerkSecretKeyOrAPIKey */,
      message: "Missing Clerk Secret Key or API Key. Go to https://dashboard.clerk.com and get your key for your instance.",
      reason: "jwk-remote-failed-to-load" /* RemoteJWKFailedToLoad */
    });
  }
  const url = new URL(apiUrl);
  url.pathname = joinPaths(url.pathname, apiVersion, "/jwks");
  const response = await runtime_default.fetch(url.href, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    const json = await response.json();
    const invalidSecretKeyError = getErrorObjectByCode(json?.errors, "clerk_key_invalid" /* InvalidSecretKey */);
    if (invalidSecretKeyError) {
      const reason = "secret-key-invalid" /* InvalidSecretKey */;
      throw new TokenVerificationError({
        action: "Contact support@clerk.com" /* ContactSupport */,
        message: invalidSecretKeyError.message,
        reason
      });
    }
    throw new TokenVerificationError({
      action: "Contact support@clerk.com" /* ContactSupport */,
      message: `Error loading Clerk JWKS from ${url.href} with code=${response.status}`,
      reason: "jwk-remote-failed-to-load" /* RemoteJWKFailedToLoad */
    });
  }
  return response.json();
}
function reachedMaxCacheUpdatedAt() {
  return Date.now() - lastUpdatedAt >= MAX_CACHE_LAST_UPDATED_AT_SECONDS * 1e3;
}

// src/tokens/verify.ts
async function verifyToken(token, options) {
  const {
    apiKey,
    secretKey,
    apiUrl,
    apiVersion,
    audience,
    authorizedParties,
    clockSkewInSeconds,
    clockSkewInMs,
    issuer,
    jwksCacheTtlInMs,
    jwtKey,
    skipJwksCache
  } = options;
  if (options.apiKey) {
    deprecated("apiKey", "Use `secretKey` instead.");
  }
  const { header } = decodeJwt(token);
  const { kid } = header;
  let key;
  if (jwtKey) {
    key = loadClerkJWKFromLocal(jwtKey);
  } else if (typeof issuer === "string") {
    key = await loadClerkJWKFromRemote({ issuer, kid, jwksCacheTtlInMs, skipJwksCache });
  } else if (apiKey || secretKey) {
    key = await loadClerkJWKFromRemote({ apiKey, secretKey, apiUrl, apiVersion, kid, jwksCacheTtlInMs, skipJwksCache });
  } else {
    throw new TokenVerificationError({
      action: "Set the CLERK_JWT_KEY environment variable." /* SetClerkJWTKey */,
      message: "Failed to resolve JWK during verification.",
      reason: "jwk-failed-to-resolve" /* JWKFailedToResolve */
    });
  }
  return await verifyJwt(token, {
    audience,
    authorizedParties,
    clockSkewInSeconds,
    clockSkewInMs,
    key,
    issuer
  });
}

function sequence(...handlers) {
  const length = handlers.length;
  if (!length)
    return ({ event, resolve }) => resolve(event);
  return ({ event, resolve }) => {
    return apply_handle(0, event, {});
    function apply_handle(i, event2, parent_options) {
      const handle2 = handlers[i];
      return handle2({
        event: event2,
        resolve: (event3, options) => {
          const transformPageChunk = async ({ html, done }) => {
            if (options?.transformPageChunk) {
              html = await options.transformPageChunk({ html, done }) ?? "";
            }
            if (parent_options?.transformPageChunk) {
              html = await parent_options.transformPageChunk({ html, done }) ?? "";
            }
            return html;
          };
          const filterSerializedResponseHeaders = parent_options?.filterSerializedResponseHeaders ?? options?.filterSerializedResponseHeaders;
          const preload = parent_options?.preload ?? options?.preload;
          return i < length - 1 ? apply_handle(i + 1, event3, {
            transformPageChunk,
            filterSerializedResponseHeaders,
            preload
          }) : resolve(event3, { transformPageChunk, filterSerializedResponseHeaders, preload });
        }
      });
    }
  };
}
function handleClerk(secretKey, { debug = false, protectedPaths = [], signInUrl = "/sign-in" }) {
  return async ({ event, resolve }) => {
    const sessionToken = event.cookies.get("__session");
    debug && console.log("[Clerk SvelteKit] " + event.url.pathname);
    if (sessionToken) {
      debug && console.log("[Clerk SvelteKit] Found session token in cookies.");
      try {
        const session = await verifySession(secretKey, sessionToken);
        if (session) {
          debug && console.log("[Clerk SvelteKit] Session verified successfully.");
          event.locals.session = session;
        } else {
          debug && console.warn("[Clerk SvelteKit] Session verification returned no session.");
        }
      } catch (error) {
        debug && console.log("[Clerk SvelteKit] Session verification failed.", error?.reason ?? error);
      }
    } else {
      debug && console.log("[Clerk SvelteKit] No session token found in cookies.");
    }
    if (!event.locals.session && protectedPaths.find((path) => typeof path === "string" ? event.url.pathname.startsWith(path) : path(event))) {
      debug && console.log("[Clerk SvelteKit] No session found, redirecting to login screen.");
      return Response.redirect(event.url.origin + signInUrl + "?redirectUrl=" + event.url.pathname);
    }
    return resolve(event);
  };
}
const verifySession = async (secretKey, sessionToken) => {
  if (sessionToken) {
    const issuer = (issuer2) => issuer2.startsWith("https://clerk.") || issuer2.includes(".clerk.accounts");
    const claims = await verifyToken(sessionToken, {
      secretKey,
      issuer
    });
    return {
      userId: claims.sub,
      claims
    };
  }
};
const handle = sequence(
  handleClerk(private_env.CLERK_SECRET_KEY, {
    debug: true,
    protectedPaths: ["/admin"],
    signInUrl: "/login"
  })
);

var hooks_server = /*#__PURE__*/Object.freeze({
	__proto__: null,
	handle: handle
});

export { hooks_server as h, requireNodeFetchNative_8afd3fea as r };
//# sourceMappingURL=hooks.server-0bb0d91b.js.map
import pako from 'pako';

// Base64 encoding from binary
function uint8ToBase64(bytes) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

// Base64 decoding to binary
function base64ToUint8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Compress string and encode to Base64
export function compressToBase64(input) {
  const compressed = pako.deflate(input);
  return uint8ToBase64(compressed);
}

// Decode Base64 and decompress
export function decompressFromBase64(encoded) {
  const compressedBytes = base64ToUint8(encoded);
  const decompressed = pako.inflate(compressedBytes, { to: 'string' });
  return decompressed;
}

export function jsonToString(json) {
  return JSON.stringify(json);
}

export function stringToJSON(str) {
  if (!str) return {};
  return JSON.parse(str);
}


export function getTestDataCrypt(testData) {
  const a = jsonToString(testData);
  const b = compressToBase64(a);
  console.log(b);
}
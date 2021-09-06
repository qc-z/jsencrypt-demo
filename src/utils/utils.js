import CryptoJS from 'crypto-js'
let iv = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')
let key = 'TYX1UZTXUSDR1PGX'
console.log(key)
key = CryptoJS.enc.Hex.parse(key)

export function getKey(n = 16) {
  var chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  let res = ''
  for (let i = 0; i < n; i++) {
    const id = Math.ceil(Math.random() * 35)
    res += chars[id]
  }
  return res
}
export function ToUTF8(str) {
  var result = new Array()
  var k = 0
  for (var i = 0; i < str.length; i++) {
    var j = encodeURI(str[i])
    if (j.length === 1) {
      // 未转换的字符
      result[k++] = j.charCodeAt(0)
    } else {
      // 转换成%XX形式的字符
      var bytes = j.split('%')
      for (var l = 1; l < bytes.length; l++) {
        result[k++] = parseInt('0x' + bytes[l])
      }
    }
  }
  return result
}
export function Bytes2Str(arr) {
  var str = ''

  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16)

    if (tmp.length === 1) {
      tmp = '0' + tmp
    }

    str += tmp
  }

  return str
}
export function isBase64(str) {
  if (str === '' || str.trim() === '') {
    return false
  }
  try {
    return btoa(atob(str)) === str
  } catch (err) {
    return false
  }
}
export function encrypted(content) {
  const wordArray = CryptoJS.lib.WordArray.create(content)
  // Convert: ArrayBuffer -> WordArray 把文件转为WordArray
  let encrypted = CryptoJS.AES.encrypt(wordArray, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  console.log(encrypted)

  encrypted = encrypted.toString()
  console.log(encrypted)
  // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)
  return new Blob([encrypted])
}
export function decryed(content) {
  const decrypted = CryptoJS.AES.decrypt(content, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
  const typedArray = convertWordArrayToUint8Array(decrypted)
  // Convert: WordArray -> typed array

  return new Blob([typedArray])
}
/**
 * 把WordArray转为Uint8Array
 */
export function convertWordArrayToUint8Array(wordArray) {
  const arrayOfWords = Object.prototype.hasOwnProperty.call(wordArray, 'words')
    ? wordArray.words
    : []
  const length = Object.prototype.hasOwnProperty.call(wordArray, 'sigBytes')
    ? wordArray.sigBytes
    : arrayOfWords.length * 4
  const uInt8Array = new Uint8Array(length)
  let index = 0,
    word,
    i
  for (i = 0; i < length; i++) {
    word = arrayOfWords[i]
    uInt8Array[index++] = word >> 24
    uInt8Array[index++] = (word >> 16) & 0xff
    uInt8Array[index++] = (word >> 8) & 0xff
    uInt8Array[index++] = word & 0xff
  }
  return uInt8Array
}
export function download(fileEnc, name) {
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(fileEnc)
  const filename = name
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

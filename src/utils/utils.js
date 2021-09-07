import CryptoJS from 'crypto-js'
import SparkMD5 from 'spark-md5'

let iv = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')
let key = getKey()
console.log(key)
/**
 * @description: 随机生成秘钥
 * @param {*} n
 * @return {*}
 */
export function getKey(n = 64) {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let res = ''
  for (let i = 0; i < n; i++) {
    const id = Math.floor(Math.random() * 10)
    res += chars[id]
  }
  return res
}
/**
 * @description: 将字符串转化为utf-8字节
 * @param {*} str
 * @return {*}
 */
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
/**
 * @description: 将 byte 字节转化成十六进制
 * @param {*} arr
 * @return {*}
 */
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
/**
 * @description: 监测是否base64格式化
 * @param {*} str
 * @return {*} Boolean
 */
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
/**
 * @description: 加密
 * @param {base64} content
 * @return {*}
 */
export function encrypted(content) {
  const enc = CryptoJS.AES.encrypt(content, CryptoJS.enc.Hex.parse(key), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return enc.ciphertext.toString()
}
/**
 * @description: 解密
 * @param {base64} content
 * @return {*}
 */
export function decryed(content) {
  const decrypted = CryptoJS.AES.decrypt(content, CryptoJS.enc.Hex.parse(key), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
  // const typedArray = convertWordArrayToUint8Array(decrypted)
  const typedArray = CryptoJS.enc.Utf8.stringify(decrypted)
  // Convert: WordArray -> typed array
  console.log(typedArray)

  return new Blob([typedArray])
}
/**
 * @description: 把WordArray转为Uint8Array
 * @param {*} wordArray
 * @return {*}
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
/**
 * @description:
 * @param {Blob} blob
 * @param {*} name
 * @return {*}
 */
export function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
/**
 * @description: file文件转为base64
 * @param {Blob} blob
 * @param {function} cb
 * @return {*}
 */
export function blobToDataURL(blob, cb) {
  let reader = new FileReader()
  reader.onload = function (evt) {
    let base64 = evt.target.result
    cb(base64)
  }
  reader.readAsDataURL(blob)
}
export function getMd5(file) {
  return new Promise(function (resolve) {
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    fileReader.onload = (e) => {
      const md5 = SparkMD5.hashBinary(e.target.result)
      resolve(md5)
    }
  })
}

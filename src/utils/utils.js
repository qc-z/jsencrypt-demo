import CryptoJS from 'crypto-js'
import SparkMD5 from 'spark-md5'
import { JSEncrypt } from 'jsencrypt'

class Encrypte {
  constructor() {
    // 公钥
    this.publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnxbl4mcx0VvSn8KyfDRj
jBXFQdVWVMd97fnGLf/faC0uL2YMhgJSY2lzT65Njqsaroi7ReSILr6BkgQxW2KO
3L8pU9jsUKyu/v+fOAR/NvmNA7RON7+GYbdh0IwnOIAq5UQmLKvoYaaJVAgaWP8D
pEgEDJE0QnPT2mkG224NMVXNQVzg+wTRFoOisHc097UljN90lg/WWPin92PSIcLM
w9nn0sHtYlDZu3PhpG+FAxacRv5puOZO+hu+G9sYCnGcNdqLTJDS3+iUZPVi4TrP
aQ85k6rr/fYG2GG7bYZ/hU1n+QL80NZQfHJ9CSVFLY8Rk2Bx7bf9McJxzyIJtUaE
+wIDAQAB
-----END PUBLIC KEY-----
`
    // 偏移量
    this.iv = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')
  }
  /**
   * @description: 获取上传加密文件所需要的参数
   * @param {*} file
   * @param {*} type
   * @return {Object | formData}
   */
  handlerParams(file, type) {
    const that = this
    return new Promise(function (resolve) {
      that.getMd5(file).then((md5) => {
        const test = that.getKey()
        const key = that.handlerRSA(test, that.publicKey)
        that.blobToDataURL(file, (base64Url) => {
          const fileEnc = that.encrypted(base64Url, test)
          const params = {
            key,
            md5,
            name: file.name,
            file: new Blob([fileEnc])
          }
          const formData = new FormData()
          for (const key in params) {
            formData.append(key, params[key])
          }
          resolve(type === 'formData' ? formData : params)
        })
      })
    })
  }
  /**
   * @description: 随机生成秘钥
   * @param {*} n
   * @return {*}
   */
  getKey() {
    const str = '3132333435363738393041424344454631323334353637383930414243444566'
    const newStrAll = []
    str.split('').forEach((item) => {
      const newIndex = Math.round(Math.random() * newStrAll.length)
      newStrAll.splice(newIndex, 0, item)
    })
    return str
  }
  /**
   * @description: 监测是否base64格式化
   * @param {*} str
   * @return {*} Boolean
   */
  isBase64(str) {
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
  encrypted(content, key) {
    const enc = CryptoJS.AES.encrypt(content, CryptoJS.enc.Hex.parse(key), {
      iv: this.iv,
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
  decryed(content, key) {
    const decrypted = CryptoJS.AES.decrypt(content, CryptoJS.enc.Hex.parse(key), {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
    // const typedArray = convertWordArrayToUint8Array(decrypted)
    const typedArray = CryptoJS.enc.Utf8.stringify(decrypted)
    // Convert: WordArray -> typed array

    return new Blob([typedArray])
  }
  /**
   * @description: 把WordArray转为Uint8Array
   * @param {*} wordArray
   * @return {*}
   */
  convertWordArrayToUint8Array(wordArray) {
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
   * @description: file文件转为base64
   * @param {Blob} blob
   * @param {function} cb
   * @return {*}
   */
  blobToDataURL(blob, cb) {
    let reader = new FileReader()
    reader.onload = function (evt) {
      let base64 = evt.target.result
      cb(base64)
    }
    reader.readAsDataURL(blob)
  }
  getMd5(file) {
    return new Promise(function (resolve) {
      const fileReader = new FileReader()
      fileReader.readAsBinaryString(file)
      fileReader.onload = (e) => {
        const md5 = SparkMD5.hashBinary(e.target.result)
        resolve(md5)
      }
    })
  }
  handlerRSA(key, publicKey) {
    console.log(key, 'KEY')
    // 使用公钥加密
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)
    var encrypted = encrypt.encrypt(key)
    return encrypted
  }
  /**
   * @description:
   * @param {Blob} blob
   * @param {*} name
   * @return {*}
   */
  download(blob, filename) {
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
}
export default Encrypte

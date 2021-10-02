import CryptoJS from 'crypto-js'
import SparkMD5 from 'spark-md5'
import { JSEncrypt } from 'jsencrypt'

class Encrypte {
  constructor(options) {
    this._type = options.type ?? 'formData'
    this._params = options?.params
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
  handlerParams(file) {
    console.time('历时')
    const that = this

    return new Promise(function (resolve) {
      // that.getMd5(file).then((md5) => {
      let md5
      ;(async () => {
        md5 = await that.getMd5(file)
      })()

      const test = that.getKey()
      const key = that.handlerRSA(test, that.publicKey)
      that.blobToDataURL(file, async (base64Url) => {
        // 取中间数
        const half = Math.floor(base64Url.length / 2)
        let result = []
        let length = half < 1024 ? half : 1024
        // 文件大于等于2048 截取值拿中间数，否者拿1024
        const start = base64Url.slice(0, length)
        const end = base64Url.slice(-length)
        const center = base64Url.slice(length, base64Url.length - length)
        result = [start, center, end]

        const fileEnc = await that.encrypted(result, test, that)

        // that.encrypted(result, test, that).then((fileEnc) => {
        console.timeEnd('历时')
        console.log('文件原始大小: ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB')
        console.log(
          '文件加密后大小: ' + ((fileEnc.file2.size + 2048) / (1024 * 1024)).toFixed(2) + 'MB'
        )

        const params = {
          key,
          md5,
          name: file.name,
          ...fileEnc,
          ...that._params
        }
        const formData = new FormData()
        for (const key in params) {
          formData.append(key, params[key])
        }
        resolve(that._type === 'formData' ? formData : params)
        // })
        // })
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
   * @description: 加密
   * @param {base64} content
   * @return {*}
   */
  async encrypted(content, key, that) {
    return new Promise(function (resolve) {
      const start = CryptoJS.AES.encrypt(content[0], CryptoJS.enc.Hex.parse(key), {
        iv: that.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).ciphertext.toString()
      const end = CryptoJS.AES.encrypt(content[2], CryptoJS.enc.Hex.parse(key), {
        iv: that.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).ciphertext.toString()
      const result = {
        file1: new Blob([start]),
        file2: new Blob([content[1]]),
        file3: new Blob([end])
      }
      resolve(result)
    })
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
    // readAsText
    // readAsDataURL
    reader.readAsDataURL(blob)
  }
  async getMd5(file) {
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
  range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
export default Encrypte

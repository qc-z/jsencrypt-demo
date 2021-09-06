<template>
  <div class="container">33</div>
</template>

<script>
import CryptoJS from 'crypto-js'
// import JSEncrypt from 'jsencrypt'

// const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsEVFVtmLrQcLLlSJP+MQZabh6riR/k/qHwEYZab+zIsncDDFOGg//x/MsTSBjAQDogtVqDHPEaModra72Fir0NRFl93Qe//LqqJeGrfXZK43XI95mbaWclUMGZ1SRuVzLgK05mKFWKKMtpwXqDDkS4MSFzmYULh/NpLfH8LixOwIDAQAB
// `
function ToUTF8(str) {
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
function Bytes2Str(arr) {
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
// function createNonceStr() {
//   let chars = [
//     '0',
//     '1',
//     '2',
//     '3',
//     '4',
//     '5',
//     '6',
//     '7',
//     '8',
//     '9',
//     'A',
//     'B',
//     'C',
//     'D',
//     'E',
//     'F',
//     'G',
//     'H',
//     'I',
//     'J',
//     'K',
//     'L',
//     'M',
//     'N',
//     'O',
//     'P',
//     'Q',
//     'R',
//     'S',
//     'T',
//     'U',
//     'V',
//     'W',
//     'X',
//     'Y',
//     'Z',
//     'a',
//     'b',
//     'c',
//     'd',
//     'e',
//     'f',
//     'g',
//     'h',
//     'i',
//     'j',
//     'k',
//     'l',
//     'm',
//     'n',
//     'o',
//     'p',
//     'q',
//     'r',
//     's',
//     't',
//     'u',
//     'v',
//     'w',
//     'x',
//     'y',
//     'z'
//   ]
//   let nums = ''
//   for (let i = 0; i < 16; i++) {
//     //这里是几位就要在这里不改变
//     let id = parseInt(Math.random() * 61)
//     nums += chars[id]
//   }
//   return nums
// }
// console.log(createNonceStr())
// var jsEncrypt = new JSEncrypt()
// jsEncrypt.setPublicKey(publicKey)
// var encrypted = jsEncrypt.encrypt('1234567887654321')
// console.log(encrypted, '哇哇')

let key = Bytes2Str(ToUTF8('1234567887654321'))
console.log('密钥：', key)
key = CryptoJS.enc.Hex.parse(key)
let iv = '30313233343536373839414243444546'
iv = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')

var src = 'werty7890'

function encrypt(content) {
  var enc = CryptoJS.AES.encrypt(content, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  //console.log('加密:',enc.toString());
  return enc.ciphertext.toString()
}

function decrypt(content) {
  var dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(content), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(dec)
}
console.log('加密：', encrypt(src))

console.log('解密:', decrypt(encrypt(src)))

export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>

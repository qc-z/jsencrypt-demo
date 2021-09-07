<template>
  <div class="container">33</div>
</template>

<script>
import CryptoJS from 'crypto-js'
// import { getKey } from '../utils/utils.js'

let key = '9603929073240010284788105120367367049033255214740478387757111783'
console.log('密钥：', key)
key = CryptoJS.enc.Hex.parse(key)
let iv = '30313233343536373839414243444546'
iv = CryptoJS.enc.Hex.parse('30313233343536373839414243444546')

var src = 'werty7890'
console.log('明文', src)

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
  }).toString(CryptoJS.enc.Utf8)
  return dec
}
console.log('加密：', encrypt(src))

console.log(
  '解密:',
  decrypt(
    '5caa2a581a0fb52ba94f49bf12efecb8b16048a41d2e611e68c2438844fd7937577526c623c0a4a4fbf8de544bb45d92'
  )
)

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

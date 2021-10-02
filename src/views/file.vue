<template>
  <div class="container">33</div>
</template>

<script>
import CryptoJS from 'crypto-js'
// import { getKey } from '../utils/utils.js'

let key = '3132333435363738393041424344454631323334353637383930414243444566'
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

console.log('解密:', decrypt('904c2b2f59520b76c2a790da1d70efa8'))

export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() { },
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>

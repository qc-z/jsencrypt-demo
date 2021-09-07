<template>
  <div class="container">
    <div><input type="file" @change="encrypt" />加密</div>
    <br />
    <div><input type="file" @change="decrypt" />解密</div>
  </div>
</template>

<script>
import axios from 'axios'
import { encrypted, decryed, download } from '../utils/utils.js'
import JSZip from '../utils/jszip.js'

async function zip(file) {
  const zip = new JSZip()
  zip.file(file.name, file)

  const content = await zip.generateAsync({
    type: 'blob',
    password: '12345678',
    encryptStrength: 3
  })
  return content
  // const data = await JSZip.loadAsync(content, { password: "12345678" });
}
async function aaa() {
  const zip = new JSZip()
  zip.file('Hello.txt', 'Hello World\n')
  const content = await zip.generateAsync({
    type: 'blob',
    password: '12345678',
    encryptStrength: 3
  })
  console.log(content)
  download(content, 'example.zip')
}
aaa()
export default {
  methods: {
    /**
     * 加密
     */
    encrypt(e) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        const fileEnc = encrypted(reader.result)
        console.log(fileEnc, '1')
        // this.upload(fileEnc)
        zip(file).then((res) => {
          console.log(res)
          download(res, '加密' + file.name + '.zip')
        })
      }
      reader.readAsArrayBuffer(file)
    },
    /**
     * 解密
     */
    decrypt(e) {
      const file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = () => {
        const fileDec = decryed(reader.result)
        download(fileDec, '解密' + file.name)
      }
      reader.readAsText(file)
    },
    upload(file) {
      const formData = new FormData()
      formData.append('file', file)
      axios({
        method: 'post',
        url: 'http://localhost:3000/post',
        data: formData
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  text-align: center;
  width: 400px;
  height: 100px;
  margin: 100px auto;
  border: 1px solid red;
  padding-top: 30px;
  border-radius: 10px;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
}
</style>





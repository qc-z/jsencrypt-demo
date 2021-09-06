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
        this.upload(fileEnc)
        download(fileEnc, '加密' + file.name)
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





<template>
  <div class="container">
    <div><input type="file" @change="encrypt" />加密</div>
  </div>
</template>

<script>
import axios from 'axios'
import { encrypted, download, blobToDataURL, getMd5 } from '../utils/utils.js'
export default {
  methods: {
    /**
     * 加密
     */
    encrypt(e) {
      const file = e.target.files[0]
      blobToDataURL(file, (base64Url) => {
        const fileEnc = encrypted(base64Url)
        console.log(fileEnc)
        console.log(new Blob([fileEnc]))
        // this.upload(new Blob([fileEnc]))
        // 下载仅用于测试
        download(new Blob([fileEnc]), '加密' + file.name)
      })
      // 计算md5
      getMd5(file).then((res) => {
        console.log(res, 'getMd5(file)')
      })
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

<style lang="scss" scoped>
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

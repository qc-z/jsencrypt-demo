<template>
  <div class="container">
    <div><input type="file" @change="encrypt" />加密</div>
  </div>
</template>

<script>
import Encrypte from '../utils/encrypt.js'
export default {
  methods: {
    /**
     * 加密
     */
    encrypt(e) {
      const encrypte = new Encrypte()

      const file = e.target.files[0]
      // 第二个参数不传默认返回json，传formData返回formData
      encrypte.handlerParams(file).then((res) => {
        console.log(res)
        for (const key of res.keys()) {
          console.log(key + ' : ' + res.get(key))
          console.log()
        }
        // this.upload(res)
      })
    },
    /**
     * 业务
     */
    async upload(params) {
      const source = await fetch('http://192.168.37.1:8890/yhkc/upData', {
        method: 'POST',
        body: params
      })
      const res = await source.json()
      console.log(res)
      if (res.code === 200) alert(res.msg)
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

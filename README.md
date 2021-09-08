目前常见的加密算法可以分成三类

- 对称加密算法：AES、...
- 非对称加密算法：RSA、...
- Hash 算法：MD5、...

## 二、对称加密算法

对称加密(也叫私钥加密)指加密和解密使用相同密钥的加密算法。它要求发送方和接收方在安全通信之前，商定一个密钥。对称算法的安全性依赖于密钥，泄漏密钥就意味着任何人都可以对他们发送或接收的消息解密，所以密钥的保密性对通信的安全性至关重要。

### 特点

- 优点：算法公开、计算量小、加密速度快、加密效率高。
- 缺点：在数据传送前，发送方和接收方必须商定好密钥，然后双方保存好密钥。如果一方的密钥被泄露，那么加密信息也就不安全了
- 使用场景：本地数据加密、https 通信、网络传输等

### AES

AES：高级加密标准(Advanced Encryption Standard)为最常见的对称加密算法(微信小程序加密传输就是用这个加密算法的)。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/22303167/1630768912585-986b9578-f99c-4990-a2b3-8cd48eca563f.png#clientId=u223fc2be-97bf-4&from=paste&id=u4c49f638&margin=%5Bobject%20Object%5D&name=image.png&originHeight=215&originWidth=732&originalType=url&ratio=1&size=47288&status=done&style=none&taskId=u4a466f9f-83a1-4e1c-b749-ef2010c83c8)
密钥：用来加密明文的密码。密钥为接收方与发送方协商产生，但不可以直接在网络上传输，否则会导致密钥泄漏，通常是通过非对称加密算法加密密钥，然后再通过网络传输给对方，或者直接面对面商量密钥。密钥是绝对不可以泄漏的，否则会被攻击者还原密文，窃取数据。
在项目中需要用到 AES 加密时，可以使用开源的 js 库：[crypto-js](https://github.com/brix/crypto-js)

```javascript
var CryptoJS = require('crypto-js')
var data = { id: 1, text: 'Hello World' }
// 加密生成密文
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret_key_123').toString()
// 解密得到明文
var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret_key_123')
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
```

## 三、非对称加密算法

非对称加密算法需要两个密钥：公开密钥（publickey:简称公钥）和私有密钥（privatekey:简称私钥）。公钥与私钥是一对，如果用公钥对数据进行加密，只有用对应的私钥才能解密。因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。

### 特点

- 优点：非对称加密与对称加密相比其安全性更好
- 缺点：加密和解密花费时间长、速度慢，只适合对少量数据进行加密。
- 使用场景：https 会话前期、CA 数字证书、信息加密、登录认证等

### RSA

RSA 加密算法是非对称加密算法最常见的一种。RSA 是 1977 年由 Ron Rivest、Adi Shamir 和 Leonard Adleman 一起提出的。RSA 就是他们三人姓氏开头字母拼在一起组成的。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/22303167/1630768912555-4acd586d-b472-449e-8c77-84814f6c2839.png#clientId=u223fc2be-97bf-4&from=paste&id=u3a972e95&margin=%5Bobject%20Object%5D&name=image.png&originHeight=215&originWidth=732&originalType=url&ratio=1&size=47877&status=done&style=none&taskId=u4a2db559-bc71-451f-9e41-419a52fb15c)
在项目中需要用到 RSA 加密时，可以使用开源的 js 库：[jsencrypt](https://github.com/travist/jsencrypt)

```javascript
// 使用公钥加密
var publicKey = 'public_key_123'
var encrypt = new JSEncrypt()
encrypt.setPublicKey(publicKey)
var encrypted = encrypt.encrypt('Hello World')

// 使用私钥解密
var privateKey = 'private_key_123'
var decrypt = new JSEncrypt()
decrypt.setPrivateKey(privateKey)
var uncrypted = decrypt.decrypt(encrypted)
```

## 四、Hash 算法

Hash，一般翻译做“散列”，也有直接音译为“哈希”的，就是把任意长度的输入（又叫做预映射， pre-image），通过散列算法，变换成固定长度的输出，该输出就是散列值。这种转换是一种压缩映射，也就是，散列值的空间通常远小于输入的空间，不同的输入可能会散列成相同的输出，而不可能从散列值来唯一的确定输入值。
简单的说就是一种将任意长度的消息压缩到某一固定长度的消息摘要的函数。

### 特点

- 优点：不可逆、易计算、特征化
- 缺点：可能存在散列冲突
- 使用场景：文件或字符串一致性校验、数字签名、鉴权协议

### MD5

MD5 是比较常见的 Hash 算法，对于 MD5 而言，有两个特性是很重要的，第一：明文数据经过散列以后的值是定长的；第二：是任意一段明文数据，经过散列以后，其结果必须永远是不变的。前者的意思是可能存在有两段明文散列以后得到相同的结果，后者的意思是如果我们散列特定的数据，得到的结果一定是相同的。
比如在登录时将密码进行 md5 加密再传输给服务器，服务器中的密码也是用 md5 加密后存储的，那么只要验证加密后的密文是否一致则可。
在项目中需要用到 MD5 加密时，可以使用开源的 js 库：[JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5)

```javascript
var hash = md5('Hello World')
// b10a8db164e0754105b7a99be72e3fe5
```

## 五、Base64 编码

Base64 编码只是一种编码格式并不是加密算法，它可用于在 HTTP 环境下传递较长的标识信息。

### 特点

- 可以将任意的二进制数据进行 Base64 编码
- 数据加密之后，数据量会变大，变大 1/3 左右
- 编码后有个非常显著的特点，末尾有个=号
- 可进行反向解码
- Base64 编码具有不可读性

现代浏览器都提供了 Base64 编码、解码方法，btoa() 和 atob()

```javascript
var enc = window.btoa('Hello World')
// SGVsbG8gV29ybGQ=
var str = window.atob(enc)
// Hello World
```

## 六、总结

# 场景 1:文件上传

### AES+RSA(使用 AES 对称密码体制对传输数据加密，同时使用 RSA 不对称密码体制来传送 AES 的密钥，就可以综合发挥 AES 和 RSA 的优点同时避免它们缺点来实现一种新的数据加密方案)

1. 后端生成**非对称加密(RSA)**密钥对，把公钥发给前端
1. 前端**随机**生成**对称加密(AES)**的秘钥，进行文件加密
1. 前端用**RSA 公钥**加密该**密钥**
1. **md5 校验文件唯一性**
1. **发送: 加密后的秘钥 + 加密文件 + md5**
1. **接受: 用 RSA 私钥解密加密的密钥，之后再用解密后的 AES 密钥解密数据密文，得到明文**

**​**

# 场景 2: http 请求

### AES+RSA+md5

AES 的密钥在前端随机生成，从服务器获取 RSA 的公钥，对 AES 的密钥进行非对称加密，把加密后的密钥在请求头中传给服务器，用 AES 对 body 进行加密。服务器收到请求头中的加密后的密钥，用 RSA 的密钥进行解密，得到明文的 AES 密钥，即可对 body 进行解密。md5 有校验字符串一致性的特性，为避免请求被拦截后篡改 body，可在发请求时，将 body 字符串进行一个 md5 加密后在请求头传输，服务器收到请求后，解密 body 后再 md5 与请求头的进行校验，可验证是否请求被篡改。

​

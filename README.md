# cos-dump

完整备份腾讯云 cos 对象存储到本地

### 安装

- 项目级别

```bash
npm i cos-dump
```

- 全局安装

```bash
npm i -g cos-dump
```

### 调用方式

#### 脚本调用

```js
const { listAndDownloadFiles } = require("cos-dump");
// 使用示例
(async () => {
  try {
    const config = {
      SecretId: process.env.COS_SECRETID, // SecretId,SecretKey 获取地址 https://console.cloud.tencent.com/cam/capi
      SecretKey: process.env.COS_SECRETKEY,
      Bucket: process.env.COS_BUCKET, // 存储桶实例名称，格式参考：name-123123
      Region: process.env.COS_REGION, // ap-xxxx
      dir: process.env.COS_DIR || "downloads",
      ckpt: process.env.COS_CKPT || "checkpoint.json",
      failPath: process.env.COS_FAILPATH || "fail.json",
    };

    await listAndDownloadFiles(config);
  } catch (error) {
    console.error("An error occurred during the download process:", error);
  }
})();
```

#### 命令行参数

```bash
cos-dump --secret-id YOUR_SECRET_ID --secret-key YOUR_SECRET_KEY --bucket YOUR_BUCKET_NAME --region YOUR_REGION --dir downloads --ckpt checkpoint.json --fail-path fail.json
```

- 举例

```bash
cos-dump --secret-id xxxxx --secret-key xxxxx --bucket bucket-112233 --region ap-shanghai --dir downloads --ckpt checkpoint.json --fail-path fail.json
```

#### 使用环境变量

```bash
export COS_SECRETID=xxx
export COS_SECRETKEY=xxx
export COS_BUCKET=xxx
export COS_REGION=xxx
# export COS_DIR=xxx
# export COS_CKPT=xxx
# export COS_FAILPATH=xxx
cos-dump
```

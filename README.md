# cos-dump

完整备份腾讯云 cos 对象存储到本地

### 脚本调用

```js
const { listAndDownloadFiles } = require("cos-download");
// 使用示例
(async () => {
  try {
    const config = {
      SecretId: process.env.COS_SECRETID,
      SecretKey: process.env.COS_SECRETKEY,
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      dir: process.env.COS_DIR || "downloads",
      ckpt: process.env.COS_CKPT || "checkpoint.json",
      failPath: process.env.COS_FAILPATH,
    };

    await listAndDownloadFiles(config);
  } catch (error) {
    console.error("An error occurred during the download process:", error);
  }
})();
```

### 命令行参数

```bash
cos-dump --secret-id YOUR_SECRET_ID --secret-key YOUR_SECRET_KEY --bucket YOUR_BUCKET_NAME --region YOUR_REGION --dir downloads --ckpt checkpoint.json --fail-path fail.json
```

### 环境变量

```bash
export COS_SECRETID=
export COS_SECRETKEY=
export COS_BUCKET=
export COS_REGION=
export COS_DIR=
export COS_CKPT=
export COS_FAILPATH=
cos-dump
```

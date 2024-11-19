const yargs = require("yargs");
const { listAndDownloadFiles } = require("../lib/cos-dump");

// 命令行参数解析
const argv = yargs
  .option("dir", {
    alias: "d",
    description: "下载目录",
    type: "string",
    default: "downloads",
  })
  .option("ckpt", {
    alias: "c",
    description: "检查点文件位置",
    type: "string",
    default: "checkpoint.json",
  })
  .option("secret-id", {
    alias: "s",
    description: "SecretId",
    type: "string",
    demandOption: false,
  })
  .option("secret-key", {
    alias: "k",
    description: "SecretKey",
    type: "string",
    demandOption: false,
  })
  .option("bucket", {
    alias: "b",
    description: "Bucket 名称",
    type: "string",
    demandOption: false,
  })
  .option("region", {
    alias: "r",
    description: "Region 名称",
    type: "string",
    demandOption: false,
  })
  .help()
  .alias("help", "h").argv;
if (argv.SecretId) {
  envConfig.SecretId = argv.SecretId;
}
const envConfig = {
  SecretId: process.env.COS_SECRETID,
  SecretKey: process.env.COS_SECRETKEY,
  Bucket: process.env.COS_BUCKET,
  Region: process.env.COS_REGION,
  dir: process.env.COS_DIR,
  ckpt: process.env.COS_CKPT,
  failPath: process.env.COS_FAILPATH,
};

if (argv.SecretKey) {
  envConfig.SecretKey = argv.SecretKey;
}
if (argv.Bucket) {
  envConfig.Bucket = argv.Bucket;
}
if (argv.Region) {
  envConfig.Region = argv.Region;
}
if (argv.dir) {
  envConfig.dir = argv.dir;
}
if (argv.ckpt) {
  envConfig.ckpt = argv.ckpt;
}
if (argv.failPath) {
  envConfig.failPath = argv.failPath;
}

// 调用封装后的函数
listAndDownloadFiles(envConfig)
  .then(() => console.log("Download completed successfully."))
  .catch((err) => console.error("An error occurred during the download:", err));

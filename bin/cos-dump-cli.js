const yargs = require("yargs");
const { listAndDownloadFiles } = require("../lib/cos-dump");

// 命令行参数解析
const argv = yargs
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
  .option("fail-path", {
    alias: "f",
    description: "错误信息存储路径",
    type: "string",
    demandOption: false,
  })
  .help()
  .alias("help", "h").argv;

// 初始化配置对象
const envConfig = {
  SecretId: argv["secret-id"] || process.env.COS_SECRETID,
  SecretKey: argv["secret-key"] || process.env.COS_SECRETKEY,
  Bucket: argv.bucket || process.env.COS_BUCKET,
  Region: argv.region || process.env.COS_REGION,
  dir: argv.dir || process.env.COS_DIR,
  ckpt: argv.ckpt || process.env.COS_CKPT,
  failPath: argv["fail-path"] || process.env.COS_FAILPATH,
};

// 调用封装后的函数
listAndDownloadFiles(envConfig)
  .then(() => console.log("Download completed successfully."))
  .catch((err) => console.error("An error occurred during the download:", err));

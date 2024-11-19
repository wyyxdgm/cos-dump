// 引入腾讯云COS SDK
const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");

// 封装成 listAndDownloadFiles 函数
async function listAndDownloadFiles({ dir, ckpt, failPath, SecretId, SecretKey, Bucket, Region }) {
  // 下载目录和检查点文件位置
  let downloadDirectory = path.resolve(process.cwd(), dir || "downloads");
  let checkpointFile = path.resolve(process.cwd(), ckpt || "checkpoint.json");
  const failedFile = path.resolve(process.cwd(), failPath || ckpt + ".failed.json"); // 用于记录下载失败的文件
  let failedFiles = [];
  if (fs.existsSync(failedFile)) {
    failedFiles = JSON.parse(fs.readFileSync(failedFile, "utf8"));
  }
  // 确保下载目录存在
  if (!fs.existsSync(downloadDirectory)) {
    fs.mkdirSync(downloadDirectory, { recursive: true });
  }

  // 读取或初始化断点续传记录
  let checkpoint = {};
  if (fs.existsSync(checkpointFile)) {
    checkpoint = JSON.parse(fs.readFileSync(checkpointFile, "utf8"));
  } else {
    checkpoint = { Marker: "", DownloadedCount: 0 };
  }

  // 保存断点信息函数
  function saveCheckpoint() {
    fs.writeFileSync(checkpointFile, JSON.stringify(checkpoint, null, 2));
  }
  // 保存失败文件信息
  function saveFailedFiles() {
    fs.writeFileSync(failedFile, JSON.stringify(failedFiles, null, 2));
  }

  // 下载文件函数
  async function downloadFile(Key) {
    const localFilePath = path.join(downloadDirectory, Key);
    const localDir = path.dirname(localFilePath);

    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      cos.getObject(
        {
          Bucket,
          Region,
          Key,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          fs.writeFileSync(localFilePath, data.Body);
          checkpoint.DownloadedCount += 1; // 更新已下载文件计数
          saveCheckpoint();
          resolve();
        }
      );
    });
  }

  // 列出并下载文件函数
  async function listAndDownload(Marker) {
    return await new Promise((resolve, reject) => {
      cos.getBucket(
        {
          Bucket,
          Region,
          Marker, // 起始位置
          MaxKeys: 1000, // 每页最大文件数量
        },
        async (err, data) => {
          if (err) {
            console.error("Error listing files:", err);
            return reject(err);
          }

          const files = data.Contents;
          // console.log(`Found ${files.length} files to download...`);

          for (const file of files) {
            const filePath = path.join(downloadDirectory, file.Key);
            if (fs.existsSync(filePath)) {
              console.log(`Skipping already existing file: ${file.Key}`);
              checkpoint.DownloadedCount += 1; // 跳过计数
              saveCheckpoint();
              continue;
            }

            console.log(`Downloading file: ${file.Key}`);
            try {
              await downloadFile(file.Key);
              console.log(`Downloaded file: ${file.Key}`);
            } catch (err) {
              console.error(`Error downloading file: ${file.Key}`, err);
              failedFiles.push(file.Key); // 添加到失败集合
              saveFailedFiles(); // 实时保存失败文件信息
            }
          }

          // 如果有下一页，递归调用
          if (data.IsTruncated) {
            checkpoint.Marker = data.NextMarker;
            saveCheckpoint();
            await listAndDownload(data.NextMarker);
          } else {
            console.log("All files downloaded.");
            checkpoint.Marker = "";
            saveCheckpoint();
          }
          resolve();
        }
      );
    });
  }
  if (!SecretId) return console.error("缺失参数：SecretId，请执行:cos-dump -h 获取帮助");
  if (!SecretKey) return console.error("缺失参数：SecretKey，请执行:cos-dump -h 获取帮助");
  if (!Region) return console.error("缺失参数：Region，请执行:cos-dump -h 获取帮助");
  if (!Bucket) return console.error("缺失参数：Bucket，请执行:cos-dump -h 获取帮助");
  if (!downloadDirectory) return console.error("缺失参数：dir，请执行:cos-dump -h 获取帮助");
  if (!checkpointFile) return console.error("缺失参数：ckpt，请执行:cos-dump -h 获取帮助");
  if (!failedFile) return console.error("缺失参数：failPath，请执行:cos-dump -h 获取帮助");
  // 启动下载任务
  const cos = new COS({ SecretId, SecretKey });
  console.log("Starting download...");
  console.log(`Files already downloaded: ${checkpoint.DownloadedCount}`);
  await listAndDownload(checkpoint.Marker);
}

module.exports = { listAndDownloadFiles };

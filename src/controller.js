const sharp = require("sharp");
const { join } = require("path");

exports.uploadImage = async (req, res) => {
  try {
    const file = req.files?.filename;
    const { width, height, solidColor, color, keepOriginalSize, resizeTo } =
      req.body;

    let fileBuffer;

    if (JSON.parse(solidColor)) {
      fileBuffer = await sharp(file.data)
        .resize(Number(width), Number(height), {
          fit: resizeTo, // cover, contain, fill, inside, outside
          position: sharp.strategy.entropy,
          background: color
        })
        .toBuffer();
    } else {
      const blurImage = await sharp(file.data)
        .resize(Number(width), Number(height), {
          fit: sharp.fit.cover,
          position: sharp.strategy.entropy,
          background: color
        })
        .blur(20)
        .toBuffer();

      let acWidth = width;
      let acHeight = height;

      if (keepOriginalSize) {
        const getMetaData = await sharp(file.data).metadata();

        if (getMetaData.width < acWidth && getMetaData.height < acHeight) {
          acWidth = getMetaData.width;
          acHeight = getMetaData.height;
        }
      }

      const actualImage = await sharp(file.data)
        .resize(Number(width), Number(height), {
          fit: keepOriginalSize ? sharp.fit.inside : resizeTo,
          position: sharp.strategy.entropy,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();

      fileBuffer = await sharp(blurImage)
        .composite([{ input: actualImage, gravity: "center" }])
        .png()
        .toBuffer();
    }

    // res.set({ "Content-Type": file.mimetype });
    // res.send(fileBuffer);

    let fileSize =
      Math.round(((await sharp(fileBuffer).metadata()).size / 1000) * 100) /
      100;
    fileSize =
      fileSize > 1000
        ? "~" + Math.round(fileSize / 10) / 100 + "MB"
        : "~" + fileSize + "KB";

    return res.render(join(__dirname, "./views/viewImage.ejs"), {
      title: "Rendered Image",
      imageBuffer: `data:${file.mimetype};base64,${fileBuffer.toString(
        "base64"
      )}`,
      fileSize
    });

    // return res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500);
    res.redirect("/");
    return;
  }
};

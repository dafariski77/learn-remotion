/* eslint-disable */

const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const controller = async (req, res) => {
  console.log("req.body");
  console.log(req.body);

  try {
    const compositionId = "HelloWorld";

    const bundleLocation = await bundle({
      entryPoint: path.resolve("./src/index.ts"),
      webpackOverride: (config) => config,
    });

    const inputProps = {
      name: req.body.name,
    };

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: `out/${compositionId}.mp4`,
      inputProps,
    });

    return res.status(200).json({ success: "berhasil" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ failed: error.message });
  }
};

app.post("/render", controller);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

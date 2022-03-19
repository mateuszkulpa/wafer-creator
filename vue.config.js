// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
module.exports = {
  devServer: {
    host: "localhost",
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/styles/_variables.scss")],
    },
  },
};

module.exports = {
  apps: [
    {
      name: "aggregator",
      script: "/home/releevante/.nvm/versions/node/v20.18.3/bin/node",
      cwd: "/home/releevante/Documents/platform/releevante-platform/smartlib/aggregator/",
      args: "dist/index.js",
      env: {
        NODE_ENV: "production"
      }
    },
  ]
};

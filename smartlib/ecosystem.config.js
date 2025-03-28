module.exports = {
  apps: [
    {
      name: "bridge.io",
      cwd: "/home/releevante/Documents/platform/releevante-platform/smartlib/bridge.io/",
      script: "/home/releevante/Documents/platform/releevante-platform/.venv/bin/python3",
      args: "app.py",
      env: {
        PYTHON_ENV: "production",
        port: 7777
      }
    },
    {
      name: "smartlib-ui",
      cwd: "/home/releevante/Documents/platform/releevante-platform/smartlib/ui/",
      script: "npm start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "aggregator",
      cwd: "/home/releevante/Documents/platform/releevante-platform/smartlib/aggregator/",
      script: "/home/releevante/.nvm/versions/node/v20.18.3/bin/node",
      args: "dist/index.js",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};

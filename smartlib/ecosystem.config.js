module.exports = {
  apps: [
    {
      name: "smartlib-bridge-io",
      script: "../.venv/bin/python3",
      args: "app.py",
      cwd: "bridge.io/",
      env: {
        PYTHON_ENV: "production",
      }
    },
    {
      name: "smartlib-ui",
      script: "npm start",
      cwd: "ui/",
      //script: "node",
      //args: "ui/.next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      }
    },
    {
      name: "smartlib-aggregator",
      script: "aggregator/dist/index.js",
      instances: "1", // Run on all CPU cores
      exec_mode: "cluster", // Cluster mode for better performance
      env: {
        NODE_ENV: "production",
      }
    },
  ]
};

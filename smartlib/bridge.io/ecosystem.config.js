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
  ]
};

module.exports = {
    apps: [
      {
        name: "smartlib-ui",
        script: "node",
        args: ".next/standalone/server.js",
        env: {
          NODE_ENV: "production",
          PORT: 3000,
        },
      },
    ],
  };
  
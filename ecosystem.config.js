module.exports = {
    apps: [
        {
            name: "imagepro",
            script: "npm",
            args: "start",
            env: {
                PORT: 3002,
                NODE_ENV: 'production'
            },
            exec_mode: "fork",
            instances: 1,
            max_memory_restart: "500M",
            watch: false,
            merge_logs: true,
            autorestart: true
        }
    ],
};
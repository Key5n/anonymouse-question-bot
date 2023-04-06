module.exports = {
  apps: [
    {
      script: 'dist/index.js',
      watch: ['dist/'],
      name: 'Production',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

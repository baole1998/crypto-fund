const env = process?.env?.NODE_ENV || 'development';

const apiEnvironment = {
  development: {
    api: process.env.REACT_APP_API_URL,
  },
  production: {
    api: process.env.REACT_APP_API_URL,
  },
};

module.exports = apiEnvironment[env];

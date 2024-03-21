module.exports = {
  root: true,
  env: {
    jest: true,
  },
  extends: "prettier",
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "no-return-assign": 0,
    camelcase: 0,
  },
  plugins: ["prettier"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 6,
    requireConfigFile: false,
  },
};

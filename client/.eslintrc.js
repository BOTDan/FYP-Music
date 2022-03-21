module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
    },
  },
};

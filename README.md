# M360 Web

## Project setup
```
npm install
```

## Setting up your `.env` files

Create a new file on the root folder called `.env.[mode].local` and copy the contents of `.env.example`. Replace `[mode]` with any of the following values: `development` | `staging` | `production`. Supply the values needed. Note that when building the app for a specific `.env` setup, your `.env.[mode].local` file should contain the following line:

```
NODE_ENV=production
```

Otherwise, if not using `build`, and only using `serve`,  it should instead contain:

```
NODE_ENV=development
```

The `.env.[mode].local` is ignored by git by default, this is to protect the private `.env` files from being pushed to the repository.

## Adding new `.env` variables

When adding a new `.env` variable, the variable should always be prefixed with `VUE_APP_` in other for it to be usable inside the Vue components. Example:

```
VUE_APP_OTHER_API_KEY=other_api_key_in_sha512_format
```

## How to generate your `SECRET_KEY`

Secret keys are needed for a number of `.env` variables. You can generate one using `Node` with:

```javascript
crypto.randomBytes(16).toString('base64')
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

import store from '@/store';
import router from '@/router';
import debug from 'debug';

const log = debug('m360:request');
if (process.env.VUE_APP_ENV === 'production') debug.disable();

const HTTP_VERBS = ['get', 'post', 'put', 'patch', 'delete'];
const REQUEST_TIMEOUT = 30000;
let controller;
log('initializing request util...');

/**
 * get a property from the global context
 * @param {string} property
 */
function getGlobal(property) {
  if (typeof self !== 'undefined' && self && property in self)
    return self[property];
  if (typeof window !== 'undefined' && window && property in window)
    return window[property];
  if (typeof global !== 'undefined' && global && property in global)
    return global[property];
}

export class HTTPError extends Error {
  constructor(body, response) {
    super(
      body?.error ||
        body?.message ||
        body?.description ||
        response?.statusText ||
        'Internal Server Error'
    );
    this.name = 'HTTPError';
    this.code = response.status;
    this.response = response;
    this.status = response.status;

    if (body && response.status !== 500) {
      this.name = body.name ?? 'HTTPError';
      this.code = body.code;
      this.message = body.message;
      this.description = body.description;
    }
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request timed out');
    this.name = 'TimeoutError';
  }
}

const localStorage = getGlobal('localStorage');
if (!localStorage) throw new Error('LocalStorage API not available');

const STORAGE_KEY = 'jwt';

export function getJWT() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setJWT(jwt) {
  localStorage.setItem(STORAGE_KEY, jwt);
}

export function removeJWT() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Accepts an object (even with deep nesting) and returns a flattened
 * object with its key respecting the deep nested keys;
 *
 * @returns {object}
 */
export const getFlatPairs = (obj, keys = []) =>
  Object.entries(obj).reduce((pairs, [key, value]) => {
    if (typeof value === 'object') {
      const otherPair = getFlatPairs(value, [...keys, key]);
      pairs = Object.assign(pairs, otherPair);
    } else {
      const [key0, ...rest] = [...keys, key];
      pairs[`${key0}${rest.map((a) => `[${a}]`).join('')}`] = value;
    }

    return pairs;
  }, {});

let isRedirected = false;
export const LAST_REQUEST_KEY = 'reqdt';

/**
 * @typedef {Object} RequestHandlerOpts
 * @property {string} [method=get]
 * @property {Object} body
 * @property {Object} headers
 * @property {string} [baseURI] Will always take precedence
 * @property {number} [timeout]
 * @property {string|Object} [searchParams]
 * @property {boolean} [authenticate=true] Will default work as authenticated
 */

/**
 * Handler for all API Requests using Window.fetch API.
 * Any limitations for this implementations will require using
 * axios as an alternative for those requests.
 *
 * @template T
 * @param {string} input
 * @param {RequestHandlerOpts} opts
 * @returns {Promise<T>}
 */
export async function request(input, opts) {
  // get fetch method
  const fetch = getGlobal('fetch');
  if (!fetch) throw new Error('Fetch API not available');

  controller = new AbortController();
  const signal = controller?.signal;

  // add defaults
  opts = Object.assign(
    {
      method: 'get',
      timeout: REQUEST_TIMEOUT,
      credentials: 'same-origin',
      authenticate: true,
    },
    opts
  );

  // normalize method
  if (~HTTP_VERBS.indexOf(opts.method)) opts.method = opts.method.toUpperCase();

  // normalize uri
  opts.baseURI = String(opts.baseURI || process.env.VUE_APP_API_URI || '');
  if (!opts.baseURI.endsWith('/')) opts.baseURI += '/';

  input = String(input || '');
  if (opts.baseURI && input.startsWith('/')) {
    throw new Error(`input must not begin with a slash when using baseURI`);
  }

  input = opts.baseURI + input;

  // add searchParams
  if (opts.searchParams) {
    // convert query string (for POJOs and arrays)
    if (typeof opts.searchParams !== 'string') {
      opts.searchParams = new URLSearchParams(
        getFlatPairs(opts.searchParams)
      ).toString();
    }

    input += `?${opts.searchParams}`;
  }

  // add headers
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';

  // attach authorization header
  const jwt = opts.authenticate && getJWT();
  if (jwt) {
    opts.headers['Authorization'] = `Bearer ${getJWT()}`;
  }

  // normalize body (for POJOs and arrays)
  if (typeof opts.searchParams !== 'string')
    opts.body = JSON.stringify(opts.body);

  // build opts
  const fetchopts = {
    body: opts.body,
    method: opts.method,
    headers: opts.headers,
    credentials: opts.credentials,
    signal,
  };

  log(`[REQ]`, { url: input, ...fetchopts });
  localStorage.setItem(LAST_REQUEST_KEY, new Date().getTime());

  return (
    Promise.race([
      // execute REST call
      fetch(input, fetchopts),
      // race a timeout
      new Promise((resolve, reject) =>
        setTimeout(() => reject(new TimeoutError()), opts.timeout)
      ),
    ])
      // parse result
      .then((response) => {
        return response.text().then((body) => {
          try {
            body = body === '' ? null : JSON.parse(body);
            log(`[RES]`, {
              body,
              ok: response.ok,
              url: response.url,
              type: response.type,
              status: response.status,
              redirected: response.redirected,
            });
          } catch (error) {
            log(`[RES#body-parse-error#error]`, error);
            log(`[RES#body-parse-error#body]`, body);
            log(`[RES#body-parse-error#response]`, response);
            // catch all Internal Server Errors to provide legitimate error message
            if (response.status >= 400) {
              throw new HTTPError(body, response);
            }

            throw error;
          }

          if (response.status < 300) return body;

          log(`[ERR#body]`, body);
          log(`[ERR#response]`, response);
          if (Array.isArray(body.error) || Array.isArray(body.errors)) {
            throw new HTTPError(
              (body.error ?? body.errors)?.shift?.(),
              response
            );
          }

          // check whether body.error contains the error details
          if (
            !!body.error &&
            typeof body.error === 'object' &&
            Object.keys(body.error).length
          ) {
            throw new HTTPError(body.error, response);
          }

          throw new HTTPError(body, response);
        });
      })
      // log errors
      .catch((error) => {
        log(`[ERR]`, error);
        // abort API call on timeout
        if (error.name === 'TimeoutError') controller?.abort();

        if (error.code === 500 || error.status === 500) {
          // store.dispatch('ui/enqueueSnack', error);
        }

        // Unauthenticated
        if (error.code === 401 || error.status === 401) {
          store.dispatch('auth/clearAuth');

          log('redirecting#currentRoute: ', router.currentRoute);

          // just to avoid multiple redirects, esp with parallel API calls
          if (
            router.currentRoute.name !== 'login' ||
            router.currentRoute.path !== '/'
          ) {
            // this if-else is necessary for parallel API calls (Promise.all())
            if (isRedirected) {
              isRedirected = false;
            } else {
              router.push({ name: 'login' });
              isRedirected = true;
            }
          }
        }

        throw error;
      })
  );
}

log('initialization complete');

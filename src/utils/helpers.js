import camelCase from 'lodash/camelCase';

export const formatAmount = (value, minFrac = 0, maxFrac = 0) => {
  if ((!value && value !== 0) || typeof value !== 'number') return value;

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  });
};

export const toProperCase = (text) => {
  if (!text) return text;

  const temp = text.replace(/_/g, ' ').replace('-', ' ').toLowerCase();

  return temp
    .split(' ')
    .map((str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`)
    .join(' ');
};

export const toUpperCase = (text) => {
  if (!text) return text;

  return text.replace(/_/g, ' ').toString().toUpperCase();
};

export const toLowerCase = (text) => {
  if (!text) return text;

  return text.toString().toLowerCase();
};

export const toCamelCase = (text) => {
  if (!text) return text;
  return camelCase(text);
};

export const sort = (arr, override) => {
  let sorted = arr;
  let opt = {
    key: 'id',
    sortOrder: 'asc',
    ...override,
  };

  if (!arr) return arr;
  if (!Array.isArray(arr)) throw new Error(`${arr} is not an array.`);

  if (opt.key)
    sorted = arr.sort((a, b) => {
      if (typeof a === 'object') {
        if (typeof a[opt.key] === 'string') {
          let f = a[opt.key]?.toUpperCase();
          let s = b[opt.key]?.toUpperCase();

          if (f > s) return 1;
          if (f < s) return -1;

          return 0;
        } else {
          return a[opt.key] - b[opt.key];
        }
      } else {
        return a - b;
      }
    });

  return opt.sortOrder !== 'asc' ? sorted.reverse() : sorted;
};

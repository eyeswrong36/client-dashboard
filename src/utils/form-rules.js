export const requiredRule =
  (msg = 'This field is required.') =>
  (val) => {
    const type = Array.isArray(val) ? 'array' : typeof val;

    switch (type) {
      case 'object': {
        return !!Object.values(val).length || msg;
      }
      case 'string': {
        return !!val?.trim() || msg;
      }
      case 'array': {
        return !!val.length || msg;
      }
      default: {
        return val ?? msg;
      }
    }
  };

export const minLengthRule =
  (length, msg = `Minimum of ${length} characters/numbers.`) =>
  (val) => {
    return val?.length >= length || msg;
  };

export const maxLengthRule =
  (length, msg = `Maximum of ${length} characters/numbers only.`) =>
  (val) => {
    return val?.length <= length || msg;
  };

export const minNumberRule =
  (minVal, msg = `Must not be less than ${minVal}.`) =>
  (val) => {
    return val >= minVal || msg;
  };

export const maxNumberRule =
  (maxVal, msg = `Must not be greater than ${maxVal}.`) =>
  (val) =>
    val <= maxVal || msg;

/* eslint-disable */
export const emailRule =
  (msg = 'Incorrect email.') =>
  (val) => {
    // eslint-disable-next-line
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(val) || msg;
  };

/**
 * Must have at least have:
 *  - One Upper Case character
 *  - One Lower Case character
 *  - One Numeric character
 *  - One Special character
 *  - 8 - 128 characters
 *  - No identical characters in a row
 */

/* eslint-disable */
export const passwordRule =
  (msg = 'Invalid Password.') =>
  (val) => {
    const regex =
      /^(?!.*([A-Za-z0-9])\1{2})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s])/;
    return (regex.test(val) && val.length >= 8 && val.length <= 128) || msg;
  };
/* eslint-enable */

/**
 * @param {pattern} regex Default: /^[A-z\s-.,']*$/
 */
export const limitRule =
  (regex = /^[A-z\s-.,']*$/) =>
  (val) =>
    regex.test(val) || 'Incorrect field format.';
/* eslint-enable */

/* eslint-disable */
export const urlRule = (val) => {
  const regex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return regex?.test(val) || 'Invalid URL form.';
};
/* eslint-enable */

export const maxTwoSameCharRule = (val) => {
  /* eslint-disable */
  return (
    /^(([a-zA-Z0-9-!@$#%^&*()_+|~=`{}\[\]:";'<>?,.\\/])\2?(?!\2))+$/.test(
      val
    ) || 'Maximum of two identical characters characters in a row.'
  );
  /* eslint-enable */
};

export const isMatchRule =
  (msg = 'Must be match', toMatch) =>
  (val) => {
    if (!toMatch) return false;

    return toMatch === val || msg;
  };

export default function hasChange(objectFrom, objectTo) {
  if (typeof objectFrom !== 'object' || typeof objectTo !== 'object')
    throw new Error('form is not an object.');

  return JSON.stringify(objectFrom) !== JSON.stringify(objectTo);
}

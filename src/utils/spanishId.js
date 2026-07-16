const CHECK_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

export function isValidDNI(value) {
  const m = /^(\d{8})([A-Za-z])$/.exec((value || '').trim());
  if (!m) return false;
  const num = parseInt(m[1], 10);
  return CHECK_LETTERS[num % 23] === m[2].toUpperCase();
}

export function isValidNIE(value) {
  const m = /^([XYZ])(\d{7})([A-Za-z])$/i.exec((value || '').trim());
  if (!m) return false;
  const prefix = { X: '0', Y: '1', Z: '2' }[m[1].toUpperCase()];
  const num = parseInt(prefix + m[2], 10);
  return CHECK_LETTERS[num % 23] === m[3].toUpperCase();
}

export function isValidSpanishId(value) {
  return isValidDNI(value) || isValidNIE(value);
}

export function isValidPostalCode(value) {
  return /^\d{5}$/.test((value || '').trim());
}

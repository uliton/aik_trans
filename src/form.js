export const cleanName = (value) => value.replace(/[^\p{L}\p{M} ]/gu, '').slice(0, 100);
export const validName = (value) => /^[\p{L}\p{M}]+(?: +[\p{L}\p{M}]+)*$/u.test(value.trim()) && [...value.trim()].length >= 2;

export function phoneDigits(value) {
  let digits = value.replace(/\D/g, '');
  // Accept full Ukrainian numbers pasted or supplied by browser autofill.
  if (digits.length === 12 && digits.startsWith('380')) digits = digits.slice(3);
  else if (digits.length === 10 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 9);
}

export function formatPhone(value) {
  const digits = phoneDigits(value);
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean).join(' ');
}

export function phoneCaret(formatted, digitsBeforeCaret) {
  if (!digitsBeforeCaret) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) count++;
    if (count === digitsBeforeCaret) return i + 1;
  }
  return formatted.length;
}

export const asciiEmail = (value) => /^[\x21-\x7E]*$/.test(value);
export function validEmail(value) {
  if (value.length > 254 || !asciiEmail(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && labels.every(label => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label)) && /^[a-zA-Z]{2,63}$/.test(labels.at(-1));
}

export const generateRandomString = (length: number, type: string = null) => {
  let charSet = '';
  let randomString = '';
  if (type === 'number') {
    charSet = '123456789';
  } else {
    charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  }

  for (let i = 0; i < length; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

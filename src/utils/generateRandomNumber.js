import { randomBytes } from 'crypto';

const generateRandomNumber = () => {
  
   const buffer = randomBytes(2); 

  const randomNumber = buffer.readUInt16BE(0); 
  return randomNumber % 9000 + 1000;
};

export default generateRandomNumber;

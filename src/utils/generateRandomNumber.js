import { randomBytes } from 'crypto';

const generateRandomNumber = () => {
   const buffer = randomBytes(5);

    const randomNumber = buffer.readUInt32BE(0) * 256 + buffer[4];
    return (
      Math.floor(
        (randomNumber / 0xffffffffff) * (9999999999 - 1000000000 + 1),
      ) + 1000000000
    );
  
};

export default generateRandomNumber;

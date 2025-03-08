// Script to generate a proper hash
import * as bcrypt from 'bcrypt';

async function generateHash() {
  const saltRounds = 10;
  const hash = await bcrypt.hash('yourPassword123', saltRounds);
  console.log('Hashed password to insert in DB:', hash);
}

generateHash();
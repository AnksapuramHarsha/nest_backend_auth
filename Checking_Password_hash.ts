import * as bcrypt from 'bcrypt';

async function generateHash() {
  const saltRounds = 10;
  const plainPassword = 'yourPassword123';
  const hash = '$2b$10$8MqJ.QzvL99YBk3zVjtttumUxEhEDk3q2CL3Epx9lU56yN9xGQ6fi';
  console.log('Hashed password:', hash);

  // Now, verify the password:
  const isMatch = await bcrypt.compare(plainPassword, hash);
  if (isMatch) {
    console.log('Password matches!');
  } else {
    console.log('Password does not match!');
  }
}

generateHash();
const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

function authMiddleware(event) {
  let token = event.headers.authorization || event.headers.Authorization;

  if (token) {
    token = token.split(' ').pop().trim();
  } else {
    console.log('No token found');
    return null;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    console.log('User data set in request:', data);
    return data;
  } catch (error) {
    console.log('Invalid token', error);
    return null;
  }
}

function signToken({ email, username, _id }) {
  const payload = { email, username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = { authMiddleware, signToken };

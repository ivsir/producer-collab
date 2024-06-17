import jwt from 'jsonwebtoken';

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

export function authMiddleware({ req }) {
  let token = req.body.token || req.query.token || req.headers.authorization;
  // console.log(token)
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
}

export function signToken({ email, username, _id }) {
  const payload = { email, username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
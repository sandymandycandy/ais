import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

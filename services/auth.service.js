import { signInWithEmailAndPassword } from 'firebase/auth';
import jwt from 'jsonwebtoken';
import { auth, isFirebaseConfigured } from '../config/firebase.js';

export async function login({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email y contraseña son obligatorios');
    error.status = 400;
    throw error;
  }

  if (!isFirebaseConfigured()) {
    const error = new Error('Firebase no está configurado. Revisá las variables en .env');
    error.status = 500;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET no está configurado en .env');
    error.status = 500;
    throw error;
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = jwt.sign(
      { uid: credential.user.uid, email: credential.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return {
      token,
      tokenType: 'Bearer',
      user: {
        uid: credential.user.uid,
        email: credential.user.email,
      },
    };
  } catch {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }
}

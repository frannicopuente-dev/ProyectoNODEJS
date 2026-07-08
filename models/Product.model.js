import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase.js';

const COLLECTION = 'products';

/**
 * Estructura del documento en Firestore (colección: products):
 * {
 *   title: string,
 *   price: number,
 *   category: string,
 *   description: string,
 *   image: string
 * }
 */
export class Product {
  constructor({ title, price, category, description = '', image = '' }) {
    this.title = title;
    this.price = price;
    this.category = category;
    this.description = description;
    this.image = image;
  }

  static ensureFirebase() {
    if (!isFirebaseConfigured()) {
      const error = new Error('Firebase no está configurado. Revisá las variables en .env');
      error.status = 500;
      throw error;
    }
  }

  static validate(data) {
    const { title, price, category } = data;

    if (!title || price === undefined || !category) {
      const error = new Error('Los campos title, price y category son obligatorios');
      error.status = 400;
      throw error;
    }

    if (Number.isNaN(Number(price))) {
      const error = new Error('El campo price debe ser un número válido');
      error.status = 400;
      throw error;
    }

    return new Product({
      title,
      price: Number(price),
      category,
      description: data.description ?? '',
      image: data.image ?? '',
    });
  }

  toFirestore() {
    return {
      title: this.title,
      price: this.price,
      category: this.category,
      description: this.description,
      image: this.image,
    };
  }

  static async findAll() {
    Product.ensureFirebase();

    try {
      const snapshot = await getDocs(collection(db, COLLECTION));
      return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
    } catch {
      const error = new Error('Error al obtener productos desde Firestore');
      error.status = 500;
      throw error;
    }
  }

  static async findById(id) {
    Product.ensureFirebase();

    try {
      const snapshot = await getDoc(doc(db, COLLECTION, id));

      if (!snapshot.exists()) {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
      }

      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      if (error.status) throw error;

      const dbError = new Error('Error al obtener el producto desde Firestore');
      dbError.status = 500;
      throw dbError;
    }
  }

  static async create(productData) {
    Product.ensureFirebase();

    const product = Product.validate(productData);

    try {
      const docRef = await addDoc(collection(db, COLLECTION), product.toFirestore());
      return { id: docRef.id, ...product.toFirestore() };
    } catch (error) {
      if (error.status) throw error;

      const dbError = new Error('Error al crear el producto en Firestore');
      dbError.status = 500;
      throw dbError;
    }
  }

  static async delete(id) {
    Product.ensureFirebase();

    try {
      const snapshot = await getDoc(doc(db, COLLECTION, id));

      if (!snapshot.exists()) {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
      }

      await deleteDoc(doc(db, COLLECTION, id));
      return { id, message: 'Producto eliminado correctamente' };
    } catch (error) {
      if (error.status) throw error;

      const dbError = new Error('Error al eliminar el producto en Firestore');
      dbError.status = 500;
      throw dbError;
    }
  }

  static async update(id, productData) {
    Product.ensureFirebase();

    const product = Product.validate(productData);

    try {
      const snapshot = await getDoc(doc(db, COLLECTION, id));

      if (!snapshot.exists()) {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
      }

      await updateDoc(doc(db, COLLECTION, id), product.toFirestore());
      return { id, ...product.toFirestore() };
    } catch (error) {
      if (error.status) throw error;

      const dbError = new Error('Error al actualizar el producto en Firestore');
      dbError.status = 500;
      throw dbError;
    }
  }
}

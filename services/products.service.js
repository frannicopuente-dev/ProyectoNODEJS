import { Product } from '../models/Product.model.js';

export async function getAllProducts() {
  return Product.findAll();
}

export async function getProductById(id) {
  return Product.findById(id);
}

export async function createProduct(productData) {
  return Product.create(productData);
}

export async function deleteProduct(id) {
  return Product.delete(id);
}

export async function updateProduct(id, productData) {
  return Product.update(id, productData);
}

import * as productsService from '../services/products.service.js';

export async function getAll(req, res) {
  try {
    const products = await productsService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const product = await productsService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const result = await productsService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const product = await productsService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

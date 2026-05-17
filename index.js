const API_BASE = 'https://fakestoreapi.com';

function parseCommand() {
  const [method, resource, ...params] = process.argv.slice(2);
  const [resourceName, productId] = (resource ?? '').split('/');

  return { method, resource, resourceName, productId, params };
}

async function fetchApi(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

function logResponse(data) {
  console.log(JSON.stringify(data, null, 2));
}

function validateResource(resourceName, expected = 'products') {
  if (resourceName !== expected) {
    console.error(`Recurso no válido. Se esperaba: ${expected}`);
    process.exit(1);
  }
}

async function handleGet({ resourceName, productId }) {
  validateResource(resourceName);

  const url = productId
    ? `${API_BASE}/products/${productId}`
    : `${API_BASE}/products`;

  logResponse(await fetchApi(url));
}

async function handlePost({ resourceName, params }) {
  validateResource(resourceName);

  const [title, price, category] = params;

  if (!title || !price || !category) {
    console.error('Faltan datos. Use: POST products <title> <price> <category>');
    process.exit(1);
  }

  const product = {
    title,
    price: Number(price),
    category,
    description: '',
    image: 'https://fakestoreapi.com/img/placeholder.png',
  };

  const data = await fetchApi(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product }),
  });

  logResponse(data);
}

async function handleDelete({ resourceName, productId }) {
  validateResource(resourceName);

  if (!productId) {
    console.error('Formato no válido. Use: DELETE products/<id>');
    process.exit(1);
  }

  const data = await fetchApi(`${API_BASE}/products/${productId}`, {
    method: 'DELETE',
  });

  logResponse(data);
}

const handlers = {
  GET: handleGet,
  POST: handlePost,
  DELETE: handleDelete,
};

async function main() {
  const command = parseCommand();
  const { method } = command;

  const handler = handlers[method];

  if (!handler) {
    console.error('Método no soportado. Use: GET, POST o DELETE');
    process.exit(1);
  }

  await handler(command);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

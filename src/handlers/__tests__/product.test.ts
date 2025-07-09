import request from "supertest";
import server from "../../server";

describe('POST /api/products', () => {
    it('should display validation error', async () => {
        const response = await request(server)
            .post('/api/products')
            .send({}); // Sending an empty object to trigger validation errors

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);
        const messages = response.body.errors.map(err => err.msg);
        expect(messages).toContain('El nombre del producto es obligatorio');
        expect(messages).toContain('El precio del producto es obligatorio');
        
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    })

    it('should validate than the price is greater than 0', async () => {
        const response = await request(server)
            .post('/api/products')
            .send({
                name: 'Test Product',
                price: 0 // Invalid price
            })

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    })

    it('should validate than the price is a number and greater than 0', async () => {
        const response = await request(server)
            .post('/api/products')
            .send({
                name: 'Test Product',
                price: "Test" // Invalid price
            })

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);
        
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(4);
    })

    it('should create a new product and return it', async () => {
        const newProduct = {
            name: 'Test Product',
            price: 100
        };

        const response = await request(server)
            .post('/api/products')
            .send(newProduct);

        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('errors');
    })

})

describe('GET /api/products', () => {
    it('should check if the endpoint exists', async () => {
        const response = await request(server).get('/api/products');
        expect(response.status).not.toBe(404);
    })
        
    it('should return a list of products', async () => {
        const response = await request(server)
            .get('/api/products');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        
        expect(response.status).not.toBe(404);
        expect(response.body.data).not.toHaveProperty('errors');
    })
})

describe('GET /api/products/:id', () => {
    it('should return 404 for a non-existing product', async () => {
        const productId = 9999; // Assuming this ID does not exist in the database
        const response = await request(server)
            .get(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto no encontrado');
        
        expect(response.status).not.toBe(200);

    })
    it('should validate the product ID in the URL', async () => {
        const response = await request(server).get('/api/products/invalid-id'); // Invalid ID format
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('El ID del producto no es válido');
    })
    it('should return a product by ID', async () => {
        const response = await request(server)
            .get('/api/products/1'); // Assuming there is a product with ID 1

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    })

})

describe('PUT /api/products/:id', () => {
    it('should validate the product ID in the URL', async () => {
        const response = await request(server)
            .put('/api/products/invalid-id') // Invalid ID format
            .send({
                name: 'Updated Product',
                price: 150
            });

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors[0].msg).toBe('El ID del producto no es válido');
    })

    it('should return 404 for a non-existing product', async () => {
        const productId = 9999; // Assuming this ID does not exist in the database
        const response = await request(server)
            .put(`/api/products/${productId}`)
            .send({
                name: 'Updated Product',
                price: 150,
                isAvailable: true
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Producto no encontrado');
    })

    it('should validate the product data', async () => {
        const response = await request(server).
            put('/api/products/1').send({})

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body.data).not.toBeTruthy()

    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).
            put('/api/products/1').send({
                name: 'Updated Product',
                price: -150,
                isAvailable: true
            })

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('El precio del producto no es válido')

        expect(response.status).not.toBe(200)
        expect(response.body.data).not.toBeTruthy()

    })

    it('should update a product and return it', async () => {
        const response = await request(server)
            .put('/api/products/1') // Assuming there is a product with ID 1
            .send({
                name: 'Updated Product',
                price: 150,
                isAvailable: true
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        
        expect(response.status).not.toBe(400);
        expect(response.body.data.name).toBe('Updated Product');
    })
})

describe('PATCH /api/products/:id', () => { 
    it('should return a 404 for a non-existing product', async () => {
        const productId = 9999; // Assuming this ID does not exist in the database
        const response = await request(server)
            .patch(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body.data).not.toBeTruthy();
    })

    it('should update the availability of a product', async () => {
        const response = await request(server)
            .patch('/api/products/1'); // Assuming there is a product with ID 1

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.isAvailable).toBe(false);
        
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('error');
    })
 })

describe('DELETE /api/products/:id', () => { 
    it('should validate the product ID in the URL', async () => {
        const response = await request(server)
            .delete('/api/products/invalid-id'); // Invalid ID format

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('El ID del producto no es válido');
    })

    it('should return 404 for a non-existing product', async () => {
        const productId = 9999; // Assuming this ID does not exist in the database
        const response = await request(server)
            .delete(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
    })

    it('should delete a product and return it', async () => {
        const response = await request(server)
            .delete('/api/products/1'); // Assuming there is a product with ID 1

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
        expect(response.body.data).toBe('Producto eliminado exitosamente');
    })
})
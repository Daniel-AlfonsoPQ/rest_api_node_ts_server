import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product';
import { body, param } from 'express-validator'
import { handleInputError } from './middleware';

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Product name
 *           example: "Laptop"
 *         price:
 *           type: number
 *           description: Product price
 *           example: 999.99
 *         isAvailable:
 *           type: boolean
 *           description: Availability status of the product
 *           example: true
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     description: Retrieve a list of all products in the store
 *     responses:
 *      200:
 *        description: A list of products
 *        content:
 *         application/json:
 *          schema:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Product'
 * 
 */

router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     description: Retrieve a specific product by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *        description: Invalid product ID  
 */

router.get('/:id', 
    param('id').isInt().withMessage('El ID del producto no es válido'),
    handleInputError,  // <-- middleware to handle input validation errors    
    getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     description: Create a new product with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: "Smartphone"
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 499.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 */

router.post('/', 

    body('name')
                .notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price')
                .isNumeric().withMessage('Valor no válido')
                .notEmpty().withMessage('El precio del producto es obligatorio')
                .custom(value => value > 0).withMessage('El precio del producto no es válido'),
    handleInputError,  // <-- middleware to handle input validation errors
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     description: Update the details of a specific product by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: "Smartphone"
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 499.99
 *               isAvailable:
 *                 type: boolean
 *                 description: Availability status of the product
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 * 
 */
router.put('/:id', 
    param('id').isInt().withMessage('El ID del producto no es válido'),
    body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price').isNumeric().withMessage('Valor no válido')
                .notEmpty().withMessage('El precio del producto es obligatorio')
                .custom(value => value > 0).withMessage('El precio del producto no es válido'),
    body('isAvailable').isBoolean().withMessage('El estado de disponibilidad debe ser un valor booleano'),            
    handleInputError,
    updateProduct);

/**
 * @swagger
 * 
 * /api/products/{id}:
 *  patch:
 *      summary: Update product availability by ID
 *      tags: [Products]
 *      description: Update the availability status of a specific product by its ID
 *      parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *      responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found       
 */
router.patch('/:id',
    param('id').isInt().withMessage('El ID del producto no es válido'),
    handleInputError,
    updateAvailability);

/**
 * @swagger
 * 
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product by ID
 *      tags: [Products]
 *      description: Delete a specific product by its ID and return a confirmation message
 *      parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to delete
 *         required: true
 *         schema:
 *           type: integer
 *      responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               value: "Producto eliminado exitosamente."
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found       
 */
router.delete('/:id', 
    param('id').isInt().withMessage('El ID del producto no es válido'),
    handleInputError,
    deleteProduct
);

export default router
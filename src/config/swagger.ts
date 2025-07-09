import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: "3.0.2",
        tags:[
            {
                name: "Products",
                description: "API Operations related to products"
            }
        ],
        info : {
            title: "REST API Products Node.js / Express / Sequelize with Swagger Documentation",
            version: "1.0.0",
            description: "API for managing products in a store",
        }
    },
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions : SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link{
            content: url('img/documentacion.png')
            width: 100px;
            height: auto;
        }
        .swagger-ui .topbar {
            background-color:rgb(84, 67, 100);
        }
    `,
    customSiteTitle: "API Products Documentation",
}
export default swaggerSpec;
export { swaggerUiOptions };
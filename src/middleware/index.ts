import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleInputError = (req : Request, res : Response, next : NextFunction): void => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return
    }
    next(); // Call the next middleware or route handler
}
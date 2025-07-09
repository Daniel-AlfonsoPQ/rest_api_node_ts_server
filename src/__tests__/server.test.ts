import { connectDB } from '../server';
import db from "../config/db";

jest.mock('../config/db')

describe('connectDB', () => {
    it('should handle database connection errors gracefully', async () => {
        jest.spyOn(db, 'authenticate')
            .mockRejectedValueOnce(new Error('Database connection error'));
        
        const consoleErrorSpy = jest.spyOn(console, 'log')
        await connectDB();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error connecting to the database')
        );
        consoleErrorSpy.mockRestore();
    })
})
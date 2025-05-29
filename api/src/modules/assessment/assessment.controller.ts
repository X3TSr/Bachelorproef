import { NextFunction, Response, Request } from "express";
import NotFoundError from "../../middleware/error/NotFoundError";
require('dotenv').config();



// -------------------
// CONTROLLER FUNTIONS
// -------------------

// Get all
const getAll = async (_req: Request, res: Response, next: NextFunction) => {
};

// Get by ID
const getById = async (req: Request, res: Response, next: NextFunction) => {
};

// Create new
const create = async (req: Request, res: Response, next: NextFunction) => {
};

// Update
const update = async (req: Request, res: Response, next: NextFunction) => {
};

// Delete
const remove = async (req: Request, res: Response, next: NextFunction) => {
};


export default {
    getAll,
    getById,
    create,
    update,
    remove
};
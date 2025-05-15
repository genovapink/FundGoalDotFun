import { Request, Response } from "express";
import { MarketModel } from "../model";

export const createItem = async (req: Request, res: Response) => {
    try {
        const newItem = new MarketModel(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ message: "Failed to create item." });
    }
};

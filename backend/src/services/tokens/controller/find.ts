import { Request, Response } from "express";
import { TokenModel } from "../model";

const LIMIT = 6;

export const findItems = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    // let items;

    const skip = (page - 1) * LIMIT;
    const limit = LIMIT * 1;

    const pipeline: any[] = [];
    let matchStage = {};

    if (searchTerm) {
      matchStage = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      };
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });

    if (!searchTerm) {
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const items = await TokenModel.aggregate(pipeline);

    const totalPage = Math.ceil(
      (await TokenModel.countDocuments(searchTerm ? matchStage : {})) / limit
    );
    const shouldLoadMore = totalPage >= page + 1;

    res.status(200).json({ items, shouldLoadMore: searchTerm ? false : shouldLoadMore });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Failed to fetch items." });
  }
};

export const findItemByContract = async (req: Request, res: Response) => {
  const token = await TokenModel.findOne({ contractAddress: req.params.contractAddress });

  if (!token) throw new Error("No slug found for Article");

  res.status(200).json(token);
};

export const allItemsOnlyName = async (req: Request, res: Response) => {
  const token = await TokenModel.find().select("ticker");

  res.status(200).json(token);
};

import { extractIframeSrc } from "@/utils/helper";
import { TokenModel } from "../model";
import { pinata } from "@packages/pinata";
import { Request, Response } from "express";

export const createItem = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const jsonData = req.body.payload;

    if (!file) res.status(400).json({ error: "Image file missing" });
    if (!jsonData) res.status(400).json({ error: "Data field missing" });

    const pinataFile = new File([file!.buffer], file!.originalname, {
      type: file!.mimetype,
    });
    const upload = await pinata.upload.public.file(pinataFile);

    /* --------------------- this one should be saved to db --------------------- */
    const urlPinata = await pinata.gateways.public.convert(upload.cid);

    res.status(200).json({
      message: "Received",
      upload,
      urlPinata,
      data: JSON.parse(jsonData),
      iframeParser: extractIframeSrc(`<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/cE49NoP2MTI?si=SEAJRlMrZqTlX1nF"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>`),
    });

    // const newItem = new TokenModel(req.body);
    // await newItem.save();
    // res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Failed to create item." });
  }
};

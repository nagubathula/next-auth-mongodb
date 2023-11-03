import ProductDb from "@/models/ProductDb";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
    const { name, price, category, code } = await request.json();

    await connect();

    const existingProduct = await ProductDb.findOne({ $or: [{ name }, { code }] });

    if (existingProduct) {
        let message = "";
        if (existingProduct.name === name) {
            message += "Name already exists. ";
        }
        if (existingProduct.code === code) {
            message += "Code already exists.";
        }
        return new NextResponse(message, { status: 400 });
    }

    try {
        await ProductDb.create({
            name,
            price,
            category,
            code
        });
        return new NextResponse("Product is added", { status: 200 });
    } catch (err: any) {
        return new NextResponse(err, {
            status: 500,
        });
    }
};

import ProductDb from "@/models/ProductDb";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    await connect();

    try {
        const products = await ProductDb.find({});
        return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (err: any) {
        return new NextResponse(err, {
            status: 500,
        });
    }
};

export const PUT = async (req: NextRequest) => {
    await connect();

    try {
        const { productId, name, price, category, code } = await req.json();

        const updatedProduct = await ProductDb.findByIdAndUpdate(productId, {
            name,
            price,
            category,
            code,
        });

        return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });
    } catch (err: any) {
        return new NextResponse(err, {
            status: 500,
        });
    }
};

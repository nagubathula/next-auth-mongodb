import ProductDb from "@/models/ProductDb";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

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

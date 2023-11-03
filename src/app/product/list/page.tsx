"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    code: string;
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus == "authenticated") {
            router.replace("/product/list");
          }
        if (sessionStatus !== "authenticated") {
            router.replace("/login");
        }
        fetchProducts();
    }, [sessionStatus, router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products/fetchproduct");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            setError("Error, try again");
            console.log(error);
        }
    };

    if (sessionStatus === "loading") {
        return <h1>Loading...</h1>;
    }

    return (
        sessionStatus === "authenticated" && (
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="bg-[#212121] p-8 rounded shadow-md w-96">
                    <h1 className="text-4xl text-center font-semibold mb-8">Product List</h1>
                    <table className="max-w-7xl">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <Link href={`/product/${product._id}`}>
                                            {product.name}
                                        </Link>
                                    </td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.code}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
                    <div className="text-center text-gray-500 mt-4">- OR -</div>
                    <Link
                        className="block text-center text-blue-500 hover:underline mt-2"
                        href="/product"
                    >
                        Add Product
                    </Link>
                </div>
            </div>
        )
    );
};

export default ProductList;

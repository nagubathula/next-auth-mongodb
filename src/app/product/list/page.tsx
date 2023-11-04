"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import for useRouter
import { useSession } from "next-auth/react";

// Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  code: string;
}

const ProductCard = ({
  product,
  onSave,
}: {
  product: Product;
  onSave: (product: Product) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const router = useRouter();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/products/editproduct`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
      });
      if (res.status === 200) {
        onSave(editedProduct);
        setIsEditing(false);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving product: ", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-96">
      {isEditing ? (
        <>
          <input
            title="form"
            type="text"
            name="name"
            value={editedProduct.name}
            onChange={handleInputChange}
          />
          <input
            title="form"
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleInputChange}
          />
          <input
            title="form"
            type="text"
            name="category"
            value={editedProduct.category}
            onChange={handleInputChange}
          />
          <input
            title="form"
            type="text"
            name="code"
            value={editedProduct.code}
            onChange={handleInputChange}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
          <p>ID: {product._id}</p>
          <p>Price: {product.price}</p>
          <p>Category: {product.category}</p>
          <p>Code: {product.code}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
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

  const handleSave = (editedProduct: Product) => {
    const updatedProducts = products.map((p) =>
      p._id === editedProduct._id ? editedProduct : p
    );
    setProducts(updatedProducts);
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus === "authenticated" && (
      <div className="flex min-h-screen items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8">
            Product List
          </h1>
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
                <tr
                  key={product._id}
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    color:
                      selectedProduct?._id === product._id ? "blue" : "inherit",
                  }}
                >
                  <td>{product.name}</td>
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
            href="/product"
            className="block text-center text-blue-500 hover:underline mt-2"
          >
            Add Product
          </Link>
        </div>
        {selectedProduct && (
          <ProductCard product={selectedProduct} onSave={handleSave} />
        )}
      </div>
    )
  );
};

export default ProductList;

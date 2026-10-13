import axios from "axios";
import React, { useEffect, useState } from "react";

const SearchProduct = () => {

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage, setProductPerPage] = useState(6);


    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const response = await axios.get("https://dummyjson.com/products");
                const res = response.data;
                setProduct(res.products);
                console.log(res);
            }
            catch (e) {
                setError(e.response ? "Failed to fetch Products.Please try again" :
                    "Network error. Please check your connection."
                );
            }
            finally {
                setLoading(false);
            }
        }
        fetchAPI();

    }, []);

    const filterProducts = product.filter((product) => {
        const searchText = search.trim().toLowerCase();

        const matchesSearch =
            product.title?.toLowerCase().includes(searchText) ||
            product.brand?.toLowerCase().includes(searchText);

        const matchesCategory = category === "" || product.category === category;

        return matchesSearch && matchesCategory;

    });

    const sortProducts = [...filterProducts].sort((a, b) => {
        if (sortOrder === "low-high") {
            return a.price - b.price;
        }
        if (sortOrder === "high-low") {
            return b.price - a.price;
        }
        return 0;
    });

    const indexOfLastProduct = currentPage * productPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productPerPage;

    const currentProducts = sortProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPage = Math.ceil(sortProducts.length / productPerPage);

    const handleClearFilter = () => {
        setCategory("");
        setSearch("");
        setSortOrder("");
        setCurrentPage(1);
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold">Product Explorer</h1>

                    <p className="text-gray-500 mt-2">Search, Filter, and Sort Products.</p>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <input type="search" placeholder="Search Products..."
                            className="border border-gray-300 bg-white rounded-lg px-3 w-full h-12 min-w-0" value={search}
                            onChange={(e) => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                            }
                            } />

                        <select name="categories"
                            className="block border border-gray-300 bg-white text-sm h-12 rounded-lg px-2 w-full max-w-full min-w-0"
                            value={category} onChange={(e) => {
                                setCategory(e.target.value)
                                setCurrentPage(1);
                            }}>

                            <option value=""> All Categories</option>
                            <option value="beauty">Beauty</option>
                            <option value="fragrances">Fragrances</option>
                            <option value="furniture">Furniture</option>
                            <option value="groceries">Groceries</option>

                        </select>

                        <select name="prices"
                            className="block border border-gray-300 rounded-lg px-2 bg-white text-sm  w-full max-w-full min-w-0 h-12"
                            value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>

                            <option value="">Sort by Price</option>
                            <option value="low-high"> Price: Low to High</option>
                            <option value="high-low">Price: High to Low</option>

                        </select>

                        <button
                            className="h-12 w-full min-w-0 rounded-lg bg-green-600 px-2 text-lg font-medium text-white transition-colors hover:bg-green-700"
                            onClick={handleClearFilter}>
                            Clear Filter
                        </button>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {loading && <p>Loading Products....</p>}

                        {error && <p className="text-red-600">{error}</p>}

                        {!loading && !error && currentProducts.map((data) => {
                            return (
                                <div key={data.id} className="bg-white rounded-xl shadow p-4">
                                    <img src={data.thumbnail} alt={data.title} className="w-full h-48 object-contain" />
                                    <h2 className="text-lg font-semibold mt-3">{data.title}</h2>
                                    <p className="text-gray-500 text-sm mt-1">{data.category}</p>
                                    <p className="text-green-700 font-bold mt-2">${data.price}</p>
                                </div>
                            );
                        })}

                        {!loading && !error && sortProducts.length === 0 && (
                            <p className="text-gray-600 col-span-full text-center">No Products Found.</p>
                        )}

                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <button className="rounded-lg border px-4 py-2 bg-gray-300 cursor-pointer 
                        disabled:cursor-not-allowed disabled:opacity-50"
                        
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage == 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                            <button key={page} className={`rounded-lg border px-4 py-2 ${currentPage === page
                                    ? "bg-green-600 text-white"
                                    : "bg-white hover:bg-gray-200"
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button className="rounded-lg border px-4 py-2 bg-gray-300 cursor-pointer 
                        disabled:cursor-not-allowed disabled:opacity-50"

                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPage || totalPage === 0}
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>
        </>
    )
}

export default SearchProduct;
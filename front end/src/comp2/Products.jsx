import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/cart2.jsx";
import Section from "../components/mycomp2/Section.jsx";
import Button from "../components/mycomp2/Button.jsx";
import Cart from "./Cart.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 8; // Items per page

  const { cartItems, addToCart, removeFromCart, showModal, toggleCartModal } =
    useContext(CartContext);

  // ✅ Fetch Products from Backend
  const getProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/getProducts?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setHasMore(data.hasMore);
        // toast.success("✅ Products loaded successfully!");
      } else {
        console.error("❌ Failed to fetch products");
        toast.error("❌ Failed to load products. Try again!");
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast.error("❌ Error loading products. Please try again later.");
    }
  };

  // ✅ Fetch Products on Initial Render & Page Change
  useEffect(() => {
    getProducts();
  }, [page]);

  return (
    <Section
      className="pt-[4rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* ✅ Toast Container for Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="relative flex flex-col justify-center bg-[#0e0c15] min-h-screen">
        <div className="flex justify-between items-center px-20 py-5 relative z-10">
          <h1 className="text-2xl uppercase font-bold mt-10 text-center mb-10 text-white">
            Shop
          </h1>
          <button
            className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none"
            onClick={toggleCartModal}
          >
            Cart ({cartItems.length})
          </button>
        </div>

        {/* ✅ Product Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 mx-12 relative z-10 ">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#0e0c15] shadow-md rounded-lg px-10 py-10"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-3xl h-48 w-full object-cover bg-conic-gradient p-1"
                loading="lazy"
              />
              <div className="mt-4">
                <h1 className="text-lg uppercase font-bold text-white">
                  {product.title}
                </h1>
                <p className="mt-2 text-gray-400 text-sm">
                  {product.description.slice(0, 40)}...
                </p>
                <p className="mt-2 text-gray-300">₹{product.price}</p>
              </div>

              {/* ✅ Add/Remove from Cart Buttons */}
              <div className="mt-6 flex justify-between items-center">
                {!cartItems.find((item) => item._id === product._id) ? (
                  <Button
                    className="px-4 py-2 bg-[#0e0c15] text-white text-xs font-bold uppercase rounded hover:bg-gray-700"
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${product.title} added to cart!`);
                    }}
                  >
                    Add to cart
                  </Button>
                ) : (
                  <div className="flex gap-4 items-center">
                    <button
                      className="px-4 py-2 bg-[#0e0c15] text-white text-xs font-bold uppercase rounded hover:bg-gray-700"
                      onClick={() => {
                        removeFromCart(product);
                        toast.warn(`${product.title} removed from cart!`);
                      }}
                    >
                      -
                    </button>
                    <p className="text-gray-400">
                      {
                        cartItems.find((item) => item._id === product._id)
                          ?.quantity
                      }
                    </p>
                    <button
                      className="px-4 py-2 bg-[#0e0c15] text-white text-xs font-bold uppercase rounded hover:bg-gray-700"
                      onClick={() => {
                        addToCart(product);
                        // toast.success(`Increased quantity for ${product.title}`);
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination Buttons */}
        <div className="flex justify-center mt-10 space-x-4">
          <Button
            className="px-6 py-2 bg-[#0e0c15] text-white text-xs font-bold uppercase rounded hover:bg-gray-700 disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            className="px-6 py-2 bg-[#0e0c15] text-white text-xs font-bold uppercase rounded hover:bg-gray-700 disabled:opacity-50"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMore}
          >
            Next
          </Button>
        </div>
      </div>

      {/* ✅ Cart Modal */}
      <Cart showModal={showModal} toggle={toggleCartModal} />
    </Section>
  );
}

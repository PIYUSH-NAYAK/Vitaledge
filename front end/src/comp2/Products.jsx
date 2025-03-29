import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/cart2.jsx";
import Cart from "./Cart.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Section from "../components/mycomp2/Section.jsx";
import { BottomLine } from "../components/design/Hero.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    showModal,
    toggleCartModal,
  } = useContext(CartContext);

  // ✅ Fetch products from MongoDB
  async function getProducts() {
    try {
      const response = await fetch("http://localhost:7777/getProducts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        console.error("❌ Failed to fetch products");
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  // ✅ Toast notifications
  const notifyAddedToCart = (item) =>
    toast.success(`${item.title} added to cart!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

  const notifyRemovedFromCart = (item) =>
    toast.error(`${item.title} removed from cart!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

  const handleRemoveFromCart = (product) => {
    removeFromCart(product);
    notifyRemovedFromCart(product);
  };

  return (
    <Section
      className="pt-[4rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* ✅ Parent Container with Relative for Centering Background */}
      <div className="relative flex flex-col justify-center bg-[#0e0c15] min-h-screen">
        <ToastContainer />
        <div className="flex justify-between items-center px-20 py-5 relative z-10">
          <h1 className="text-2xl uppercase font-bold mt-10 text-center mb-10 text-white">
            Shop
          </h1>
          <button
            className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            onClick={toggleCartModal}
          >
            Cart ({cartItems.length})
          </button>
        </div>

        {/* ✅ Product Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-16 px-10 relative z-10">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#0e0c15] shadow-md rounded-lg px-10 py-10"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-md h-48 w-full object-cover"
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

              {/* ✅ Add/Remove Cart Buttons */}
              <div className="mt-6 flex justify-between items-center">
                {!cartItems.find((item) => item._id === product._id) ? (
                  <button
                    className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                    onClick={() => {
                      addToCart(product);
                      notifyAddedToCart(product);
                    }}
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className="flex gap-4 items-center">
                    <button
                      className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                      onClick={() => {
                        const cartItem = cartItems.find(
                          (item) => item._id === product._id
                        );
                        if (cartItem?.quantity === 1) {
                          handleRemoveFromCart(product);
                        } else {
                          removeFromCart(product);
                        }
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
                      className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Bottom Line Design */}
        <BottomLine />
      </div>
      <Cart showModal={showModal} toggle={toggleCartModal} />
    </Section>
  );
}

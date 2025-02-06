import { useState } from "react";
const URI = "http://localhost:7777/contact";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        console.log("Message sent successfully!");
        setMessage(""); // Reset only the message field
      } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.msg || "Failed to send message";
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="font-nunito bg-[#0e0c15] min-h-screen p-4 flex flex-col lg:flex-row lg:justify-between text-white">
      {/* Contact Form Section */}
      <div className="flex-1 px-6 lg:pl-16 my-10">
        <form
          onSubmit={handleSubmit}
          className="shadow-lg rounded-lg p-8 bg-gray-800 max-w-lg mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-4">Get in Touch</h1>
            <p className="text-gray-400">
              Have questions? Feel free to contact us with your queries.
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-gray-300">
                First Name
              </label>
              <input
                id="firstName"
                className="w-full border border-gray-500 bg-gray-900 p-3 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="FirstName"
                placeholder="Enter your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300">
                Email
              </label>
              <input
                id="email"
                className="w-full border border-gray-500 bg-gray-900 p-3 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300">
                What do you have in mind?
              </label>
              <textarea
                id="message"
                className="w-full border border-gray-500 bg-gray-900 p-3 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="Message"
                placeholder="Enter your query"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded mt-6 hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Map and Social Section */}
      <div className="flex-1 px-6 my-10 lg:pr-16">
        <div className="flex flex-col items-center text-center lg:items-start">
          <p className="text-2xl font-semibold mb-4">Reach us at</p>
          <p className="text-gray-400 mb-6">
            We're here to help with your queries and concerns.
          </p>
          <div
            className="w-full h-64 bg-gray-700 bg-cover bg-center rounded-lg mb-6"
            style={{
              backgroundImage:
                'url("https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/sc23.png")',
            }}
          ></div>
          <div className="flex space-x-4 justify-center lg:justify-start">
            <a href="#" className="hover:text-blue-500">
              <img
                className="w-8 h-8"
                src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-twitter.png"
                alt="Twitter"
              />
            </a>
            <a href="#" className="hover:text-blue-500">
              <img
                className="w-8 h-8"
                src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-facebook.png"
                alt="Facebook"
              />
            </a>
            <a href="#" className="hover:text-blue-500">
              <img
                className="w-8 h-8"
                src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-google.png"
                alt="Google"
              />
            </a>
            <a href="#" className="hover:text-blue-500">
              <img
                className="w-8 h-8"
                src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-instagram.png"
                alt="Instagram"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

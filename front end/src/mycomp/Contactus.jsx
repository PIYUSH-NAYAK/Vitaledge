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
    <div className="contact_us_6 font-nunito bg-white min-h-screen flex items-center justify-center p-8 ">
      {/* <div className="container mx-auto flex lg:flex-nowrap lg:justify-between bg-green-500 "> */}
      <div className="pr-10 ml-20 my-10">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="form-box w-screen shadow-lg rounded-lg p-8 max-w-lg"
        >
          <div className="form-wrapper">
            {/* Form Header */}
            <div className="text-center mb-8 mt-16">
              <h1 className="text-black text-2xl font-semibold mb-4">
                Get in Touch
              </h1>
              <p className="text-gray-500 text-sm">
                Have questions? Feel free to contact us with your queries.
              </p>
            </div>
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  className="w-full border border-gray-300 p-3 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="FirstName"
                  placeholder="Enter your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  className="w-full border border-gray-300 p-3 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700">
                  What do you have in mind?
                </label>
                <textarea
                  id="message"
                  className="w-full border border-gray-300 p-3 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-500 text-white py-3 rounded mt-6"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {/* </div> */}

      {/* Map Section */}
      <div className="ml-20 ">
        <div className="map-part flex flex-col items-center  justify-center  w-full mt-8 pr-40 lg:mt-0">
          <p className="text-black text-2xl font-semibold mb-4">Reach us at</p>
          <p className="text-gray-500 text-sm mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis diam
            lectus sapien.
          </p>
          <div
            className="w-full h-64 bg-gray-300 bg-cover bg-center rounded-lg mb-6"
            style={{
              backgroundImage:
                'url("https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/sc23.png")',
            }}
          ></div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-500">
              <img
                className="w-8 h-8"
                src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-twitter.png"
                alt="Twitter"
              />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500">
              <img
                className="w-8 h-8"
                src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-facebook.png"
                alt="Facebook"
              />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500">
              <img
                className="w-8 h-8"
                src="https://workik-widget-assets.s3.amazonaws.com/Footer1-83/v1/images/Icon-google.png"
                alt="Google"
              />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500">
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

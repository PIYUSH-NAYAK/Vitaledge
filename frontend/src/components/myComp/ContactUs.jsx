import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTwitter, FaFacebook, FaGoogle, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
const URI = `${import.meta.env.VITE_APP_BACKEND_URL}/contact`;
import { useAuth } from "../../context/AuthContext"; // ✅ Updated to Firebase auth
import Section from "../mycomp2/Section";
import InputControls from "../common/Inputcontrols";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.displayName || user.email); // ✅ Firebase user displayName or email
      setEmail(user.email); // ✅ Firebase user email
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        console.log("Message sent successfully!");
        setMessage(""); // Reset only the message field
      } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.msg || "Failed to send message";
        toast.error(errorMessage);
        console.error(errorMessage);
      }
    } catch (error) {
      toast.error("Error sending message. Please try again.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <Section className="pt-[6rem] -mt-[5.25rem]" crosses>
      
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Touch</span>
          </h1>
          <p className="text-n-4 text-lg md:text-xl max-w-3xl mx-auto">
            Have questions about our medical platform? We&apos;re here to help you with all your healthcare technology needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="relative z-1 p-1 rounded-2xl bg-conic-gradient">
              <div className="bg-n-8 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputControls
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  
                  <InputControls
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-n-3 block mb-2">
                      Message
                    </label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-xl border border-input bg-n-7 px-3 py-2 text-sm ring-offset-background placeholder:text-n-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-n-1 resize-none"
                      placeholder="Tell us about your inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition duration-300 transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-n-8 rounded-xl p-8 border border-n-6">
                <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Address</h4>
                      <p className="text-n-4">123 Healthcare St, Medical District, City 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <FaPhone className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Phone</h4>
                      <p className="text-n-4">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Email</h4>
                      <p className="text-n-4">support@vitaledge.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-n-8 rounded-xl p-8 border border-n-6">
                <h3 className="text-xl font-semibold text-white mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-700 transition duration-300 transform hover:scale-110"
                  >
                    <FaTwitter className="text-white text-lg" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-700 transition duration-300 transform hover:scale-110"
                  >
                    <FaFacebook className="text-white text-lg" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-700 transition duration-300 transform hover:scale-110"
                  >
                    <FaGoogle className="text-white text-lg" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-700 transition duration-300 transform hover:scale-110"
                  >
                    <FaInstagram className="text-white text-lg" />
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-n-8 rounded-xl p-8 border border-n-6">
                <h3 className="text-xl font-semibold text-white mb-6">Location</h3>
                <div className="w-full h-64 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaMapMarkerAlt className="text-4xl mb-4 mx-auto" />
                    <p className="text-lg font-medium">Interactive Map</p>
                    <p className="text-sm opacity-75">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ContactPage;

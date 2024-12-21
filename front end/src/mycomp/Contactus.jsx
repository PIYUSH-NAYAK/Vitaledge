// import React from 'react';
import './HomePage.css'; // Make sure to create this CSS file

const ContactPage = () => {
 return (
  <div className="flex h-[730px] items-center justify-start bg-white">
    <div className="mx-auto w-full max-w-lg p-10 bg-white border-gray-300 border-[1px] rounded-md shadow-lg">
      <h1 className="text-gray-800 text-3xl font-bold">Contact Us</h1>
      <p className="mt-3">Send an email to <a href="mailto:contacto@helloheath.com" className="underline text-[#3E8AED]">contacto@helloheath.com</a> or write to us here:</p>
  
      <form className="mt-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative z-0">
            <input type="text" name="name" className="peer block w-full appearance-none border-0 border-b border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-400 focus:border-[#3E8AED] focus:outline-none focus:ring-0" placeholder=" " />
            <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#3E8AED]">Your name</label>
          </div>
          <div className="relative z-0">
            <input type="email" name="email" className="peer block w-full appearance-none border-0 border-b border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-400 focus:border-[#3E8AED] focus:outline-none focus:ring-0" placeholder=" " />
            <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#3E8AED]">Your email</label>
          </div>
          <div className="relative z-0 col-span-2">
            <textarea name="message" rows="4" className="peer block w-full appearance-none border-0 border-b border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-400 focus:border-[#3E8AED] focus:outline-none focus:ring-0" placeholder=" "></textarea>
            <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-400 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#3E8AED]">Your message</label>
          </div>
        </div>
        <button type="submit" className="mt-5 w-full rounded-md bg-[#3E8AED] py-3 text-white">Send Message</button>
      </form>
    </div>
  </div>
 );
};

export default ContactPage;
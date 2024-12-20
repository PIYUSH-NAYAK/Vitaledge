// import React from 'react';

function About() {
  return (
   
        <div className="h-screen  flex flex-col justify-center bg-green-100 ">
      <div className="bg-gradient-to-b from-customGreen to-customBlue shadow-md rounded-lg p-4 w-full  ">
        <h1 className="text-3xl font-bold mx-10 px-10 py-2 text-center text-black bg-teal-100  underline rounded-t-2xl ">About Us</h1>
        <div className="text-center py-4 mx-10 px-10 shadow-md rounded-b-3xl bg-teal-100" >
            <p className="text-black text-lg">
                Welcome to VitalEdge! We are an innovative platform powered by blockchain technology, transforming pharmaceutical tracking. Our system enables users to monitor the journey of medicines from production to delivery, ensuring the integrity, transparency, and safety of pharmaceutical products.
            </p>
            <p className="text-black text-lg">
                Our mission is to provide a secure and efficient solution for pharmaceutical companies, healthcare providers, and patients. We are committed to delivering a seamless experience that meets the needs of our users and exceeds their expectations.
            </p>
            <p className="text-black text-lg">
                Thank you for choosing us. We look forward to making a positive impact in your journey.
            </p>
        </div>
        {/* <p className="text-black text-lg ">
          Welcome to our platform! We are dedicated to providing the best services and solutions to meet your needs. Our mission is to deliver excellence through innovation, collaboration, and a commitment to quality.
        </p>
        <p className="text-black text-lg ">
          Our team is passionate about helping our users achieve their goals. Whether you're here to explore, learn, or grow, we're here to support you every step of the way.
        </p>
        <p className="text-black text-lg">
          Thank you for choosing us. We look forward to making a positive impact in your journey.
        </p> */}
      </div>
    </div>

    
    
  );
}

export default About;
const Sec4 = () => {
  return (
    <section className=" ">
      <div 
      className="max-w-screen-xl mx-auto px-4 md:mx-10 md:py-5  rounded-b-3xl  bg-white text-gray-600 md:px-8"
      style={{ backgroundColor: "#96b3c1" }}
>
        <div className="max-w-2xl mx-auto text-center pt-12">
          <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Our clients are happier
          </h3>
          <p className="mt-3">
            We eliminate user concern by giving a status of where your product is counted.
          </p>
        </div>
        <div className="mt-12">
          <ul className="flex flex-col items-center justify-center gap-y-10 sm:flex-row sm:flex-wrap lg:divide-x">
            <li className="text-center px-12 md:px-16">
              <h4 className="text-4xl text-indigo-600 font-semibold">35K</h4>
              <p className="mt-3 font-medium">Customers</p>
            </li>
            <li className="text-center px-12 md:px-16">
              <h4 className="text-4xl text-indigo-600 font-semibold">10K+</h4>
              <p className="mt-3 font-medium">Downloads</p>
            </li>
            <li className="text-center px-12 md:px-16">
              <h4 className="text-4xl text-indigo-600 font-semibold">40+</h4>
              <p className="mt-3 font-medium">Countries</p>
            </li>
            <li className="text-center px-12 md:px-16">
              <h4 className="text-4xl text-indigo-600 font-semibold">30M+</h4>
              <p className="mt-3 font-medium">Total revenue</p>
            </li>
            <li className="text-center px-12 md:px-16">
              <h4 className="text-4xl text-indigo-600 font-semibold">5K+</h4>
              <p className="mt-3 font-medium">Verified Medications</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Sec4;

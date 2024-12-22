const Sec3 = () => {
  return (
    <section className=" pt-40 swyam:pt-0  ">
      <div
        className="max-w-screen-xl mx-auto px-4 py-5 md:mx-10 Amrit:mx-40 md:py-5  text-gray-600 md:px-8 rounded-t-3xl"
        style={{ backgroundColor: "#96b3c1" }}
      >
        <div className="w-full space-y-3 flex flex-col justify-center items-center">
          <h3 className="text-indigo-600 text-xl font-semibold">Our Brand</h3>
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Main Features
          </p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            <li className="space-y-3">
              <div className="w-12 h-12 border text-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h4 className="text-lg text-gray-800 font-semibold">
                Counterfeit Drug Detection
              </h4>
              <p>
                Ensure medication authenticity by leveraging blockchain to
                verify records and eliminate counterfeit drugs.
              </p>
            </li>
            <li className="space-y-3">
              <div className="w-12 h-12 border text-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h4 className="text-lg text-gray-800 font-semibold">
                Real-time Drug Traceability
              </h4>
              <p>
                Monitor the entire lifecycle of your medications, from
                production to delivery, with blockchain-powered transparency.
              </p>
            </li>
            <li className="space-y-3">
              <div className="w-12 h-12 border text-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h4 className="text-lg text-gray-800 font-semibold">
                Batch Recall Alerts
              </h4>
              <p>
                Receive real-time alerts for drug recalls, enabling prompt
                action to ensure your safety against defective or contaminated
                products.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Sec3;

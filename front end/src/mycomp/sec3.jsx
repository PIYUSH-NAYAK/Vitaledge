const Sec3 = () => {
    const features = [
      {
        title: "Real-time tracking of medications",
        desc: "Identify the real-time location of your medications without having to consult other services.",
      },
      {
        title: "Expiration alerts",
        desc: "Get a notification when your medicine is weeks away so you can buy it sooner.",
      },
      {
        title: "Blockchain Integration",
        desc: "We have blockchain integration in order to guarantee the authenticity of your medicine and do not receive copies.",
      },
    ];
  
    return (
      <section className=" border-t">
        <div className="max-w-screen-xl mx-auto px-4 bg-white text-gray-600 md:px-8">
          <div className="max-w-xl space-y-3">
            <h3 className="text-indigo-600 font-semibold">Our Brand</h3>
            <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
              Main Features
            </p>
            <p>The characteristics that identify us</p>
          </div>
          <div className="mt-12">
            <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item, idx) => (
                <li key={idx} className="space-y-3">
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
                    {item.title}
                  </h4>
                  <p>{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  };
  
  export default Sec3
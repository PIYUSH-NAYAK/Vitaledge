const Sec2 = () => {
  return (
    <div className="flex justify-between h-96 w-full bg-white">
      {/* First Section - Image */}
      <div className="w-1/3 h-full bg-gray-300 flex justify-center items-center">
        <img src="https://via.placeholder.com/150" alt="Placeholder" className="h-full object-cover" />
      </div>

      {/* Second Section - Headings and Paragraphs */}
      <div className="w-1/3 h-full flex flex-col justify-center items-center bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Heading 1</h2>
        <p className="text-center">This is a sample paragraph that describes something important about the topic. It's a good place for text content.</p>
      </div>

      {/* Third Section - Image */}
      <div className="w-1/3 h-full bg-gray-300 flex justify-center items-center">
        <img src="https://via.placeholder.com/150" alt="Placeholder" className="h-full object-cover" />
      </div>
    </div>
  );
};

export default Sec2;

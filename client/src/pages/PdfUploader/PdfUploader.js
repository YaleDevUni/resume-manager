const PdfUploader = () => {
  return (
    <div className="  w-1/2 m-2  p-2 border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg  ">
      <div className=" text-3xl  mb-4">
        Upload Resume to <i> Seng123</i>
      </div>
      <div className=" flex flex-row items-center gap-8">
        <div className=" font-bold">Select PDF File</div>
        <div>
          <button className=" font-bold border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg p-2">
            Browse File
          </button>
        </div>
      </div>
      {/* drag and drop */}
      <div className=" mt-8 border-dashed border-2 border-gray-300 bg-slate-200 h-40 flex flex-row items-center justify-center rounded-lg">
        <div className="  text-center">Drag and Drop PDF File Here</div>
      </div>
      <div className=" font-bold mt-8   ">File list</div>
      <div className=" h-96  overflow-auto mt-4 p-2 border shadow-inner  overflow-y-scroll">
        <div className=" flex flex-row items-center gap-8 "></div>
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            className={` py-2 flex flex-row items-center justify-between gap-8 ${
              index % 2 == 1 ? 'bg-slate-100' : 'bg-slate-200'
            }`}
          >
            <div className=" ml-4 font-bold">Resume{index + 1}.pdf</div>
            <div>
              <button className=" bg-white mr-8 font-bold border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg p-2">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className=" w-full relative my-4">
        <button className=" absolute right-0 font-bold border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg p-2">
          Upload
        </button>
      </div>
    </div>
  );
};
export default PdfUploader;

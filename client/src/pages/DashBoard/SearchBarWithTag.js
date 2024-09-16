import SearchBar from '../../components/SearchBar';
const SearchBarWithTag = () => {
  return (
    <>
      <div className=" flex flex-row justify-between w-full p-4 gap-1">
        <SearchBar className={'w-full'}  />
        <select className=" w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="location">Location</option>
        </select>
        <button className=" w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
          Reset
        </button>
        <button className=" w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
          Search
        </button>
      </div>
      <div className=" flex flex-row flex-wrap items-center w-full gap-1 px-4">
        <div className=" font-extrabold"> Recruitment ID:</div>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-red-500">
          SoftEng20241212
        </button>
        <div className="h-8 border-x-2 border-gray-300 mx-2" />
        <div className=" font-extrabold"> Skills:</div>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Python
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Node
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Angular
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Python
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Node
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Angular
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Python
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Node
        </button>
        <button className=" text-white  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] bg-green-500">
          Angular
        </button>
      </div>
    </>
  );
};

export default SearchBarWithTag;

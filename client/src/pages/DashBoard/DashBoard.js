import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaUserCircle } from 'react-icons/fa';
import { GrDocumentConfig } from 'react-icons/gr';
const DashBoard = () => {
  return (
    <div className=" w-screen h-screen flex flex-row justify-between">
      <div className=" w-150 bg-white shadow-[8px_0_6px_rgba(0,0,0,0.1)] transition-all duration-500  relative ">
        <div className=" absolute -right-16 h-72 flex flex-col rounded-br-3xl justify-evenly w-16 shadow-[8px_15px_15px_-5px_rgba(0,0,0,0.1)] bg-white ">
          <FaUserCircle className="  w-12 h-12 m-2" />
          <TbAdjustmentsHorizontal className=" w-12 h-12 m-2" />
          <GrDocumentConfig className=" w-12 h-12 m-2" />
        </div>
      </div>
      <div className="w-full ml-16">
        <div className=" flex flex-row justify-between w-full p-4 gap-1">
          <input
            type="text"
            placeholder="Search"
            className=" w-full p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
          />
          <select className=" w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="location">Location</option>
          </select>
          <button className=" w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            Search
          </button>
        </div>
        <div className=" flex flex-row flex-wrap items-center w-full gap-1 px-4">
          <button className="  mr-10  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            Reset Filter
          </button>
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
      </div>
      {/* Will be componentized from here */}
      <div className=" h-full w-1/3 shadow-[0px_0px_15px_-3px_rgba(0,0,0,0.3)] rounded-lg overflow-auto">
        <div className=" flex justify-center m-2 gap-3">
          <button className=" w-full p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            View Resume
          </button>
          <button className=" w-12 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            {/* star icon */}
            &#9733;
          </button>
          <button className=" w-12 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            #
          </button>
        </div>

        <hr />
        <div className=" text-xl m-4">Applicant</div>
        <div className=" text-lg m-4"> John Doe</div>
        <hr />
        <div className=" text-xl m-4">Rating</div>
        <div className=" flex flex-row m-4 gap-1">
          {
            // 10 iteration
            Array.from({ length: 10 }, (_, i) =>
              i < 4 ? (
                <div className=" w-6 h-6 border rounded border-gray-500 bg-green-500" />
              ) : (
                <div className=" w-6 h-6 border rounded border-gray-500  hover:bg-green-500" />
              )
            )
          }
        </div>

        <hr />

        <div className=" text-xl m-4">Recruitment ID</div>
        <div className=" text-lg m-4"> SoftEng20241212 </div>
        <hr />
        <div className=" text-xl m-4">Position</div>
        <div className=" text-lg m-4"> Software Engineer</div>
        <hr />
        <div className=" text-xl m-4 mb-0">Note</div>
        <div className="m-4 mt-0">
          This is my note. This applicant is awsome and great fit for... {'>'}
        </div>
        <hr />
        <div className=" text-xl m-4">Keywords and Match</div>
        <div className=" flex flex-row flex-wrap m-4 gap-1">
          {
            // 10 iteration
            Array.from({ length: 20 }, (_, i) => (
              <>
                {' '}
                <div
                  className=" rounded-md border 
         shadow-[0_0_6px_rgba(0,0,0,0.2)] p-2"
                >
                  React
                </div>
                <div
                  className=" rounded-md border bg-green-200
         shadow-[0_0_6px_rgba(0,0,0,0.2)] p-2"
                >
                  Node
                </div>
                <div
                  className=" rounded-md border 
         shadow-[0_0_6px_rgba(0,0,0,0.2)] p-2"
                >
                  Express
                </div>
                <div
                  className=" rounded-md border 
         shadow-[0_0_6px_rgba(0,0,0,0.2)] p-2"
                >
                  Python
                </div>
              </>
            ))
          }
        </div>
      </div>
      {/* Will be componentized till here */}
    </div>
  );
};

export default DashBoard;

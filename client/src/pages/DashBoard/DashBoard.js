import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaUserCircle } from 'react-icons/fa';
import { GrDocumentConfig } from 'react-icons/gr';
const DashBoard = () => {
  return (
    <div className=" w-screen h-screen flex flex-row justify-between">
      {/* Side Nav Bar (will be comp) */}
      <div className=" w-150 bg-white shadow-[8px_0_6px_rgba(0,0,0,0.1)] hover:w-150 transition-all duration-500 relative ">
        <div className=" absolute -right-16 h-72 flex flex-col rounded-br-3xl justify-evenly w-16 shadow-[8px_15px_15px_-5px_rgba(0,0,0,0.1)] bg-white ">
          <FaUserCircle className="  w-12 h-12 m-2" />
          <TbAdjustmentsHorizontal className=" w-12 h-12 m-2" />
          <GrDocumentConfig className=" w-12 h-12 m-2" />
        </div>
        <div className=" w-full p-2 flex flex-col ">
          <div className=" text-4xl mb-4">Advanced Filter</div>
          <hr className="mb-4" />
          <div className=" flex flex-row justify-between">
            <div className=" text-xl my-2">Minimum Rating</div>
          </div>

          <div className=" flex flex-row gap-1 mb-4">
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
          <div className="flex items-center self-end">
            <span className="mr-2 text-gray-700">Include Any</span>
            <div className="relative inline-block w-24 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                id="toggleSwitch"
                className="toggle-checkbox absolute block w-12 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggleSwitch"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
            <div className="ml-2">
              <span className="text-gray-700">Must Include</span>
            </div>
          </div>
          <hr className="my-4" />
          <div className=" flex flex-row justify-between">
            <div className=" text-xl my-2">Status</div>
          </div>

          {/* <button className=" w-max mb-2 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            Under Review
          </button> */}
          <select className=" w-full mb-4 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="InterviewScheduled">Interview Scheduled</option>
          </select>

          <div className="flex items-center self-end">
            <span className="mr-2 text-gray-700">Include Any</span>
            <div className="relative inline-block w-24 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                id="toggleSwitch"
                className="toggle-checkbox absolute block w-12 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggleSwitch"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
            <div className="ml-2">
              <span className="text-gray-700">Must Include</span>
            </div>
          </div>
          <hr className="my-4" />
          <div className=" flex flex-row justify-between mb-4">
            <div className=" text-xl">
              Show Only Preference
              {/* check box */}
            </div>
            <div className="relative inline-block w-24 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                id="toggleSwitch"
                className="toggle-checkbox absolute block w-12 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggleSwitch"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>

          <hr className="mb-4" />
          <div className=" flex flex-row justify-between mb-4">
            <div className=" text-xl">
              Show Only Preference
              {/* check box */}
            </div>
            <div className="relative inline-block w-24 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                id="toggleSwitch"
                className="toggle-checkbox absolute block w-12 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggleSwitch"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>
          <div className=" mb-4">
            <span className=" text-red-500 ">Caution!</span> This will ignore
            other filters
          </div>
          <hr className="mb-4" />
        </div>
        <div className=" w-full mt-14 p-2 flex flex-col ">
          <div className=" text-4xl mb-4">Setting</div>
          <hr className="mb-4" />
          <div className=" text-xl my-2">Pagination</div>
          {/* items per page */}
          <select className=" w-full mb-4 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            <option value="10">10</option>
            <option value="20">15</option>
            <option value="30">20</option>
            <option value="40">25</option>
          </select>
        </div>
      </div>
      {/* Side Nav Bar end */}
      <div className="w-full ml-16 flex flex-col">
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
        <div className="p-4 w-full flex-grow overflow-auto">
          <div className="border shadow-[0_0_6px_rgba(0,0,0,0.2)] h-full rounded-lg">
            <div className="overflow-auto h-full rounded-lg">
              <table className="w-full text-start rounded-lg">
                <thead className=" h-14 bg-black text-white">
                  <tr className="sticky top-0 bg-black">
                    <th className="text-start">Recruitment ID</th>
                    <th className="text-start">Position</th>
                    <th className="text-start">Applicant</th>
                    <th className="text-start">Rating</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Reviewed</th>
                    <th className="text-start">*</th>
                  </tr>
                </thead>
                <tbody className="table-fixed ">
                  {
                    // 10 iteration
                    Array.from({ length: 10 }, (_, i) => (
                      <tr
                        className={` h-20 ${
                          i % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        <td className="">Seng244</td>
                        <td>Software Eng</td>
                        <td>Yeil Park</td>
                        <td>4/10</td>
                        <td>Under Review</td>
                        <td>Yes</td>
                        {/* star */}
                        <td className="text-center">
                          <button className=" w-12 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
                            &#9733;
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
                {/* </table> */}
              </table>
              <div className="h-6"></div>
              <div className="  h-6 sticky bottom-0 bg-white text-center">
                {'<'} 1 2 3 4 5 {'>'}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Will be componentized from here */}
      <div className=" h-full w-1/3 shadow-[0px_0px_15px_-3px_rgba(0,0,0,0.3)] rounded-lg overflow-auto">
        <div className=" flex justify-center m-2 gap-3 sticky top-0 bg-white">
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
        <div className=" text-xl m-4 mb-0 ">Applicant</div>
        <div className=" text-lg m-4 mt-0"> John Doe</div>
        <hr />
        <div className=" text-xl m-4 mb-0">Status</div>
        <div className=" text-lg m-4 mt-0"> Under Review</div>

        <hr />
        <div className=" text-xl m-4 mb-0">Recruitment ID</div>
        <div className=" text-lg m-4 mt-0"> SoftEng20241212 </div>
        <hr />
        <div className=" text-xl m-4 mb-0">Position</div>
        <div className=" text-lg m-4 mt-0"> Software Engineer</div>
        <hr />
        <div className=" text-xl m-4 mb-0">Shared</div>
        <div className=" text-lg m-4 mt-0"> Yeil Park, John Doe</div>
        <hr />

        <div className=" text-xl m-4 mb-0">Note</div>
        <div className="m-4 mt-0">
          This is my note. This applicant is awsome and great fit for... {'>'}
        </div>
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
        <div className=" text-xl m-4">Skills and Match</div>
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

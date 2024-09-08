import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaUserCircle } from 'react-icons/fa';
import { GrDocumentConfig } from 'react-icons/gr';
import Table from './Table';
import Info from './Info';
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
      <Table />
      {/* Will be componentized from here */}
      <Info />
      {/* Will be componentized till here */}
    </div>
  );
};

export default DashBoard;

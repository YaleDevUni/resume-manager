import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import {
  fetchResumes,
  fetchResumeById,
  setResumeList,
} from '../../features/resume/resumeSlice';
// Icons
import { MdOutlineStarBorder } from 'react-icons/md';
import { MdOutlineStarPurple500 } from 'react-icons/md';

const Table = () => {
  // Custom hooks
  const { alerts, addAlert } = useAlerts(); // Custom hook to handle alerts
  // Redux hooks
  const dispatch = useDispatch(); // Redux dispatch function
  // Redux selectors
  const resumeList = useSelector(state => state.resume.resumes);

  const resume = useSelector(state => state.resume.resume);

  // fetch resumes
  const fetchResumesList = useCallback(() => {
    dispatch(fetchResumes({ page: 1, limit: 40 }));
  }, [dispatch]);

  const handleResumeClick = async selectedResume => {
    try {
      await dispatch(fetchResumeById(selectedResume._id)).unwrap();
      // Also update the resume status to viewed
      dispatch(
        setResumeList(
          resumeList.data?.map(r =>
            r._id === selectedResume._id ? { ...r, resumeViewed: true } : r
          )
        )
      );
    } catch (error) {
      addAlert(error, 'error');
    }
  };

  useEffect(() => {
    fetchResumesList();
  }, [fetchResumesList]);

  return (
    <>
      <AlertContainer alerts={alerts} />
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
                    <th className="text-start">Applicant</th>
                    <th className="text-start">Rating</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Reviewed</th>
                    <th>
                      <MdOutlineStarBorder className=" w-6 h-6" />
                    </th>
                    <th className="text-start"></th>
                  </tr>
                </thead>
                <tbody className="table-fixed ">
                  {
                    // 10 iteration
                    // Array.from({ length: 10 }, (_, i) => (
                    //   <tr
                    //     className={` h-20 ${
                    //       i % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                    //     }`}
                    //   >
                    //     <td className="">Seng244</td>
                    //     <td>Software Eng</td>
                    //     <td>Yeil Park</td>
                    //     <td>4/10</td>
                    //     <td>Under Review</td>
                    //     <td>Yes</td>
                    //     {/* star */}
                    //     <td className="text-center">
                    //       <button className=" w-12 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
                    //         &#9733;
                    //       </button>
                    //     </td>
                    //   </tr>
                    // ))
                    resumeList.data?.map((resume, index) => (
                      <tr
                        key={resume._id}
                        className={` ${
                          index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                        }  cursor-pointer hover:bg-gray-300`} // hover:bg-gray-300`}
                        onClick={() => {
                          handleResumeClick(resume);
                        }}
                      >
                        <td>{resume.recruitment.title}</td>

                        <td>{resume.name}</td>
                        <td>{resume.rating}</td>
                        <td>{resume.status}</td>
                        <td>{resume.resumeViewed ? 'yes' : 'No'}</td>
                        <td>
                          {resume.isPreferred ? (
                            <MdOutlineStarPurple500 className=" w-6 h-6 fill-yellow-300" />
                          ) : (
                            <MdOutlineStarBorder className=" w-6 h-6 " />
                          )}
                        </td>
                        <td
                          className=" hover:bg-red-500 hover:fill-white
                     justify-center flex flex-row border-l-2 border-dashed border-gray-400"
                          onClick={e => {
                            e.stopPropagation();
                            console.log('delete');
                            // handleDelete(recruit);
                          }}
                        >
                          <button>
                            {/* <MdDeleteForever className=" h-6 w-6 " /> */}
                            Delete
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
    </>
  );
};

export default Table;

import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import useLocalStorage from '../../hooks/useLocalStorage';
import {
  createRecruitmentAsync,
  fetchAllRecruitments,
  fetchRecruitmentById,
  updateRecruitmentAsync,
  deleteRecruitmentAsync,
} from '../../features/recruitment/recruitSlice';

const RecruimentSetting = () => {
  const { alerts, addAlert } = useAlerts();
  const [recruitmentId, setRecruitmentId] = useState(''); // State to hold the recruitment ID input
  const dispatch = useDispatch();
  // Inline selectors to get the status and error from the store
  const status = useSelector(state => state.recruitment.status);
  const error = useSelector(state => state.recruitment.error);
  const recruitments = useSelector(state => state.recruitment.recruitments);
  const recruitment = useSelector(state => state.recruitment.recruitment);
  const { user } = useSelector(state => state.user);
  const {
    localStorageValue: currentPage,
    setLocalStorageStateValue: setCurrentPage,
  } = useLocalStorage('recruitmentsCurrentPage', 1, user.userId);

  const handleAddNew = () => {
    try {
      if (recruitmentId.trim()) {
        const recruitmentData = {
          recruitmentID: recruitmentId,
          skillsToMatch: [], // Assuming you're starting with an empty array for skills
          user: user.userId, // Replace with the actual user ID or leave empty if it will be filled in the backend
        };
        dispatch(createRecruitmentAsync(recruitmentData));
        setRecruitmentId(''); // Clear the input after dispatching
        addAlert('Recruitment added successfully', 'success');
      }
    } catch (error) {
      // addAlert({ message: error.message, type: 'error' });
    }
  };
  useEffect(() => {
    const fetchInitialData = () => {
      dispatch(
        fetchAllRecruitments({ limit: recruitments.limit, page: currentPage })
      );
    };

    fetchInitialData();
  }, [dispatch, recruitments.limit, currentPage]);

  const handlePageChange = page => {
    setCurrentPage(page); // Update localStorage when the page changes
    dispatch(fetchAllRecruitments({ limit: recruitments.limit, page }));
  };

  return (
    <>
      <AlertContainer alerts={alerts} />{' '}
      <div className="relative w-1/2 m-2 p-2 border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg">
        <div className="flex flex-row justify-between">
          <div className="text-3xl">Recruitment Setting</div>
          <div className="flex flex-row gap-1">
            <input
              className="p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
              type="text"
              id="recruitmentId"
              name="recruitmentId"
              placeholder="Recruitment ID"
              value={recruitmentId}
              onChange={e => setRecruitmentId(e.target.value)} // Update state on input change
            />
            <Button
              className="font-bold"
              onClick={handleAddNew}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Adding...' : 'Add New'}
            </Button>
          </div>
        </div>
        <div className=" font-bold ">Select Recruitment ID</div>
        <table className="w-full">
          <thead>
            <tr className=" bg-black text-white">
              <th className=" text-start">Recruitment ID</th>
              <th className=" text-start">Created At</th>
              <th className=" text-start">Modified At</th>
            </tr>
          </thead>
          <tbody>
            {/* {Array.from({ length: 10 }).map((_, index) => (
              <tr
                className={` ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                } hover:bg-gray-300 cursor-pointer`}
              >
                <td key={index}>Seng123</td>
                <td key={index + '123'}>2014/12/12</td>
                <td key={index + '1234'}>2014/12/12</td>
              </tr>
            ))} */}
            {recruitments.data.map((recruitment, index) => (
              <tr
                key={recruitment._id}
                className={` ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                } hover:bg-gray-300 cursor-pointer h-full`}
              >
                <td>{recruitment.recruitmentID}</td>
                <td>{recruitment.createdAt}</td>
                <td>{recruitment.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className=" w-full flex flex-row justify-center gap-3 ">
          {Array.from({ length: recruitments.totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={` ${
                index + 1 === recruitments.currentPage
                  ? 'text-white bg-black'
                  : ''
              }`}
            >
              {index + 1}{' '}
            </button>
          ))}
        </div>
        <hr className="my-4" />
        <div className=" text-xl mb-4">
          Current Recruitment ID: <span> Seng123</span>
        </div>
        <div className=" flex flex-row gap-2">
          {' '}
          <div>
            <input
              className="  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
              type="text"
              id="skillsToMatch"
              name="skillsToMatch"
              placeholder="Add Required Skills"
            />
          </div>
          <Button>Add Required Skills</Button>
        </div>
        <div className=" flex flex-row flex-wrap gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              className={` my-2 p-2 border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg`}
            >
              <div className=" text-center">Java</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecruimentSetting;

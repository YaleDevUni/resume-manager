import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import useLocalStorage from '../../hooks/useLocalStorage';
import { MdDeleteForever } from 'react-icons/md';
import {
  createRecruitmentAsync,
  fetchAllRecruitments,
  fetchRecruitmentById,
  updateRecruitmentAsync,
  deleteRecruitmentAsync,
  selectRecruitment,
} from '../../features/recruitment/recruitSlice';

const RecruimentSetting = () => {
  // Local state
  const [recruitmentId, setRecruitmentId] = useState(''); // State to hold the recruitment ID input
  const [recruitmentAdded, setRecruitmentAdded] = useState(false); // State to track if a recruitment has been added
  const [recruitmentDeleted, setRecruitmentDeleted] = useState(false); // State to track if a recruitment has been deleted
  // Custom hooks
  const { alerts, addAlert } = useAlerts(); // Custom hook to handle alerts

  // Redux hooks
  const dispatch = useDispatch(); // Redux dispatch function

  // Redux selectors
  const status = useSelector(state => state.recruitment.status); // Status of the recruitment fetching/creating process
  const error = useSelector(state => state.recruitment.error); // Error message from recruitment-related actions
  const recruitments = useSelector(state => state.recruitment.recruitments); // List of all recruitments
  const recruitment = useSelector(state => state.recruitment.recruitment); // Single recruitment detail
  const { user } = useSelector(state => state.user); // Currently authenticated user
  const selectedRecruitment = useSelector(
    state => state.recruitment.recruitment
  ); // Currently selected recruitment
  const {
    localStorageValue: currentPage,
    setLocalStorageStateValue: setCurrentPage,
  } = useLocalStorage('recruitmentsCurrentPage', 1, user.userId);

  const handleAddNew = async () => {
    if (recruitmentId.trim()) {
      const recruitmentData = {
        recruitmentID: recruitmentId,
        skillsToMatch: [], // Starting with an empty array for skills
        user: user.userId, // Replace with the actual user ID or leave empty if it will be filled in the backend
      };
      try {
        const newRecruiment = await dispatch(
          createRecruitmentAsync(recruitmentData)
        ).unwrap();
        setRecruitmentId(''); // Clear the input after dispatching
        setRecruitmentAdded(true); // Set the recruitment added state to true
        handleSelectRecruitment(newRecruiment); // Select the newly added recruitment
        addAlert('Recruitment added successfully', 'success');
      } catch (error) {
        addAlert(error || 'An unexpected error occurred', 'error');
      }
    } else {
      addAlert('Recruitment ID cannot be empty', 'error');
    }
  };
  const handleDelete = async recruitment => {
    try {
      if (
        !window.confirm(
          `Are you sure you want to delete the recruitment ${recruitment.recruitmentID}?`
        )
      )
        return;
      await dispatch(deleteRecruitmentAsync(recruitment.id)).unwrap();
      // check if the deleted recruitment is the selected recruitment
      if (selectedRecruitment.id === recruitment.id) {
        console.log('selectedRecruitment.id', selectedRecruitment.id);
        dispatch(selectRecruitment({})); // Clear the selected recruitment
      }
      setRecruitmentDeleted(true); // Set the recruitment deleted state to true
      addAlert('Recruitment deleted successfully', 'success');
    } catch (error) {
      addAlert(error || 'An unexpected error occurred', 'error');
    }
  };

  const handleSelectRecruitment = selectedRecruitment => {
    // select current recruitment id
    dispatch(selectRecruitment(selectedRecruitment));
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleAddNew();
    }
  };

  useEffect(() => {
    dispatch(
      fetchAllRecruitments({ limit: recruitment.limit, page: currentPage })
    );
    setRecruitmentAdded(false); // Reset the recruitment added state
    setRecruitmentDeleted(false); // Reset the recruitment deleted state
  }, [recruitmentAdded, recruitmentDeleted]);

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
              onChange={e => setRecruitmentId(e.target.value.trim())} // Update state on input change
              onKeyDown={handleKeyDown}
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
        <div className="font-bold text-xl  flex flex-row justify-between">
          <div className=" "> Select Recruitment ID</div>
        </div>

        <table className="w-full">
          <thead>
            <tr className=" bg-black text-white">
              <th className=" text-start">Recruitment ID</th>
              <th className=" text-start">Created At</th>
              <th className=" text-start"># Applicant</th>
              <th className=" text-start"></th>
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
                }  cursor-pointer ${
                  recruitment.id === selectedRecruitment?.id
                    ? 'bg-slate-400'
                    : 'hover:bg-gray-300 '
                } `}
              >
                <td
                  onClick={() => {
                    handleSelectRecruitment(recruitment);
                  }}
                >
                  {recruitment.recruitmentID}
                  {selectRecruitment.id}
                </td>
                <td
                  onClick={() => {
                    handleSelectRecruitment(recruitment);
                  }}
                >
                  {new Date(recruitment.createdAt).toISOString().split('T')[0]}
                </td>
                <td
                  onClick={() => {
                    handleSelectRecruitment(recruitment);
                  }}
                >
                  {JSON.stringify(recruitment.applicants)}
                </td>

                <td
                  className=" hover:bg-red-500 hover:fill-white
                 justify-center flex flex-row border-l-2 border-dashed border-gray-400"
                  onClick={() => {
                    handleDelete(recruitment);
                  }}
                >
                  <button>
                    <MdDeleteForever className=" h-6 w-6 " />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalPages={recruitments.totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
        <hr className="my-4" />
        <div className=" text-xl mb-4">
          Current Recruitment ID:{' '}
          <span className=" font-bold">
            {' '}
            {selectedRecruitment.recruitmentID}
          </span>
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

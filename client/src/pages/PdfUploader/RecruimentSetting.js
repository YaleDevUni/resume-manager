import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import SkillSearchBar from '../../components/SkillSearch';
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
  setRecruitmentSync,
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
  // TODO: Fix selector variable name
  const {
    localStorageValue: currentPage,
    setLocalStorageStateValue: setCurrentPage,
  } = useLocalStorage('recruitmentsCurrentPage', 1, user.userId);

  /** Handlers */
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
  const handleUpdate = async updatedData => {
    try {
      await dispatch(
        updateRecruitmentAsync({
          id: recruitment.id,
          updatedData: updatedData,
        })
      ).unwrap();
      addAlert('Recruitment updated successfully', 'success');
      // dispatch(setRecruitmentSync(newData)); // Update the selected recruitment with the new data
    } catch (error) {
      addAlert(error || 'An unexpected error occurred', 'error');
    }
  };

  const handleDelete = async recruitmentToDel => {
    try {
      if (
        !window.confirm(
          `Are you sure you want to delete the recruitment ${recruitmentToDel.recruitmentID}?`
        )
      )
        return;
      await dispatch(deleteRecruitmentAsync(recruitmentToDel.id)).unwrap();
      // check if the deleted recruitment is the selected recruitment
      if (recruitment.id === recruitmentToDel.id) {
        dispatch(setRecruitmentSync({})); // Clear the selected recruitment
      }
      setRecruitmentDeleted(true); // Set the recruitment deleted state to true
      addAlert('Recruitment deleted successfully', 'success');
    } catch (error) {
      addAlert(error || 'An unexpected error occurred', 'error');
    }
  };
  const handleSelectRecruitment = recruitment => {
    console.log('recruitment', recruitment);
    // fetch recruitment by id
    dispatch(fetchRecruitmentById(recruitment.id));
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleAddNew();
    }
  };
  const handlePageChange = page => {
    setCurrentPage(page); // Update localStorage when the page changes
    dispatch(fetchAllRecruitments({ limit: recruitments.limit, page }));
  };

  /** Side Effects */
  useEffect(() => {
    dispatch(
      fetchAllRecruitments({ limit: recruitment.limit, page: currentPage })
    );
    setRecruitmentAdded(false); // Reset the recruitment added state
    setRecruitmentDeleted(false); // Reset the recruitment deleted state
  }, [recruitmentAdded, recruitmentDeleted]);

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
            {recruitments.data.map((recruit, index) => (
              <tr
                key={recruit._id}
                className={` ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                }  cursor-pointer ${
                  recruit.id === recruitment?.id
                    ? 'bg-slate-400'
                    : 'hover:bg-gray-300 '
                } `}
              >
                <td
                  onClick={() => {
                    handleSelectRecruitment(recruit);
                  }}
                >
                  {recruit.recruitmentID}
                </td>
                <td
                  onClick={() => {
                    handleSelectRecruitment(recruit);
                  }}
                >
                  {new Date(recruit.createdAt).toISOString().split('T')[0]}
                </td>
                <td
                  onClick={() => {
                    handleSelectRecruitment(recruit);
                  }}
                >
                  {JSON.stringify(recruit.applicants)}
                </td>

                <td
                  className=" hover:bg-red-500 hover:fill-white
                 justify-center flex flex-row border-l-2 border-dashed border-gray-400"
                  onClick={() => {
                    handleDelete(recruit);
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
        <div className=" text-xl mb-4 text-center">
          Current Recruitment ID:{' '}
          <span className=" font-bold">
            {' '}
            {recruitment.recruitmentID || 'Please Select Recruiment First'}
          </span>
        </div>
        <div className=" text-xl mb-4">
          Add Required Skills for the position
        </div>
        <SkillSearchBar
          callBackAdd={selectedSkill => {
            if (!recruitment._id) {
              addAlert('Please select a recruitment', 'error');
              return;
            }
            handleUpdate({
              skillsToMatch: [...recruitment.skillsToMatch, selectedSkill],
            });
          }}
        />
        <div className=" mt-2 text-red-500">Click to delete a skill</div>
        <div className="flex flex-row flex-wrap gap-1">
          {recruitment?.skillsToMatch?.map((skill, index) => (
            <Button
              onClick={() => {
                handleUpdate({
                  skillsToMatch: recruitment.skillsToMatch.filter(
                    (s, i) => i !== index
                  ),
                });
              }}
              key={index}
              className=" font-bold mt-2"
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecruimentSetting;

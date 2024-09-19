import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import SearchBarWithTag from './SearchBarWithTag';
import {
  fetchResumes,
  fetchResumeById,
  setResumeList,
  updateResumeById,
} from '../../features/resume/resumeSlice';
// Icons
import { MdOutlineStarBorder } from 'react-icons/md';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

const Table = () => {
  // Custom hooks
  const { alerts, addAlert } = useAlerts(); // Custom hook to handle alerts

  // Redux hooks
  const dispatch = useDispatch(); // Redux dispatch function

  // Redux selectors
  const resumeList = useSelector(state => state.resume.resumes);
  const resume = useSelector(state => state.resume.resume);

  // Search params
  const [searchParams, setSearchParams] = useSearchParams();
  // Custom Dependency that replace resumeId
  const filterResumeQuery = useMemo(() => {
    let stringQuery = searchParams.toString();
    if (stringQuery) {
      stringQuery = stringQuery.replace(/resumeId=[^&]+&?/g, '');
    }
    return stringQuery;
  }, [searchParams.toString()]);
  
  // Callbacks
  const fetchResumesList = useCallback(
    async params => {
      try {
        const data = await dispatch(fetchResumes(params)).unwrap();
      } catch (error) {
        addAlert(error, 'error', 10000);
      }
    },
    [dispatch, addAlert]
  );

  const handlePreferredClick = async selectedResume => {
    try {
      await dispatch(
        updateResumeById({
          id: selectedResume._id,
          updatedData: { isPreferred: !selectedResume.isPreferred },
        })
      ).unwrap();
      dispatch(
        setResumeList(
          resumeList.data?.map(r =>
            r._id === selectedResume._id
              ? { ...r, isPreferred: !selectedResume.isPreferred }
              : r
          )
        )
      );
      addAlert("Resume's preferred status updated", 'success');
    } catch (error) {
      addAlert(error, 'error');
    }
  };
  const handleResumeClick = async selectedResume => {
    console.log('am I');
    try {
      await dispatch(fetchResumeById(selectedResume._id)).unwrap();
      dispatch(
        setResumeList(
          resumeList.data?.map(r =>
            r._id === selectedResume._id ? { ...r, resumeViewed: true } : r
          )
        )
      );
      // set search params but preserve other params
      const existingSkills = searchParams.getAll('skills');
      const existingApplicants = searchParams.getAll('applicants');
      const existingRecruitments = searchParams.getAll('recruitments');
      setSearchParams({
        recruitments: existingRecruitments,
        applicants: existingApplicants,
        skills: existingSkills,
        resumeId: selectedResume._id,
      });
    } catch (error) {
      addAlert(error, 'error');
    }
  };

  // Fetch resumes list on page load and when search params change
  useEffect(() => {
    const applicantsParam = searchParams.getAll('applicants');
    const recruitmentParam = searchParams.getAll('recruitments');
    const skillParam = searchParams.getAll('skills');
    let params = {};
    if (applicantsParam || recruitmentParam || skillParam) {
      params = {
        applicants: applicantsParam,
        recruitments: recruitmentParam,
        skills: skillParam,
      };
    }
    // add pagination to the params
    params = { ...params, page: 1, limit: 40 };
    fetchResumesList(params);
  }, [filterResumeQuery, fetchResumesList]);

  // Set the default selected resume
  // Only called when the resumeList is fetched successfully and page is loaded
  useEffect(() => {
    if (resumeList.status === 'succeeded' && resumeList.data.length > 0) {
      const defaultSelectedResume = searchParams.get('resumeId')
        ? { _id: searchParams.get('resumeId') }
        : resumeList.data[0];
      handleResumeClick(defaultSelectedResume);
    }
  }, [resumeList.data?.length]);

  // Utilities
  const capitalizeWords = str => {
    if (!str) return '';
    return str
      .split(' ') // Split the string into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a single string
  };

  return (
    <>
      <AlertContainer alerts={alerts} />
      <div className="w-full ml-16 flex flex-col">
        <SearchBarWithTag />
        <div className="p-4 w-full flex-grow overflow-auto">
          <div className="border shadow-[0_0_6px_rgba(0,0,0,0.2)] h-full rounded-lg">
            <div className="overflow-auto h-full rounded-lg">
              <table className="w-full text-start rounded-lg">
                <thead className=" h-14 bg-black text-white">
                  <tr className="sticky top-0 bg-black">
                    <th className="text-start">Recruitment Title</th>
                    <th className="text-start">Position</th>
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
                  {Array.isArray(resumeList.data) &&
                    resumeList?.data?.map((resumeInTable, index) => (
                      <tr
                        key={resumeInTable._id}
                        className={` ${
                          index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                        } cursor-pointer hover:bg-gray-300 ${
                          resume.data?._id === resumeInTable._id &&
                          'bg-green-200 hover:bg-green-200'
                        }`} // hover:bg-gray-300`}
                        onClick={() => {
                          handleResumeClick(resumeInTable);
                        }}
                      >
                        <td>
                          {resumeInTable.recruitment.title}
                          {/* {resume.data?._id} */}
                        </td>
                        <td>{resumeInTable.recruitment.position}</td>
                        <td>{capitalizeWords(resumeInTable.name)}</td>
                        <td>{resumeInTable.rating}</td>
                        <td>{resumeInTable.status}</td>
                        <td>{resumeInTable.resumeViewed ? 'yes' : 'No'}</td>
                        <td
                          onClick={e => {
                            e.stopPropagation();
                            handlePreferredClick(resumeInTable);
                            // handlePreferred(recruit);
                          }}
                        >
                          {resumeInTable.isPreferred ? (
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
                    ))}
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

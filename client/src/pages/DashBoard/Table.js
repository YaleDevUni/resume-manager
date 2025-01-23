import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import SearchBarWithTag from './SearchBarWithTag';
import Pagination from '../../components/Pagination';
import useCustomSearchParams from '../../hooks/SearchParamService';
// import React
import React from 'react';
import {
  fetchResumes,
  fetchResumeById,
  setResumeList,
  updateResumeById,
  removeResumeById,
} from '../../features/resume/resumeSlice';
// Icons
import { MdOutlineStarBorder } from 'react-icons/md';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

const Table = () => {
  const pdfContainerRef = useRef(null);
  // Custom hooks
  const { alerts, addAlert } = useAlerts(); // Custom hook to handle alerts

  // Redux hooks
  const dispatch = useDispatch(); // Redux dispatch function

  // Redux selectors
  const resumeList = useSelector(state => state.resume.resumes);
  const resume = useSelector(state => state.resume.resume);
  const pagination = useSelector(state => state.resume.resumes.pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    searchParams,
    getParamsObject,
    appendSearchParams,
    removeSearchParams,
  } = useCustomSearchParams();

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
  const handleDelete = async selectedResume => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await dispatch(removeResumeById(selectedResume._id)).unwrap();
        addAlert('Resume deleted successfully', 'success');
      } catch (error) {
        addAlert(error, 'error');
      }
    }
  };
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
    } catch (error) {
      addAlert(error, 'error');
    }
  };

  // Fetch resumes list on page load and when search params change
  useEffect(() => {
    fetchResumesList(getParamsObject());
    //if pagination.totalPages is less than currentPage, set currentPage to 1
    if (pagination.totalPages < pagination.currentPage) {
      appendSearchParams('currentPage', 1);
    }
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
                <thead className=" text-xs h-8 bg-gray-800 text-white">
                  <tr className="sticky top-0 bg-gray-800">
                    <th className="text-start">Recruitment Title</th>
                    <th className="text-start">Position</th>
                    <th className="text-start">File Name</th>
                    <th className="text-start">Rating</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Reviewed</th>
                    <th>
                      <MdOutlineStarBorder className=" w-6 h-6" />
                    </th>
                    <th className="text-start"></th>
                  </tr>
                </thead>
                <tbody className="table-fixed text-xs ">
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
                          {resumeInTable?.recruitment?.title}
                          {/* {resume.data?._id} */}
                        </td>
                        <td>{resumeInTable?.recruitment?.position}</td>
                        <td>{resumeInTable?.originalFileName}</td>
                        <td>{resumeInTable?.rating}</td>
                        <td>{resumeInTable?.status}</td>
                        <td>{resumeInTable?.resumeViewed ? 'yes' : 'No'}</td>
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
                          className="hover:bg-red-500 hover:text-white hover:fill-white
    border-l text-center border-gray-400"
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(resumeInTable);
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
                <Pagination
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  handlePageChange={page => {
                    appendSearchParams('currentPage', page);
                  }}
                />
              </div>
              {/* <div className="w-full" ref={pdfContainerRef} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;

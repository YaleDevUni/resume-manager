import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import { getPdfById } from '../../services/ResumeApiService';
import {
  updateResumeById,
  setResumeList,
  setPdf,
} from '../../features/resume/resumeSlice';

const Info = () => {
  // Local state
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [debouncedNote, setDebouncedNote] = useState('');

  // Redux hooks
  const dispatch = useDispatch();
  const resume = useSelector(state => state.resume.resume);
  const resumeList = useSelector(state => state.resume.resumes);
  const pdf = useSelector(state => state.resume.pdf);
  // Custom hooks
  const { alerts, addAlert } = useAlerts();

  // Callbacks
  const debouncedSetNote = useCallback(
    debounce((value, resumeID) => {
      setDebouncedNote(value);
      const data = { note: value };
      handleResumeUpdate(resumeID, data);
    }, 300),
    []
  );

  const handleViewDocument = async () => {
    try {
      if (pdf.data !== null) {
        dispatch(setPdf(null));
        return;
      }
      const response = await getPdfById(resume.data.resumePDF);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      dispatch(setPdf(url));
    } catch (error) {
      addAlert(error, 'error');
    }
  };

  const handleChange = e => {
    const value = e.target.value;
    setNote(value);
    debouncedSetNote(value, resume.data?._id);
  };

  const handleResumeUpdate = async (
    resumeId,
    data,
    isEffectOnTable = false
  ) => {
    if (!resumeId) {
      addAlert('No resume ID found', 'error');
      return;
    }
    try {
      await dispatch(
        updateResumeById({ id: resumeId, updatedData: data })
      ).unwrap();

      if (isEffectOnTable) {
        dispatch(
          setResumeList(
            resumeList.data?.map(r =>
              r._id === resume.data?._id ? { ...r, ...data } : r
            )
          )
        );
      }

      addAlert('Resume updated successfully', 'success');
    } catch (error) {
      addAlert(error, 'error');
    }
  };

  useEffect(() => {
    if (resume.data?.note) setNote(resume.data?.note);
    else setNote('');
    if (resume.data?.rating) setRating(resume.data?.rating);
    else setRating(0);
  }, [resume.data]);

  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  const capitalizeWords = str => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <AlertContainer alerts={alerts} />
      <div className="relative text-xs h-full w-1/3 shadow-[0px_0px_15px_-3px_rgba(0,0,0,0.3)] rounded-lg overflow-auto">
        {resume.status === 'loading_from_table' && (
          <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        <div className="flex justify-center m-2 gap-3 sticky top-0 bg-white">
          <button
            className="w-full p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] hover:bg-gray-100"
            onClick={handleViewDocument}
          >
            {pdf.data ? 'Close Document' : 'View Document'}
          </button>
          <button
            className="w-8 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
            onClick={e => {
              handleResumeUpdate(
                resume.data?._id,
                { isPreferred: !resume.data?.isPreferred },
                true
              );
            }}
          >
            {resume.data?.isPreferred ? '★' : '☆'}
          </button>
          <button className="w-8 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            #
          </button>
        </div>

        <hr />
        <div className="text-sm m-4 mb-0">Applicant </div>
        <div className="text-sm m-4 mt-0">{resume.data?.originalFileName}</div>
        <hr />
        <div className="text-sm m-4 mb-0">Status</div>
        <select
          className="w-1/2 m-4 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
          value={resume.data?.status}
          onChange={e => {
            handleResumeUpdate(
              resume.data?._id,
              { status: e.target.value },
              true
            );
          }}
        >
          <option value="Under Review">Under Review</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
        </select>

        <hr />
        <div className="text-sm m-4 mb-0">Recruitment ID</div>
        <div className="text-sm m-4 mt-0">
          {resume.data?.recruitment?.title}
        </div>
        <hr />

        <hr />
        <div className="text-sm m-4 mb-0">Note</div>
        <textarea
          className="w-11/12 h-40 p-1 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] m-2 resize-none"
          value={note}
          disabled={!resume.data?._id}
          onChange={handleChange}
        ></textarea>
        <hr />
        <div className="text-sm m-4">Rating</div>
        <div className="flex flex-row m-4 gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              onMouseEnter={() => {
                setRating(i + 1);
              }}
              onMouseLeave={() => {
                setRating(resume.data?.rating);
              }}
              onClick={() => {
                handleResumeUpdate(
                  resume.data?._id,
                  {
                    rating: i + 1,
                  },
                  true
                );
              }}
              key={i}
              className={`cursor-pointer w-6 h-6 border rounded border-gray-500 ${
                i < rating ? 'bg-green-500' : 'hover:bg-green-500'
              }`}
            />
          ))}
        </div>
        <hr />
        <div className="text-sm m-4">Skills and Match</div>
        <div className="flex flex-row flex-wrap m-4 gap-1">
          {resume.data?.skills?.map((skill, index) => (
            <div
              key={index}
              className={`p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]
                ${
                  resume.data?.recruitment?.skillsToMatch?.includes(skill)
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black'
                }
              `}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Info;

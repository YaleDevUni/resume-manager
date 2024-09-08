import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
// TODO: import updateResumeById from resumeSlice
import { updateResumeById } from '../../features/resume/resumeSlice';
const Info = () => {
  // Local state
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [infoRatingAdjust, setInfoRatingAdjust] = useState(false);
  // Redux hooks
  const dispatch = useDispatch(); // Redux dispatch function
  // Redux selectors
  const resume = useSelector(state => state.resume.resume);
  // Custom hooks
  const { alerts, addAlert } = useAlerts(); // Custom hook to handle alerts
  // Callbacks
  const [debouncedNote, setDebouncedNote] = useState('');

  // Debounce the side effect
  const debouncedSetNote = useCallback(
    debounce((value, resumeID) => {
      setDebouncedNote(value);
      const data = { note: value };
      // update the resume with the new note
      handleResumeUpdate(resumeID, data);
    }, 300), // Adjust the delay as needed
    []
  );

  // Handle onChange event
  const handleChange = e => {
    const value = e.target.value;
    setNote(value); // Update note state immediately
    debouncedSetNote(value, resume.data._id); // Debounce the side effect
  };

  const handleResumeUpdate = async (resumeId, data) => {
    if (!resumeId) {
      addAlert('No resume ID found', 'error');
      return;
    }
    try {
      await dispatch(
        updateResumeById({ id: resumeId, updatedData: data })
      ).unwrap();
      addAlert('Resume updated successfully', 'success');
    } catch (error) {
      addAlert(error, 'error');
    }
  };

  useEffect(() => {
    if (debouncedNote) {
    }
  }, [debouncedNote]);

  useEffect(() => {
    if (resume.data.note) setNote(resume.data.note);
    else setNote('');
    if (resume.data.rating) setRating(resume.data.rating);
    else setRating(0);
  }, [resume.data]);
  useEffect(() => {
    console.log(resume.data);
  }, [resume]);

  // Utility functions
  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
  return (
    <>
      <AlertContainer alerts={alerts} />
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
        <div className=" text-xl m-4 mb-0 ">File Name</div>
        <div className=" text-lg m-4 mt-0"> {resume.data.name}</div>
        <hr />
        <div className=" text-xl m-4 mb-0">Status</div>
        <div className=" text-lg m-4 mt-0"> {resume.data.status}</div>

        <hr />
        <div className=" text-xl m-4 mb-0">Recruitment ID</div>
        <div className=" text-lg m-4 mt-0">
          {resume.data.recruitment?.title}
        </div>
        <hr />
        <div className=" text-xl m-4 mb-0">Position</div>
        <div className=" text-lg m-4 mt-0"> {resume.data.position}</div>
        <hr />
        {/* <div className=" text-xl m-4 mb-0">Shared</div>
        <div className=" text-lg m-4 mt-0"> Yeil Park, John Doe</div>
        <hr /> */}

        <div className=" text-xl m-4 mb-0">Note</div>
        <textarea
          className=" w-11/12 h-40 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] m-4 resize-none"
          value={note}
          disabled={!resume.data._id}
          // debounce
          onChange={handleChange}
        ></textarea>
        <hr />
        <div className=" text-xl m-4">Rating</div>
        <div className=" flex flex-row m-4 gap-1">
          {
            // 10 iteration
            Array.from({ length: 10 }, (_, i) => (
              <div
                onMouseEnter={() => {
                  setRating(i);
                }}
                onMouseLeave={() => {
                  setRating(resume.data.rating);
                }}
                onClick={() => {
                  console.log(resume);
                  handleResumeUpdate(resume.data._id, {
                    rating: i,
                  });
                }}
                key={i}
                className={` cursor-pointer w-6 h-6 border rounded border-gray-500 ${
                  i < rating ? 'bg-green-500' : 'hover:bg-green-500'
                }`}
              />
            ))
          }
        </div>
        <hr />
        <div className=" text-xl m-4">Skills and Match</div>
        <div className=" flex flex-row flex-wrap m-4 gap-1">
          {resume.data.skills?.map((skill, index) => (
            <div
              key={index}
              className=" p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
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

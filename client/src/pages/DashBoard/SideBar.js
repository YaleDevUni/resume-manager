import React, { useState } from 'react';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaUserCircle } from 'react-icons/fa';
import { GrDocumentConfig } from 'react-icons/gr';
import { Link, useSearchParams } from 'react-router-dom';
import { use } from 'react';
import { useEffect } from 'react';
import useCustomSearchParams from '../../hooks/SearchParamService';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [toggleNav, setToggleNav] = useState('w-0');
  const { searchParams, appendSearchParams, removeSearchParams } =
    useCustomSearchParams();
  const [rating, setRating] = useState(
    parseInt(searchParams.get('rating') || 0)
  );
  const navigate = useNavigate();
  // Same as in your SearchBarWithTag

  const handleStatusChange = e => {
    appendSearchParams('status', e.target.value);
  };

  const handleShowOnlyPreferenceChange = e => {
    appendSearchParams('showOnlyPreference', e.target.checked);
  };

  const handlePaginationChange = e => {
    appendSearchParams('pagination', e.target.value);
  };

  const handleRatingChange = val => {
    appendSearchParams('rating', val);
  };

  return (
    <div
      className={`${toggleNav} bg-gray-800 text-white shadow-[8px_0_6px_rgba(0,0,0,0.1)] transition-all duration-500 relative`}
    >
      <div className="absolute -right-10 -top-1 h-44 flex flex-col rounded-br-3xl justify-evenly w-10 shadow-[8px_15px_15px_-5px_rgba(0,0,0,0.1)] bg-gray-800">
        <FaUserCircle
          className="fill-white w-6 h-6 m-2 cursor-pointer"
          onClick={() => navigate('/dashboard/profile')}
        />
        <TbAdjustmentsHorizontal
          className="text-white w-6 h-6 m-2 cursor-pointer"
          onClick={() => {
            setToggleNav(toggleNav === 'w-0' ? 'w-100 p-2' : 'w-0');
          }}
        />
        <Link to={`/dashboard/pdf-uploader?${searchParams.toString()}`}>
          <GrDocumentConfig className="text-white w-6 h-6 m-2" />
        </Link>
      </div>
      <div className="overflow-hidden w-full flex flex-col">
        <div className="text-xl mb-4">Advanced Filter</div>
        <hr className="mb-2" />

        {/* MINIMUM RATING */}
        <div className="flex flex-row justify-between">
          <div className="my-2">Minimum Rating</div>
        </div>
        <div className=" flex flex-row gap-1">
          {
            // 10 iteration
            Array.from({ length: 10 }, (_, i) => (
              <div
                onMouseEnter={() => {
                  setRating(i + 1);
                }}
                onMouseLeave={() => {
                  setRating(parseInt(searchParams.get('rating') || 0));
                }}
                onClick={() => {
                  handleRatingChange(i + 1);
                }}
                key={i}
                className={` cursor-pointer w-5 h-6 border rounded border-gray-500 ${
                  i < rating ? 'bg-green-500' : 'hover:bg-green-500'
                }`}
              />
            ))
          }
        </div>

        <hr className="my-1" />

        {/* STATUS */}
        <div className="flex flex-row justify-between">
          <div className="my-1">Status</div>
        </div>
        <select
          className="text-xs bg-inherit w-full mb-4 p-2 border rounded-md"
          onChange={handleStatusChange}
          value={searchParams.get('status') || 'All'}
        >
          <option value="All">All</option>
          <option value="Under Review">Under Review</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="InterviewScheduled">Interview Scheduled</option>
        </select>

        <hr className="my-2" />

        {/* SHOW ONLY PREFERENCE */}
        <div className="flex flex-row justify-between mb-2">
          <div>Show Only Preference</div>
          <input
            type="checkbox"
            onChange={handleShowOnlyPreferenceChange}
            checked={searchParams.get('showOnlyPreference') === 'true'}
          />
        </div>

        <hr />

        {/* PAGINATION */}
        <div className="w-full flex flex-col">
          <div className="my-2">Pagination</div>
          <select
            className="text-xs bg-inherit w-full p-2 border rounded-md"
            onChange={handlePaginationChange}
            value={searchParams.get('pagination') || '10'}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

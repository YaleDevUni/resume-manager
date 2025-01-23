import SearchBar from '../../components/SearchBar';
import { useState } from 'react';
import Button from '../../components/Button';
import useCustomSearchParams from '../../hooks/SearchParamService';

const SearchBarWithTag = () => {
  const [queryType, setQueryType] = useState('recruitments');
  const { searchParams, appendSearchParams, removeSearchParams } =
    useCustomSearchParams();

  const searchParamsCallback = value => {
    appendSearchParams(queryType, value);
  };

  const handleSortChange = e => {
    const value = e.target.value;
    if (value === 'none') {
      removeSearchParams('sortConfig');
    } else {
      appendSearchParams('sortConfig', value);
    }
  };

  return (
    <>
      <div className="text-xs flex flex-row justify-between w-full p-4 gap-1">
        <SearchBar
          className={'w-full'}
          queryType={queryType}
          callBackAdd={searchParamsCallback}
        />
        <select
          className="w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
          value={queryType}
          onChange={e => setQueryType(e.target.value)}
        >
          <option value="skills">Skills</option>
          <option value="originalFileName">File Name</option>
          <option value="recruitments">Recruitments</option>
        </select>

        <select
          className="w-40 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
          value={searchParams.get('sortConfig') || 'none'}
          onChange={handleSortChange}
        >
          <option value="none">Sort by...</option>
          <option value="fileName_asc">Name (A-Z)</option>
          <option value="fileName_desc">Name (Z-A)</option>
          <option value="rating_asc">Rating (Low-High)</option>
          <option value="rating_desc">Rating (High-Low)</option>
          <option value="date_asc">Date (Oldest)</option>
          <option value="date_desc">Date (Latest)</option>
        </select>

        <button
          onClick={() => {
            removeSearchParams('skills', '', true);
            removeSearchParams('sortConfig');
          }}
          className="w-28 p-1 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
        >
          Reset
        </button>
        <button className="w-28 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
          Search
        </button>
      </div>

      <div className="text-xs flex flex-row flex-wrap items-center w-full gap-1 px-4">
        <div className="font-extrabold">Recruitment ID:</div>
        {searchParams.getAll('recruitments')?.map((recruitment, index) => (
          <Button
            key={index}
            className="text-white bg-red-500"
            onClick={() => {
              removeSearchParams('recruitments', recruitment);
            }}
          >
            {recruitment}
          </Button>
        ))}
        <div className="h-5 border-x border-gray-300 mx-1" />
        <div className="font-extrabold">Skills:</div>
        {searchParams.getAll('skills')?.map((skill, index) => (
          <Button
            key={index}
            className="text-white bg-green-500"
            onClick={() => {
              removeSearchParams('skills', skill);
            }}
          >
            {skill}
          </Button>
        ))}
      </div>
      <div className="mt-2 text-xs flex flex-row flex-wrap items-center w-full gap-1 px-4">
        <div className="font-extrabold">File name:</div>
        {searchParams.getAll('originalFileName')?.map((fileName, index) => (
          <Button
            key={index}
            className="text-xs hover:bg-red-200"
            onClick={() => {
              removeSearchParams('originalFileName', fileName);
            }}
          >
            {fileName}
          </Button>
        ))}
        <div className="mx-1" />
        {Number(searchParams.getAll('rating')) > 0 && (
          <div className="font-extrabold">
            Minimum rating: {Number(searchParams.getAll('rating'))}
          </div>
        )}
        {searchParams.getAll('showOnlyPreference').toString() === 'true' && (
          <div className="font-extrabold">Show only preference: Yes </div>
        )}
      </div>
    </>
  );
};

export default SearchBarWithTag;

import SearchBar from '../../components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../components/Button';
const SearchBarWithTag = () => {
  // Local state
  const [queryType, setQueryType] = useState('recruitments');
  const [searchParams, setSearchParams] = useSearchParams();

  // SearchBar Callback function to set searchParams
  const searchParamsCallback = value => {
    const existingSkills = searchParams.getAll('skills');
    const existingApplicants = searchParams.getAll('applicants');
    const existingRecruitments = searchParams.getAll('recruitments');
    const resumeId = searchParams.get('resumeId');
    setSearchParams({ resumeId: resumeId });
    switch (queryType) {
      case 'skills':
        setSearchParams({
          recruitments: existingRecruitments,
          applicants: existingApplicants,
          skills: [...existingSkills, value],
          resumeId: resumeId,
        });
        break;
      case 'applicants':
        setSearchParams({
          recruitments: existingRecruitments,
          skills: existingSkills,
          applicants: [...existingApplicants, value],
          resumeId: resumeId,
        });
        break;

      case 'recruitments':
        setSearchParams({
          skills: existingSkills,
          applicants: existingApplicants,
          recruitments: [...existingRecruitments, value],
          resumeId: resumeId,
        });
        break;
      default:
        break;
    }

    // console.log(searchParamsObject);
  };
  // const searchParamsCallback = value => {
  //   console.log(searchParams.entries());
  //   console.log(searchParams);
  //   const entries = searchParams.entries();

  //   // Convert iterator to an array and log key-value pairs
  //   for (const [key, value] of entries) {
  //     console.log(`${key}: ${value}`);
  //   }

  //   const params = {
  //     skills: searchParams.getAll('skills'),
  //     applicants: searchParams.getAll('applicants'),
  //     recruitments: searchParams.getAll('recruitments'),
  //   };

  //   if (params[queryType]) {
  //     setSearchParams({
  //       ...params,
  //       [queryType]: [...params[queryType], value],
  //     });
  //   }
  // };
  return (
    <>
      <div className=" flex flex-row justify-between w-full p-4 gap-1">
        <SearchBar
          className={'w-full'}
          queryType={queryType}
          callBackAdd={searchParamsCallback}
        />
        <select
          className="w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
          value={queryType} // Ensure controlled component
          onChange={e => setQueryType(e.target.value)} // Update queryType on selection
        >
          <option value="skills">Skills</option>
          <option value="applicants">Applicants</option>
          <option value="recruitments">Recruitments</option>
        </select>

        <button
          onClick={() => setSearchParams({ sklls: [] })}
          className=" w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
        >
          Reset
        </button>
        <button className=" w-32 p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]">
          Search
        </button>
      </div>
      <div className=" flex flex-row flex-wrap items-center w-full gap-1 px-4">
        <div className=" font-extrabold"> Recruitment ID:</div>
        {searchParams.getAll('recruitments')
          ? searchParams
              .getAll('recruitments')
              .map((recruitment, index) => (
                <Button className=" text-white bg-red-500">
                  {recruitment}
                </Button>
              ))
          : null}
        <div className="h-8 border-x-2 border-gray-300 mx-2" />
        <div className=" font-extrabold"> Skills:</div>
        {searchParams.getAll('sklls')
          ? searchParams
              .getAll('skills')
              .map((skill, index) => (
                <Button className=" text-white bg-green-500">{skill}</Button>
              ))
          : null}
      </div>
    </>
  );
};

export default SearchBarWithTag;

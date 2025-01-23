import { current } from '@reduxjs/toolkit';
import { useSearchParams } from 'react-router-dom';

const useCustomSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper function to extract current search parameters as an object
  const getParamsObject = () => {
    const params = {
      skills: searchParams.getAll('skills'),
      originalFileName: searchParams.getAll('originalFileName'),
      recruitments: searchParams.getAll('recruitments'),
      resumeId: searchParams.get('resumeId'),
      rating: searchParams.get('rating'),
      showOnlyPreference: searchParams.get('showOnlyPreference'),
      status: searchParams.get('status'),
      pagination: searchParams.get('pagination'),
      currentPage: searchParams.get('currentPage'),
      sortFileName: searchParams.get('sortFileName'),
      sortRating: searchParams.get('sortRating'),
      sortDate: searchParams.get('sortDate'),
      sortConfig: searchParams.get('sortConfig'),
    };

    // Remove keys with undefined or empty values
    return Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) =>
          value && (Array.isArray(value) ? value.length > 0 : true)
      )
    );
  };

  // Append a new value to a search parameter
  const appendSearchParams = (key, value) => {
    const params = getParamsObject();

    if (Array.isArray(params[key])) {
      params[key] = [...params[key], value];
    } else {
      params[key] = value;
    }

    setSearchParams(params);
  };

  // Remove a specific value from a search parameter
  const removeSearchParams = (key, value, clear = false) => {
    const params = getParamsObject();

    if (Array.isArray(params[key])) {
      params[key] = params[key].filter(val => val !== value);

      // If the array becomes empty, delete the key
      if (params[key].length === 0 || clear) {
        delete params[key];
      }
    } else {
      delete params[key]; // Remove non-array keys directly
    }

    setSearchParams(params);
  };

  return {
    searchParams,
    getParamsObject,
    appendSearchParams,
    removeSearchParams,
  };

  //to Object
};

export default useCustomSearchParams;

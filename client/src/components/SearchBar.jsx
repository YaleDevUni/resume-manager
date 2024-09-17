import React, { useState, useEffect, useCallback } from 'react';
import { getSkills } from '../services/SkillService';
import { searchRecruitments } from '../services/RecruitApiService';
import { searchApplicants } from '../services/ResumeApiService';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchBar = ({
  queryType = 'skills',
  className,
  callBackAdd = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [mockQuery, setMockQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [list, setList] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1); // Track highlighted suggestion

  // useCallBack functions
  const fetchRecruitments = useCallback(
    debounce(async query => {
      try {
        const recruitmentsObjList = await searchRecruitments(query);
        const recruitmentsList = recruitmentsObjList.map(r => r.title);
        setList(recruitmentsList);
      } catch (error) {
        console.error('Error fetching recruitments in useEffect:', error);
        setList([]); // Optionally handle the error by setting an empty list
      }
    }, 150),
    []
  );

  const fetchApplicants = useCallback(
    debounce(async query => {
      try {
        const applicantsObjList = await searchApplicants(query);
        const applicantsList = applicantsObjList.map(a => a.name);
        setList(applicantsList);
      } catch (error) {
        console.error('Error fetching applicants in useEffect:', error);
        setList([]); // Optionally handle the error by setting an empty list
      }
    }, 150),
    []
  );

  // Event handlers
  const handleChange = e => {
    // trim for leading and trailing spaces and special characters when searching for skills, otherwise only special characters with out trimming
    const value =
      queryType === 'skills'
        ? e.target.value.trim().replace(/[^a-zA-Z0-9 ]/g, '')
        : e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
    setQuery(value);
    setMockQuery('');
    setHighlightIndex(-1); // Reset highlight when query changes
  };

  const handleSelect = suggestion => {
    setQuery(suggestion);
    setSuggestions([]);
    setQuery('');
    setMockQuery('');
    callBackAdd(suggestion);
    setHighlightIndex(-1); // Reset highlight after selection
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      // return if no input
      if (!query) return;
      if (highlightIndex >= 0 && suggestions.length > 0) {
        // If there is a highlighted suggestion, select it
        handleSelect(suggestions[highlightIndex]);
      } else {
        // If no suggestion is highlighted, add the current query as a custom skill
        handleSelect(query);
      }
    }
    if (suggestions.length === 0) return;
    else if (e.key === 'Escape') {
      setSuggestions([]);
      setHighlightIndex(-1);
    } else if (e.key === 'ArrowDown') {
      setHighlightIndex(prevIndex => {
        const nextIndex =
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex;
        scrollIntoView(nextIndex);
        return nextIndex;
      });
      setMockQuery(suggestions[highlightIndex + 1]);
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex(prevIndex => {
        const nextIndex = prevIndex > 0 ? prevIndex - 1 : 0;
        scrollIntoView(nextIndex);
        return nextIndex;
      });
      setMockQuery(suggestions[highlightIndex - 1]);
    }
  };

  // useEffects
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsList = await getSkills();
        setList(skillsList);
      } catch (error) {
        console.error('Error fetching list in useEffect:', error);
        setList([]); // Optionally handle the error by setting an empty list list
      }
    };
    setList([]);
    if (!query) return;
    switch (queryType) {
      case 'skills':
        fetchSkills();
        break;
      case 'applicants':
        fetchApplicants(query);
        break;
      case 'recruitments':
        fetchRecruitments(query);
        break;
      default:
        console.error('Unknown queryType:', queryType);
    }
  }, [queryType, query, fetchApplicants, fetchRecruitments]);

  // update the list of suggestions when the query changes
  useEffect(() => {
    if (query.length > 0) {
      const filteredSuggestions = list.filter(skill =>
        skill.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions([query, ...filteredSuggestions]);
    } else {
      setSuggestions([]);
    }
  }, [list]); // Add query to the dependency array

  // Helper function to scroll the highlighted item into view
  const scrollIntoView = index => {
    const list = document.querySelector('.search-bar ul');
    const item = list.children[index];
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  const handleBlur = e => {
    // Delay closing the suggestions to allow time for a click
    setTimeout(() => {
      setSuggestions([]);
      setHighlightIndex(-1);
    }, 100);
  };

  return (
    <div className={`search-bar relative ${className}`}>
      <input
        type="text"
        value={mockQuery ? mockQuery : query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search list..."
        onBlur={handleBlur}
        className="border p-2 w-full rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 border mt-2 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className={`p-2 cursor-pointer ${
                index === highlightIndex ? 'bg-gray-300' : 'hover:bg-gray-200'
              }
              ${index === 0 ? 'font-bold italic' : ''}
              `}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

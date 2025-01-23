import React, { useState, useEffect, useCallback } from 'react';
import { getSkills } from '../services/SkillService';
import { searchRecruitments } from '../services/RecruitApiService';

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
  // States
  const [query, setQuery] = useState('');
  const [mockQuery, setMockQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [list, setList] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Data fetching
  const fetchRecruitments = useCallback(
    debounce(async query => {
      try {
        const recruitmentsObjList = await searchRecruitments(query);
        const recruitmentsList = recruitmentsObjList.map(r => r.title);
        setList(recruitmentsList);
      } catch (error) {
        console.error('Error fetching recruitments:', error);
        setList([]);
      }
    }, 150),
    []
  );

  // UI Event Handlers
  const handleSelect = suggestion => {
    setQuery(suggestion);
    setSuggestions([]);
    setQuery('');
    setMockQuery('');
    callBackAdd(suggestion);
    setHighlightIndex(-1);
    setIsFocused(false);
  };

  const handleChange = async e => {
    let value;
    switch (queryType) {
      case 'skills':
        value = e.target.value.trim().replace(/[^a-zA-Z0-9 ]/g, '');
        break;
      case 'recruitments':
        value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
        break;
      default:
        value = e.target.value;
        break;
    }
    setQuery(value);
    setMockQuery('');
    setHighlightIndex(-1);

    if (value) {
      switch (queryType) {
        case 'skills':
          const skillsList = await getSkills();
          setList(skillsList);
          break;
        case 'recruitments':
          fetchRecruitments(value);
          break;
      }
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (!query) return;
      if (highlightIndex >= 0 && suggestions.length > 0) {
        handleSelect(suggestions[highlightIndex]);
      } else {
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

  const handleBlur = () => {
    if (!isMouseDown) {
      setTimeout(() => {
        setIsFocused(false);
        setHighlightIndex(-1);
        setSuggestions([]);
      }, 100);
    }
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleFocus = async () => {
    setIsFocused(true);
    try {
      switch (queryType) {
        case 'skills':
          const skillsList = await getSkills();
          setList(skillsList);
          break;
        case 'recruitments':
          const recruitmentsObjList = await searchRecruitments('');
          const recruitmentsList = recruitmentsObjList.map(r => r.title);
          setList(recruitmentsList);
          break;
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setList([]);
    }
  };

  // Helper Functions
  const scrollIntoView = index => {
    const list = document.querySelector('.search-bar ul');
    const item = list.children[index];
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  // Effects
  useEffect(() => {
    if (isFocused) {
      if (query.length > 0) {
        const filteredSuggestions = list.filter(item =>
          item.toLowerCase().startsWith(query.toLowerCase())
        );
        setSuggestions([query, ...filteredSuggestions]);
      } else {
        setSuggestions(list);
      }
    }
  }, [list, query, isFocused]);

  // Render
  return (
    <div className={`search-bar relative ${className}`}>
      <input
        type="text"
        value={mockQuery ? mockQuery : query ? query : ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search list..."
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="text-xs border p-2 w-full rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul
          className="text-xs absolute z-10 border mt-2 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
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

import React, { useState, useEffect } from 'react';
import { getSkills } from '../services/SkillService';
const SearchBar = ({className, callBackAdd = () => {} }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [list, setList] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1); // Track highlighted suggestion

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

    fetchSkills();
  }, []);

  const handleChange = e => {
    // trim and remove dots from the query
    const value = e.target.value.trim().replace(/\./g, '');
    setQuery(value);
    setHighlightIndex(-1); // Reset highlight when query changes

    if (value.length > 0) {
      const filteredSuggestions = list.filter(skill =>
        skill.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = suggestion => {
    setQuery(suggestion);
    setSuggestions([]);
    setHighlightIndex(-1); // Reset highlight after selection
    callBackAdd(suggestion);
    // reset the input field after adding the skill
    setQuery('');
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
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex(prevIndex => {
        const nextIndex = prevIndex > 0 ? prevIndex - 1 : 0;
        scrollIntoView(nextIndex);
        return nextIndex;
      });
    }
  };

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
        value={query}
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
              }`}
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

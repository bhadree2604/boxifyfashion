'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder = 'Select...', disabled = false }) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update filtered options when options or input changes
  useEffect(() => {
    const filtered = options.filter(opt =>
      opt.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    // Reset highlight when options change
    setHighlightedIndex(-1);
  }, [options, inputValue]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target) &&
          dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev <= 0 ? filteredOptions.length - 1 : prev - 1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev >= filteredOptions.length - 1 ? 0 : prev + 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const selected = filteredOptions[highlightedIndex];
          setInputValue(selected);
          onChange(selected);
          setIsOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const renderDropdown = () => {
    if (!isOpen || filteredOptions.length === 0) return null;
    return (
      <div
        ref={dropdownRef}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto',
          width: '100%',
        }}
      >
        {filteredOptions.map((opt, idx) => (
          <div
            key={opt}
            style={{
              padding: '0.55rem 0.75rem',
              cursor: 'pointer',
              background: idx === highlightedIndex ? 'rgba(44, 90, 160, 0.08)' : 'transparent',
              color: 'var(--text)',
              fontSize: '0.95rem',
            }}
            onMouseEnter={() => setHighlightedIndex(idx)}
            onClick={() => handleOptionClick(opt)}
          >
            {opt}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="searchable-select-wrapper" style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="admin-input searchable-input"
        style={{
          width: '100%',
          padding: '0.55rem 0.75rem',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: '#ffffff',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          transition: 'border-color 0.15s ease',
          boxSizing: 'border-box',
          // Add focus style
          '&:focus': {
            outline: 'none',
            borderColor: 'var(--secondary)',
            boxShadow: '0 0 0 3px rgba(44, 90, 160, 0.12)'
          }
        }}
      />
      {renderDropdown()}
    </div>
  );
}
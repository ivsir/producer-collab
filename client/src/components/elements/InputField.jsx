// src/components/elements/InputField.js

import React, { useState } from 'react';

const InputField = ({ id, disabled, label = 'Type here', variant, placeholder, name, value, onChange }) => {
  const [showAsterisk, setShowAsterisk] = useState(true);

  // Determine input field color and additional classes based on variant
  let inputStateClass = '';
  let inputLabelClass = '';
  let inputType = 'text';

  switch (variant) {
    case 'error':
      inputStateClass = 'border border-red-500';
      inputLabelClass = 'block';
      break;
    case 'outlined':
      inputStateClass = 'bg-transparent border-2 border-tertiary';
      inputLabelClass = 'hidden';
      break;
    case 'password':
      inputType = 'password';
      inputStateClass = '';
      inputLabelClass = 'hidden';
      break;
    default:
      inputStateClass = '';
      inputLabelClass = 'hidden';
  }

  return (
    <div className="flex flex-col mb-4 relative">
      <input
        id={id}
        type={inputType}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg bg-secondary text-white border border-secondary ${inputStateClass}`}
        placeholder={placeholder || label.replace('*', '')} // Use the custom placeholder if provided, otherwise use the label
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setShowAsterisk(false)}
        onBlur={() => setShowAsterisk(true)}
      />
      {showAsterisk && (
        <span className="absolute right-3 top-5 transform -translate-y-1/2 text-red-500">*</span>
      )}
      {/* Error Message */}
      <label className={`text-red-500 text-xs mt-1 ${inputLabelClass}`}>
        Invalid input. Please try again.
      </label>
    </div>
  );
};

export default InputField;

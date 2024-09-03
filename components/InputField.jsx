import React from "react";
export const InputField = ({ label, type = 'text', value, onChange }) => {
    return (
      <div className="relative mb-6">
        {/* <label className="block text-gray-500 text-sm font-medium mb-2">
          {label}
        </label> */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={label}
          className="block w-full lg:w-96 px-3 py-2 text-lg font-semibold text-black border-b-2 border-gray-300 focus:outline-none focus:border-black"
        />
        {type === 'password' && (
          <span className="absolute right-3 bottom-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 12a3 3 0 1 0-3 3M12 9v0M19.4 4.6A10 10 0 0 1 12 2a10 10 0 0 1-7.4 3.6M12 22a10 10 0 0 1-7.4-3.6M22 12a10 10 0 0 1-3.6 7.4M4.6 19.4A10 10 0 0 1 2 12" />
            </svg>
          </span>
        )}
      </div>
    );
  };
import React from 'react'

export default function SearchBar() {
    return (
      <div className="segsebox">
        <div className="iconMenuOption col-xs-12 openFullMenu">
          <span className="fullSearchBox w-full">
            <form className="msearchContainer table">
              <label>
                <i className="icon-search"></i>
              </label>
              <input
                className="msearchInput text-[12px] border-none p-4 rounded-lg pl-[40px] w-96 bg-[#f2f2f2]"
                placeholder="Type here to search"
                type="text"
                autoComplete="off"
                value=""
              />
              <i className="icon-close-thin msearchClose absolute top-0 right-0 p-[10px] pr-[15px] text-[25px] font-black text-black"></i>
            </form>
          </span>
        </div>
      </div>
    );
  }
  
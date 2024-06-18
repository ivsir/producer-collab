import React from 'react';

const PlayButton = ({ onClick, children }) => {
  return (
    <button onClick={onClick}>{children}
    className="flex justify-center items-center w-16 bg-[#efefef] hover:bg-[#DDDDDD] rounded-[50%] border-none outline-none cursor-pointer pb-1">
    </button>
  );
}

export default PlayButton;
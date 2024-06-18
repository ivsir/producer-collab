// SkeletonLoader.jsx
import React from 'react';
import '../style/SkeletonLoader.css'; // Import your CSS for styling

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="animated-background"></div>
    </div>
  );
};

export default SkeletonLoader;

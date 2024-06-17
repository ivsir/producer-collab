import React, { useState } from 'react';
import Comments from '../accountBox/Comments';

const Modal = ({ project }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleJoin = (event, projectId) => {
    event.preventDefault();
    setSelectedProjectId(projectId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProjectId(null); // Clear selected project ID when modal closes
  };

  return (
    <div className="project-item">
      <button onClick={(event) => handleJoin(event, project._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Comment
      </button>
      {modalOpen && selectedProjectId === project._id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Comments</p>
                <button onClick={closeModal} className="modal-close cursor-pointer z-50">
                  <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path
                      d="M16.22 1.93l-1.15-1.14-6.07 6.07-6.07-6.07-1.15 1.14 6.07 6.07-6.07 6.07 1.15 1.15 6.07-6.07 6.07 6.07 1.15-1.15-6.07-6.07 6.07-6.07z"/>
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <Comments projectId={selectedProjectId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;

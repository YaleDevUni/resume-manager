import React from 'react';

const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  return (
    <div className="w-full flex flex-row justify-center gap-3">
      <button
        className={`w-10 ${
          currentPage === 1 ? 'cursor-not-allowed' : ' font-bold'
        }`}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        {'<<'}
      </button>

      <button
        className={`w-10 ${
          currentPage === 1 ? 'cursor-not-allowed' : ' font-bold'
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
      </button>

      {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
        const pageIndex = startPage + index;
        return (
          <button
            key={pageIndex}
            onClick={() => handlePageChange(pageIndex)}
            className={`w-4 ${
              pageIndex === currentPage ? 'text-white bg-black' : ''
            }`}
          >
            {pageIndex}
          </button>
        );
      })}

      <button
        className={`w-10 ${
          currentPage === totalPages ? 'cursor-not-allowed' : ' font-bold'
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {'>'}
      </button>

      <button
        className={`w-10 ${
          currentPage === totalPages ? 'cursor-not-allowed' : ' font-bold'
        }`}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {'>>'}
      </button>
    </div>
  );
};

export default Pagination;

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const showEllipses = totalPages > 8;
  const goToPage = (page) => {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <button
        className='px-3 py-1.5 rounded border border-slate-300 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700'
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {showEllipses && currentPage > 4 && (
        <>
          <button className='px-3 py-1.5 rounded border border-slate-300 text-sm dark:border-slate-700' onClick={() => goToPage(1)}>
            1
          </button>
          <span className='px-1 text-slate-500'>...</span>
        </>
      )}

      {range(
        Math.max(1, currentPage - 3),
        Math.min(totalPages, currentPage + 4)
      ).map((page) => (
        <button
          key={page}
          className={`px-3 py-1.5 rounded border text-sm ${
            page === currentPage
              ? "border-rose-600 bg-rose-600 text-white"
              : "border-slate-300 dark:border-slate-700"
          }`}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      ))}

      {showEllipses && currentPage < totalPages - 3 && (
        <>
          <span className='px-1 text-slate-500'>...</span>
          <button
            className='px-3 py-1.5 rounded border border-slate-300 text-sm dark:border-slate-700'
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className='px-3 py-1.5 rounded border border-slate-300 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700'
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

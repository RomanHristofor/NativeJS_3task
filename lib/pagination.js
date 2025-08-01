export function paginate(data, page, size) {
  const total = data.length;
  const totalPages = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;

  return {
    items: data.slice(start, end),
    totalPages,
    currentPage: page
  };
}

export function renderPagination({ currentPage, totalPages }) {
  const isBackDisabled = currentPage === 1 ? 'disabled' : '';
  const isNextDisabled = currentPage === totalPages ? 'disabled' : '';
  return `
    <div class="pagination">
      <button ${isBackDisabled} onclick="changePage(${currentPage - 1})">Back</button>
      <span>Страница ${currentPage} из ${totalPages}</span>
      <button ${isNextDisabled} onclick="changePage(${currentPage + 1})">Next</button>
    </div>
  `;
}

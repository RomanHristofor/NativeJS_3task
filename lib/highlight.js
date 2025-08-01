import { paginate } from './pagination.js';

export function highlightRows(data, currentPage, pageSize) {
  setTimeout(() => {
    const items = paginate(data, currentPage, pageSize).items;
    const highlightIds = items.slice(0, 3).map(item => item.id.toString());

    document.querySelectorAll("tr[data-id], .card[data-id]").forEach((el) => {
      el.classList.remove('highlight');
    });

    highlightIds.forEach((id) => {
      const el =
        document.querySelector(`tr[data-id="${id}"]`) ||
        document.querySelector(`.card[data-id="${id}"]`);
      if (el) {
        el.classList.add('highlight');
      }
    });
  }, 100);
}

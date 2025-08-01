const prevPositions = new Map();

export function saveElementPositions() {
  const rows = document.querySelectorAll("tbody tr");
  prevPositions.clear();

  rows.forEach((row, index) => {
    const rect = row.getBoundingClientRect();
    prevPositions.set(index, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  });
}

export function animateElementChanges() {
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach((row, index) => {
    const rect = row.getBoundingClientRect();
    const previous = prevPositions.get(index);

    if (previous) {
      const deltaX = previous.left - rect.left;
      const deltaY = previous.top - rect.top;

      row.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      row.style.transition = 'none';

      requestAnimationFrame(() => {
        row.style.transform = '';
        row.style.transition = 'transform 0.3s ease';
      });
    }
  });
}

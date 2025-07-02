// Наблюдатель за изменением DOM (например, для пагинации)
export function observePaginationContainer(callback) {
  const observer = new MutationObserver(() => {
    callback();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

// Слежение за изменением чекбокса пагинации и pageSize
export function observePaginationPlus(callback) {
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'pagination-checkbox') {
      setTimeout(callback, 100);
    }
    if (e.target && e.target.closest('#form_page_size')) {
      setTimeout(callback, 200);
    }
  });
  window.addEventListener('DOMContentLoaded', callback);
  window.addEventListener('popstate', callback);
} 
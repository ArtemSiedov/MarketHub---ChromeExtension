document.addEventListener('DOMContentLoaded', () => {
  const paginationCheckbox = document.getElementById('paginationPlus');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // Загрузка состояния чекбокса из chrome.storage
  chrome.storage.local.get(['paginationPlus'], (result) => {
    paginationCheckbox.checked = !!result.paginationPlus;
  });

  // Сохранить
  saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({ paginationPlus: paginationCheckbox.checked }, () => {
      window.close();
    });
  });

  // Отмена
  cancelBtn.addEventListener('click', () => {
    window.close();
  });
}); 
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

  // --- Управление ---
  const openProductsBtn = document.getElementById('openProductsBtn');
  const hotkeyInput = document.getElementById('hotkeyInput');
  const saveHotkeyBtn = document.getElementById('saveHotkeyBtn');
  const hotkeyStatus = document.getElementById('hotkeyStatus');

  // Загрузка хоткея
  chrome.storage.local.get(['productsHotkey'], (result) => {
    if (result.productsHotkey) {
      hotkeyInput.value = result.productsHotkey;
      hotkeyStatus.textContent = `Текущий хоткей: ${result.productsHotkey}`;
    }
  });

  // Сохранить хоткей
  saveHotkeyBtn.addEventListener('click', () => {
    const hotkey = hotkeyInput.value.trim();
    if (hotkey) {
      chrome.storage.local.set({ productsHotkey: hotkey }, () => {
        hotkeyStatus.textContent = `Текущий хоткей: ${hotkey}`;
      });
    }
  });

  // Открыть товары по кнопке
  openProductsBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'openProducts' });
    });
  });
}); 
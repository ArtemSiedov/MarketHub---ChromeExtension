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

  const selectProductHotkeyCheckbox = document.getElementById('selectProductHotkeyCheckbox');
  const selectProductHotkeyInput = document.getElementById('selectProductHotkeyInput');
  const saveSelectProductHotkeyBtn = document.getElementById('saveSelectProductHotkeyBtn');
  const selectProductHotkeyStatus = document.getElementById('selectProductHotkeyStatus');

  // Загрузка состояния хоткея выбора товара
  chrome.storage.local.get(['selectProductHotkeyEnabled', 'selectProductHotkey'], (result) => {
    selectProductHotkeyCheckbox.checked = !!result.selectProductHotkeyEnabled;
    if (result.selectProductHotkey) {
      selectProductHotkeyInput.value = result.selectProductHotkey;
      selectProductHotkeyStatus.textContent = `Текущий хоткей выбора: ${result.selectProductHotkey}`;
    }
  });

  selectProductHotkeyCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ selectProductHotkeyEnabled: selectProductHotkeyCheckbox.checked });
  });

  selectProductHotkeyInput.addEventListener('keydown', (e) => {
    e.preventDefault();
    const keys = [];
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.shiftKey) keys.push('Shift');
    if (e.altKey) keys.push('Alt');
    if (e.metaKey) keys.push('Meta');
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      keys.push(e.key.toUpperCase());
    }
    if (keys.length > 1) {
      selectProductHotkeyInput.value = keys.join('+');
    }
  });

  saveSelectProductHotkeyBtn.addEventListener('click', () => {
    const hotkey = selectProductHotkeyInput.value.trim();
    const enabled = selectProductHotkeyCheckbox.checked;
    if (hotkey) {
      chrome.storage.local.set({ selectProductHotkey: hotkey, selectProductHotkeyEnabled: enabled }, () => {
        selectProductHotkeyStatus.textContent = `Текущий хоткей выбора: ${hotkey}`;
      });
    }
  });
}); 
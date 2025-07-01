function createMarketHubModal() {
  try {
    if (!document.body) {
      alert('На этой странице расширения Chrome не работают!');
      return;
    }
    if (document.getElementById('market-hub-modal-overlay')) return;

    // Подключаем CSS только один раз
    if (!document.getElementById('market-hub-modal-css')) {
      const link = document.createElement('link');
      link.id = 'market-hub-modal-css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = chrome.runtime.getURL('content/market-hub-modal.css');
      document.head.appendChild(link);
    }

    // Создаём overlay
    const overlay = document.createElement('div');
    overlay.id = 'market-hub-modal-overlay';
    overlay.className = 'market-hub-modal-overlay';

    // Создаём модальное окно
    const modal = document.createElement('div');
    modal.className = 'market-hub-modal';

    // === БЛОК УПРАВЛЕНИЕ ===
    const managementBlock = document.createElement('div');
    managementBlock.className = 'market-hub-modal-block';
    managementBlock.innerHTML = `
        <div class="market-hub-modal-block-title">Управление</div>
        <label class="market-hub-checkbox-label">
            <input type="checkbox" id="quick-open-products-checkbox" class="market-hub-checkbox">
            <span>Открыть товары</span>
        </label>
        <div class="market-hub-hotkey-container" id="hotkey-container" style="display: none; margin-top: 12px;">
            <div class="market-hub-hotkey-label">Хоткей для открытия товаров:</div>
            <input type="text" id="hotkey-input" class="market-hub-hotkey-input" placeholder="Нажмите клавиши..." readonly>
            <div class="market-hub-hotkey-hint">Нажмите сочетание клавиш (например: Ctrl+Shift+O)</div>
        </div>
    `;
    modal.appendChild(managementBlock);
    // === КОНЕЦ БЛОКА УПРАВЛЕНИЕ ===

    // === БЛОК НАВИГАЦИЯ ===
    const navigationBlock = document.createElement('div');
    navigationBlock.className = 'market-hub-modal-block';
    navigationBlock.innerHTML = `
        <div class="market-hub-modal-block-title">Навигация</div>
        <label class="market-hub-checkbox-label">
            <input type="checkbox" id="pagination-checkbox" class="market-hub-checkbox">
            <span>Пагинация+</span>
        </label>
    `;
    modal.appendChild(navigationBlock);
    // === КОНЕЦ БЛОКА НАВИГАЦИЯ ===

    // Кнопки
    const actions = document.createElement('div');
    actions.className = 'market-hub-actions';
    actions.innerHTML = `
      <button class="market-hub-btn cancel">Отмена</button>
      <button class="market-hub-btn save">Сохранить</button>
    `;
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // === ПОСЛЕ добавления в DOM ищем элементы и вешаем обработчики ===
    // Загрузка состояния чекбоксов
    chrome.storage.local.get(['paginationPlus', 'quickOpenProducts', 'quickOpenHotkey'], (result) => {
      try {
        const paginationCheckbox = document.getElementById('pagination-checkbox');
        const quickOpenCheckbox = document.getElementById('quick-open-products-checkbox');
        const hotkeyContainer = document.getElementById('hotkey-container');
        const hotkeyInput = document.getElementById('hotkey-input');
        
        paginationCheckbox.checked = !!result.paginationPlus;
        quickOpenCheckbox.checked = !!result.quickOpenProducts;
        
        if (result.quickOpenHotkey) {
          hotkeyInput.value = result.quickOpenHotkey;
        }
        
        // Показать/скрыть контейнер хоткея
        if (quickOpenCheckbox.checked) {
          hotkeyContainer.style.display = 'block';
        }
      } catch (e) { console.error('MarketHub: ошибка при загрузке состояния чекбоксов', e); }
    });

    // Обработчик чекбокса "Открыть товары"
    const quickOpenCheckbox = document.getElementById('quick-open-products-checkbox');
    const hotkeyContainer = document.getElementById('hotkey-container');
    quickOpenCheckbox.addEventListener('change', () => {
      if (quickOpenCheckbox.checked) {
        hotkeyContainer.style.display = 'block';
      } else {
        hotkeyContainer.style.display = 'none';
      }
    });

    // Обработчик ввода хоткея
    const hotkeyInput = document.getElementById('hotkey-input');
    hotkeyInput.addEventListener('keydown', (e) => {
      e.preventDefault();
      const keys = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Meta');
      // Добавляем основную клавишу (если это не модификатор)
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        keys.push(e.key.toUpperCase());
      }
      if (keys.length > 1) { // Нужен хотя бы один модификатор + основная клавиша
        hotkeyInput.value = keys.join('+');
      }
    });

    // Сохранить
    const saveBtn = modal.querySelector('.market-hub-btn.save');
    saveBtn.addEventListener('click', () => {
      try {
        const settings = {
          paginationPlus: document.getElementById('pagination-checkbox').checked,
          quickOpenProducts: document.getElementById('quick-open-products-checkbox').checked,
          quickOpenHotkey: document.getElementById('hotkey-input').value
        };
        chrome.storage.local.set(settings, () => {
          removeMarketHubModal();
          enhancePaginationIfEnabled();
          setupQuickOpenProducts();
        });
      } catch (e) { console.error('MarketHub: ошибка при сохранении состояния', e); }
    });

    // Отмена
    const cancelBtn = modal.querySelector('.market-hub-btn.cancel');
    cancelBtn.addEventListener('click', () => {
      try { removeMarketHubModal(); } catch (e) { console.error('MarketHub: ошибка при закрытии модалки', e); }
    });

    // Клик вне модалки
    overlay.addEventListener('click', (e) => {
      try {
        if (e.target === overlay) {
          removeMarketHubModal();
        }
      } catch (e) { console.error('MarketHub: ошибка при клике вне модалки', e); }
    });
  } catch (e) {
    console.error('MarketHub: ошибка при создании модалки', e);
  }
}

function removeMarketHubModal() {
  try {
    const overlay = document.getElementById('market-hub-modal-overlay');
    if (overlay) overlay.remove();
  } catch (e) {
    console.error('MarketHub: ошибка при удалении модалки', e);
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  try {
    if (msg && msg.type === 'open_market_hub_modal') {
      createMarketHubModal();
    }
    if (msg && msg.type === 'close_market_hub_modal') {
      removeMarketHubModal();
    }
    if (msg && msg.action === 'openProducts') {
      openAllProducts();
    }
  } catch (e) {
    console.error('MarketHub: ошибка в обработчике сообщений', e);
  }
});

// === БЫСТРОЕ ОТКРЫТИЕ ТОВАРОВ ===
function setupQuickOpenProducts() {
  try {
    chrome.storage.local.get(['quickOpenProducts', 'quickOpenHotkey'], (result) => {
      try {
        if (!result.quickOpenProducts || !result.quickOpenHotkey) {
          // Удаляем старый обработчик если есть
          if (window.marketHubHotkeyHandler) {
            document.removeEventListener('keydown', window.marketHubHotkeyHandler);
            window.marketHubHotkeyHandler = null;
          }
          return;
        }

        // Парсим хоткей
        const hotkey = result.quickOpenHotkey;
        const keys = hotkey.split('+');
        
        // Удаляем старый обработчик если есть
        if (window.marketHubHotkeyHandler) {
          document.removeEventListener('keydown', window.marketHubHotkeyHandler);
        }

        // Создаем новый обработчик
        window.marketHubHotkeyHandler = (e) => {
          const pressedKeys = [];
          if (e.ctrlKey) pressedKeys.push('Ctrl');
          if (e.shiftKey) pressedKeys.push('Shift');
          if (e.altKey) pressedKeys.push('Alt');
          if (e.metaKey) pressedKeys.push('Meta');
          pressedKeys.push(e.key.toUpperCase());

          const pressedHotkey = pressedKeys.join('+');
          
          if (pressedHotkey === hotkey) {
            e.preventDefault();
            openAllProducts();
          }
        };

        document.addEventListener('keydown', window.marketHubHotkeyHandler);
      } catch (e) { console.error('MarketHub: ошибка в setupQuickOpenProducts (внутренняя)', e); }
    });
  } catch (e) {
    console.error('MarketHub: ошибка в setupQuickOpenProducts', e);
  }
}

function openAllProducts() {
  try {
    const productCells = document.querySelectorAll("#sync-sources-container > table > tbody > tr > td:nth-child(3) > div > a");
    if (productCells.length === 0) {
      console.log('MarketHub: товары не найдены на странице');
      return;
    }
    console.log(`MarketHub: найдено ${productCells.length} товаров, открываем...`);
    productCells.forEach((cell, index) => {
          window.open(cell.href, '_blank');
    });
  } catch (e) {
    console.error('MarketHub: ошибка при открытии товаров', e);
  }
}

// === ПАГИНАЦИЯ+ ===
function enhancePaginationIfEnabled() {
  try {
    chrome.storage.local.get(['paginationPlus'], (result) => {
      try {
        if (!result.paginationPlus) return;
        const paginationContainer = document.querySelector('#sync-sources > ul, body > div:nth-child(2) > div:nth-child(1) > section > div:nth-child(16) > div > ul.pagination');
        if (!paginationContainer) return;

        // Получить количество товаров
        const totalCountElem = document.querySelector('#items_summary_container > div.summary_container_content > div:nth-child(1) > strong.summary_total_count');
        const pageSizeSelect = document.querySelector('#form_page_size > select');
        let pageSize = 10;
        if (pageSizeSelect) {
          const selectedOption = pageSizeSelect.querySelector('option[selected]');
          if (selectedOption) pageSize = parseInt(selectedOption.value, 10);
          else if (pageSizeSelect.value) pageSize = parseInt(pageSizeSelect.value, 10);
        }
        let totalCount = 0;
        if (totalCountElem) totalCount = parseInt(totalCountElem.textContent.replace(/\D/g, ''), 10);
        const lastPage = pageSize && totalCount ? Math.ceil(totalCount / pageSize) : null;

        // --- Кнопка первой страницы ---
        let firstLi = paginationContainer.querySelector('.market-hub-first-page');
        if (!firstLi && lastPage && paginationContainer.querySelectorAll('li').length > 0) {
          firstLi = document.createElement('li');
          firstLi.className = 'market-hub-first-page';
          const firstLinkBtn = document.createElement('a');
          firstLinkBtn.href = '#';
          firstLinkBtn.textContent = '«««';
          firstLinkBtn.style.marginRight = '1px';
          firstLinkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const firstLink = paginationContainer.querySelector('a[data-page]');
            if (firstLink) {
              let url = new URL(firstLink.href, window.location.origin);
              url.searchParams.set('page', 1);
              window.location.href = url.toString();
            }
          });
          firstLi.appendChild(firstLinkBtn);
          // Вставляем в начало списка
          paginationContainer.insertBefore(firstLi, paginationContainer.firstChild);
        }

        // --- Кнопка последней страницы ---
        let lastLi = paginationContainer.querySelector('.market-hub-last-page');
        if (!lastLi && lastPage && paginationContainer.querySelectorAll('li').length > 0) {
          lastLi = document.createElement('li');
          lastLi.className = 'market-hub-last-page';
          const lastLink = document.createElement('a');
          lastLink.href = '#';
          lastLink.textContent = '»»»';
          lastLink.style.marginLeft = '1px';
          lastLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Получаем актуальный pageSize и totalCount прямо перед переходом
            const pageSizeSelect = document.querySelector('#form_page_size > select');
            let pageSize = 10;
            if (pageSizeSelect) {
              const selectedOption = pageSizeSelect.querySelector('option[selected]');
              if (selectedOption) pageSize = parseInt(selectedOption.value, 10);
              else if (pageSizeSelect.value) pageSize = parseInt(pageSizeSelect.value, 10);
            }
            const totalCountElem = document.querySelector('#items_summary_container > div.summary_container_content > div:nth-child(1) > strong.summary_total_count');
            let totalCount = 0;
            if (totalCountElem) totalCount = parseInt(totalCountElem.textContent.replace(/\D/g, ''), 10);
            const lastPage = pageSize && totalCount ? Math.ceil(totalCount / pageSize) : 1;
            // Берём первую ссылку для baseUrl, но page подставляем вручную
            const firstLink = paginationContainer.querySelector('a[data-page]');
            if (firstLink) {
              let url = new URL(firstLink.href, window.location.origin);
              url.searchParams.set('page', lastPage);
              window.location.href = url.toString();
            }
          });
          lastLi.appendChild(lastLink);
          paginationContainer.appendChild(lastLi);
        }

        // --- Бокс для ввода номера страницы ---
        let gotoLi = paginationContainer.querySelector('.market-hub-goto-page');
        let gotoInput, hintDiv;
        if (!gotoLi) {
          gotoLi = document.createElement('li');
          gotoLi.className = 'market-hub-goto-page';
          // Только input, без кнопки
          gotoInput = document.createElement('input');
          gotoInput.type = 'number';
          gotoInput.min = 1;
          gotoInput.max = lastPage || 9999;
          gotoInput.placeholder = '№';
          gotoInput.style.width = '72px';
          gotoInput.style.height = '35px';
          gotoInput.style.padding = '0 6px';
          gotoInput.style.borderRadius = '4px';
          gotoInput.style.border = '1px solid #ccc';
          gotoInput.style.fontSize = '16px';
          gotoInput.style.textAlign = 'center';
          gotoInput.style.margin = '0 4px';
          gotoInput.style.boxSizing = 'border-box';
          gotoInput.addEventListener('input', () => {
            gotoInput.style.borderColor = '#ccc';
            if (hintDiv) hintDiv.style.display = 'none';
          });
          // Подсказка
          hintDiv = document.createElement('div');
          hintDiv.style.display = 'none';
          hintDiv.style.position = 'absolute';
          hintDiv.style.background = '#fff';
          hintDiv.style.color = '#d32f2f';
          hintDiv.style.fontSize = '13px';
          hintDiv.style.padding = '2px 8px';
          hintDiv.style.borderRadius = '4px';
          hintDiv.style.boxShadow = '0 2px 8px rgba(60,60,120,0.08)';
          hintDiv.style.width = '';
          hintDiv.style.minWidth = '0';
          hintDiv.style.maxWidth = '100vw';
          hintDiv.style.margin = '6px auto 0 auto';
          hintDiv.textContent = '';
          gotoLi.style.position = 'relative';
          // Переход по Enter или blur
          function goToPage() {
            const val = parseInt(gotoInput.value, 10);
            if (!val || !lastPage || val < 1 || val > lastPage) {
              gotoInput.style.borderColor = 'red';
              hintDiv.textContent = `Всего страниц: ${lastPage}`;
              hintDiv.style.display = 'block';
              return;
            }
            hintDiv.style.display = 'none';
            const firstLink = paginationContainer.querySelector('a[data-page]');
            if (firstLink) {
              let url = new URL(firstLink.href, window.location.origin);
              url.searchParams.set('page', val);
              window.location.href = url.toString();
            }
          }
          gotoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              goToPage();
            }
          });
          gotoInput.addEventListener('blur', goToPage);
          gotoLi.appendChild(gotoInput);
          gotoLi.appendChild(hintDiv);
          paginationContainer.appendChild(gotoLi);
        } else {
          gotoInput = gotoLi.querySelector('input[type="number"]');
          hintDiv = gotoLi.querySelector('div');
          if (gotoInput) {
            gotoInput.max = lastPage || 9999;
          }
        }
      } catch (e) { console.error('MarketHub: ошибка в enhancePaginationIfEnabled (внутренняя)', e); }
    });
  } catch (e) {
    console.error('MarketHub: ошибка в enhancePaginationIfEnabled', e);
  }
}

// Следить за изменением чекбокса и pageSize
function observePaginationPlus() {
  // При изменении чекбокса
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'pagination-checkbox') {
      setTimeout(enhancePaginationIfEnabled, 100);
    }
    if (e.target && e.target.closest('#form_page_size')) {
      setTimeout(enhancePaginationIfEnabled, 200);
    }
  });
  // При загрузке страницы
  window.addEventListener('DOMContentLoaded', enhancePaginationIfEnabled);
  // При переходах SPA
  window.addEventListener('popstate', enhancePaginationIfEnabled);
}

function observePaginationContainer() {
  const observer = new MutationObserver(() => {
    enhancePaginationIfEnabled();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Инициализация
observePaginationContainer();
observePaginationPlus();

// Инициализация быстрого открытия товаров
window.addEventListener('DOMContentLoaded', setupQuickOpenProducts);
setupQuickOpenProducts();

// === ГЛОБАЛЬНЫЙ ХОТКЕЙ ДЛЯ ОТКРЫТИЯ ТОВАРОВ ===
(function setupProductsHotkey() {
  let lastHotkey = null;
  let handler = null;

  function parseHotkey(hotkeyStr) {
    if (!hotkeyStr) return null;
    return hotkeyStr.toLowerCase().split('+').map(k => k.trim());
  }

  function matchHotkey(e, hotkeyArr) {
    if (!hotkeyArr || !hotkeyArr.length) return false;
    const key = e.key.toLowerCase();
    const mods = [];
    if (e.ctrlKey) mods.push('ctrl');
    if (e.shiftKey) mods.push('shift');
    if (e.altKey) mods.push('alt');
    if (e.metaKey) mods.push('meta');
    // Последний элемент — основная клавиша
    const mainKey = hotkeyArr[hotkeyArr.length - 1];
    const hotkeyMods = hotkeyArr.slice(0, -1);
    return key === mainKey && mods.length === hotkeyMods.length && mods.every(m => hotkeyMods.includes(m));
  }

  function updateHotkeyListener(hotkeyStr) {
    if (handler) {
      document.removeEventListener('keydown', handler);
      handler = null;
    }
    if (!hotkeyStr) return;
    const hotkeyArr = parseHotkey(hotkeyStr);
    handler = function(e) {
      if (matchHotkey(e, hotkeyArr)) {
        e.preventDefault();
        openAllProducts();
      }
    };
    document.addEventListener('keydown', handler);
  }

  // Инициализация и слежение за изменением хоткея
  chrome.storage.local.get(['productsHotkey'], (result) => {
    lastHotkey = result.productsHotkey || null;
    updateHotkeyListener(lastHotkey);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.productsHotkey) {
      lastHotkey = changes.productsHotkey.newValue;
      updateHotkeyListener(lastHotkey);
    }
  });
})();
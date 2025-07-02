/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./content/hotkey.js":
/*!***************************!*\
  !*** ./content/hotkey.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Hotkey: () => (/* binding */ Hotkey)
/* harmony export */ });
class Hotkey {
  constructor(key) {
    this.key = key;
    this.enabled = true;
  }
  matches(e) {
    return e.key === this.key;
  }
  setKey(key) {
    this.key = key;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
}

/***/ }),

/***/ "./content/modal.js":
/*!**************************!*\
  !*** ./content/modal.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModalManager: () => (/* binding */ ModalManager)
/* harmony export */ });
/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage.js */ "./content/storage.js");

class ModalManager {
  constructor(options = {}) {
    this.options = options;
    this.overlay = null;
    this.modal = null;
  }
  create() {
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
    managementBlock.className = 'market-hub-modal-block market-hub-modal-block-inline';
    managementBlock.innerHTML = `
      <div class="market-hub-modal-block-title" style="font-size:16px; margin-bottom:14px;">Управление</div>
      <div class="market-hub-inline-row">
        <div class="market-hub-inline-block">
          <div class="market-hub-modal-block-title">Открыть товары</div>
          <input type="text" id="hotkey-input" class="market-hub-hotkey-input-inline" placeholder="Клавиша..." readonly>
        </div>
        <div class="market-hub-inline-block">
          <div class="market-hub-modal-block-title">Выбор товара</div>
          <input type="text" id="select-product-hotkey-input" class="market-hub-hotkey-input-inline" placeholder="Клавиша..." readonly>
          <div class="market-hub-hotkey-hint">+ Mouse click</div>
        </div>
      </div>
    `;
    modal.appendChild(managementBlock);
    // === КОНЕЦ БЛОКА УПРАВЛЕНИЕ ===

    // === БЛОК НАВИГАЦИЯ ===
    const navigationBlock = document.createElement('div');
    navigationBlock.className = 'market-hub-modal-block market-hub-modal-block-inline';
    navigationBlock.innerHTML = `
      <div class="market-hub-modal-block-title" style="font-size:16px; margin-bottom:14px;">Навигация</div>
      <div class="market-hub-inline-row">
        <div class="market-hub-inline-block">
          <div class="market-hub-modal-block-title">Пагинация+</div>
          <label class="market-hub-checkbox-label-inline">
            <input type="checkbox" id="pagination-checkbox" class="market-hub-checkbox">
            <span>Вкл.</span>
          </label>
        </div>
      </div>
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
    this.overlay = overlay;
    this.modal = modal;

    // === ПОСЛЕ добавления в DOM ищем элементы и вешаем обработчики ===
    (0,_storage_js__WEBPACK_IMPORTED_MODULE_0__.getSettings)(['paginationPlus', 'quickOpenHotkey', 'selectProductHotkey']).then(result => {
      try {
        const paginationCheckbox = document.getElementById('pagination-checkbox');
        const hotkeyInput = document.getElementById('hotkey-input');
        const selectProductHotkeyInput = document.getElementById('select-product-hotkey-input');
        paginationCheckbox.checked = !!result.paginationPlus;
        if (result.quickOpenHotkey) {
          hotkeyInput.value = result.quickOpenHotkey;
        }
        if (result.selectProductHotkey) {
          selectProductHotkeyInput.value = result.selectProductHotkey;
        }
      } catch (e) {
        console.error('MarketHub: ошибка при загрузке состояния', e);
      }
    });

    // Обработчик ввода хоткея для открытия товаров
    const hotkeyInput = document.getElementById('hotkey-input');
    hotkeyInput.addEventListener('keydown', e => {
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
        hotkeyInput.value = keys.join('+');
      }
    });

    // Обработчик ввода хоткея для выбора товара
    const selectProductHotkeyInput = document.getElementById('select-product-hotkey-input');
    selectProductHotkeyInput.addEventListener('keydown', e => {
      e.preventDefault();
      selectProductHotkeyInput.value = e.key;
    });

    // Сохранить
    const saveBtn = modal.querySelector('.market-hub-btn.save');
    saveBtn.addEventListener('click', () => {
      try {
        const settings = {
          paginationPlus: document.getElementById('pagination-checkbox').checked,
          quickOpenHotkey: document.getElementById('hotkey-input').value,
          selectProductHotkey: document.getElementById('select-product-hotkey-input').value
        };
        (0,_storage_js__WEBPACK_IMPORTED_MODULE_0__.setSettings)(settings).then(() => {
          this.remove();
          if (this.options.onSave) this.options.onSave(settings);
        });
      } catch (e) {
        console.error('MarketHub: ошибка при сохранении состояния', e);
      }
    });

    // Отмена
    const cancelBtn = modal.querySelector('.market-hub-btn.cancel');
    cancelBtn.addEventListener('click', () => {
      try {
        this.remove();
      } catch (e) {
        console.error('MarketHub: ошибка при закрытии модалки', e);
      }
    });

    // Клик вне модалки
    overlay.addEventListener('click', e => {
      try {
        if (e.target === overlay) {
          this.remove();
        }
      } catch (e) {
        console.error('MarketHub: ошибка при клике вне модалки', e);
      }
    });
  }
  remove() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.modal = null;
    }
  }
  update(options = {}) {
    this.options = {
      ...this.options,
      ...options
    };
    // Перерисовать UI, если нужно
  }

  // Можно добавить методы для загрузки/сохранения настроек, обновления UI и т.д.
}

/***/ }),

/***/ "./content/pagination.js":
/*!*******************************!*\
  !*** ./content/pagination.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enhancePaginationIfEnabled: () => (/* binding */ enhancePaginationIfEnabled),
/* harmony export */   initPagination: () => (/* binding */ initPagination),
/* harmony export */   observePaginationContainer: () => (/* binding */ observePaginationContainer),
/* harmony export */   observePaginationPlus: () => (/* binding */ observePaginationPlus)
/* harmony export */ });
function enhancePaginationIfEnabled() {
  console.log('enhancePaginationIfEnabled called');
  chrome.storage.local.get(['paginationPlus'], result => {
    console.log('paginationPlus storage:', result);
    if (!result.paginationPlus) return;
    try {
      const paginationContainer = document.querySelector('#sync-sources > ul, body > div:nth-child(2) > div:nth-child(1) > section > div:nth-child(16) > div > ul.pagination');
      if (!paginationContainer) {
        console.log('paginationContainer not found');
        return;
      }
      console.log('paginationContainer found, adding UI');
      // Получить количество товаров
      const totalCountElem = document.querySelector('#items_summary_container > div.summary_container_content > div:nth-child(1) > strong.summary_total_count');
      const pageSizeSelect = document.querySelector('#form_page_size > select');
      let pageSize = 10;
      if (pageSizeSelect) {
        const selectedOption = pageSizeSelect.querySelector('option[selected]');
        if (selectedOption) pageSize = parseInt(selectedOption.value, 10);else if (pageSizeSelect.value) pageSize = parseInt(pageSizeSelect.value, 10);
      }
      let totalCount = 0;
      if (totalCountElem) totalCount = parseInt(totalCountElem.textContent.replace(/\D/g, ''), 10);
      const lastPage = pageSize && totalCount ? Math.ceil(totalCount / pageSize) : null;
      const liCount = paginationContainer.querySelectorAll('li').length;
      console.log('lastPage:', lastPage, 'li count:', liCount);

      // --- Кнопка первой страницы ---
      let firstLi = paginationContainer.querySelector('.market-hub-first-page');
      if (!firstLi && lastPage && liCount > 0) {
        firstLi = document.createElement('li');
        firstLi.className = 'market-hub-first-page';
        const firstLinkBtn = document.createElement('a');
        firstLinkBtn.href = '#';
        firstLinkBtn.textContent = '«««';
        firstLinkBtn.style.marginRight = '1px';
        firstLinkBtn.addEventListener('click', e => {
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
        console.log('Добавляю первую страницу:', firstLi);
        paginationContainer.insertBefore(firstLi, paginationContainer.firstChild);
      }

      // --- Кнопка последней страницы ---
      let lastLi = paginationContainer.querySelector('.market-hub-last-page');
      if (!lastLi && lastPage && liCount > 0) {
        lastLi = document.createElement('li');
        lastLi.className = 'market-hub-last-page';
        const lastLink = document.createElement('a');
        lastLink.href = '#';
        lastLink.textContent = '»»»';
        lastLink.style.marginLeft = '1px';
        lastLink.addEventListener('click', e => {
          e.preventDefault();
          // Получаем актуальный pageSize и totalCount прямо перед переходом
          const pageSizeSelect = document.querySelector('#form_page_size > select');
          let pageSize = 10;
          if (pageSizeSelect) {
            const selectedOption = pageSizeSelect.querySelector('option[selected]');
            if (selectedOption) pageSize = parseInt(selectedOption.value, 10);else if (pageSizeSelect.value) pageSize = parseInt(pageSizeSelect.value, 10);
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
        console.log('Добавляю последнюю страницу:', lastLi);
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
        gotoInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            goToPage();
          }
        });
        gotoInput.addEventListener('blur', goToPage);
        gotoLi.appendChild(gotoInput);
        gotoLi.appendChild(hintDiv);
        console.log('Добавляю input для перехода:', gotoLi);
        paginationContainer.appendChild(gotoLi);
      } else {
        gotoInput = gotoLi.querySelector('input[type="number"]');
        hintDiv = gotoLi.querySelector('div');
        if (gotoInput) {
          gotoInput.max = lastPage || 9999;
        }
      }
    } catch (e) {
      console.error('MarketHub: ошибка в enhancePaginationIfEnabled (внутренняя)', e);
    }
  });
}
function observePaginationPlus() {
  document.addEventListener('change', e => {
    if (e.target && e.target.id === 'pagination-checkbox') {
      setTimeout(enhancePaginationIfEnabled, 100);
    }
    if (e.target && e.target.closest('#form_page_size')) {
      setTimeout(enhancePaginationIfEnabled, 200);
    }
  });
  window.addEventListener('DOMContentLoaded', enhancePaginationIfEnabled);
  window.addEventListener('popstate', enhancePaginationIfEnabled);
}
function observePaginationContainer() {
  const observer = new MutationObserver(() => {
    enhancePaginationIfEnabled();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
function initPagination() {
  observePaginationContainer();
  observePaginationPlus();
}

/***/ }),

/***/ "./content/quick-open.js":
/*!*******************************!*\
  !*** ./content/quick-open.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   openAllProducts: () => (/* binding */ openAllProducts),
/* harmony export */   setupQuickOpenProducts: () => (/* binding */ setupQuickOpenProducts)
/* harmony export */ });
function setupQuickOpenProducts() {
  console.log('setupQuickOpenProducts called');
  chrome.storage.local.get(['quickOpenHotkey'], result => {
    console.log('quickOpen storage:', result);
    if (!result.quickOpenHotkey) {
      document.removeEventListener('keydown', handleQuickOpenHotkey);
      return;
    }
    function handleQuickOpenHotkey(e) {
      const keys = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Meta');
      keys.push(e.key.toUpperCase());
      if (keys.join('+') === result.quickOpenHotkey) {
        e.preventDefault();
        openAllProducts();
      }
    }
    document.removeEventListener('keydown', handleQuickOpenHotkey);
    document.addEventListener('keydown', handleQuickOpenHotkey);
  });
}
function openAllProducts() {
  try {
    const productCells = document.querySelectorAll("#sync-sources-container > table > tbody > tr > td:nth-child(3) > div > a");
    if (productCells.length === 0) {
      console.log('MarketHub: товары не найдены на странице');
      return;
    }
    console.log(`MarketHub: найдено ${productCells.length} товаров, открываем...`);
    productCells.forEach(cell => {
      window.open(cell.href, '_blank');
    });
  } catch (e) {
    console.error('MarketHub: ошибка при открытии товаров', e);
  }
}

/***/ }),

/***/ "./content/select-product.js":
/*!***********************************!*\
  !*** ./content/select-product.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectProductHotkey: () => (/* binding */ SelectProductHotkey),
/* harmony export */   setupSelectProductHotkey: () => (/* binding */ setupSelectProductHotkey)
/* harmony export */ });
/* harmony import */ var _hotkey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hotkey.js */ "./content/hotkey.js");

let selectProductHotkeyPressed = false;
let selectProductHotkey = null;
function setupSelectProductHotkey() {
  console.log('setupSelectProductHotkey called');
  try {
    chrome.storage.local.get(['selectProductHotkey'], result => {
      console.log('selectProductHotkey storage:', result);
      try {
        if (!result.selectProductHotkey) {
          if (window.marketHubSelectProductHotkeyKeyHandler) {
            document.removeEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
            document.removeEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);
            window.marketHubSelectProductHotkeyKeyHandler = null;
          }
          if (window.marketHubSelectProductHotkeyMouseHandler) {
            document.removeEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler);
            window.marketHubSelectProductHotkeyMouseHandler = null;
          }
          return;
        }
        selectProductHotkey = result.selectProductHotkey;

        // Клавиша
        window.marketHubSelectProductHotkeyKeyHandler = e => {
          if (e.key && e.key === selectProductHotkey) {
            if (e.type === 'keydown') selectProductHotkeyPressed = true;
            if (e.type === 'keyup') selectProductHotkeyPressed = false;
          }
        };
        document.addEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
        document.addEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);

        // Клик мышкой по строке товара
        window.marketHubSelectProductHotkeyMouseHandler = e => {
          // Разрешаем выбор только если зажата клавиша
          if (!selectProductHotkeyPressed) return;
          const tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
          if (tr) {
            e.preventDefault();
            const dataKey = tr.getAttribute('data-key');
            // Пробуем найти чекбокс внутри строки
            let checkbox = tr.querySelector('input[type="checkbox"]');
            // Если не нашли, ищем по data-key в строке sync-sources
            if (!checkbox && dataKey) {
              checkbox = document.querySelector(`tr.sync-sources[data-key="${dataKey}"] input[type="checkbox"]`);
            }
            if (checkbox) checkbox.click();
          }
        };
        document.addEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler, true);
      } catch (e) {
        console.error('MarketHub: ошибка в setupSelectProductHotkey (внутренняя)', e);
      }
    });
  } catch (e) {
    console.error('MarketHub: ошибка в setupSelectProductHotkey', e);
  }
}
class SelectProductHotkey extends _hotkey_js__WEBPACK_IMPORTED_MODULE_0__.Hotkey {
  constructor(key) {
    super(key);
    this.pressed = false;
    this._keyHandler = this._handleKey.bind(this);
    this._mouseHandler = this._handleMouse.bind(this);
  }
  _handleKey(e) {
    if (e.key === this.key) {
      this.pressed = e.type === 'keydown';
    }
  }
  _handleMouse(e) {
    if (!this.enabled) return;
    if (this.pressed) {
      // Реальная логика выбора товара по клику
      const tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
      if (tr) {
        e.preventDefault();
        const dataKey = tr.getAttribute('data-key');
        // Пробуем найти чекбокс внутри строки
        let checkbox = tr.querySelector('input[type="checkbox"]');
        // Если не нашли, ищем по data-key в строке sync-sources
        if (!checkbox && dataKey) {
          checkbox = document.querySelector(`tr.sync-sources[data-key="${dataKey}"] input[type="checkbox"]`);
        }
        if (checkbox) checkbox.click();
      }
    }
  }
  listen() {
    document.addEventListener('keydown', this._keyHandler);
    document.addEventListener('keyup', this._keyHandler);
    document.addEventListener('mousedown', this._mouseHandler);
  }
  unlisten() {
    document.removeEventListener('keydown', this._keyHandler);
    document.removeEventListener('keyup', this._keyHandler);
    document.removeEventListener('mousedown', this._mouseHandler);
  }
  static setupFromStorage() {
    chrome.storage.local.get(['selectProductHotkeyEnabled', 'selectProductHotkey'], result => {
      if (!result.selectProductHotkeyEnabled || !result.selectProductHotkey) {
        if (window.marketHubSelectProductHotkeyKeyHandler) {
          document.removeEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
          document.removeEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);
          window.marketHubSelectProductHotkeyKeyHandler = null;
        }
        if (window.marketHubSelectProductHotkeyMouseHandler) {
          document.removeEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler);
          window.marketHubSelectProductHotkeyMouseHandler = null;
        }
        return;
      }
      const selectProductHotkey = result.selectProductHotkey;
      let selectProductHotkeyPressed = false;
      window.marketHubSelectProductHotkeyKeyHandler = e => {
        if (e.key && e.key === selectProductHotkey) {
          if (e.type === 'keydown') selectProductHotkeyPressed = true;
          if (e.type === 'keyup') selectProductHotkeyPressed = false;
        }
      };
      document.addEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
      document.addEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);
      window.marketHubSelectProductHotkeyMouseHandler = e => {
        if (!selectProductHotkeyPressed) return;
        const tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
        if (tr) {
          e.preventDefault();
          const dataKey = tr.getAttribute('data-key');
          let checkbox = tr.querySelector('input[type="checkbox"]');
          if (!checkbox && dataKey) {
            checkbox = document.querySelector(`tr.sync-sources[data-key="${dataKey}"] input[type="checkbox"]`);
          }
          if (checkbox) checkbox.click();
        }
      };
      document.addEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler);
    });
  }
}

/***/ }),

/***/ "./content/storage.js":
/*!****************************!*\
  !*** ./content/storage.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSettings: () => (/* binding */ getSettings),
/* harmony export */   onSettingsChanged: () => (/* binding */ onSettingsChanged),
/* harmony export */   setSettings: () => (/* binding */ setSettings)
/* harmony export */ });
function getSettings(keys) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(keys, result => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
function setSettings(settings) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(settings, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
function onSettingsChanged(listener) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      listener(changes);
    }
  });
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./content/main.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _quick_open_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./quick-open.js */ "./content/quick-open.js");
/* harmony import */ var _pagination_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pagination.js */ "./content/pagination.js");
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal.js */ "./content/modal.js");
/* harmony import */ var _select_product_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./select-product.js */ "./content/select-product.js");
console.log('MARKETHUB BUNDLE LOADED');




function reinitAll() {
  (0,_quick_open_js__WEBPACK_IMPORTED_MODULE_0__.setupQuickOpenProducts)();
  (0,_pagination_js__WEBPACK_IMPORTED_MODULE_1__.enhancePaginationIfEnabled)();
  (0,_select_product_js__WEBPACK_IMPORTED_MODULE_3__.setupSelectProductHotkey)();
}

// Инициализация при старте
(0,_quick_open_js__WEBPACK_IMPORTED_MODULE_0__.setupQuickOpenProducts)();
(0,_pagination_js__WEBPACK_IMPORTED_MODULE_1__.enhancePaginationIfEnabled)();
(0,_pagination_js__WEBPACK_IMPORTED_MODULE_1__.observePaginationPlus)();
(0,_pagination_js__WEBPACK_IMPORTED_MODULE_1__.observePaginationContainer)();
(0,_select_product_js__WEBPACK_IMPORTED_MODULE_3__.setupSelectProductHotkey)();
const modalManager = new _modal_js__WEBPACK_IMPORTED_MODULE_2__.ModalManager({
  onSave: () => {
    reinitAll();
  }
});

// --- Логика открытия всех товаров ---
function openAllProducts() {
  // Ваша логика открытия всех товаров
  console.log('Открыть все товары!');
}

// --- Логика выбора товара по клику ---
function selectProductByClick(e) {
  // Ваша логика выбора товара по клику
  console.log('Выбрать товар по клику!', e);
}

// --- Инициализация пагинации ---
// const paginationManager = new PaginationManager();
// paginationManager.enable(); // включить при необходимости

// Глобальный обработчик сообщений для открытия/закрытия модалки
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'open_market_hub_modal') {
    modalManager.create();
  }
  if (msg && msg.type === 'close_market_hub_modal') {
    modalManager.remove();
  }
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
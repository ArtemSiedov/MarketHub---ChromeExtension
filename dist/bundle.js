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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Hotkey = /*#__PURE__*/function () {
  function Hotkey(key) {
    _classCallCheck(this, Hotkey);
    this.key = key;
    this.enabled = true;
  }
  return _createClass(Hotkey, [{
    key: "matches",
    value: function matches(e) {
      return e.key === this.key;
    }
  }, {
    key: "setKey",
    value: function setKey(key) {
      this.key = key;
    }
  }, {
    key: "enable",
    value: function enable() {
      this.enabled = true;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.enabled = false;
    }
  }]);
}();

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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var ModalManager = /*#__PURE__*/function () {
  function ModalManager() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, ModalManager);
    this.options = options;
    this.overlay = null;
    this.modal = null;
  }
  return _createClass(ModalManager, [{
    key: "create",
    value: function create() {
      var _this = this;
      if (!document.body) {
        alert('На этой странице расширения Chrome не работают!');
        return;
      }
      if (document.getElementById('market-hub-modal-overlay')) return;

      // Подключаем CSS только один раз
      if (!document.getElementById('market-hub-modal-css')) {
        var link = document.createElement('link');
        link.id = 'market-hub-modal-css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL('content/market-hub-modal.css');
        document.head.appendChild(link);
      }

      // Создаём overlay
      var overlay = document.createElement('div');
      overlay.id = 'market-hub-modal-overlay';
      overlay.className = 'market-hub-modal-overlay';

      // Создаём модальное окно
      var modal = document.createElement('div');
      modal.className = 'market-hub-modal';

      // === БЛОК УПРАВЛЕНИЕ ===
      var managementBlock = document.createElement('div');
      managementBlock.className = 'market-hub-modal-block market-hub-modal-block-inline';
      managementBlock.innerHTML = "\n      <div class=\"market-hub-modal-block-title\" style=\"font-size:16px; margin-bottom:14px;\">\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435</div>\n      <div class=\"market-hub-inline-row\">\n        <div class=\"market-hub-inline-block\">\n          <div class=\"market-hub-modal-block-title\">\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0442\u043E\u0432\u0430\u0440\u044B</div>\n          <input type=\"text\" id=\"hotkey-input\" class=\"market-hub-hotkey-input-inline\" placeholder=\"\u041A\u043B\u0430\u0432\u0438\u0448\u0430...\" readonly>\n        </div>\n        <div class=\"market-hub-inline-block\">\n          <div class=\"market-hub-modal-block-title\">\u0412\u044B\u0431\u043E\u0440 \u0442\u043E\u0432\u0430\u0440\u0430</div>\n          <input type=\"text\" id=\"select-product-hotkey-input\" class=\"market-hub-hotkey-input-inline\" placeholder=\"\u041A\u043B\u0430\u0432\u0438\u0448\u0430...\" readonly>\n        </div>\n      </div>\n    ";
      modal.appendChild(managementBlock);
      // === КОНЕЦ БЛОКА УПРАВЛЕНИЕ ===

      // === БЛОК НАВИГАЦИЯ ===
      var navigationBlock = document.createElement('div');
      navigationBlock.className = 'market-hub-modal-block market-hub-modal-block-inline';
      navigationBlock.innerHTML = "\n      <div class=\"market-hub-modal-block-title\" style=\"font-size:16px; margin-bottom:14px;\">\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F</div>\n      <div class=\"market-hub-inline-row\">\n        <div class=\"market-hub-inline-block\">\n          <div class=\"market-hub-modal-block-title\">\u041F\u0430\u0433\u0438\u043D\u0430\u0446\u0438\u044F+</div>\n          <label class=\"market-hub-checkbox-label-inline\">\n            <input type=\"checkbox\" id=\"pagination-checkbox\" class=\"market-hub-checkbox\">\n            <span>\u0412\u043A\u043B.</span>\n          </label>\n        </div>\n      </div>\n    ";
      modal.appendChild(navigationBlock);
      // === КОНЕЦ БЛОКА НАВИГАЦИЯ ===

      // Кнопки
      var actions = document.createElement('div');
      actions.className = 'market-hub-actions';
      actions.innerHTML = "\n      <button class=\"market-hub-btn cancel\">\u041E\u0442\u043C\u0435\u043D\u0430</button>\n      <button class=\"market-hub-btn save\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n    ";
      modal.appendChild(actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      this.overlay = overlay;
      this.modal = modal;

      // === ПОСЛЕ добавления в DOM ищем элементы и вешаем обработчики ===
      (0,_storage_js__WEBPACK_IMPORTED_MODULE_0__.getSettings)(['paginationPlus', 'quickOpenHotkey', 'selectProductHotkey']).then(function (result) {
        try {
          var paginationCheckbox = document.getElementById('pagination-checkbox');
          var _hotkeyInput = document.getElementById('hotkey-input');
          var _selectProductHotkeyInput = document.getElementById('select-product-hotkey-input');
          paginationCheckbox.checked = !!result.paginationPlus;
          if (result.quickOpenHotkey) {
            _hotkeyInput.value = result.quickOpenHotkey;
          }
          if (result.selectProductHotkey) {
            _selectProductHotkeyInput.value = result.selectProductHotkey;
          }
        } catch (e) {
          console.error('MarketHub: ошибка при загрузке состояния', e);
        }
      });

      // Обработчик ввода хоткея для открытия товаров
      var hotkeyInput = document.getElementById('hotkey-input');
      hotkeyInput.addEventListener('keydown', function (e) {
        e.preventDefault();
        var keys = [];
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
      var selectProductHotkeyInput = document.getElementById('select-product-hotkey-input');
      selectProductHotkeyInput.addEventListener('keydown', function (e) {
        e.preventDefault();
        selectProductHotkeyInput.value = e.key;
      });

      // Сохранить
      var saveBtn = modal.querySelector('.market-hub-btn.save');
      saveBtn.addEventListener('click', function () {
        try {
          var settings = {
            paginationPlus: document.getElementById('pagination-checkbox').checked,
            quickOpenHotkey: document.getElementById('hotkey-input').value,
            selectProductHotkey: document.getElementById('select-product-hotkey-input').value
          };
          (0,_storage_js__WEBPACK_IMPORTED_MODULE_0__.setSettings)(settings).then(function () {
            _this.remove();
            if (_this.options.onSave) _this.options.onSave(settings);
          });
        } catch (e) {
          console.error('MarketHub: ошибка при сохранении состояния', e);
        }
      });

      // Отмена
      var cancelBtn = modal.querySelector('.market-hub-btn.cancel');
      cancelBtn.addEventListener('click', function () {
        try {
          _this.remove();
        } catch (e) {
          console.error('MarketHub: ошибка при закрытии модалки', e);
        }
      });

      // Клик вне модалки
      overlay.addEventListener('click', function (e) {
        try {
          if (e.target === overlay) {
            _this.remove();
          }
        } catch (e) {
          console.error('MarketHub: ошибка при клике вне модалки', e);
        }
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this.overlay) {
        this.overlay.remove();
        this.overlay = null;
        this.modal = null;
      }
    }
  }, {
    key: "update",
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.options = _objectSpread(_objectSpread({}, this.options), options);
      // Перерисовать UI, если нужно
    }

    // Можно добавить методы для загрузки/сохранения настроек, обновления UI и т.д.
  }]);
}();

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
  chrome.storage.local.get(['paginationPlus'], function (result) {
    console.log('paginationPlus storage:', result);
    if (!result.paginationPlus) return;
    try {
      var paginationContainer = document.querySelector('#sync-sources > ul, body > div:nth-child(2) > div:nth-child(1) > section > div:nth-child(16) > div > ul.pagination');
      if (!paginationContainer) {
        console.log('paginationContainer not found');
        return;
      }
      console.log('paginationContainer found, adding UI');
      // Получить количество товаров
      var totalCountElem = document.querySelector('#items_summary_container > div.summary_container_content > div:nth-child(1) > strong.summary_total_count');
      var pageSizeSelect = document.querySelector('#form_page_size > select');
      var pageSize = 10;
      if (pageSizeSelect) {
        var selectedOption = pageSizeSelect.querySelector('option[selected]');
        if (selectedOption) pageSize = parseInt(selectedOption.value, 10);else if (pageSizeSelect.value) pageSize = parseInt(pageSizeSelect.value, 10);
      }
      var totalCount = 0;
      if (totalCountElem) totalCount = parseInt(totalCountElem.textContent.replace(/\D/g, ''), 10);
      var lastPage = pageSize && totalCount ? Math.ceil(totalCount / pageSize) : null;
      var liCount = paginationContainer.querySelectorAll('li').length;
      console.log('lastPage:', lastPage, 'li count:', liCount);

      // --- Кнопка первой страницы ---
      var firstLi = paginationContainer.querySelector('.market-hub-first-page');
      if (!firstLi && lastPage && liCount > 0) {
        firstLi = document.createElement('li');
        firstLi.className = 'market-hub-first-page';
        var firstLinkBtn = document.createElement('a');
        firstLinkBtn.href = '#';
        firstLinkBtn.textContent = '«««';
        firstLinkBtn.style.marginRight = '1px';
        firstLinkBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var firstLink = paginationContainer.querySelector('a[data-page]');
          if (firstLink) {
            var url = new URL(firstLink.href, window.location.origin);
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
      var lastLi = paginationContainer.querySelector('.market-hub-last-page');
      if (!lastLi && lastPage && liCount > 0) {
        lastLi = document.createElement('li');
        lastLi.className = 'market-hub-last-page';
        var lastLink = document.createElement('a');
        lastLink.href = '#';
        lastLink.textContent = '»»»';
        lastLink.style.marginLeft = '1px';
        lastLink.addEventListener('click', function (e) {
          e.preventDefault();
          // Получаем актуальный pageSize и totalCount прямо перед переходом
          var pageSizeSelect = document.querySelector('#form_page_size > select');
          var pageSize = 10;
          if (pageSizeSelect) {
            var _selectedOption = pageSizeSelect.querySelector('option[selected]');
            if (_selectedOption) pageSize = parseInt(_selectedOption.value, 10);else if (pageSizeSelect.value) pageSize = parseInt(pageSizeSelect.value, 10);
          }
          var totalCountElem = document.querySelector('#items_summary_container > div.summary_container_content > div:nth-child(1) > strong.summary_total_count');
          var totalCount = 0;
          if (totalCountElem) totalCount = parseInt(totalCountElem.textContent.replace(/\D/g, ''), 10);
          var lastPage = pageSize && totalCount ? Math.ceil(totalCount / pageSize) : 1;
          // Берём первую ссылку для baseUrl, но page подставляем вручную
          var firstLink = paginationContainer.querySelector('a[data-page]');
          if (firstLink) {
            var url = new URL(firstLink.href, window.location.origin);
            url.searchParams.set('page', lastPage);
            window.location.href = url.toString();
          }
        });
        lastLi.appendChild(lastLink);
        console.log('Добавляю последнюю страницу:', lastLi);
        paginationContainer.appendChild(lastLi);
      }

      // --- Бокс для ввода номера страницы ---
      var gotoLi = paginationContainer.querySelector('.market-hub-goto-page');
      var gotoInput, hintDiv;
      if (!gotoLi) {
        // Переход по Enter или blur
        var goToPage = function goToPage() {
          var val = parseInt(gotoInput.value, 10);
          if (!val || !lastPage || val < 1 || val > lastPage) {
            gotoInput.style.borderColor = 'red';
            hintDiv.textContent = "\u0412\u0441\u0435\u0433\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446: ".concat(lastPage);
            hintDiv.style.display = 'block';
            return;
          }
          hintDiv.style.display = 'none';
          var firstLink = paginationContainer.querySelector('a[data-page]');
          if (firstLink) {
            var url = new URL(firstLink.href, window.location.origin);
            url.searchParams.set('page', val);
            window.location.href = url.toString();
          }
        };
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
        gotoInput.addEventListener('input', function () {
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
        gotoInput.addEventListener('keydown', function (e) {
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
  document.addEventListener('change', function (e) {
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
  var observer = new MutationObserver(function () {
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
  chrome.storage.local.get(['quickOpenHotkey'], function (result) {
    console.log('quickOpen storage:', result);
    if (!result.quickOpenHotkey) {
      document.removeEventListener('keydown', handleQuickOpenHotkey);
      return;
    }
    function handleQuickOpenHotkey(e) {
      var keys = [];
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
    var productCells = document.querySelectorAll("#sync-sources-container > table > tbody > tr > td:nth-child(3) > div > a");
    if (productCells.length === 0) {
      console.log('MarketHub: товары не найдены на странице');
      return;
    }
    console.log("MarketHub: \u043D\u0430\u0439\u0434\u0435\u043D\u043E ".concat(productCells.length, " \u0442\u043E\u0432\u0430\u0440\u043E\u0432, \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C..."));
    productCells.forEach(function (cell) {
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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }

var selectProductHotkeyPressed = false;
var selectProductHotkey = null;
function setupSelectProductHotkey() {
  console.log('setupSelectProductHotkey called');
  try {
    chrome.storage.local.get(['selectProductHotkey'], function (result) {
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
        window.marketHubSelectProductHotkeyKeyHandler = function (e) {
          if (e.key && e.key === selectProductHotkey) {
            if (e.type === 'keydown') selectProductHotkeyPressed = true;
            if (e.type === 'keyup') selectProductHotkeyPressed = false;
          }
        };
        document.addEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
        document.addEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);

        // Клик мышкой по строке товара
        window.marketHubSelectProductHotkeyMouseHandler = function (e) {
          // Разрешаем выбор только если зажата клавиша
          if (!selectProductHotkeyPressed) return;
          var tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
          if (tr) {
            e.preventDefault();
            var dataKey = tr.getAttribute('data-key');
            // Пробуем найти чекбокс внутри строки
            var checkbox = tr.querySelector('input[type="checkbox"]');
            // Если не нашли, ищем по data-key в строке sync-sources
            if (!checkbox && dataKey) {
              checkbox = document.querySelector("tr.sync-sources[data-key=\"".concat(dataKey, "\"] input[type=\"checkbox\"]"));
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
var SelectProductHotkey = /*#__PURE__*/function (_Hotkey) {
  function SelectProductHotkey(key) {
    var _this;
    _classCallCheck(this, SelectProductHotkey);
    _this = _callSuper(this, SelectProductHotkey, [key]);
    _this.pressed = false;
    _this._keyHandler = _this._handleKey.bind(_this);
    _this._mouseHandler = _this._handleMouse.bind(_this);
    return _this;
  }
  _inherits(SelectProductHotkey, _Hotkey);
  return _createClass(SelectProductHotkey, [{
    key: "_handleKey",
    value: function _handleKey(e) {
      if (e.key === this.key) {
        this.pressed = e.type === 'keydown';
      }
    }
  }, {
    key: "_handleMouse",
    value: function _handleMouse(e) {
      if (!this.enabled) return;
      if (this.pressed) {
        // Реальная логика выбора товара по клику
        var tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
        if (tr) {
          e.preventDefault();
          var dataKey = tr.getAttribute('data-key');
          // Пробуем найти чекбокс внутри строки
          var checkbox = tr.querySelector('input[type="checkbox"]');
          // Если не нашли, ищем по data-key в строке sync-sources
          if (!checkbox && dataKey) {
            checkbox = document.querySelector("tr.sync-sources[data-key=\"".concat(dataKey, "\"] input[type=\"checkbox\"]"));
          }
          if (checkbox) checkbox.click();
        }
      }
    }
  }, {
    key: "listen",
    value: function listen() {
      document.addEventListener('keydown', this._keyHandler);
      document.addEventListener('keyup', this._keyHandler);
      document.addEventListener('mousedown', this._mouseHandler);
    }
  }, {
    key: "unlisten",
    value: function unlisten() {
      document.removeEventListener('keydown', this._keyHandler);
      document.removeEventListener('keyup', this._keyHandler);
      document.removeEventListener('mousedown', this._mouseHandler);
    }
  }], [{
    key: "setupFromStorage",
    value: function setupFromStorage() {
      chrome.storage.local.get(['selectProductHotkeyEnabled', 'selectProductHotkey'], function (result) {
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
        var selectProductHotkey = result.selectProductHotkey;
        var selectProductHotkeyPressed = false;
        window.marketHubSelectProductHotkeyKeyHandler = function (e) {
          if (e.key && e.key === selectProductHotkey) {
            if (e.type === 'keydown') selectProductHotkeyPressed = true;
            if (e.type === 'keyup') selectProductHotkeyPressed = false;
          }
        };
        document.addEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
        document.addEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);
        window.marketHubSelectProductHotkeyMouseHandler = function (e) {
          if (!selectProductHotkeyPressed) return;
          var tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
          if (tr) {
            e.preventDefault();
            var dataKey = tr.getAttribute('data-key');
            var checkbox = tr.querySelector('input[type="checkbox"]');
            if (!checkbox && dataKey) {
              checkbox = document.querySelector("tr.sync-sources[data-key=\"".concat(dataKey, "\"] input[type=\"checkbox\"]"));
            }
            if (checkbox) checkbox.click();
          }
        };
        document.addEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler);
      });
    }
  }]);
}(_hotkey_js__WEBPACK_IMPORTED_MODULE_0__.Hotkey);

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
  return new Promise(function (resolve, reject) {
    try {
      chrome.storage.local.get(keys, function (result) {
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
  return new Promise(function (resolve, reject) {
    try {
      chrome.storage.local.set(settings, function () {
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
  chrome.storage.onChanged.addListener(function (changes, area) {
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
var modalManager = new _modal_js__WEBPACK_IMPORTED_MODULE_2__.ModalManager({
  onSave: function onSave() {
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
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
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
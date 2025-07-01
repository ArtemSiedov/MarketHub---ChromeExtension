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
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'market-hub-btn cancel';
    cancelBtn.textContent = 'Отмена';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'market-hub-btn save';
    saveBtn.textContent = 'Сохранить';
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    modal.appendChild(actions);

    // Загрузка состояния чекбокса
    chrome.storage.local.get(['paginationPlus'], (result) => {
      try {
        const checkbox = document.getElementById('pagination-checkbox');
        checkbox.checked = !!result.paginationPlus;
      } catch (e) { console.error('MarketHub: ошибка при загрузке состояния чекбокса', e); }
    });

    // Сохранить
    saveBtn.addEventListener('click', () => {
      try {
        chrome.storage.local.set({
          paginationPlus: document.getElementById('pagination-checkbox').checked
        }, () => {
          removeMarketHubModal();
          enhancePaginationIfEnabled();
        });
      } catch (e) { console.error('MarketHub: ошибка при сохранении состояния', e); }
    });

    // Отмена
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

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
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
  } catch (e) {
    console.error('MarketHub: ошибка в обработчике сообщений', e);
  }
});

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

observePaginationContainer();

observePaginationPlus();

 
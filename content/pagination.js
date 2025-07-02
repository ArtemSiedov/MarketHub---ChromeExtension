export function enhancePaginationIfEnabled() {
  console.log('enhancePaginationIfEnabled called');
  chrome.storage.local.get(['paginationPlus'], (result) => {
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
        if (selectedOption) pageSize = parseInt(selectedOption.value, 10);
        else if (pageSizeSelect.value) pageSize = parseInt(pageSizeSelect.value, 10);
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
        gotoInput.addEventListener('keydown', (e) => {
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
    } catch (e) { console.error('MarketHub: ошибка в enhancePaginationIfEnabled (внутренняя)', e); }
  });
}

export function observePaginationPlus() {
  document.addEventListener('change', (e) => {
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

export function observePaginationContainer() {
  const observer = new MutationObserver(() => {
    enhancePaginationIfEnabled();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function initPagination() {
  observePaginationContainer();
  observePaginationPlus();
} 
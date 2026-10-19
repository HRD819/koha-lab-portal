(function () {
  'use strict';
  const config = window.KOHA_PORTAL || {};
  const dialog = document.getElementById('connection-dialog');
  const isHttpsUrl = function (value) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
    catch (_) { return false; }
  };
  document.querySelectorAll('[data-service]').forEach(function (link) {
    const target = config[link.dataset.service];
    if (isHttpsUrl(target)) {
      link.href = target;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', function (event) {
        if (typeof dialog.showModal === 'function') { event.preventDefault(); dialog.showModal(); }
      });
    }
  });
  dialog.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', function () { dialog.close(); });
  });
  if (isHttpsUrl(config.staff)) {
    document.getElementById('service-status').textContent = '受保護遠端試用 · 須通過郵件驗證';
    document.querySelector('#connection h2').textContent = '遠端試用已接通，先驗證再登入。';
    document.querySelector('#connection h2 + p').textContent = '先以管理員核准的電子郵件收取驗證碼，再使用個人 Koha 帳號登入。此為小規模試用，尚未開放整班使用；臨時網址在連線服務重啟後會變更。';
  }
}());

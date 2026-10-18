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
    document.getElementById('service-status').textContent = '分類編目入口已設定 · 請依課程通知登入';
    document.querySelector('#connection h2').textContent = '依課程通知，使用個人帳號登入。';
    document.querySelector('#connection h2 + p').textContent = '請使用分類編目入口開始操作；若入口需要校內網路或指定連線方式，請依教師或管理員提供的說明使用。';
  }
}());

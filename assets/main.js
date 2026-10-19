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
}());

(function () {
  'use strict';
  const config = window.KOHA_PORTAL || {};
  const dialog = document.getElementById('connection-dialog');
  const status = document.getElementById('service-status');
  const links = Array.from(document.querySelectorAll('[data-service]'));
  let current = null, checkedAt = 0, pending = null;
  function detect() {
    if (pending) return pending;
    status.textContent = '正在尋找可用入口…';
    current = null;
    links.forEach(link => { link.href = '#connection'; link.removeAttribute('target'); link.setAttribute('aria-busy', 'true'); });
    pending = window.KohaConnection.pick(config.candidates || []).then(function (result) {
      current = result; checkedAt = Date.now();
      links.forEach(function (link) {
        link.href = result[link.dataset.service]; link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.removeAttribute('aria-busy'); link.removeAttribute('aria-disabled');
      });
      status.textContent = '已找到可用入口 · 請使用個人 Koha 帳號登入';
      document.documentElement.dataset.connectedIp = result.ip;
      return result;
    }).catch(function () {
      delete document.documentElement.dataset.connectedIp;
      links.forEach(link => { link.removeAttribute('aria-busy'); link.setAttribute('aria-disabled', 'true'); });
      status.textContent = '暫時無法連線 · 請確認校內網路或學校 VPN';
      return null;
    }).finally(function () { pending = null; });
    return pending;
  }
  links.forEach(function (link) {
    link.addEventListener('click', async function (event) {
      if (current && Date.now() - checkedAt < 30000) return;
      event.preventDefault();
      const result = await detect();
      if (result) window.location.assign(result[link.dataset.service]);
      else if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    });
  });
  dialog.querySelectorAll('.close, .close-dialog').forEach(function (button) {
    button.addEventListener('click', function () { dialog.close(); });
  });
  document.getElementById('retry-connection').addEventListener('click', async function () {
    if (await detect()) dialog.close();
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && Date.now() - checkedAt > 30000) detect();
  });
  window.addEventListener('pageshow', function (event) { if (event.persisted) detect(); });
  setInterval(function () { if (!document.hidden) detect(); }, 60000);
  detect();
}());

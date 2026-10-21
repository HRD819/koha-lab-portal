(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KohaConnection = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const approved = ['140.136.115.61', '140.136.115.62'];
  function urls(ip) {
    if (!approved.includes(ip)) throw new Error('Unapproved endpoint');
    return {ip: ip, staff: 'https://' + ip + '/cgi-bin/koha/cataloguing/addbooks.pl',
      opac: 'https://' + ip + ':8443/',
      password: 'https://' + ip + ':8443/cgi-bin/koha/opac-passwd.pl'};
  }
  function validStatus(data, ip, now) {
    const age = now / 1000 - Number(data.checkedAt);
    return data.service === 'koha-lab' && data.version === 1 && data.healthy === true &&
      data.activeIp === ip && Number.isFinite(age) && age >= -120 && age <= 600;
  }
  async function pick(candidates, options) {
    options = options || {};
    const fetcher = options.fetch || globalThis.fetch;
    const now = options.now || Date.now;
    const controllers = [];
    const attempts = candidates.filter(ip => approved.includes(ip)).map(async function (ip) {
      const controller = new AbortController(); controllers.push(controller);
      const timer = setTimeout(() => controller.abort(), options.timeout || 4000);
      try {
        const checks = ['', ':8443'].map(async function (port) {
          const response = await fetcher('https://' + ip + port + '/.well-known/koha-status.json', {
            mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error', signal: controller.signal
          });
          if (!response.ok || !validStatus(await response.json(), ip, now())) throw new Error('Unhealthy endpoint');
        });
        await Promise.all(checks);
        return urls(ip);
      } finally { clearTimeout(timer); }
    });
    try { return await Promise.any(attempts); }
    finally { controllers.forEach(controller => controller.abort()); }
  }
  return {pick: pick, urls: urls, validStatus: validStatus};
}));

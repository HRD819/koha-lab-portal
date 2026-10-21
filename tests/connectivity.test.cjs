const {test} = require('node:test');
const assert = require('node:assert/strict');
const {pick, validStatus, urls} = require('../assets/connectivity.js');
const now = 1792559269000;
const status = ip => ({service:'koha-lab', version:1, healthy:true, activeIp:ip, checkedAt:now/1000});
function fetcher(active, changes) {
  return async function (url, options) {
    assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error');
    const ip = new URL(url).hostname;
    if (ip !== active) throw new Error('unreachable');
    return {ok:true, json:async () => Object.assign(status(ip),changes)};
  };
}
test('chooses .61 when .62 is unavailable, with matching OPAC/password origins',async () => {
  const result = await pick(['140.136.115.62','140.136.115.61'],{fetch:fetcher('140.136.115.61'),now:()=>now});
  assert.equal(result.ip,'140.136.115.61');
  assert.equal(new URL(result.opac).hostname,result.ip);
  assert.equal(new URL(result.password).port,'8443');
});
test('chooses .62 when .61 is unavailable',async () => {
  assert.equal((await pick(['140.136.115.61','140.136.115.62'],{fetch:fetcher('140.136.115.62'),now:()=>now})).ip,'140.136.115.62');
});
test('does not accept wrong identity, stale status, unhealthy origin or unapproved IP',async () => {
  for (const change of [{activeIp:'140.136.115.62'},{service:'other'},{healthy:false},{checkedAt:now/1000-601}]) {
    await assert.rejects(pick(['140.136.115.61'],{fetch:fetcher('140.136.115.61',change),now:()=>now}));
  }
  assert.throws(()=>urls('127.0.0.1'));
  assert.equal(validStatus(status('140.136.115.61'),'140.136.115.61',now),true);
});
test('fails closed if OPAC is unreachable, and times out hung connections',async () => {
  await assert.rejects(pick(['140.136.115.61'],{now:()=>now,fetch:async url => {
    if(new URL(url).port==='8443') throw new Error('OPAC blocked');
    return {ok:true,json:async()=>status('140.136.115.61')};
  }}));
  await assert.rejects(pick(['140.136.115.61'],{timeout:10,fetch:(_,options)=>new Promise((resolve,reject)=> {
    options.signal.addEventListener('abort',()=>reject(new Error('aborted')));
  })}));
});

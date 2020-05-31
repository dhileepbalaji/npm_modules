const thumprinttest = require('../getAccessToken');
test('Testing Reading Cert and Getting Thumprint ', async () => {
  expect(await thumprinttest.getThumbprint(__dirname + './testcert.pfx')).toBe(
    'AC:10:FD:88:82:B1:6D:5E:D0:F6:88:2E:9E:01:CB:BE:16:39:CE:E0',
  );
});

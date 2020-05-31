'use strict';
const adal = require('adal-node');
const pem = require('pem');

// Read Certificate and Key from PFX
function getPrivateKey(pfxCertificate: String) {
  return new Promise(async (resolve, reject) => {
    return pem.readPkcs12(pfxCertificate, (err: any, certificate: { key: String }) => {
      if (certificate) {
        console.log('Reading Private key from : ' + pfxCertificate);
        resolve(certificate.key);
      } else {
        console.log('Error Reading Private key from : ' + pfxCertificate);
        reject(err);
      }
    });
  });
}

function getThumbprint(pfxCertificate: String) {
  return new Promise(async (resolve, reject) => {
    return pem.readPkcs12(pfxCertificate, (err: any, certificate: { cert: String }) => {
      if (certificate) {
        pem.getFingerprint(certificate.cert, (err: any, thumbprint: { fingerprint: String }) => {
          if (thumbprint) {
            console.log('Getting thumprint for : ' + pfxCertificate);
            resolve(thumbprint.fingerprint);
          } else {
            console.log('getFingerprint : unable to read certificate : ' + pfxCertificate);
            reject(err);
          }
        });
      } else {
        console.log('readPkcs12: Unable to open certificate' + pfxCertificate);
      }
    });
  });
}
var AuthenticationContext = adal.AuthenticationContext;

function turnOnLogging() {
  var log = adal.Logging;
  log.setLoggingOptions({
    level: log.LOGGING_LEVEL.VERBOSE,
    log: function (level: String, message: String, error: String) {
      console.log(message);
      if (error) {
        console.log(error);
      }
    },
  });
}

function getAccessToken() {
  turnOnLogging();
  var pfxCertificate = '/usr/local/sql/azure.pfx' || process.env.PFX_CERT_PATH  ;
  var authorityUrl = 'https://login.windows.net/' + process.env.TENANT_NAME;
  var context = new AuthenticationContext(authorityUrl);

  return new Promise(async (resolve, reject) => {
    return context.acquireTokenWithClientCertificate(
      process.env.RESOURCE_URL,
      process.env.CLIENT_ID,
      await getPrivateKey(pfxCertificate),
      await getThumbprint(pfxCertificate),
      function (err: { stack: string }, tokenResponse: any) {
        if (err) {
          console.log('well that didnt work: ' + err.stack);
        } else {
          console.log('Successfully retrived token');
          resolve(tokenResponse);
        }
      },
    );
  });
}

export { getAccessToken };
export { getThumbprint };
export { getPrivateKey };

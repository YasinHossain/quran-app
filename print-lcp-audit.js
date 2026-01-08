const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lighthouse-mobile.report.json', 'utf8'));
const lcpAudit = report.audits['largest-contentful-paint-element'];
console.log(JSON.stringify(lcpAudit, null, 2));


const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lighthouse-mobile.report.json', 'utf8'));

const lcpAudit = report.audits['largest-contentful-paint-element'];
if (lcpAudit && lcpAudit.details && lcpAudit.details.items) {
    console.log('--- LCP Element Details ---');
    lcpAudit.details.items.forEach(item => {
        console.log(`Node: ${item.node.nodeLabel}`);
        console.log(`Snippet: ${item.node.snippet}`);
        console.log(`Selector: ${item.node.selector}`);
    });
} else {
    console.log('LCP Element details not found.');
}

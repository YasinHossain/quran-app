
const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lighthouse-mobile.report.json', 'utf8'));

const categories = report.categories;
const audits = report.audits;

console.log('--- Performance Summary ---');
console.log(`Overall Performance Score: ${categories.performance.score * 100}`);
console.log(`First Contentful Paint: ${audits['first-contentful-paint'].displayValue}`);
console.log(`Largest Contentful Paint: ${audits['largest-contentful-paint'].displayValue}`);
console.log(`Speed Index: ${audits['speed-index'].displayValue}`);
console.log(`Total Blocking Time: ${audits['total-blocking-time'].displayValue}`);
console.log(`Cumulative Layout Shift: ${audits['cumulative-layout-shift'].displayValue}`);

console.log('\n--- Critical Issues (Score < 0.5) ---');
Object.values(audits).forEach(audit => {
    if (audit.score !== null && audit.score < 0.5 && audit.scoreDisplayMode !== 'informative') {
        console.log(`[${audit.score}] ${audit.title}`);
    }
});

console.log('\n--- Environment ---');
console.log(`Emulated Form Factor: ${report.configSettings.formFactor}`);
console.log(`Network User Agent: ${report.environment.networkUserAgent}`);

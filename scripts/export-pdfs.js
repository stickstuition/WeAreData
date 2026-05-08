const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const workspaceRoot = path.resolve(__dirname, '..');
  const pages = [
    { html: 'business-plan.html', pdf: 'business-plan.pdf' },
    { html: 'financial-plan.html', pdf: 'financial-plan.pdf' }
  ];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 1600 },
    deviceScaleFactor: 1
  });

  for (const pageInfo of pages) {
    const pagePath = path.resolve(workspaceRoot, pageInfo.html);
    if (!fs.existsSync(pagePath)) {
      console.error(`Missing HTML file: ${pageInfo.html}`);
      continue;
    }

    const page = await context.newPage();
    const fileUrl = new URL(`file://${pagePath}`);
    await page.goto(fileUrl.href, { waitUntil: 'networkidle' });
    await page.pdf({
      path: path.resolve(workspaceRoot, pageInfo.pdf),
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' }
    });
    console.log(`Generated ${pageInfo.pdf}`);
    await page.close();
  }

  await browser.close();
})();

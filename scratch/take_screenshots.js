const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching headless chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Dashboard View
  console.log('Capturing Dashboard view...');
  await page.screenshot({ path: path.join(screenshotsDir, '01_dashboard_screen.png') });

  // 2. Upload Station View
  console.log('Capturing Upload Station view...');
  await page.click('button:has-text("Upload")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '02_upload_screen.png') });

  // 3. Document Explorer View
  console.log('Capturing Document Explorer view...');
  await page.click('button:has-text("Explorer")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '03_explorer_screen.png') });

  // 4. Document Detail Modal View
  console.log('Capturing Document Detail Modal view...');
  await page.click('tr:has-text("ZigBank")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '04_document_detail_modal.png') });

  // Close detail modal
  const closeBtn = page.locator('button:has(svg.lucide-x)');
  if (await closeBtn.count() > 0) {
    await closeBtn.first().click();
    await page.waitForTimeout(500);
  }

  // 5. Architecture & ROI View
  console.log('Capturing Architecture & ROI view...');
  await page.click('button:has-text("Architecture & ROI")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '05_architecture_screen.png') });

  // 6. Heavy Services Safeguard Modal View
  console.log('Capturing Heavy Services Safeguard Modal view...');
  await page.click('button:has-text("Heavy Services Safeguard")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '06_paid_services_modal.png') });

  // Close paid services modal
  const closeBtn2 = page.locator('button:has(svg.lucide-x)');
  if (await closeBtn2.count() > 0) {
    await closeBtn2.first().click();
    await page.waitForTimeout(500);
  }

  // 7. CloudFormation & Teardown View
  console.log('Capturing CloudFormation & Teardown view...');
  await page.click('button:has-text("CloudFormation")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '07_cloudformation_screen.png') });

  // 8. Lambda Code Guide View
  console.log('Capturing Lambda Code Guide view...');
  await page.click('button:has-text("Lambda Code")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '08_lambda_code_screen.png') });

  // 9. AWS Config Modal View
  console.log('Capturing AWS Config Modal view...');
  await page.click('button:has-text("AWS Config")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '09_aws_config_modal.png') });

  // Close settings modal
  const closeBtn3 = page.locator('button:has(svg.lucide-x)');
  if (await closeBtn3.count() > 0) {
    await closeBtn3.first().click();
    await page.waitForTimeout(500);
  }

  // 10. Standby Hero Command Center View
  console.log('Capturing Standby Hero Command Center view...');
  await page.click('button:has-text("Lambda Code")'); // Click active tab to collapse
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '10_standby_hero_screen.png') });

  console.log('All screenshots captured successfully in:', screenshotsDir);
  await browser.close();
}

captureScreenshots().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});

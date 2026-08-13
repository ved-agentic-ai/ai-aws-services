const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching chromium...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  console.log('1. Dashboard...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '01_dashboard_screen.png') });

  console.log('2. Upload...');
  await page.click('button:has-text("Upload")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '02_upload_screen.png') });

  console.log('3. Explorer...');
  await page.click('button:has-text("Explorer")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '03_explorer_screen.png') });

  console.log('4. Detail Modal...');
  try {
    const row = page.locator('tbody tr').first();
    if (await row.count() > 0) {
      await row.click({ timeout: 3000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(screenshotsDir, '04_document_detail_modal.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.log('Detail modal skipped:', e.message);
  }

  console.log('5. Architecture...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.click('button:has-text("Architecture & ROI")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '05_architecture_screen.png') });

  console.log('6. Paid Services Modal...');
  try {
    await page.click('button:has-text("Heavy Services Safeguard")', { timeout: 3000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotsDir, '06_paid_services_modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    console.log('Paid services modal skipped:', e.message);
  }

  console.log('7. CloudFormation...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.click('button:has-text("CloudFormation")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '07_cloudformation_screen.png') });

  console.log('8. Lambda Code...');
  await page.click('button:has-text("Lambda Code")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '08_lambda_code_screen.png') });

  console.log('9. AWS Config Modal...');
  try {
    await page.click('button:has-text("AWS Config")', { timeout: 3000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotsDir, '09_aws_config_modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    console.log('AWS config modal skipped:', e.message);
  }

  console.log('10. Standby Hero...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.click('button:has-text("Dashboard")'); // Click active tab to collapse
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '10_standby_hero_screen.png') });

  console.log('DONE: All 10 screenshots saved!');
  await browser.close();
}

captureScreenshots().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

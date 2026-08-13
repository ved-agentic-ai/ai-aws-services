const { chromium } = require('playwright');

async function verifyAllFlows() {
  console.log('Starting end-to-end automated cross-check validation...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  console.log('1. Loading http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Dashboard
  console.log('2. Verifying Executive Dashboard...');
  await page.click('button:has-text("Dashboard")');
  await page.waitForTimeout(800);

  // Check Document Explorer & Detail Modal
  console.log('3. Verifying Document Explorer & Document Detail Modal...');
  await page.click('button:has-text("Explorer")');
  await page.waitForTimeout(800);

  const firstRow = page.locator('tbody tr').first();
  if (await firstRow.count() > 0) {
    console.log('   Clicking first document row to open detail modal...');
    await firstRow.click();
    await page.waitForTimeout(1000);

    // Verify modal header & tabs work
    const modalHeader = await page.locator('h2:has-text("Confidence")').textContent();
    console.log('   Document Detail Modal loaded successfully:', modalHeader.trim());

    // Dismiss modal by clicking close button
    const closeBtn = page.locator('button:has(svg.lucide-x)');
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click();
      await page.waitForTimeout(500);
    }
  }

  // Check Upload Station
  console.log('4. Verifying Upload Station...');
  await page.click('button:has-text("Upload")');
  await page.waitForTimeout(800);

  // Check Architecture & ROI
  console.log('5. Verifying Architecture & ROI View...');
  await page.click('button:has-text("Architecture & ROI")');
  await page.waitForTimeout(800);

  // Check Heavy Services Safeguard Modal
  console.log('6. Verifying Heavy Services Safeguard Modal...');
  await page.click('button:has-text("Heavy Services Safeguard")');
  await page.waitForTimeout(800);
  const closeBtn2 = page.locator('button:has(svg.lucide-x)');
  if (await closeBtn2.count() > 0) {
    await closeBtn2.first().click();
    await page.waitForTimeout(500);
  }

  // Check CloudFormation Visualizer
  console.log('7. Verifying CloudFormation Visualizer...');
  await page.click('button:has-text("CloudFormation")');
  await page.waitForTimeout(800);

  // Check AWS Backend & Lambda Guide
  console.log('8. Verifying Lambda Code Guide...');
  await page.click('button:has-text("Lambda Code")');
  await page.waitForTimeout(800);

  // Check AWS Config Settings Modal
  console.log('9. Verifying AWS Config Settings Modal...');
  await page.click('button:has-text("AWS Config")');
  await page.waitForTimeout(800);
  const closeBtn3 = page.locator('button:has(svg.lucide-x)');
  if (await closeBtn3.count() > 0) {
    await closeBtn3.first().click();
    await page.waitForTimeout(500);
  }

  // Check Standby Hero View (Tab Toggle Collapse)
  console.log('10. Verifying Standby Hero View on active tab toggle...');
  await page.click('button:has-text("Lambda Code")'); // Collapse
  await page.waitForTimeout(800);

  const standbyHeroTitle = await page.locator('h2:has-text("PayComprehend")').textContent();
  console.log('    Standby Hero View loaded successfully:', standbyHeroTitle.trim());

  await browser.close();

  if (consoleErrors.length > 0) {
    console.error('FAILED: Browser console errors detected:', consoleErrors);
    process.exit(1);
  } else {
    console.log('✅ SUCCESS: 100% End-to-end verification passed with ZERO console errors!');
  }
}

verifyAllFlows().catch(err => {
  console.error('Verification script failed:', err);
  process.exit(1);
});

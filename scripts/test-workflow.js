/**
 * Sri Rama Cycles - End-to-End Workflow Integration Test Suite
 * Tests full customer and admin API flows against local dev server (http://localhost:3000)
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runWorkflowTests() {
  console.log('\n======================================================');
  console.log('🚀 SRI RAMA CYCLES - E2E WORKFLOW INTEGRATION TEST SUITE');
  console.log(`Target Base URL: ${BASE_URL}`);
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;
  let adminCookie = '';

  async function testStep(name, fn) {
    try {
      process.stdout.write(`[TEST] ${name.padEnd(55, '.')} `);
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log('❌ FAILED');
      console.error(`      Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Storefront Categories Workflow
  await testStep('1. Storefront Categories API (GET /api/categories)', async () => {
    const res = await fetch(`${BASE_URL}/api/categories`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'API returned success: false');
    if (!Array.isArray(data.categories)) throw new Error('categories field is not an array');
  });

  // 2. Storefront Products Workflow
  await testStep('2. Storefront Products API (GET /api/products)', async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'API returned success: false');
    if (!Array.isArray(data.products)) throw new Error('products field is not an array');
  });

  // 3. Guest Auth Session Workflow
  await testStep('3. Guest Auth Check API (GET /api/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (data.success !== true) throw new Error('Guest response should return success: true');
  });

  // 4. Active Coupons Workflow
  await testStep('4. Active Storefront Coupons (GET /api/coupons/active)', async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/active`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'API returned success: false');
    if (!Array.isArray(data.coupons)) throw new Error('coupons field is not an array');
  });

  // 5. Customer Enquiry Submission Workflow
  await testStep('5. Customer Enquiry Submission (POST /api/enquiries)', async () => {
    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test User',
        email: 'testworkflow@example.com',
        phone: '9876543210',
        subject: 'Workflow Test',
        message: 'This is an automated workflow test message.',
      }),
    });
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Enquiry submission failed');
  });

  // 6. Admin Authentication Session Workflow
  await testStep('6. Admin Authentication Login (POST /api/auth/login)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sriramacycles.com',
        password: 'Admin@123456',
        requiredRole: 'admin',
      }),
    });
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Admin login failed');

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      adminCookie = setCookie.split(';')[0];
    }
  });

  const getAdminHeaders = () => ({
    'Content-Type': 'application/json',
    ...(adminCookie ? { Cookie: adminCookie } : {}),
  });

  // 7. Admin Dashboard Stats Workflow
  await testStep('7. Admin Dashboard Stats (GET /api/admin/stats)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, { headers: getAdminHeaders() });
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Stats endpoint failed');
  });

  // 8. Admin Coupon CRUD Workflow
  let createdCouponId = null;
  await testStep('8a. Admin Coupon Creation (POST /api/admin/coupons)', async () => {
    const testCode = `TEST${Date.now().toString().slice(-4)}`;
    const res = await fetch(`${BASE_URL}/api/admin/coupons`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({
        code: testCode,
        description: 'Test Workflow Coupon',
        discountType: 'percentage',
        discountValue: '15',
        minOrderAmount: '500',
        usageLimit: '50',
        isActive: true,
      }),
    });
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.coupon) throw new Error(data.message || 'Coupon creation failed');
    createdCouponId = data.coupon._id;
  });

  if (createdCouponId) {
    await testStep('8b. Admin Coupon Update (PUT /api/admin/coupons/[id])', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/coupons/${createdCouponId}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          description: 'Updated Test Workflow Coupon',
          discountValue: 20,
        }),
      });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Coupon update failed');
    });

    await testStep('8c. Admin Coupon Deletion (DELETE /api/admin/coupons/[id])', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/coupons/${createdCouponId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Coupon deletion failed');
    });
  }

  // 9. Admin POS Workflow
  await testStep('9. Admin POS Stats & Billing Data (GET /api/admin/pos)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/pos`, { headers: getAdminHeaders() });
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'POS stats endpoint failed');
  });

  console.log('\n======================================================');
  console.log(`📊 WORKFLOW TEST SUMMARY: ${passed} Passed | ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runWorkflowTests();

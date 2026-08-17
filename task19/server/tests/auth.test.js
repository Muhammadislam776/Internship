const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_BASE = `http://localhost:${process.env.PORT || 5000}/api`;

async function runTests() {
  console.log('\n🧪 Starting SecureGate Authentication Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  const testUser = {
    name: 'Test Security Developer',
    email: `test_${Date.now()}@securegate.dev`,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };

  let validToken = '';

  // Helper for fetch
  const makeReq = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };

  // TEST 1: Register User
  try {
    const res = await makeReq(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    if (res.status === 201 && res.data.success && res.data.token) {
      console.log('✅ TEST 1 PASSED: Register User successful.');
      passed++;
    } else {
      console.error('❌ TEST 1 FAILED:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ TEST 1 ERROR:', err.message);
    failed++;
  }

  // TEST 2: Login with Correct Credentials
  try {
    const res = await makeReq(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    if (res.status === 200 && res.data.success && res.data.token) {
      validToken = res.data.token;
      console.log('✅ TEST 2 PASSED: Login with valid credentials returned JWT token.');
      passed++;
    } else {
      console.error('❌ TEST 2 FAILED:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ TEST 2 ERROR:', err.message);
    failed++;
  }

  // TEST 3: Call GET /api/auth/me with Authorization: Bearer <valid JWT>
  try {
    const res = await makeReq(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${validToken}` }
    });
    if (res.status === 200 && res.data.success && res.data.user.email.toLowerCase() === testUser.email.toLowerCase()) {
      console.log('✅ TEST 3 PASSED: Protected route GET /api/auth/me authenticated successfully (200 OK).');
      passed++;
    } else {
      console.error('❌ TEST 3 FAILED:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ TEST 3 ERROR:', err.message);
    failed++;
  }

  // TEST 4: Call Protected Route Without Authorization Header
  try {
    const res = await makeReq(`${API_BASE}/auth/me`, {
      method: 'GET'
    });
    if (res.status === 401 && res.data.message === 'Authentication token is required.') {
      console.log('✅ TEST 4 PASSED: Missing token correctly returned 401 "Authentication token is required."');
      passed++;
    } else {
      console.error('❌ TEST 4 FAILED:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ TEST 4 ERROR:', err.message);
    failed++;
  }

  // TEST 5: Send Authorization: Bearer invalid-token
  try {
    const res = await makeReq(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Authorization: 'Bearer invalid.token.payload' }
    });
    if (res.status === 401 && res.data.message === 'Invalid or expired token.') {
      console.log('✅ TEST 5 PASSED: Invalid token correctly returned 401 "Invalid or expired token."');
      passed++;
    } else {
      console.error('❌ TEST 5 FAILED:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ TEST 5 ERROR:', err.message);
    failed++;
  }

  // TEST 6: Send Malformed Authorization Header (e.g. without Bearer)
  try {
    const res = await makeReq(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Token ${validToken}` }
    });
    if (res.status === 401 && res.data.message === 'Invalid authorization format.') {
      console.log('✅ TEST 6 PASSED: Malformed header scheme correctly returned 401 "Invalid authorization format."');
      passed++;
    } else {
      console.error('❌ TEST 6 FAILED:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ TEST 6 ERROR:', err.message);
    failed++;
  }

  // TEST 7: Use Expired JWT
  try {
    const expiredToken = jwt.sign(
      { id: 'usr_test', email: 'expired@dev.com' },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' } // Expired token
    );
    const res = await makeReq(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${expiredToken}` }
    });
    if (res.status === 401 && res.data.message === 'Invalid or expired token.') {
      console.log('✅ TEST 7 PASSED: Expired token correctly returned 401 "Invalid or expired token."');
      passed++;
    } else {
      console.error('❌ TEST 7 FAILED:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ TEST 7 ERROR:', err.message);
    failed++;
  }

  console.log(`\n===================================================`);
  console.log(`🏁 Integration Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`===================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

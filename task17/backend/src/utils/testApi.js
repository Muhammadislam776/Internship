import http from 'http';

function makePostRequest(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(body)
        });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("🚀 Starting ShieldForm Zod Middleware API Verification Tests...\n");

  // Test 1: Valid Request
  console.log("1. Testing VALID Request...");
  const validResult = await makePostRequest({
    name: "Alex Vance",
    email: "alex.vance@shieldform.io",
    password: "SecurePass@2026",
    confirmPassword: "SecurePass@2026",
    age: 26,
    phone: "+1-555-0192",
    country: "United States",
    role: "developer"
  });

  console.log(`Status Code: ${validResult.status}`);
  console.log("Response Body:", JSON.stringify(validResult.data, null, 2));
  console.log(validResult.status === 200 && validResult.data.success ? "✅ TEST 1 PASSED\n" : "❌ TEST 1 FAILED\n");

  // Test 2: Invalid Request (Bad email, weak password, underage)
  console.log("2. Testing INVALID Request (Intercepted by Zod)...");
  const invalidResult = await makePostRequest({
    name: "A",
    email: "bad-email-format",
    password: "weak",
    confirmPassword: "mismatch",
    age: 14,
    phone: "123",
    country: "",
    role: "invalid-role"
  });

  console.log(`Status Code: ${invalidResult.status}`);
  console.log("Response Body:", JSON.stringify(invalidResult.data, null, 2));
  console.log(invalidResult.status === 400 && !invalidResult.data.success ? "✅ TEST 2 PASSED (Correctly rejected by Zod)\n" : "❌ TEST 2 FAILED\n");
}

runTests().catch(console.error);

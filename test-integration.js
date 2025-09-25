#!/usr/bin/env node

// Integration test script to verify frontend-backend connectivity
const { default: fetch } = require('node-fetch');

const API_URLS = {
  localhost: 'http://localhost:8000/api/v1',
  localIP: 'http://192.168.1.9:8000/api/v1',
  androidEmulator: 'http://10.0.2.2:8000/api/v1',
};

async function testEndpoint(name, url) {
  try {
    console.log(`\n🧪 Testing ${name}: ${url}`);

    // Test health endpoint
    const healthResponse = await fetch(`${url.replace('/api/v1', '')}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log(`✅ Health check: ${health.status} (v${health.version})`);
    } else {
      console.log(`❌ Health check failed: ${healthResponse.status}`);
      return false;
    }

    // Test registration
    const registerData = {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'test123',
      role: 'citizen',
    };

    const registerResponse = await fetch(`${url}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });

    if (registerResponse.ok) {
      const user = await registerResponse.json();
      console.log(`✅ Registration successful: ${user.email}`);

      // Test login
      const loginResponse = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      });

      if (loginResponse.ok) {
        const tokens = await loginResponse.json();
        console.log(`✅ Login successful: ${tokens.user.email}`);
        console.log(
          `   Token type: ${tokens.token_type}, expires in: ${tokens.expires_in}s`
        );
        return true;
      } else {
        console.log(`❌ Login failed: ${loginResponse.status}`);
        return false;
      }
    } else {
      const error = await registerResponse.text();
      console.log(
        `❌ Registration failed: ${registerResponse.status} - ${error}`
      );
      return false;
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
    return false;
  }
}

async function runIntegrationTests() {
  console.log('🚀 Starting Frontend-Backend Integration Tests\n');

  const results = {};

  for (const [name, url] of Object.entries(API_URLS)) {
    results[name] = await testEndpoint(name, url);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }

  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(40));

  let allPassed = true;
  for (const [name, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}: ${API_URLS[name]}`);
    if (!passed) allPassed = false;
  }

  console.log('='.repeat(40));

  if (allPassed) {
    console.log(
      '🎉 All integration tests PASSED! Frontend-Backend integration is working correctly.'
    );
  } else {
    console.log(
      '⚠️  Some tests FAILED. Check the network configuration and server status.'
    );
  }

  // Recommendations
  console.log('\n💡 Recommendations for mobile app:');
  if (results.localhost) {
    console.log('   📱 iOS Simulator: Use http://localhost:8000/api/v1');
  }
  if (results.localIP) {
    console.log(
      '   📱 Physical Android (WiFi): Use http://192.168.1.9:8000/api/v1'
    );
  }
  if (results.androidEmulator) {
    console.log('   📱 Android Emulator: Use http://10.0.2.2:8000/api/v1');
  } else {
    console.log(
      '   📱 Android Emulator: Not accessible from host (normal behavior)'
    );
    console.log('   📱 For physical Android devices, use ADB port forwarding:');
    console.log('       adb reverse tcp:8000 tcp:8000');
  }
}

// Run the tests
runIntegrationTests().catch(console.error);

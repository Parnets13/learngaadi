// Quick API diagnostic script
const axios = require('axios');

const BASE_URL = 'https://learngaadi-x496.onrender.com';

async function testAPI() {
  console.log('Testing LearnGaadi API...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✓ Health check passed:', health.data);
  } catch (error) {
    console.log('✗ Health check failed:', error.message);
  }

  // Test 2: API test endpoint
  try {
    console.log('\n2. Testing API endpoint...');
    const test = await axios.get(`${BASE_URL}/api/test`);
    console.log('✓ API test passed:', test.data);
  } catch (error) {
    console.log('✗ API test failed:', error.message);
  }

  // Test 3: Driver endpoint (example)
  try {
    console.log('\n3. Testing driver endpoint...');
    const drivers = await axios.get(`${BASE_URL}/api/driver/getalldriver`);
    console.log('✓ Driver endpoint passed, count:', drivers.data.length || 'N/A');
  } catch (error) {
    console.log('✗ Driver endpoint failed:', error.response?.status, error.message);
    if (error.response?.data) {
      console.log('Error details:', error.response.data);
    }
  }

  console.log('\n--- Test Complete ---');
}

testAPI();

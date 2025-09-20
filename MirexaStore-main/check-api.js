const axios = require('axios');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function checkAPI() {
  console.log('Checking API connectivity...');
  console.log('API URL:', API_URL);
  
  try {
    // Test basic connectivity
    const response = await axios.get(`${API_URL}/subscription/plans`, {
      timeout: 5000
    });
    console.log('✅ API is responding');
    console.log('Plans found:', response.data?.data?.length || 0);
  } catch (error) {
    console.log('❌ API Error:');
    if (error.code === 'ECONNREFUSED') {
      console.log('- Backend server is not running');
      console.log('- Make sure your backend is running on port 5000');
    } else if (error.response) {
      console.log('- Status:', error.response.status);
      console.log('- Message:', error.response.data?.message || 'Unknown error');
    } else {
      console.log('- Network error:', error.message);
    }
  }
}

checkAPI();
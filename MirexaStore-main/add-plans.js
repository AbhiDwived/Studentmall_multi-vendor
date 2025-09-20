const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const plans = [
  {
    title: 'Basic - 15 Days',
    description: 'Perfect for trying out full access with limited duration.',
    days: 15,
    price: 150,
    features: ['Unlimited Listings', 'Advanced Analytics', '24/7 Priority Support', 'Email Alerts', 'Promotional Tools'],
    popular: false,
    hot: false,
    badgeColor: 'blue'
  },
  {
    title: 'Standard - 1 Month',
    description: 'Best for individuals looking for a full-featured monthly plan.',
    days: 30,
    price: 250,
    features: ['Unlimited Listings', 'Advanced Analytics', '24/7 Priority Support', 'Email Alerts', 'Promotional Tools', 'Custom Branding'],
    popular: true,
    hot: false,
    badgeColor: 'orange'
  },
  {
    title: 'Premium - 3 Months',
    description: 'Great for growing sellers needing uninterrupted platform benefits.',
    days: 90,
    price: 700,
    features: ['Unlimited Listings', 'Advanced Analytics', '24/7 Priority Support', 'Email Alerts', 'Promotional Tools', 'Custom Branding', 'Team Access'],
    popular: false,
    hot: true,
    badgeColor: 'red'
  },
  {
    title: 'Enterprise - 1 Year',
    description: 'Complete enterprise solution with full access and long-term value.',
    days: 365,
    price: 2200,
    features: ['Unlimited Listings', 'Advanced Analytics', '24/7 Priority Support', 'Email Alerts', 'Promotional Tools', 'Custom Branding', 'Team Access', 'Dedicated Account Manager'],
    popular: true,
    hot: false,
    badgeColor: 'green'
  }
];

async function addPlans() {
  console.log('Adding subscription plans...');
  
  for (const plan of plans) {
    try {
      const response = await axios.post(`${API_URL}/subscription/plans`, plan);
      console.log(`✅ Added: ${plan.title}`);
    } catch (error) {
      console.log(`❌ Failed to add ${plan.title}:`, error.response?.data?.message || error.message);
    }
  }
  
  console.log('Done!');
}

addPlans();
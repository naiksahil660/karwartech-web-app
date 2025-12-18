export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'new-phone': 'New Phones',
    'used-phone': 'Used Phones',
    'new-laptop': 'New Laptops',
    'used-laptop': 'Used Laptops',
    'desktop': 'Desktops',
    'mobile-accessories': 'Mobile Accessories',
    'laptop-accessories': 'Laptop Accessories',
    'speaker': 'Speakers',
    'other': 'Other'
  };
  return categoryMap[category] || category;
};

export const getServiceTypeDisplayName = (serviceType) => {
  const serviceMap = {
    'mobile-repair': 'Mobile Repair',
    'laptop-repair': 'Laptop Repair',
    'screen-replacement': 'Screen Replacement',
    'battery-replacement': 'Battery Replacement',
    'software-issue': 'Software Issue',
    'hardware-upgrade': 'Hardware Upgrade',
    'data-recovery': 'Data Recovery',
    'general-consultation': 'General Consultation',
    'other': 'Other'
  };
  return serviceMap[serviceType] || serviceType;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

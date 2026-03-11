export const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
};

export const getStatusDetails = (status) => {
    switch (status) {
        case 'pending':
            return { color: '#ffaa00', label: 'PENDING' };
        case 'processing':
            return { color: '#00ffff', label: 'PROCESSING' };
        case 'shipped':
            return { color: '#bf00ff', label: 'SHIPPED' };
        case 'delivered':
            return { color: '#00ff88', label: 'DELIVERED' };
        case 'cancelled':
            return { color: '#ff3333', label: 'CANCELLED' };
        default:
            return { color: '#888', label: status?.toUpperCase() || 'UNKNOWN' };
    }
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
};

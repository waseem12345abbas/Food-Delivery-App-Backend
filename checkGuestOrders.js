const mongoose = require('mongoose');
const Order = require('./models/orders');

async function checkGuestOrders() {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-delivery-app');
        console.log('Connected to MongoDB');

        const guestOrders = await Order.find({ userID: { $regex: '^guest_' } });
        console.log(`Found ${guestOrders.length} guest orders:`);

        guestOrders.forEach(order => {
            console.log(`- Order ID: ${order._id}`);
            console.log(`- User ID: ${order.userID}`);
            console.log(`- User Email: ${order.userEmail}`);
            console.log('---');
        });

        // Also check all orders to see what userID formats exist
        const allOrders = await Order.find({});
        console.log(`\nTotal orders in database: ${allOrders.length}`);
        console.log('All userID values:');
        allOrders.forEach(order => {
            console.log(`- ${order.userID} (email: ${order.userEmail})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkGuestOrders();

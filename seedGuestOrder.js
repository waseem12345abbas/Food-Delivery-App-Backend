const mongoose = require('mongoose');
const Order = require('./models/orders');

async function seedGuestOrder() {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-delivery-app');
        console.log('Connected to MongoDB');

        // Create a sample guest order
        const guestOrder = new Order({
            userID: 'guest_plk9kxta4', // The guest ID from the error
            userName: 'Guest User',
            userEmail: 'guest_plk9kxta4@guest.com',
            userCNIC: null,
            cartItems: [
                {
                    itemID: '689b124c4fcd8ee11f9a4dad',
                    itemName: 'Paneer Wrap',
                    itemQuantity: 2,
                    itemPrice: 150
                },
                {
                    itemID: '689b124c4fcd8ee11f9a4dae',
                    itemName: 'Veggie Burger',
                    itemQuantity: 1,
                    itemPrice: 200
                }
            ],
            address: [
                {
                    addrName: 'Guest User',
                    addrPhone: '1234567890',
                    addrStreet: '123 Guest Street',
                    addrCity: 'Guest City',
                    addrPostalCode: '12345'
                }
            ],
            paymentId: 'guest_payment_123',
            proofImage: null,
            status: 'Confirmed',
            createdAt: new Date()
        });

        const savedOrder = await guestOrder.save();
        console.log('Sample guest order created successfully!');
        console.log('Order ID:', savedOrder._id);
        console.log('User ID:', savedOrder.userID);

        process.exit(0);
    } catch (error) {
        console.error('Error creating guest order:', error);
        process.exit(1);
    }
}

seedGuestOrder();

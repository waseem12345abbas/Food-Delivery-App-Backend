const mongoose = require('mongoose');
const Order = require('./models/orders');
const { defaultStages } = require('./utils/stages');

async function seedGuestOrder() {
    try {
        await mongoose.connect('mongodb://localhost:27017/food-delivery-app');
        console.log('Connected to MongoDB');

        // Calculate total time based on stages
        const totalDuration = defaultStages.reduce((acc, stage) => acc + stage.recommendedPercent, 0);
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000); // totalDuration in minutes

        // Create stages with durations
        const stages = defaultStages.map(stage => ({
            id: stage.id,
            name: stage.name,
            duration: stage.recommendedPercent, // in minutes
            completed: false,
            image: stage.icon,
            updatedAt: startTime
        }));

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
            stages: stages,
            timer: {
                startTime: startTime,
                endTime: endTime
            },
            riderDetails: {
                riderName: 'John Doe',
                riderNumber: '9876543210',
                riderLocation: 'Near your location'
            },
            createdAt: new Date()
        });

        const savedOrder = await guestOrder.save();
        console.log('Sample guest order created successfully!');
        console.log('Order ID:', savedOrder._id);
        console.log('User ID:', savedOrder.userID);
        console.log('Payment ID:', savedOrder.paymentId);

        process.exit(0);
    } catch (error) {
        console.error('Error creating guest order:', error);
        process.exit(1);
    }
}

seedGuestOrder();

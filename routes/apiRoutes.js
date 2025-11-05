const express=require('express')
const multer = require('multer')
const router=express.Router()
// now require the controllers where we are making api calls with database
const createUserRegister=require('../controller/userRequest.js')
const validateLogin=require('../controller/userLogin.js')
const getProducts=require('../controller/getProducts.js')
const searchById=require('../controller/searchById.js')
const getUsers=require('../controller/getUsers.js')
const { deleteWithId } = require('../controller/deleteWithId.js');
const addProduct = require('../controller/addProduct.js');
const updateProduct = require('../controller/updateProduct.js');
const {verifyToken, verifyAdmin} = require('../middleware/authMiddleware.js')
const getProfile = require('../controller/getProfile.js')
const { verifyRefreshToken } = require('../middleware/authMiddleware.js')
// import the controllers
const  { createOrder }  = require('../controller/orderController.js');
const  refreshToken  = require('./auth.js')
const getOrder = require('../controller/getOrder.js')
const getOrderById = require('../controller/getOrderById.js')
const getOrderByPaymentId = require('../controller/getOrderByPaymentId.js')
const getAllOrders = require('../controller/getAllOrders.js')
const searchOrders = require('../controller/searchOrders.js')
const updateOrderStatus = require('../controller/updateOrderStatus.js')
const updateOrder = require('../controller/updateOrder.js')
const clientRating = require('../controller/updateRating.js')
const adminController = require('../controller/adminController.js')


// clear refresh cookie (logout)
const clearRefreshToken = (req, res)=>{
 res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict'
  });
  res.json({ success: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fs = require('fs');
        const uploadDir = 'uploads/';
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('proofImage');
// user post requests
router.post('/adduser', createUserRegister)
router.post('/addItem', addProduct)
router.post('/login', validateLogin)
router.post('/userOrder', (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred during upload
            return res.status(400).json({
                success: false,
                message: err.code === 'LIMIT_FILE_SIZE' 
                    ? 'File size too large. Maximum size is 5MB.' 
                    : err.message
            });
        } else if (err) {
            // An unknown error occurred
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
}, createOrder);
router.post('/logout', clearRefreshToken);

// Admin route to update user ranks
router.post('/admin/updateUserRanks', verifyToken, verifyAdmin, adminController.updateUserRanks);

// Admin route to get today's revenue
router.get('/revenue/today', verifyToken, verifyAdmin, adminController.getTodaysRevenue);

// products get requests
router.get('/allProducts', getProducts)
router.get('/products/:id', searchById)
router.get('/users', getUsers)
router.get('/profile', verifyToken , getProfile)
router.get('/refresh-token', verifyRefreshToken ,refreshToken)
router.get('/orders/:email', getOrder)
router.get('/order/:id', getOrderById)
router.get('/order/payment/:paymentId', getOrderByPaymentId)
router.get('/allOrders', verifyToken, verifyAdmin , getAllOrders)
router.get('/searchOrders', verifyToken, verifyAdmin , searchOrders)


// delete requests  
router.delete('/deleteProduct/:id', deleteWithId)

// update request
router.put('/updateProduct/:id', updateProduct)
router.put('/updateOrderStatus/:id', verifyToken, verifyAdmin, updateOrderStatus)
router.put('/orders/:id', verifyToken, verifyAdmin, updateOrder)
router.put('/orders/rating/:id', clientRating)

module.exports=router

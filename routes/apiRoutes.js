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
const addMenuItem = require('../controller/addMenuItem.js')
const updateMenuItem = require('../controller/updateMenuItem.js')
const paymentRouter = require('./payment.js');
const webhookRouter = require('./webhook.js');
const {verifyToken, verifyAdmin} = require('../middleware/authMiddleware.js')
const getProfile = require('../controller/getProfile.js')
const { verifyRefreshToken } = require('../middleware/authMiddleware.js')
// import the controllers
const { getBestSellingProducts } = require('../controller/analyticsController.js');
const  { createOrder }  = require('../controller/orderController.js');
const  refreshToken  = require('./auth.js')
const getOrder = require('../controller/getOrder.js')
const getOrderById = require('../controller/getOrderById.js')
const getOrderByPaymentId = require('../controller/getOrderByPaymentId.js')
const getAllOrders = require('../controller/getAllOrders.js')
const updateOrderStatus = require('../controller/updateOrderStatus.js')
const updateOrder = require('../controller/updateOrder.js')
const clientRating = require('../controller/updateRating.js')


// clear refresh cookie (logout)
const clearRefreshToken = (req, res)=>{
 res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict'
  });
  res.json({ success: true });
}

const storage = multer.diskStorage({
    destination: function (req, file , cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload=multer({storage})
// user post requests
router.post('/adduser', createUserRegister)
router.post('/addItem', addMenuItem)
router.post('/login', validateLogin)
router.post('/userOrder', upload.single('proofImage') , createOrder)
router.post('/logout', clearRefreshToken);

// products get requests
router.get('/allProducts', getProducts)
router.get('/products/:id', searchById)
router.get('/bestSellingProducts', getBestSellingProducts)
router.get('/users', getUsers)
router.get('/profile', verifyToken , getProfile)
router.get('/refresh-token', verifyRefreshToken ,refreshToken)
router.get('/orders/:email', getOrder)
router.get('/order/:id', getOrderById)
router.get('/order/payment/:paymentId', getOrderByPaymentId)
router.get('/allOrders', verifyToken, verifyAdmin , getAllOrders)


// delete requests
router.delete('/deleteProduct/:id', deleteWithId)

// update request
router.put('/updateProduct/:id', updateMenuItem)
router.put('/updateOrderStatus/:id', verifyToken, verifyAdmin, updateOrderStatus)
router.put('/orders/:id', verifyToken, verifyAdmin, updateOrder)
router.put('/orders/rating/:id', clientRating)

// payment routes
router.use('/payment', paymentRouter);
router.use('/webhook', webhookRouter);
module.exports=router

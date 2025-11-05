// delete specific product by id on admin request
const laptopProducts = require('../models/products');

const deleteWithId = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await laptopProducts.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `Product with id ${id} not found`
            });
        }
        return res.status(200).json({
            success: true,
            message: `Product with id ${id} deleted successfully`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while deleting the product'
        });
    }
};

module.exports = { deleteWithId };

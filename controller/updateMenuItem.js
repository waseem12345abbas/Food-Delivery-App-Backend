const foodProducts = require('../models/products')

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Update the updatedAt field
        updateData.updatedAt = new Date();

        const updatedItem = await foodProducts.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: `Product with id ${id} not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item updated successfully.',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

module.exports = updateMenuItem


const Customer = require("../modals/customerModel");
const User = require("../modals/userModel");
async function getDashBoardData(req, res) {
    try {
        const customerCount = await Customer.countDocuments();
        const userCount = await User.countDocuments();
        res.status(201).json({
            message: "success", data: {
                customerCount,
                userCount
            }, status: true
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(201).json({
            message: "not found", status: false
        });
    }
}
module.exports = {
    getDashBoardData
};

const Customer = require("../modals/customerModel");
const Order = require("../modals/ordersModel");
const { mongoose, ObjectId } = require("mongoose");
async function addCustomer(req, res) {
  try {
    // Extract user and vehicles data from the request body
    const { user } = req.body;

    // Create a new customer
    const newUser = new Customer({
      name: user.name,
      phone: user.phone,
      division: user.division,
      number: user.number,
      fatherName: user.fatherName,
      whatsapp: user.whatsapp,
      amount: user.amount
    });

    await newUser.save()

    // Respond with the newly created user, vehicles, and order
    res.json({ user: newUser,status:true });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: error.message });
  }
}
async function getCustomerById(req, res) {
  try {
    const userId = req.params.userId;

    // Find the existing user by ID along with associated vehicles
    const customer = await Customer.findById(userId).populate(
      "vehicles"
    ).populate({
      path: "selectedPackage",
      populate: {
        path: "plan",
        model: "Plan", // Replace with your Vehicle model name
      }
    });

    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user and associated vehicles
    res.json({ customer, status: true });
  } catch (error) {
    console.error("Error getting customer with vehicles:", error);
    res.status(500).json({ error: error.message });
  }
}
async function getCustomers(req, res) {
  try {
    const customers = await Customer.find()
      .sort({ _id: -1 })
      .exec();
    res.json({ message: "Registered Customers", customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching customers" });
  }
}
module.exports = {
  addCustomer,
  getCustomerById,
  getCustomers,
};

const Employee = require('../model/model.js');

// Get all employees with pagination
exports.getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  try {
    const employees = await Employee.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Employee.countDocuments();

    res.render('index', {
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send('Error fetching employees');
  }
};

// Show add employee form
exports.showAddEmployeeForm = (req, res) => res.render('add');

// Add a new employee
exports.addEmployee = async (req, res) => {
  const { title, description, image, price, rating } = req.body;

  console.log('Request body:', req.body); // Add this line to debug

  if (!title || !description || !image || !price || !rating) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const newEmployee = await Employee.create(req.body);
    res.redirect('/employees');
  } catch (error) {
    console.error('Error adding employee:', error.message);
    res.status(500).send('Error adding employee');
  }
};
// Show edit employee form
exports.showEditEmployeeForm = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render('edit', { employee });
  } catch (error) {
    res.status(500).send('Error fetching employee details');
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/employees');
  } catch (error) {
    res.status(500).send('Error updating employee');
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
  } catch (error) {
    res.status(500).send('Error deleting employee');
  }
};

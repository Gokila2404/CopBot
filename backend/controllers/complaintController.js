const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.json({ message: 'Complaint submitted successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getComplaints = async (req, res) => {
  const complaints = await Complaint.find().populate('user', 'name email');
  res.json(complaints);
};

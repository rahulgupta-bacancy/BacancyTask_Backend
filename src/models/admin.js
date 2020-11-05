import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String }
  },{
      timestamps:true
  });
  const Admin = new mongoose.model('Admin', adminSchema);

  export default Admin;
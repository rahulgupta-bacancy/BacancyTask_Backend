import mongoose from 'mongoose';


const studentSchema = new mongoose.Schema({
    firstname: { type: String ,required :true},
    lastname: { type: String },
    email: { type: String  ,required :true},
    password: { type: String  ,required :true},
    image: { type: String  ,required :true}
},{
    timestamps:true
});

const Student = new mongoose.model('Student', studentSchema);

export default Student;

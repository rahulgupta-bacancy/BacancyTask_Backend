import mongoose from 'mongoose';


const courseSchema = new mongoose.Schema({
    name: { type: String  ,required :true},
    duration: { type: String  ,required :true},
    domain: { type: String ,required :true }
},{
    timestamps:true
});

const Course = new mongoose.model('Course', courseSchema);

export default Course;

import mongoose from 'mongoose';

/**
 * Quotes Mongoose schema
 *   createdBy is referencing to User will need object id of User
 */
const courseWithUserSchema = new mongoose.Schema({
  studentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
    ,required :true},
    courseId:  [ { type: mongoose.Schema.Types.ObjectId, ref: 'Course' ,required :true } ]
},{
    timestamps:true
});

const OptedCourse = new mongoose.model('OptedCourse', courseWithUserSchema);

export default OptedCourse;

import mongoose from 'mongoose';


const usersSchema = new mongoose.Schema({
    firstname: { type: String ,required :true},
    lastname: { type: String },
    email: { type: String  ,required :true},
    degrees:[String],
    address:{type:String },
    image: { type: String  ,required :true}
},{
    timestamps:true
});

const Users = new mongoose.model('Users', usersSchema);

export default Users;

import mongoose from "mongoose" ; 

const tempTokens = new mongoose.Schema({
    tempToken : {
        type : String 
    } , 
    tempTokenSecret : {
        type : String 
    }
})

const tokens = mongoose.model('tokens' , tempTokens) ; 
export default tokens ; 
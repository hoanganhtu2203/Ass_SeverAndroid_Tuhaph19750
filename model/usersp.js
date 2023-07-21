const mongoose = require('mongoose')
const useSchema = new mongoose.Schema({
    idsp:{
        type:String
    },
    namesp:{
        type:String
    },
    giasp:{
        type:String
    },
    mota:{
        type:String
    },
    anh:{
        type:String
    }
    
})

const user = mongoose.model('dssanphams', useSchema)
module.exports = user
const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    CaseNo: String,
    Age: String,
    AgeGroup: String,
    Sex:String,
    DateRepConf: String,
    DateRecover: String,
    DateDied: String,
    RemovalType: String,
    DateRepRem: String,
    Admitted: String,
    RegionRes: String,
    ProvCityRes: String
})

// export patient module
module.exports = mongoose.model('patient', patientSchema)

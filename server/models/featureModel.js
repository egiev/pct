const GeoJSON = require('mongoose-geojson-schema')
const mongoose = require('mongoose')

// setup schema
const featureSchema = new mongoose.Schema({
  type: String,
  geometry: mongoose.Schema.Types.MultiPolygon | mongoose.Schema.Types.Polygon,
  properties: {
    ENGTYPE_2: String,
    ID_0: Number,
    ID_1: Number,
    ID_2: Number,
    ISO: String,
    NAME_0: String,
    NAME_1: String,
    NAME_2: String,
    NL_NAME_2: String,
    PROVINCE: String,
    REGION: String,
    TYPE_2: String,
    VARNAME_2: String,
    TOTAL: Number,
    DIED: Number,
    RECOVERED: Number
  }
})

// export feature module
module.exports = mongoose.model('feature', featureSchema)
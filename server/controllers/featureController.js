// Import feature model
const Feature = require('../models/featureModel')
const Patient = require('../models/patientModel')

// get
exports.list = async (req, res) => {
  try {
    const features = await Feature.find()
    const patients = await Patient.find({ RegionRes: 'Pangasinan' })

    died = 0
    recovered = 0
    patients.forEach(p => {
      switch(p.RemovalType) {
        case 'Died':
          died += 1
          break
        case 'Recovered':
          recovered += 1
          break
        default:
          break
      }
    })
    
    res.json({
      sucess: 'success',
      message: 'test',
      data: {
        features: features,
        total: patients.length,
        died: died,
        recovered: recovered
      },
    })
  } catch (error) {
    res.status(500).json({
      sucess: 'error',
      message: error
    })
  }
}

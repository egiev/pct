const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const csv = require('csv-parser')
const cors = require('cors')

// init app
const app = express()

app.use(cors())

// import feature model
const Feature = require('./models/featureModel')
const Patient = require('./models/patientModel')

// import routes
const apiRoutes = require('./routes')

// connect to mongoose
mongoose.connect('mongodb://localhost:27017/covid', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const con = mongoose.connection
con.on('error', error => console.error(error))
con.once('open', () => {
  console.log('MongoDB connected successfully')
})

async function init_patient_data() {
  const data = await Patient.find()

  if(data.length !== 0) {
    return
  }

  fs.createReadStream('./source/covid-case.csv')
    .pipe(csv())
    .on('data', (row) => {
      let patient = new Patient(row)

      switch(patient.ProvCityRes) {
        case 'City of Alaminos' || 'Alaminos':
          patient.ProvCityRes = 'Alaminos City'
          break
        case 'City of Urdaneta':
          patient.ProvCityRes = 'Urdaneta City'
          break
        case 'Lingayen (Capital)':
          patient.ProvCityRes = 'Lingayen'
          break
      }

      if(patient.RegionRes == 'Pangasinan') {
        console.log('Patient Location', patient.ProvCityRes)
      }
      patient.save()
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

async function init_feature_data() {
  //init patient data
  init_patient_data()

  const data = await Feature.find()

  if(data.length !== 0) {
    // data exist
    return
  }

  let raw_data = fs.readFileSync('./geojson/municipality.json')
  let geojson = JSON.parse(raw_data)
  
  for (let index = 0; index < geojson.features.length; index++) {
    try {
      // get patients per municipality
      const patients = await Patient.find({ RegionRes: 'Pangasinan', ProvCityRes: { $regex: geojson.features[index].properties.NAME_2} })
      
      // add total, died, recoverer property
      let died = 0
      let recovered = 0

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

      geojson.features[index].properties.TOTAL = patients.length
      geojson.features[index].properties.DIED = died
      geojson.features[index].properties.RECOVERED = recovered
      
      let feature = new Feature(geojson.features[index])
      
      feature.save()
    } catch (error) {
      console.log(error)
    }
  }
}

// init data
init_feature_data()

// accept json as a data format
app.use(express.json())

// use api routes
app.use('/api', apiRoutes)

// setup server port
const port = 3000
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
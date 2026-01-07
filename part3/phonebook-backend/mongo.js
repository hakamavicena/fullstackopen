const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hakammustain_db_user:${password}@cluster0.qrqmopa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phoneSchema)

if (process.argv.length === 3) {
  console.log('phonebook: ')
  Phonebook.find({}).then((result) => {
    result.forEach((phone) => {
      console.log(`${phone.name} ${phone.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const num = process.argv[4]

  const newPhone = new Phonebook({ name: name, number: num })
  newPhone.save().then(() => {
    console.log(`added ${name} number ${num} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log(
    'Please provide correct arguments: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

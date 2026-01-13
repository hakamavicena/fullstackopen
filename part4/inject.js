require('dotenv').config()
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const User = require('./models/user')

const url = process.env.MONGODB_URI
mongoose.connect(url)

const linkData = async () => {
  const matti = await User.findById('695dd96f04069fd85dc63c09')
  const root = await User.findById('695dd97b04069fd85dc63c0b')

  const note1 = await Blog.findById('695bdef2f598cf287636186d')
  const note2 = await Blog.findById('695bdf04f598cf287636186f')
  const note3 = await Blog.findById('695bdf16f598cf2876361871')


  matti.blogs = [note1._id, note2._id]
  root.blogs = [note3._id]

  note1.user = matti._id
  note2.user = matti._id
  note3.user = root._id

  await matti.save()
  await root.save()
  await note1.save()
  await note2.save()
  await note3.save()

  console.log('Data berhasil dihubungkan!')
  mongoose.connection.close()
}

linkData()

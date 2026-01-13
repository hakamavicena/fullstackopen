const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const helper = require('./blog_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekiansekian', 10)
  const user = new User({
    username: 'root',
    name: 'Super User',
    passwordHash,
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser.id,
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  const blogsWithUser = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: savedUser.id,
  }))
  await Blog.insertMany(blogsWithUser)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned notes', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map((e) => e.title)
  assert(contents.includes('Tutorial Belajar Backend'))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Pola patterns',
    author: 'Michael James',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map((n) => n.title)
  assert(contents.includes('Pola patterns'))
})

test('adding a blog fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'No Token Blog',
    author: 'Hacker',
    url: 'https://hacker.com/',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('likes defaults to 0 if missing', async () => {
  const newBlog = {
    title: 'Pola Poly',
    author: 'Hakam',
    url: 'https://poly.com/',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
  const notesAtEnd = await helper.blogsInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 1)
})

test('blog without title or url', async () => {
  const newBlog = {
    author: 'Hakam',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const notesAtEnd = await helper.blogsInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length)
})

test('delete blog with id', async () => {
  const blogAtStart = await helper.blogsInDb()
  const blogDeleted = blogAtStart[0]

  await api
    .delete(`/api/blogs/${blogDeleted.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogAtEnd = await helper.blogsInDb()
  const ids = blogAtEnd.map((b) => b.id)
  assert(!ids.includes(blogDeleted.id))
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length - 1)
})

test('update likes with id', async () => {
  const blogAtStart = await helper.blogsInDb()
  const blogChanged = blogAtStart[0]
  const updatedData = { ...blogChanged, likes: 77 }

  await api.put(`/api/blogs/${blogChanged.id}`).send(updatedData).expect(200)

  const blogAtEnd = await helper.blogsInDb()
  const processedBlog = blogAtEnd.find((b) => b.id === blogChanged.id)
  assert.strictEqual(processedBlog.likes, 77)
})

after(async () => {
  await mongoose.connection.close()
})

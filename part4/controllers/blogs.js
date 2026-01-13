const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', userExtractor, async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })

  if (blog.likes === null || blog.likes === undefined) {
    blog.likes = 0
  }

  if (!blog.title || !blog.url) {
    response.status(400).end()
  } else {
    const result = await blog.save()
    await result.populate('user')
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body
  const blog = await Blog.findById(request.params.id)

  blog.comments = blog.comments.concat(content)
  await blog.save()

  response.status(201).json(blog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(204).end()
  }
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response
      .status(401)
      .json({ error: 'only the creator can delete this blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter

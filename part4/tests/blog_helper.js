const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    id: "695bdef2f598cf287636186d",
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    id: "695bdf04f598cf287636186f",
  },
  {
    title: "Tutorial Belajar Backend",
    author: "Hakam",
    url: "http://localhost:3003/api/blogs",
    likes: 100,
    id: "695bdf16f598cf2876361871",
  },
];

// const nonExistingId = async () => {
//   const note = new Blog({ content: 'willremovethissoon' })
//   await note.save()
//   await note.deleteOne()

//   return note._id.toString()
// }

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}
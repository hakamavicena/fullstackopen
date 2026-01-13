import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [hide, setHide] = useState(true)
  const text = hide ? 'view' : 'hide'

  const handleLike = () => {
    addLike(blog.id, blog)
  }

  const handleDelete = () => {
    deleteBlog(blog)
  }

  const isCreator = user && blog.user && user.username === blog.user.username

  return (
    <div style={blogStyle} className="blog">
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
      <button onClick={() => setHide(!hide)}>{text}</button>

      {!hide && (
        <div className="togglableContent">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>

          {isCreator && <button onClick={handleDelete}>delete</button>}
        </div>
      )}
    </div>
  )
}

export default Blog

import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>title</label>
          <input
            type="text"
            onChange={({ target }) => setNewTitle(target.value)}
            value={newTitle}
            placeholder="write title here"
            id="title"
          />
        </div>

        <div>
          <label>author</label>
          <input
            type="text"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder="write author here"
          />
        </div>

        <div>
          <label>url</label>
          <input
            type="text"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder="write url here"
          />
        </div>

        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm

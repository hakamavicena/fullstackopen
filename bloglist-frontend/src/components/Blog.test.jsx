import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let mockLikeHandler
  let mockDeleteHandler
  let user

  beforeEach(() => {
    blog = {
      title: 'Testing React components',
      author: 'Hakam',
      url: 'https://react.dev/',
      likes: 10,
      user: {
        username: 'root',
        name: 'Super User',
      },
    }

    user = {
      username: 'root',
    }

    mockLikeHandler = vi.fn()
    mockDeleteHandler = vi.fn()
  })

  test('renders title and author, but does not render URL or likes by default', () => {
    render(
      <Blog
        blog={blog}
        addLike={mockLikeHandler}
        deleteBlog={mockDeleteHandler}
        user={user}
      />
    )

    const titleElement = screen.getByText(blog.title, { exact: false })
    const authorElement = screen.getByText(blog.author, { exact: false })

    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()

    const urlElement = screen.queryByText(blog.url)
    const likesElement = screen.queryByText('likes', { exact: false })

    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('shows URL and number of likes when the view button is clicked', async () => {
    const userSession = userEvent.setup()

    render(
      <Blog
        blog={blog}
        addLike={mockLikeHandler}
        deleteBlog={mockDeleteHandler}
        user={user}
      />
    )

    const button = screen.getByText('view')

    await userSession.click(button)

    const urlElement = screen.getByText(blog.url)
    const likesElement = screen.getByText(`likes ${blog.likes}`) // Sesuaikan dengan teks di kodemu

    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
  })

  test('ensure that if the like button is clicked twice, the event handler is called twice', async () => {
    const userSession = userEvent.setup()

    render(
      <Blog
        blog={blog}
        addLike={mockLikeHandler}
        deleteBlog={mockDeleteHandler}
        user={user}
      />
    )

    const viewButton = screen.getByText('view')
    await userSession.click(viewButton)

    const likeButton = screen.getByText('like')

    await userSession.click(likeButton)
    await userSession.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})

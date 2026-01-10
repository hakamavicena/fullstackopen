import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = token ? { headers: { Authorization: token } } : {}
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

const deleteOne = (id) => {
  const config ={ headers:{ Authorization:token } }
  const request = axios.delete(`${baseUrl}/${id}`,config)
  return request.then((response) => response.data)
}
export default { getAll, setToken,create, update,deleteOne }
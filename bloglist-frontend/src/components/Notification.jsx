import {useSelector} from 'react-redux'

export default function Notification() {
  const desc = useSelector(state => state.notification)
  if (desc === null) {
    return null
  }

  const style = {
    color: desc.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div className={desc.type} style={style}>
      {desc.message}
    </div>
  )
}

import { useParams } from 'react-router-dom'

function VenuePage() {
  const { id } = useParams()
  return <h1>Venue {id}</h1>
}

export default VenuePage

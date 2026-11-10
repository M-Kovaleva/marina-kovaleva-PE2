import ErrorScreen from '../components/ErrorScreen'

function NotFoundPage() {
  return (
    <ErrorScreen
      title="Page not found"
      message="The page you’re looking for doesn’t exist or has moved."
      link={{ to: '/', label: 'Back to home' }}
    />
  )
}

export default NotFoundPage
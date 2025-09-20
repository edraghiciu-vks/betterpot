// Login component placeholder
export const Login = () => {
  return (
    <div className="login">
      <h2>Login with Beatport</h2>
      <button onClick={() => window.location.href = '/api/auth/login'}>
        Connect to Beatport
      </button>
    </div>
  )
}
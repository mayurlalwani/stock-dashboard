export default function Login({ onLogin }) {
  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Enter email"
        onKeyDown={e => {
          if (e.key === "Enter") onLogin(e.target.value);
        }}
      />
    </div>
  );
}

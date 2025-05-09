import { useNavigate } from "react-router-dom";

function Home({ users }) {
  const navigate = useNavigate();

  const handleSelectUser = (userId) => {
    navigate(`/user/${userId}`);
  };

  const customerUsers = users.filter((u) => u.role === "customer");

  return (
    <div style={{ padding: "2rem" }}>
      {/* <h2>Welcome, {currentUser.name}!</h2> */}
      <h3 style={{marginBottom:'1rem'}}>Customer List:</h3>
      <div className="card-container">
        {customerUsers.map((user) => (
          <div className="card" key={user.id}>
            <h4>{user?.first_name+" "+user?.last_name}</h4>
            <p>{user?.email}</p>
            <button onClick={() => handleSelectUser(user.id)}>
              Manage Books
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

// File: src/App.jsx

import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import UserBooks from "./Pages/UserBooks";
import Login from "./Pages/Login";

function App() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState({});
  const [bookOptions, setBookOptions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users data
    fetch("http://localhost:5000/api/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));

    // Fetch book options data
    fetch("/data/bookOptions.json")
      .then(response => response.json())
      .then(data => setBookOptions(data))
      .catch(error => console.error("Error fetching book options:", error));
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      setCurrentUser(data);
      if(data.role==='customer'){
        navigate(`/user/${data.id}`);
      }else{
        navigate("/Home");
      }
     
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };


  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <>
      {currentUser && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 20px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd'
        }}>
          <div>Welcome, {currentUser?.first_name+" "+currentUser?.last_name} ({currentUser?.role})</div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '5px 15px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}

      <Routes>
        <Route path="/Home" element={<Home currentUser={currentUser} users={users} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/:userId" element={<UserBooks bookOptions={bookOptions} books={books} setBooks={setBooks} users={users} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </>
  );
}

export default App;

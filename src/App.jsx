import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import UserBooks from "./Pages/UserBooks";
import Login from "./Pages/Login";

// Dummy users data
const initialUsers = [

  {
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "id": 1,
    "role": "admin",
    "is_active": true
},
{
    "email": "dilip.y@novarroh.com",
    "first_name": "dilip",
    "last_name": "y",
    "id": 2,
    "role": "customer",
    "is_active": true
},
{
    "email": "ravi@yopmail.com",
    "first_name": "ravi",
    "last_name": "a",
    "id": 3,
    "role": "customer",
    "is_active": true
}
];

// Dummy books data
const initialBooks = {
  1: [
    { id: 1, "title": "To Kill a Mockingbird", "author": "Harper Lee" },
    { id: 2,  "title": "1984", "author": "George Orwell" },
  ],
  
};

const bookOptions=[
  {
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "id": 1,
      "quantity": 5,
      "available_quantity": 5
  },
  {
      "title": "1984",
      "author": "George Orwell",
      "id": 2,
      "quantity": 8,
      "available_quantity": 8
  },
  {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "id": 3,
      "quantity": 3,
      "available_quantity": 3
  },
  {
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "id": 4,
      "quantity": 7,
      "available_quantity": 7
  }]

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [books, setBooks] = useState(initialBooks);
  const [currentUser, setCurrentUser] = useState({
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "id": 1,
    "role": "admin",
    "is_active": true
},);

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
  
      const data = await response.json();
  
      // Assuming the API returns user data in the response
      setCurrentUser(data);
      navigate("/Home");
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };
  

  const handleRegister = (name, email, password) => {
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      role: "customer",
    };
    setUsers([...users, newUser]);
    alert("Registered successfully! Please login.");
    navigate("/login");
  };

  // New logout function
  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* Simple navbar with logout button */}
      {currentUser && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 20px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd'
        }}>
          <div>Welcome, {currentUser.name} ({currentUser.role})</div>
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
        <Route
          path="/Home"
          element={<Home currentUser={currentUser} users={users} onLogout={handleLogout} />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<Register onRegister={handleRegister} />}
        />
        <Route
          path="/user/:userId"
          element={
            <UserBooks
            bookOptions={bookOptions}
              books={books}
              setBooks={setBooks}
              users={users}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          }
        />
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </>
  );
}

export default App;
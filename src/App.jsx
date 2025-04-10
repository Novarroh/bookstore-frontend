import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import UserBooks from "./Pages/UserBooks";
import Login from "./Pages/Login";

// Dummy users data
const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    role: "admin",
    email: "admin@example.com",
    password: "adminpass",
  },
  {
    id: 2,
    name: "Librarian User",
    role: "librarian",
    email: "librarian@example.com",
    password: "librarianpass",
  },
  {
    id: 3,
    name: "Ankit",
    role: "customer",
    email: "Ankit@example.com",
    password: "customerpass",
  },
  {
    id: 4,
    name: "Dilip",
    role: "customer",
    email: "Dilip@example.com",
    password: "customerpass",
  },
  {
    id: 5,
    name: "Poorna",
    role: "customer",
    email: "Poorna@example.com",
    password: "customerpass",
  },
];

// Dummy books data
const initialBooks = {
  3: [
    { id: 1, name: "Book A" },
    { id: 2, name: "Book B" },
  ],
  4: [
    { id: 3, name: "Book C" },
    { id: 4, name: "Book D" },
  ],
  5: [
    { id: 5, name: "Book E" },
    { id: 6, name: "Book F" },
  ],
};

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [books, setBooks] = useState(initialBooks);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      navigate("/Home");
    } else {
      alert("Invalid credentials");
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

  return (
    <Routes>
      <Route
        path="/Home"
        element={<Home currentUser={currentUser} users={users} />}
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
            books={books}
            setBooks={setBooks}
            users={users}
            currentUser={currentUser}
          />
        }
      />
    </Routes>
  );
}

export default App;

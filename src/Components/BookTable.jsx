// File: src/components/BookTable.jsx

import { useState, useEffect } from "react";

function BookTable({ books, onDelete, onEdit, isEditable, bookOptions ,currentUser}) {
  const [userBooks, setUserBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");


  useEffect(() => {
    fetchTableData();
  },[]);

  const fetchTableData=()=>{
    fetch("/data/BooksTable.json")
    .then((response) => response.json())
    .then((data) => setUserBooks(data))
    .catch((error) => console.error("Error fetching user books:", error));
  }

  const EditTableData=()=>{
    
  }
  const deleteTableData = async (id) => {
    try {
      const response = await fetch(`/api/borrowings/${id}/return`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to return the book");
      }

      const data = await response.json();
      alert(data.message || "Book returned successfully");

      setUserBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      alert(error.message || "Something went wrong while returning the book");
    }
  };
console.log("userBooks",userBooks);
  const startEditing = (book) => {
    setEditingId(book.id);
    setEditValue(book.book.title);
  };

  const saveEdit = (bookId) => {
    if (editValue.trim() !== "") {
      onEdit(bookId, editValue);
    }
    setEditingId(null);
  };

  const tableStyle = {
    borderCollapse: "collapse",
    margin: 'auto',
    border: '1px solid rgb(221, 221, 221)',
    marginTop: "2rem",
    width:'100%',
  };

  const thStyle = {
    backgroundColor: "#f4f4f4",
    padding: "12px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  };

  const buttonStyle = {
    marginRight: "8px",
    padding: "6px 12px",
    border: "none",
    backgroundColor: "#3f72af",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336",
  };

  const selectStyle = {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Book Name</th>
          <th  style={thStyle}>Book Author</th>
          <th  style={thStyle}>available quantity</th>
          {isEditable && <th style={thStyle}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {userBooks.map((val) => (
          <tr key={val.id}>
            <td style={tdStyle}>
              {editingId === val.id ? (
                <select
                  style={selectStyle}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                >
                  <option value="">Select a Book</option>
                  {bookOptions.map((option, index) => (
                    <option key={index} value={option.title}>
                      {option.title}
                    </option>
                  ))}
                </select>
              ) : (
                val.book.title
              )}
            </td>
            <td  style={tdStyle}>{val.book.author}</td>
            <td  style={tdStyle}>{val.book.available_quantity}</td>
            {isEditable && (
              <td style={tdStyle}>
                {editingId === val.id ? (
                  <>
                    <button
                      style={buttonStyle}
                      onClick={() => saveEdit(val.id)}
                    >
                      Save
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      style={buttonStyle}
                      onClick={() => startEditing(val)}
                    >
                      Edit
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => deleteTableData(val.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookTable;
import { useState } from "react";

function BookTable({ books, onDelete, onEdit, isEditable }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (book) => {
    setEditingId(book.id);
    setEditValue(book.name);
  };

  const saveEdit = (bookId) => {
    onEdit(bookId, editValue);
    setEditingId(null);
  };

  // Styles
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const thStyle = {
    backgroundColor: "#f4f4f4",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
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

  const inputStyle = {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Book Name</th>
          {isEditable && <th style={thStyle}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td style={tdStyle}>
              {editingId === book.id ? (
                <input
                  style={inputStyle}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                book.name
              )}
            </td>
            {isEditable && (
              <td style={tdStyle}>
                {editingId === book.id ? (
                  <button style={buttonStyle} onClick={() => saveEdit(book.id)}>
                    Save
                  </button>
                ) : (
                  <button
                    style={buttonStyle}
                    onClick={() => startEditing(book)}
                  >
                    Edit
                  </button>
                )}
                <button
                  style={deleteButtonStyle}
                  onClick={() => onDelete(book.id)}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookTable;

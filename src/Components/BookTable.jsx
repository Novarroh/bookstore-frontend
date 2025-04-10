import { useState } from "react";

function BookTable({ books, onDelete, onEdit, isEditable, bookOptions }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (book) => {
    setEditingId(book.id);
    setEditValue(book.name);
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
  };

  const thStyle = {
    backgroundColor: "#f4f4f4",
    padding: "12px",
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
          {isEditable && <th style={thStyle}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td style={tdStyle}>
              {editingId === book.id ? (
                <select
                  style={selectStyle}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                >
                  <option value="">Select a Book</option>
                  {bookOptions.map((val, index) => (
                    <option key={index} value={val.title}>
                      {val.title}
                    </option>
                  ))}
                </select>
              ) : (
                book.title
              )}
            </td>
            {isEditable && (
              <td style={tdStyle}>
                {editingId === book.id ? (
                  <>
                    <button
                      style={buttonStyle}
                      onClick={() => saveEdit(book.id)}
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
                      onClick={() => startEditing(book)}
                    >
                      Edit
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => onDelete(book.id)}
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
import { useState } from "react";

function AddBookForm({ onAddBook, bookOptions }) {
  const [selectedBook, setSelectedBook] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedBook.trim() === "") return;
    onAddBook(selectedBook);
    setSelectedBook("");
  };

  return (
    <form
      onSubmit={handleSubmit }
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#f9f9f9",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "20px auto",
      }}
    >
      <select
        value={selectedBook}
        onChange={(e) => setSelectedBook(e.target.value)}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      >
        <option value="">Select a Book</option>
        {bookOptions.map((val, index) => (
          <option key={index} value={val.title}>
            {val.title}
          </option>
        ))}
      </select>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#3f72af",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#3f72af")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#3f72af")}
      >
        Add Book
      </button>
    </form>
  );
}

export default AddBookForm;

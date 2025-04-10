import { useState } from "react";

function AddBookForm({ onAddBook }) {
  const [bookName, setBookName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookName.trim() === "") return;
    onAddBook(bookName);
    setBookName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
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
      <input
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
        placeholder="New Book Name"
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
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
        onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
      >
        Add Book
      </button>
    </form>
  );
}

export default AddBookForm;

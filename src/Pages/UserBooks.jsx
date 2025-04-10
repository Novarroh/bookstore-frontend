import { useParams } from "react-router-dom";
import AddBookForm from "../Components/AddBookForm";
import BookTable from "../Components/BookTable";

function UserBooks({ books, setBooks, users, currentUser,bookOptions }) {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));
  const userBooks = books[user.id] || [];

  const handleAddBook = (bookName) => {
    const newBook = { id: Date.now(), name: bookName };
    setBooks((prev) => ({
      ...prev,
      [user.id]: [...(prev[user.id] || []), newBook],
    }));
  };

  const handleDeleteBook = (bookId) => {
    setBooks((prev) => ({
      ...prev,
      [user.id]: prev[user.id].filter((book) => book.id !== bookId),
    }));
  };

  const handleEditBook = (bookId, newName) => {
    setBooks((prev) => ({
      ...prev,
      [user.id]: prev[user.id].map((book) =>
        book.id === bookId ? { ...book, name: newName } : book
      ),
    }));
  };

  return (
    <div style={{padding:'2rem'}}>
      <h2>Books borrowed by {user?.first_name}</h2>
      {(currentUser.role === "admin" || currentUser.role === "librarian") && (
        <AddBookForm onAddBook={handleAddBook} bookOptions={bookOptions} />
      )}
      <BookTable
      bookOptions={bookOptions}
        books={userBooks}
        onDelete={handleDeleteBook} 
        onEdit={handleEditBook}
        isEditable={
          currentUser.role === "admin" || currentUser.role === "librarian"
        }
      />
    </div>
  );
}

export default UserBooks;

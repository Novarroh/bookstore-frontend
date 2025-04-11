import { useParams } from "react-router-dom";
import AddBookForm from "../Components/AddBookForm";
import BookTable from "../Components/BookTable";

function UserBooks({ books, setBooks, users, currentUser,bookOptions }) {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));
  const userBooks = books[user.id] || [];

  // const handleAddBook = (bookName) => {

  //   const newBook = { id: Date.now(), name: bookName };
  //   setBooks((prev) => ({
  //     ...prev,
  //     [user.id]: [...(prev[user.id] || []), newBook],
  //   }));
  // };

  const handleAddBook = async (bookName) => {
    try {
      const selectedBook = bookOptions.find((book) => book.title === bookName);
      if (!selectedBook) {
        alert("Selected book not found");
        return;
      }

      const payload = {
        book_id: selectedBook.id,
        user_id: userBooks[0]?.user?.id || null, // fallback to user ID 1 if not found
        is_returned: false,
        current_user_id: currentUser?.id || null,
      };

      const response = await fetch(`/api/borrowings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add the book");
      }

      const data = await response.json();
      alert(data.message || "Book added successfully");


    
    } catch (error) {
      alert(error.message || "Something went wrong while adding the book");
    }
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
        currentUser={currentUser}
        isEditable={
          currentUser.role === "admin" || currentUser.role === "librarian"
        }
      />
    </div>
  );
}

export default UserBooks;

import { useParams, useSearchParams } from "react-router-dom";
import AddBookForm from "../Components/AddBookForm";
import BookTable from "../Components/BookTable";
import { useState } from "react";

function UserBooks({ books, setBooks, users, currentUser,bookOptions }) {
  const [bookAdded,setbookAdded]=useState(false)
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));
  const userBooks = books[user?.id] || [];

  const handleAddBook = async (bookName) => {
    try {
      const selectedBook = bookOptions.find((book) => book.title === bookName);

      const payload = {
        book_id: selectedBook.id,
        user_id: user?.id|| null, // fallback to user ID 1 if not found
        is_returned: false,
        current_user_id: currentUser?.id || null,
      };

      const response = await fetch(`http://localhost:5000/api/borrowings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail);
        return;
      }

      const data = await response.json();
      setbookAdded(!bookAdded);
      alert(data.message || "Book added successfully");


    
    } catch (error) {
      alert(error.message || "Something went wrong while adding the book");
    }
  };


  return (
    <div style={{padding:'2rem'}}>
      <h2>Books borrowed by {user?.first_name}</h2>
      {(currentUser.role === "admin" || currentUser.role === "librarian") && (
        <AddBookForm onAddBook={handleAddBook} bookOptions={bookOptions} setbookAdded={setbookAdded} />
      )}
      <BookTable
      bookOptions={bookOptions}
        books={userBooks}
        bookAdded={bookAdded}
        currentUser={currentUser}
        userId={ user?.id||null}
        isEditable={
          currentUser.role === "admin" || currentUser.role === "librarian"
        }
      />
    </div>
  );
}

export default UserBooks;

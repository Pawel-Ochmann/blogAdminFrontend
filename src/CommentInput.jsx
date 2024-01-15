import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const CommentInput = ({ postId }) => {
  const [content, setContent] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const submitComment = async () => {
    // Assuming you have an API endpoint to handle the comment submission
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://blogbackend.adaptable.app/admin/comments/${postId}`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      if (response.ok) {
        // Handle success, e.g., update UI or trigger a reload of comments
        console.log('Comment submitted successfully!');
      } else {
        // Handle error, e.g., display an error message
        console.error('Error submitting comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission and page reload

    if (content.trim() !== '') {
      submitComment();
      setContent('');
      window.location.reload();
    }
  };

  return (
    <div>
      <form className='commentInput' method='post'>
        <h3>Add a New Comment</h3>
        <label>
          <textarea
            value={content}
            onChange={handleContentChange}
            name='content'
            required
          ></textarea>
        </label>
        <button onClick={handleSubmit}>Add New Comment</button>
      </form>
    </div>
  );
};

export default CommentInput;

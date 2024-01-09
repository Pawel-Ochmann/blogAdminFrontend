import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentInput from './CommentInput';
import { useNavigate, Link } from 'react-router-dom';

export default function Post() {
  let { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/admin/posts/${postId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 401) {
          console.error('Unauthorized. Redirecting to login page...');
          history('/log_in'); // Replace '/login' with your desired route
          return;
        }

        return response.json();
      })
      .then((response) => {
        const { post, comments } = response;
        setPost(post);
        setComments(comments);
      })
      .catch((error) => console.error(error));
  }, [postId]);


      const deleteComment = async (comment_id) => {
        // Assuming you have an API endpoint to handle the comment submission
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            `http://localhost:3000/admin/comments/${comment_id}`,
            {
              method: 'DELETE',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            // Handle success, e.g., update UI or trigger a reload of comments
            console.log('Comment deleted successfully!');
          } else {
            // Handle error, e.g., display an error message
            console.error('Error submitting comment');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const handleDelete = (e, comment_id) => {
      e.preventDefault(); // Prevents the default form submission and page reload
      deleteComment(comment_id);
      window.location.reload()
    };

    const handleContentChange = (e, comment_id) => {
      e.preventDefault();
      const commentChangedId = comments.findIndex((comment)=>{return comment._id === comment_id});
      const updatedComments = [...comments];
      updatedComments[commentChangedId].content = e.target.value; 
      setComments(updatedComments);
    }

  return (
    <>
      {post ? (
        <div className='post'>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>{post.date_formatted}</p>
        </div>
      ) : (
        <p>Post is loading... </p>
      )}
      <CommentInput postId={postId} />
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <p>Author: {comment.author}</p>
              <textarea
                name=''
                id=''
                cols='30'
                rows='5'
                value={comment.content}
                onChange={(e)=>{handleContentChange(e, comment._id)}}
              ></textarea>
              <p>Date: {comment.date_formatted}</p>
              <button>Edit Comment</button>
              <button
                onClick={(e) => {
                  handleDelete(e, comment._id);
                }}
              >
                Delete Comment
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

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

      if (response.status === 401) {
        // Handle your own logic to navigate to another route
        console.error('Unauthorized. Redirecting to login page...');
        history('/log_in'); // Replace '/login' with your desired route
        return;
      }

      if (response.ok) {
        console.log('Comment deleted successfully!');
      } else {
        console.error('Error deleting comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = (e, comment_id) => {
    e.preventDefault();
    deleteComment(comment_id);
    window.location.reload();
  };

  const handleContentChange = (e, comment_id) => {
    e.preventDefault();
    const commentChangedId = comments.findIndex((comment) => {
      return comment._id === comment_id;
    });
    const updatedComments = [...comments];
    updatedComments[commentChangedId].content = e.target.value;
    setComments(updatedComments);
  };

  const editComment = async (e, comment_id, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/admin/comments/${comment_id}`,
        {
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      if (response.ok) {
        console.log('Comment edited successfully!');
      } else {
        console.error('Error editing comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleEdit = (e, comment_id) => {
    e.preventDefault();
    const commentContent = comments.find((comment) => {
      return comment._id === comment_id;
    }).content;

    if (commentContent !== '') {
      editComment(e, comment_id, commentContent);
      window.location.reload();
    } else {
      window.alert('Write something in the comment or delete it!');
    }
  };

  const handleEditPost = (e, postId) => {
    e.preventDefault();
    history(`/:${postId}/edit`)
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/admin/posts/${postId}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        // Handle your own logic to navigate to another route
        console.error('Unauthorized. Redirecting to login page...');
        history('/log_in'); // Replace '/login' with your desired route
        return;
      }

      if (response.status === 200) {
        console.log('Post deleted successfully!');
        history('/');
      } else {
        console.error('Error deleting post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleDeletePost = (e, postId) => {
    e.preventDefault();
    deletePost(postId);
  };

  return (
    <>
      {post ? (
        <div className='post'>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <p>
            <strong>Published: </strong>
            {post.published ? 'Yes' : 'No'}
          </p>
          <p>{post.date_formatted}</p>
          <button
            onClick={(e) => {
              handleEditPost(e, post._id);
            }}
          >
            Edit Post
          </button>
          <button
            onClick={(e) => {
              handleDeletePost(e, post._id);
            }}
          >
            Delete Post
          </button>
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
                onChange={(e) => {
                  handleContentChange(e, comment._id, comment.content);
                }}
              ></textarea>
              <p>Date: {comment.date_formatted}</p>
              <button
                onClick={(e) => {
                  handleEdit(e, comment._id);
                }}
              >
                Edit Comment
              </button>
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

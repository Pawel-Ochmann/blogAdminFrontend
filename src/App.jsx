import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [posts, setPosts] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          // Handle your own logic to navigate to another route
          console.error('Unauthorized. Redirecting to login page...');
          history('/log_in'); // Replace '/login' with your desired route
          return;
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const PostList = ({ posts }) => {
    return (
      <div>
        <h2 className='listTitle'>Post List</h2>
        {posts.map((post) => (
          <div className='postBox' key={post._id}>
            <Link className='postTitle' to={`/${post._id}`}>
              <h2>{post.title}</h2>
            </Link>
            <div
              className='postContent'
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {post.image ? (
              <img src={post.image} alt='Post Image' />
            ) : (
              <p className='imageDescription'>No image added to this post yet.</p>
            )}
            <p>
              <strong>Date: </strong>
              {post.date_formatted}
            </p>
            <p>
              <strong>Published: </strong>
              {post.published ? 'Yes' : 'No'}
            </p>
            <div className='commentBox'>
              <FontAwesomeIcon icon={faComment} />
              {post.comments.length}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='container'>
      <h1>Travel Blog Admin Panel</h1>
      <Link to='/posts/new'>
        <button>Create new post</button>
      </Link>
      <PostList posts={posts} />
    </div>
  );
};

export default App;

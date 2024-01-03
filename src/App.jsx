import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      }});

        
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
        <h2>Post List</h2>
        {posts.map((post) => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>
              <strong>Date: </strong>
              {post.date_formatted}
            </p>
            <p>
              <strong>Published: </strong>
              {post.published ? 'Yes' : 'No'}
            </p>
            <p>{post.comments.length}</p>
            <hr />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Your Blog</h1>
      <PostList posts={posts} />
    </div>
  );
};

export default App;

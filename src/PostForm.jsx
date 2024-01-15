import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import GoMain from './GoMain';

const FormPost = () => {
  const [postData, setPostData] = useState({
    title: '',
    image:'',
    content: '',
    published: false,
  });

  const { postId } = useParams();
  const history = useNavigate();

  useEffect(() => {
    if (postId === undefined) return;
    const id = postId.slice(1);
    const token = localStorage.getItem('token');

    fetch(`https://blogbackend.adaptable.app/admin/posts/${id}`, {
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
        const { post } = response;
        setPostData((prevData) => ({
          ...prevData,
          title: post.title,
          image: post.image ?? '',
          content: post.content,
          published: post.published,
        }));
      })

      .catch((error) => console.error(error));
  }, [postId, history]);

  const handleEditorChange = (content) => {
    setPostData({ ...postData, content });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let id;
    if (postId) {id = postId.slice(1)} else {id = false}
    if (postData.title === '') {
      return window.alert("Don't forget about title");
    } else if (postData.content === '') {
      return window.alert('There must be a content of a post');
    }
    try {
      const address = id
        ? `https://blogbackend.adaptable.app/admin/posts/${id}`
        : 'https://blogbackend.adaptable.app/admin/posts/new';
      const method = id ? 'PUT' : 'POST';
      const token = localStorage.getItem('token');
      const response = await fetch(address, {
        method: method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 401) {
        // Handle your own logic to navigate to another route
        console.error('Unauthorized. Redirecting to login page...');
        history('/log_in'); // Replace '/login' with your desired route
        return;
      }

      if (response.status === 201) {
        console.log('Post created successfully');
        history('/');
      } else {
        // Handle errors, e.g., display an error message to the user
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className='postForm'>
      <GoMain />
      <h2>{postId ? 'Edit' : 'Create'} a New Post</h2>
      <form className='form' onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type='text'
            name='title'
            value={postData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Image address:
          <input
            type='text'
            name='image'
            value={postData.image}
            onChange={handleInputChange}
          />
        </label>
        <label className='textareaBox'>
          <div className='contentTitle'>Content:</div>
          <Editor
            apiKey='ochkhbyoq38aqe48yg2ui0rv3s3zgyvpxqbwrbarx7jnfabg'
            value={postData.content}
            init={{
              height: 300,
            }}
            onEditorChange={handleEditorChange}
          />
        </label>
        <label>
          Published:
          <input
            type='checkbox'
            name='published'
            checked={postData.published}
            onChange={() =>
              setPostData({
                ...postData,
                published: !postData.published,
              })
            }
          />
        </label>
        <button type='submit' onClick={handleSubmit}>
          {postId ? 'Edit' : 'Create '} Post
        </button>
      </form>
    </div>
  );
};

export default FormPost;

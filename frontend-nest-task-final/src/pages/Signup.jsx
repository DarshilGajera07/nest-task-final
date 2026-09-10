import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: ""
  });
  
  let navigate = useNavigate()

  const [accessToken, setaccessToken] = useState(localStorage.getItem('token') || '');

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/users/signup", formData);
      console.log(res.data);
      setaccessToken(res.data.access_token);
      localStorage.setItem('accessToken', res.data.access_token);
      navigate("/login")
    }
    catch (error) {
      console.error(error);
    }

  };


  return (
    <>
      <div className="outer">
        <div className="formbox">
          <h4>Signup Form</h4>
          <form action="" onSubmit={handleSubmit} className='formcontainer'>
            <input onChange={handleChange} type="text" name="name" id="" placeholder='Enter username' />
            <input onChange={handleChange} type="password" name="password" id="" />
            <input type="submit" value="SignUp" />
          </form>
        </div>
      </div>

    </>
  )
}

export default Signup
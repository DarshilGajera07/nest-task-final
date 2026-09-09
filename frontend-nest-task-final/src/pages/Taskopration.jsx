import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar';


const Taskopration = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false
  });
  const [tasks, setTasks] = useState([]);
  const [editId, seteditId] = useState(null);
  const [accessToken, setaccessToken] = useState(localStorage.getItem('accessToken') || '');


  function updateTask(id) {
    const editTask = tasks.find((task) => task.id === id);

    const editData = {
      title: editTask.title,
      description: editTask.description,
      completed: editTask.completed
    }

    setFormData(editData)

    seteditId(id);
  }


  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function fetchData() {

    const res = await axios.get("http://localhost:3000/tasks", {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log(res.data);

    setTasks(res.data);
  }

  useEffect(() => {
    fetchData();
  }, [])





  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId) {
      await axios.post("http://localhost:3000/tasks", formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
    } else {
      await axios.patch(`http://localhost:3000/tasks/${editId}`, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      seteditId(null);
    }
    fetchData();
    setFormData({
      title: '',
      description: '',
      completed: false
    })
  }

  const deleteTask = async (id) => {
    const res = await axios.delete(`http://localhost:3000/tasks/${id}`);
    fetchData();
  }

  return (
    <>
    <Navbar />
      <div>
        <form action="" onSubmit={handleSubmit}>
          <input onChange={handleChange} type="text" name="title" id="" placeholder='Enter title' value={formData.title} />
          <input onChange={handleChange} type="text" name="description" id="" placeholder='Enter description' value={formData.description} />
          <input onChange={handleChange} type="checkbox" name="completed" id="completed" checked={formData.completed} />
          <label htmlFor="completed">Completed</label>
          <input type="submit" value={editId ? "Update Task" : "Add Task"} />
        </form>
      </div>


      {
        tasks.map((item) => (
          <div key={item.id}>
            <h5>{item.title}</h5>
            <p>{item.description}</p>
            <p>{item.completed ? 'completed' : 'not completed'}</p>
            <div>
              <button onClick={() => updateTask(item.id)}>Edit</button>
              <button onClick={() => deleteTask(item.id)}>Delete</button>
            </div>
          </div>
        ))
      }
    </>
  )
}

export default Taskopration
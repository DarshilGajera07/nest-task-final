import { useState, useEffect } from 'react'
import axios from 'axios'
import AxiosInstance from '../api/api.js'




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

    const res = await AxiosInstance.get("http://localhost:3000/tasks");

    setTasks(res.data);
  }

  useEffect(() => {
    fetchData();
  }, [])





  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId) {
      await AxiosInstance.post("http://localhost:3000/tasks", formData);
    } else {
      await AxiosInstance.patch(`http://localhost:3000/tasks/${editId}`, formData);
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
    await AxiosInstance.delete(`http://localhost:3000/tasks/${id}`);
    fetchData();
  }

  return (
    <>
      <div className='taskformbox'>
        <h4>Enter Task Details   </h4>
        <form action="" onSubmit={handleSubmit} className='taskform'>
          <input onChange={handleChange} type="text" name="title" id="" placeholder='Enter title' value={formData.title} />
          <input onChange={handleChange} type="text" name="description" id="" placeholder='Enter description' value={formData.description} />
          <div>
            <label htmlFor="completed">Completed : </label>
            <input onChange={handleChange} type="checkbox" name="completed" id="completed" checked={formData.completed} />
          </div>
          <input type="submit" value={editId ? "Update Task" : "Add Task"} />

        </form>
      </div>


      <div className='taskdataouter'>
        {
          tasks.map((item) => (
            <div key={item.id} className='taskdatainner'>
              <div className='taskdatadiv'>
                <p className='bold'>Title: </p> <p> {item.title}</p>
              </div>

              <div className='taskdatadiv'>
                <p className='bold'>Description: </p>
                <p> {item.description}</p>
              </div>
              <div className='taskdatadiv'>
                <p className='bold'>Completed: </p>
                <p> {item.completed ? 'completed' : 'not completed'}</p>
              </div>
              <div className='taskdatadiv'>
                <button className='edit' onClick={() => updateTask(item.id)}>Edit</button>
                <button className='delete' onClick={() => deleteTask(item.id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>

    </>
  )
}

export default Taskopration
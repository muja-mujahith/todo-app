
import { setSelectionRange } from "@testing-library/user-event/dist/utils"
import { useEffect, useState } from "react"

export default function Todo(){
     

    const apiUrl = "http://localhost:8000"


    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [todos, setTodos] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [editId, setEditId] = useState(-1)
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')

    useEffect(()=>{
        getItems()
    },[])

    const handleSubmit = () =>{

        setError("")
        if(title.trim() !== '' && description.trim() !== ''){
            fetch(apiUrl + "/todos", {
                method:"POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title, description})
                
            }).then((res) => {
                if(res.ok){
                    setTodos([...todos, {title, description}])
                    setTitle('')
                    setDescription('')
                    setMessage("item added sucessfuluy")
                    setTimeout(() =>{
                        setMessage("")
                    },3000)
                }else{
                    setError("unable to create todo item")
                }
                
            }).catch(()=>{
                setError("unble to create todo item")
            })
           
        }
    }
    
    const getItems = () =>{
        fetch(apiUrl + "/todos")
         .then((res)=> res.json())
         .then((res)=>{
            setTodos(res)
         })
        
        
    }

    const handleUpdate = () =>{
        setError("")
        if(editTitle.trim() !== '' &&  editDescription.trim() !== ''){
            fetch(apiUrl + "/todos/"+ editId, {
                method:"PUT",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title : editTitle, description: editDescription})
                
            }).then((res) => {
                if(res.ok){
                  const updatedTodos =   todos.map((item)=>{
                        if(item._id == editId){
                            item.title = editTitle
                            item.description = editDescription
                        }
                        return item
                    })


                    setTodos(updatedTodos)
                    setEditTitle('')
                    setEditDescription('')
                    setMessage("item updates sucessfuluy")
                    
                    setTimeout(() =>{
                        setMessage("")
                    },3000)

                    setEditId(-1)
                }else{
                    setError("unable to create todo item")
                }
                
            }).catch(()=>{
                setError("unble to create todo item")
            })
           
        }
    }
    
  


    const handelEditCancel = () =>{
        setEditId(-1)
    }
   
    const handleEdit = (item) =>{
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description)
    }
    
    const handelDelete = (id) => {
          if(window.confirm('are you delete')){
            fetch(apiUrl + '/todos/' + id, {
                method: 'DELETE'

            })
            .then(()=>{
               const updatedTodos =  todos.filter((item) => item._id !== id)
                setTodos(updatedTodos)
            })
          }
     }

    return  <>
            <div className="row p-3 bg-success text-light">
           <h1>Todo project with mern stack</h1>
  
           </div>

           <div>
                <h3>add item</h3>
                {message && <p className="text-success">{message}</p> }
            </div>
    
            <div className="form-group d-flex gap-2">
                <input className="form-control" onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="title"/>
                <input className="form-control" onChange={(e)=>{setDescription(e.target.value)}} value={description} type="text" placeholder="description"/>
                <button className="btn btn-dark" onClick={handleSubmit}>submit</button>
            </div>
            { error && <p className="text-danger">{error}</p> }

            <div className="row mt-3"> 
                <h3>Task</h3>
                <div className="col-md-6">
                <ul className="list-group"> 

                    {
                        todos.map((item)=> <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                        <div className="d-flex flex-column me-2">
                            {
                                editId == -1 ||  editId !== item._id ? <> <span className="fw-bold">{item.title}</span>
                                                 <span>{item.description}</span>
                                </> : <>
                                <div className="form-group d-flex gap-2">
                                <input className="form-control" onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} type="text" placeholder="title"/>
                                <input className="form-control" onChange={(e)=>{setEditDescription(e.target.value)}} value={editDescription} type="text" placeholder="description"/>
                               
                                </div>
                                </>
                            }
                             
                        </div>
                        
                        <div className="d-flex gap-2">
                            
                        {  editId == -1 || editId !== item._id ? <button className="btn btn-warning"  onClick={()=> handleEdit(item)}>edit</button> : <button onClick={handleUpdate}>update</button>}
                        { editId == -1 ?   <button className="btn btn-danger"  onClick={() => handelDelete(item._id)}>delete</button> :
                            <button className="btn btn-danger" onClick={handelEditCancel}>cancel</button> }
    
                        </div>
                            
                        </li>
                            
                        )
                    }
                    
                    

                    
                </ul>
                </div>
            </div>
            </>
  
}
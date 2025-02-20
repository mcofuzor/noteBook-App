import React, {useState, useEffect, createContext, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import axios from 'axios'
import Notes from './Notes';




function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [viewNotes, setViewNotes] = useState(false);
    const [addNotes, setAddNotes] = useState(false);
    const [popupTrigger, setPopupTrigger] = useState(false)
    const [editTrigger, setEditTrigger] = useState(false)

    

    const [formData, setFormData] = useState({
        title: '',
        content: '',
       })

    // const user = useContext(UserContext)

    const user = localStorage.getItem("User")
    const userId = localStorage.getItem("UserId")
    const liveToken = localStorage.getItem("token")


    const navigate = useNavigate();
      

    useEffect(   ()   =>  { 

        handleViewNotes ()
        
        
    }, []);
    
  
   

    function handleFormData (event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setFormData ({...formData, [fieldName]:fieldValue})
  
  
       }


    async function handleViewNotes () {
        await axios.get("/dashboard",   { headers: { Authorization: localStorage.getItem("token") }, body:userId })
        .then (response => {
           
            setNotes(response.data)
            console.log(response.data) 
            console.log(notes)

        })
        
        .catch(error => {
            // Handle errors
            console.log('Error fetching data:', error);
          })


        setViewNotes(true)
        setAddNotes(false)
            
            navigate("/dashboard" ) 
        }
        
    //   )
    
    //     .catch(error => {
    //     // Handle errors
    //     console.log('Error fetching data:', error);
    //   });
    



    // }

    function handleAddNotes () {
        setAddNotes(true)
        setViewNotes(false)



    }

    async function handleSubmit (event){
               event.preventDefault();

        await axios.post("/newnote",  [formData, userId], { headers: { Authorization: localStorage.getItem("token") } })
         .then (response => {
             console.log(response.data) 
             console.log("Successful")  
               
             setViewNotes(true)
             setAddNotes (false)

             handleViewNotes ()

             setFormData({
                title: '',
                content: '',
               })
             
             navigate("/dashboard" )        // setisLoggedIn(true)
         }
         
       )
     
         .catch(error => {
         // Handle errors
         console.log('Error fetching data:', error);
       });
 
 
      }




      async function handleUpdate (){
     

 await axios.post("/updatenote",  [formData, userId], { headers: { Authorization: localStorage.getItem("token") } })
  .then (response => {
      console.log(response.data) 
      console.log("Successful")  
        
      setViewNotes(true)
      setAddNotes (false)

      handleViewNotes ()

      
      navigate("/dashboard" )        // setisLoggedIn(true)
  }
  
)

  .catch(error => {
  // Handle errors
  console.log('Error fetching data:', error);
});


}




      async function handleDelete (id){
      

 await axios.post("/delete/"+id, userId, { headers: { Authorization: localStorage.getItem("token") } })
  .then (response => {
      console.log(response.data) 
      console.log("Successful Deleted") 
      console.log(id)  
        


      handleViewNotes ()
      
      navigate("/dashboard" )        // setisLoggedIn(true)
  }
  
)

  .catch(error => {
  // Handle errors
  console.log('Error fetching data:', error);
});


}
function handleOnViewNote (id) {
    setPopupTrigger(true)
    



}
function handleEditNote (id) {
    setEditTrigger(true)
    



}
async function handleLogout () {

    localStorage.clear();
      navigate("/" )  
        


}


  return (liveToken) ? (
     
    <div>
        <Header/>
        
      <div>
        <div className="upbar">
            <span className="userinfo">Welcome <span>{user.toUpperCase()} </span></span>!
            <span className="logout" onClick={handleLogout}> Logout</span>
        </div>
        <div className="content">
            <div className="navar">
                <ul className="navitems" >
                    <li className={viewNotes?'active':null} onClick={handleViewNotes}>View Notes</li>
                    <li className={addNotes?'active':null} onClick={handleAddNotes}>Add Notes</li>
                </ul>
            </div>
            <div className="dashboard">
            {viewNotes && 
            
            <div className='hold-note'>
                {notes.map((note, index) =>  

                <Notes
                id={note.id}
                key={index}
                title={note.title}
                content={note.content}
                onDeleteNotes={handleDelete}
                onViewNotes={handleOnViewNote}
                trigger ={popupTrigger}
                etrigger ={editTrigger}
                onSetTrigger={setPopupTrigger}
                setEditTrigger={setEditTrigger}
                submitRequest={handleEditNote}
                handleUpdate={handleUpdate}
                userId={userId}
                />
                    
                )}


            </div>
            
            }

            {addNotes && 
            
            <div className='note-form'>
                <form onSubmit={handleSubmit}>
                    <div>
                <label >Title</label></div>
                <input name='title'value={formData.title}  onChange={handleFormData} size="50" maxlength="35" id='title'></input>
                <div>
                <label  >Content</label></div>
                <textarea name='content' value={formData.content} onChange={handleFormData} id='notecon' ></textarea>
                
                <button type='submit'>Add Note</button>


                </form>
                </div>
            
            }

            </div>
        </div>

      </div> 
    </div>
  ):""
}

export default Dashboard

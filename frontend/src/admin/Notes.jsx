import React, {useState} from 'react'
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import View from '../Components/View';
import Edit from '../Components/Edit';



function Notes(props) {
    const [trigger, setTrigger] = useState(false)
    const [editRrigger, setEditTrigger] = useState(false)
    function viewNotes () {
        setTrigger(props.trigger)
        props.onViewNotes(props.id) 

        
    }
    function editNotes () {
        setEditTrigger(true)
        props.submitRequest(props.id) 

    }

    function deleteNotes () {

        props.onDeleteNotes(props.id) 
        alert("Hi Delete")


    }
    function activeClose () {
        props.onSetTrigger(false)
        setTrigger(false)

    }
    function activeEditClose () {
        props.setEditTrigger(false)
        setEditTrigger(false)

    }
 function editSubmit (){
    props.handleUpdate()
    props.setEditTrigger(false)
    setEditTrigger(false)

 }
    


  return (
    <div className='notecomp'> 
    <div  className="notelist">
   <div className='note-title'> <h2>{props.title} </h2></div>
   <div className='note-content'> {props.content.slice(0, 255)}</div>
   <div className='note-veiw' onClick={viewNotes}>  <View 
        trigger={trigger}
        id={props.id}
        title={props.title}
        content={props.content}
        onClose={activeClose}
        setOnTrigger={setEditTrigger}
        
        ></View> View Note</div>
   <div className='note-btn'><span onClick={editNotes}><Edit
    id={props.id}
    trigger={editRrigger}
    title={props.title}
    content={props.content}
    setOnTrigger={setEditTrigger}
    onEClose={activeEditClose}
    editSubmit={editSubmit}
    userId={props.userId}
   
    
></Edit><FaEdit/></span>
   
   
   <span onClick={deleteNotes}><MdDeleteForever/></span></div>


    </div>

      
    </div>
  )
}

export default Notes

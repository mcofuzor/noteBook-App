import React, {useState} from 'react'
import {useNavigate } from 'react-router-dom';

import { IoClose } from "react-icons/io5";
import axios from 'axios'



function Edit(props) {
    const userId= props.userId;
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: props.title,
        content: props.content,
        id:props.id
       }) 


    function handleFormData(event) {

         const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setFormData ({...formData, [fieldName]:fieldValue})
    }

    async function handleSubmit (event) {
        event.preventDefault();
        // props.editSubmit(formData);

        await axios.post("/updatenote",  [formData, userId], { headers: { Authorization: localStorage.getItem("token") } })
         .then (response => {
             console.log(response.data) 
             console.log("Successful")  })
             

             handleClose()
             navigate("/dashboard")

        

    }
    function handleClose() {
        props.onEClose()

}

  return (props.trigger)? (
    <div className='view-popup'>
        <div className="edit-note" id={props.id}> 
        <IoClose onMouseUp={handleClose} className='close-btn'></IoClose>

        <form onSubmit={handleSubmit}>
        <div className="idfied"> <input name='id' value={formData.id}  type='hidden' ></input></div>
               <div className="tilefied"> <input name='title' value={formData.title}  onChange={handleFormData} size="50" max-Length="35" id='title'></input></div>
               <div className="contentfied"> <textarea name='content' value={formData.content} onChange={handleFormData} id='notecon' ></textarea></div>
                
               <div className="sbtn"> <button type='submit'>Update Note</button></div>


                </form>

        </div>

      
    </div> 
  ):"";
}

export default Edit

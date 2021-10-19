import React, { useState, useEffect } from 'react';  
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" 
import proj4 from "proj4";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import axios from 'axios';
import { MDBNotification } from "mdbreact";
import './Loading.css';

function Scenario() {

    if (typeof window !== "undefined") {
        window.proj4 = window.proj4 || proj4;
    }

    const columns = [{  
        Header: 'Scenario',  
        accessor: 'scenario' ,
        width: 150, 
    },{  
        Header: 'Description',  
        accessor: 'description'  ,
        width: 250,
    },{  
        Header: 'Date Added',  
        accessor: 'date_created'  ,
        width: 200,
    },{  
        Header: 'Added By',  
        accessor: 'added_by'  ,
        width: 150,
    },{  
        Header: "Action",
        width: 250, 
        Cell: ({ original }) => (
            <div>
                <button type="button" class="btn btn-primary" onClick={() => editScenario(original.id)}>
                    Edit
                </button>
                &nbsp;
                <button type="button" class="btn btn-danger" onClick={() => deleteScenario(original.id)}>
                    Delete
                </button>
            </div>

            )
    }]  

    const [ data, setData] = useState();
    const [ name, setName ] = useState();
    const [ scenario, setScenario ] = useState();
    const [ defaultScenario, setDefaultScenario ] = useState();
    const [ description, setDescription ] = useState("");
    const [ loading, setLoading ] = useState(0);


    useEffect(() => {
        axios.get('http://localhost:8000/dataset/api/v1/scenario/all')
        .then(res => {
            setData(res.data.result)
        })

        axios.get('http://localhost:8000/dataset/api/v1/scenario/all?unique=1')
        .then(res => {
            setScenario(res.data.result)
            setDefaultScenario(res.data.result[0])
            setName(res.data.result[0])

        })
    }, []);

    const loadScenario = () => {
        axios.get('http://localhost:8000/dataset/api/v1/scenario/all')
        .then(res => {
            setData(res.data.result)
        })

        axios.get('http://localhost:8000/dataset/api/v1/scenario/all?unique=1')
        .then(res => {
            setScenario(res.data.result)
            setDefaultScenario(res.data.result[0])

        })
    }

    const newScenario = () => {    
        setStyle(defaultLoadingStyle)
        setLoading(1)

        axios.get('http://localhost:8000/accounts/csrf_cookie')
        .then(res => {
            
            axios.post('http://localhost:8000/dataset/api/v1/scenario', {
                        name: name,
                        description: description,
                    }, {
                        headers: {
                                'X-CSRFTOKEN': document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1],
                        }
                    })
            .then(res => {
                if(res.data.message === 'success'){
                    setColor('#45b39d')
                    setNotificationMessage('Successfully Added')
                    setNotification(true)
                }else{
                    setColor('#cd6155')
                    setNotificationMessage(res.data.message)
                    setNotification(true)
                }
                loadScenario()
                setStyle({})
                setLoading(0)
            }).catch(error => {
                setColor('#cd6155')
                setNotificationMessage('Error Adding')
                setNotification(true)
                setStyle({})
                setLoading(0)
            })
        })
       
    }

    const deleteScenario = (id) => {
        const confirm_delete = window.confirm("Are you sure you want to delete this dataset?")

        if (confirm_delete === true) {
            setStyle(defaultLoadingStyle)
            setLoading(1)
            axios.get('http://localhost:8000/dataset/api/v1/scenario/delete?id='+id, {
                headers: {
                        'X-CSRFTOKEN': document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1],
                }
            })
            .then( res => {
                if(res.data.message === 'success'){
                    setColor('#45b39d')
                    setNotificationMessage('Successfully Deleted')
                    setNotification(true)
                }else{
                    setColor('#cd6155')
                    setNotificationMessage(res.data.message)
                    setNotification(true)
                }
                loadScenario()
                setStyle({})
                setLoading(0)
            })
            .catch(error => {
                setColor('#cd6155')
                setNotificationMessage('Error Deleting')
                setNotification(true)
                setStyle({})
                setLoading(0)
            })
        }
    }

    const editScenario = (id) => {
        axios.get('http://localhost:8000/dataset/api/v1/scenario/details?id='+id, {
            headers: {
                    'X-CSRFTOKEN': document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1],
            }
        })
        .then( res => {
            setName(res.data.name)
            setDescription(res.data.description)
            setDefaultScenario(res.data.name)
        })
        .catch(error => {
           console.log(error)
        })
    }

    const [ notification, setNotification ] = useState(false); 
    const [ message, setNotificationMessage ] = useState(); 
    const [ color, setColor ] = useState(); 
    const [ style, setStyle] = useState({});

    const selectedScenario = (event) => {
        setName(event.value)
    }

    const defaultLoadingStyle = {
        'backgroundColor': 'rgba(255, 255, 255, 0.5)',
        'opacity': 0.5
    }

    return (  
       
        <div className='container-fluid' style={style}>   
            {(() => {
                if (loading) {
                    return (
                        <div className="row">
                            <center>
                                <div class="loader-container">
                                    <div class="loader"></div>
                                </div>
                            </center>
                        </div>
                    )
                }
            })()}

            <div className="row">
                <div className="col-8">
                    <div style={{marginTop:'2%', backgroundColor: 'white'}}>  
                        <ReactTable  
                            data={data}  
                            columns={columns}  
                            defaultPageSize = {10}  
                            pageSizeOptions = {[2,4, 6]}  
                        />  
                    </div>  
                </div>
                
                <div className="col-4" style={{marginTop:'1%', backgroundColor: 'white'}}>
                    {(() => {
                        if (notification) {
                            return (
                                <MDBNotification
                                    iconClassName="text-primary"
                                    icon="bell"
                                    show
                                    fade
                                    title="Message"
                                    message={message}
                                    text=""
                                    style={{backgroundColor: color, margin:0, padding:0}}/>
                                
                            )
                        }
                    })()}
                    <div className='form-group' style={{marginTop:'1%', backgroundColor: 'white'}}> 
                        <label class="form-label">Scenario</label>
                        <Dropdown options={scenario}  value={defaultScenario}  onChange={selectedScenario} placeholder="Select an option" />
                    </div>

                    <div className='form-group'>
                        <label className='form-label mt-3'>Description: </label>
                        <textarea
                            className='form-control'
                            type='text'
                            placeholder='Description*'
                            rows="10"
                            required
                            value={description}
                            onChange={(evt) => setDescription(evt.target.value)}
                        />
                    </div>

                    <button className='btn btn-primary mt-4 mb-4' onClick={() => newScenario()}>Add</button>
                </div>
            </div>
                  
          </div>
    )  
}  
export default Scenario;  
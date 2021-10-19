import React, { useState, useEffect } from 'react';  
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" 
import proj4 from "proj4";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import axios from 'axios';
import { MDBNotification } from "mdbreact";
import './Loading.css';
  

function Insights() {
    const [ data, setData] = useState();
    const [ description, setDescription ] = useState("");
    const [ cover, setCover ] = useState();

    if (typeof window !== "undefined") {
        window.proj4 = window.proj4 || proj4;
    }


    useEffect(() => {
        axios.get('http://localhost:8000/dataset/api/v1/upload/all?data_type=3')
        .then(res => {
            setData(res.data.result)
        })
    }, []);

    const loadDatasets = () => {
        axios.get('http://localhost:8000/dataset/api/v1/upload/all?data_type=3')
        .then(res => {
            setData(res.data.result)
        })
    }


    const columns = [{  
                Header: 'Date Type',  
                accessor: 'data_type' ,
                width: 100, 
            }, { 
                Header: 'Date Created',  
                accessor: 'date_created' ,
                width: 200, 
            },{ 
                Header: 'Added By',  
                accessor: 'added_by' ,
                width: 100, 
            },{  
                Header: 'Number of Rows',  
                accessor: 'number_of_rows' ,
                width: 150, 
            },{  
                Header: "Action",
                width: 250, 
                Cell: ({ original }) => (
                    <div>
                        <button  className='btn btn-primary'>
                        <a href={original.cover} download style={{color: 'white', textDecoration:'none'}}> 
                            Download</a>
                        </button>
                        &nbsp;
                        <button type="button" class="btn btn-danger" onClick={() => deleteDatasets(original.id, original.data_type)}>
                            Delete
                        </button>
                    </div>

                  )
            }]          

    const newDatasets = () => {
        setStyle(defaultLoadingStyle)
        setLoading(1)
        const uploadData = new FormData();
        uploadData.append('description', description);
        uploadData.append('dataType', 3);
        uploadData.append('cover', cover, cover.name);
        
        axios.get('http://localhost:8000/accounts/csrf_cookie')
        .then(res => {
            axios({
                method: "POST",
                url: "http://localhost:8000/dataset/api/v1/upload",
                data: uploadData,
                headers: { 
                    "Content-Type": "multipart/form-data",
                    'X-CSRFTOKEN': document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1], 
                },
              })
            .then( res => {
                if(res.data.message === 'success'){
                    setColor('#45b39d')
                    setNotificationMessage('Successfully Uploaded')
                    setNotification(true)
                }else{
                    setColor('#cd6155')
                    setNotificationMessage(res.data.message)
                    setNotification(true)
                }
                loadDatasets()
                setStyle({})
                setLoading(0)
            })
            .catch(error => {
                setColor('#cd6155')
                setNotificationMessage('Error Uploading')
                setNotification(true)
                setStyle({})
                setLoading(0)
            })
        })

       
    }

    const deleteDatasets = (id, data_type) => {
        const confirm_delete = window.confirm("Are you sure you want to delete this dataset?")

        if (confirm_delete == true) {
            setStyle(defaultLoadingStyle)
            setLoading(1)
            fetch('http://localhost:8000/dataset/api/v1/upload/delete?id='+id+"&data_type="+data_type, {
                method: 'GET',
                headers: {
                    'X-CSRFTOKEN': document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1],
                },
            })
            .then( res => {
                loadDatasets()
                setStyle({})
                setLoading(0)
            })
            .catch(error => console.log(error))
            loadDatasets()
        }
    }

    const [ loading, setLoading ] = useState(0);
    const [ notification, setNotification ] = useState(false); 
    const [ message, setNotificationMessage ] = useState(); 
    const [ color, setColor ] = useState(); 
    const [ style, setStyle] = useState({});

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
                    <div style={{marginTop:'3%', backgroundColor: 'white'}} className='form-group mt-4'>  
                        <ReactTable  
                            data={data}  
                            columns={columns}  
                            defaultPageSize = {10}  
                            pageSizeOptions = {[2,4, 6]}  
                        />  
                    </div>
                </div>
                <div className="col-4" style={{marginTop: '2%', backgroundColor: 'white'}}>
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
                    <div className='form-group mt-4'>
                        <label className='form-label mt-4'>Description: </label>
                        <textarea
                                className='form-control'
                                type='text'
                                placeholder='Description*'
                                value={description} 
                                onChange={(evt) => setDescription(evt.target.value)}
                                required
                            />
                    </div>
                    
                    <div className='form-group mt-4'>
                        <input type="file" className="form-control-file" onChange={(evt) => setCover(evt.target.files[0])}/>
                    </div>
                    <button className='btn btn-primary mt-4 mb-4 mr-4' onClick={() => newDatasets()}>Upload</button> &nbsp;
                </div>
            </div>
        </div>           
    );
}

export default Insights;  
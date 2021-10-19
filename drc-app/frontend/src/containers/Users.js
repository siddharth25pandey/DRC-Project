import React, { Component } from 'react';  
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" 
  
class Users extends Component {  
  render() {  
     const data = [{  
            full_name: 'John Doe',  
            email: 'johndoe@gmail.com',
            organization: 'sample organization name' ,
            country: 'Germany' ,
            approve: <button className='btn' style={{backgroundColor:'#269abc',  borderColor:'#269abc', color: "white"}}>Approve</button>,
            disapprove: <button className='btn' style={{backgroundColor:'#B0141C',  borderColor:'#B0141C', color: "white"}}>Reject</button> 
        },{  
            full_name: 'Jane Doe',  
            email: 'janedoe@gmail.com',
            organization: 'sample organization name' ,
            country: 'Africa' ,
            approve: <button className='btn' style={{backgroundColor:'#269abc',  borderColor:'#269abc', color: "white"}}>Approve</button>,
            disapprove: <button className='btn' style={{backgroundColor:'#B0141C',  borderColor:'#B0141C', color: "white"}}>Reject</button>
        }] 

     const columns = [{  
       Header: 'Full Name',  
       accessor: 'full_name' ,
       width: 250, 
       },{  
       Header: 'Email',  
       accessor: 'email'  ,
       width: 250,
       },{  
        Header: 'Organization',  
        accessor: 'organization'  ,
        width: 250,
        },{  
            Header: 'Country',  
            accessor: 'country' ,
            width: 250, 
            
        },{  
        Header: 'Approve',  
        accessor: 'approve'  
        },{  
            Header: 'Disapprove',  
            accessor: 'disapprove' ,
            width: 250, 
        }]  
    return (  
        <div className='container' style={{height: '55vh', width:"150%"}}>   
            <div style={{marginTop:'2%', backgroundColor: 'white'}}>  
                <ReactTable  
                    data={data}  
                    columns={columns}  
                    defaultPageSize = {10}  
                    pageSizeOptions = {[2,4, 6]}  
                />  
            </div>        
          </div>
    )  
  }  
}  
export default Users;  
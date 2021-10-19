import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../actions/auth';
import CSRFToken from '../components/CSRFToken';
import red_line  from '../images/red-line.png';
import logo  from '../images/logo.png';

const Register = ({ register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        organization: '',
        country: '',
        email: '',
        password: '',
        re_password: ''
    });
    const [accountCreated, setAccountCreated] = useState(false);

    const { first_name, last_name, middle_name, organization, country, email, username, password, re_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (password === re_password) {
            register(first_name, last_name, middle_name, organization, country, email, username, password, re_password);
            setAccountCreated(true);

        }
    };

    if (isAuthenticated)
        return <Redirect to='/dashboard' />;
    else if (accountCreated)
        return (
            <div className='container mt-5 mt-5' style={{display: 'flex',  justifyContent:'center', height: '55vh'}}> 
                <div style={{marginTop:'10%', backgroundColor: 'white'}}>
                    <div style={{marginTop:'10%', marginLeft: '10%', marginRight: '10%', backgroundColor: 'white'}}><h4>Sign Up Successful! Please wait the admin to review it. 
                    You will receive an email once access is granted</h4></div>

                    <center>
                        <Link to="/" className="btn" style={{backgroundColor:'#B0141C', borderColor:'#B0141C', marginLeft:'2%', color:'white',
                    width:'48.5%', marginBottom:'3%', marginTop:'3%'}}>Back to Login</Link>
                    </center>
                </div>
            </div>
            
        );

    return (
        <div className='container mt-5' style={{marginLeft: '10%',  width: '1125px', height: '70vh'}}>
            <div style={{marginTop:'2%', marginLeft:'5%', backgroundColor: 'white'}}>
            <div><img src={ red_line } width="1050" height="45"/></div>
            <div>
                <img src={ logo } />
            </div>
           
            <form onSubmit={e => onSubmit(e)} style={{marginTop:'2%', marginLeft:'2%', marginRight: '2%', backgroundColor: 'white'}}>
                <h3>Signup</h3>
                <hr></hr>
                {}
                <CSRFToken />
                <div className="row mb-3">
                    <div className='form-group col-4'>
                        <label className='form-label mt-3 col-6'>Last Name: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Last Name*'
                                name='last_name'
                                onChange={e => onChange(e)}
                                value={last_name}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-group col-4'>
                        <label className='form-label mt-3 col-12'>First Name: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='text'
                                placeholder='First Name*'
                                name='first_name'
                                onChange={e => onChange(e)}
                                value={first_name}
                                required
                            />
                        </div>
                    </div>

                    <div className='form-group col-4'>
                        <label className='form-label mt-3 col-12'>Middle Name: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Middle Name'
                                name='middle_name'
                                onChange={e => onChange(e)}
                                value={middle_name}
                                
                            />
                        </div>
                    </div>
                </div>
                
                <div className="row mb-3">
                    <div className='form-group col-6 mb-3'>
                        <label className='form-label col-12'>Organization: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Organization*'
                                name='organization'
                                onChange={e => onChange(e)}
                                value={organization}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-group col-6 mb-3'>
                        <label className='form-label col-12'>Country: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Country*'
                                name='country'
                                onChange={e => onChange(e)}
                                value={country}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-group col-6 mb-3'>
                        <label className='form-label col-12'>Email: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Email*'
                                name='email'
                                onChange={e => onChange(e)}
                                value={email}
                                required
                            />
                        </div>
                    </div>

                    <div className='form-group col-6 mb-3'>
                        <label className='form-label col-12'>Username: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='text'
                                placeholder='Username*'
                                name='username'
                                onChange={e => onChange(e)}
                                value={username}
                                required
                            />
                        </div>
                    </div>
                
                    <div className='form-group col-6'>
                        <label className='form-label col-12'>Password: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='password'
                                placeholder='Password*'
                                name='password'
                                onChange={e => onChange(e)}
                                value={password}
                                minLength='6'
                                required
                            />
                        </div>
                    </div>
                        
                    <div className='form-group col-6'>
                        <label className='form-label col-12'>Confirm Password: </label>
                        <div class="col-12">
                            <input
                                className='form-control'
                                type='password'
                                placeholder='Confirm Password*'
                                name='re_password'
                                onChange={e => onChange(e)}
                                value={re_password}
                                minLength='6'
                                required
                            />
                        </div>
                    </div>
                </div>
                
                <button className='btn' type='submit' style={{backgroundColor:'#B0141C', borderColor:'#B0141C',
                 width:'48.5%', marginBottom:'3%', marginTop:'3%', color:'white'}}>Register</button>
                <Link to="/" className="btn" style={{backgroundColor:'#E5E5E5', borderColor:'#E5E5E5', marginLeft:'2%', 
                width:'48.5%', marginBottom:'3%', marginTop:'3%'}}>Back to Login</Link>
            </form>
            </div>
            
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(Register);

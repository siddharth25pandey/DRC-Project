import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import CSRFToken from '../components/CSRFToken';
import red_line  from '../images/red-line.png';
import logo  from '../images/logo.png';

const ForgotPassword = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        login(username, password);
    };

    if (isAuthenticated)
        return <Redirect to='/dashboard' />;

    return (
        <div className='container mt-5 mt-5' style={{display: 'flex',  justifyContent:'center', height: '58vh'}}> 
            <div style={{marginTop:'15%', backgroundColor: 'white'}}>
            <div><img src={ red_line } /></div>
            <div>
                <img src={ logo } />
            </div>

            <form onSubmit={e => onSubmit(e)}  style={{marginLeft:'3%', marginRight:'3%', marginTop:'5%'}}>
                <CSRFToken />
                <h3 style={{marginBottom: '5%'}}>Forgot Password</h3>
                <div className='form-group ml-2 mr-4'>
                    <label className='form-label'>Email: </label>
                    <input 
                        className='form-control col-6'
                        type='text'
                        placeholder='Username*'
                        name='username'
                        onChange={e => onChange(e)}
                        value={username}
                        required
                    />
                </div>
                <button className='btn btn-primary mt-3' type='submit' style={{backgroundColor:'#B0141C', borderColor:'#B0141C',
                 width:'48.5%'}}>Send</button>
                {/* <button className='btn btn-info mt-3' type='button' onclick="window.location.href=/register" */}
                <Link to="/" className="btn" style={{backgroundColor:'#E5E5E5', borderColor:'#E5E5E5', marginLeft:'2%', 
                marginTop:'3%', width:'48.5%'}}>Back to Login</Link>
            </form>
            </div>
          
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(ForgotPassword);

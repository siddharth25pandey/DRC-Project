import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import CSRFToken from '../components/CSRFToken';
import red_line  from '../images/red-line.png';
import logo  from '../images/logo.png';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const [ message, setMessage] = useState();

    const onSubmit = e => {
        e.preventDefault();

        const value = login(username, password);
        console.log(value['value'])
    };

    if (isAuthenticated)
        return <Redirect to='/dashboard' />;

    return (
        <div class="container-fluid h-100">
            <div class="row justify-content-center align-items-center h-100" >
                
                <div class="col-5" style={{marginTop:'10%', backgroundColor: 'white'}}>
                    <div style={{marginLeft:'4%', marginTop:'5%'}}>
                        <img src={ logo } style={{width: '50%', height: 'auto'}}/>
                    </div>
                    <form onSubmit={e => onSubmit(e)}  style={{marginLeft:'3%', marginRight:'3%', marginTop:'2%',  paddingLeft: '5%',  paddingRight: '5%',  paddingBottom: '5%'}}>
                        <CSRFToken />
                        <div className='form-group ml-2 mr-4'>
                            <label className='form-label'>Username: </label>
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
                        <div className='form-group'>
                            <label className='form-label mt-3'>Password: </label>
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
                        <button className='btn btn-primary mt-3' type='submit' style={{backgroundColor:'#B0141C', borderColor:'#B0141C',
                        width:'48.5%'}}>Login</button>
                        {/* <button className='btn btn-info mt-3' type='button' onclick="window.location.href=/register" */}
                        <Link to="/register" className="btn" style={{backgroundColor:'#E5E5E5', borderColor:'#E5E5E5', marginLeft:'2%', 
                        marginTop:'3%', width:'48.5%'}}>Sign up</Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);

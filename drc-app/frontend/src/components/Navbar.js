import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import red_line  from '../images/red-line-long.png';
import logo  from '../images/logo.png';

const navbar = ({ isAuthenticated, logout }) => {
    const authLinks = (
        <Fragment>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/dashboard'>Dashboard</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/scenario'>Scenario</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/upload'>Dataset</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/insights'>Insights</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/users'>Users</NavLink>
            </li>
            <li className='nav-item'>
                <a className='nav-link' onClick={logout} href='#!'>Logout</a>
            </li>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/'>Login</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/register'>Register</NavLink>
            </li>
        </Fragment>
    );
    
    if (isAuthenticated) {
        return (
                <div>
                    <div><img src={ red_line } width="100%" height="30"/></div>
                    <nav className='navbar navbar-expand-lg navbar-light bg-light' style={{backgroundColor: '#fafafa'}}>
                    
                        <div className='container-fluid' style={{backgroundColor: '#fafafa'}}>
                            <Link className='navbar-brand' exact to='/dashboard'><img src={ logo } /></Link>
                            <button 
                                className='navbar-toggler' 
                                type='button' 
                                data-bs-toggle='collapse' 
                                data-bs-target='#navbarNav' 
                                aria-controls='navbarNav' 
                                aria-expanded='false' 
                                aria-label='Toggle navigation'
                            >
                                <span className='navbar-toggler-icon'></span>
                            </button>
                            <div className='collapse navbar-collapse' id='navbarNav' style={{backgroundColor: '#fafafa'}}>
                                <ul className='nav navbar-nav ms-auto'>
                                    { isAuthenticated ? authLinks : guestLinks }
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
        );
    }else{
        return ''
    }
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(navbar);

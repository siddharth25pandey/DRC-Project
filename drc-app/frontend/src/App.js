import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Layout from './hocs/Layout';

import Register from './containers/Register';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Datasets from './containers/Datasets';
import Insights from './containers/Insights';
import Scenario from './containers/Scenario';
import Users from './containers/Users';

import PrivateRoute from './hocs/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';

const App = () => (
    <Provider store={store}>
        <Router>
            <Layout>
                <Route exact path='/register' component={Register} />
                <Route exact path='/' component={Login} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/reset-password' component={ResetPassword} />
                <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} />
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute exact path='/scenario' component={Scenario} />
                <PrivateRoute exact path='/upload' component={Datasets} />
                <PrivateRoute exact path='/insights' component={Insights} />
                <PrivateRoute exact path='/users' component={Users} />
            </Layout>
        </Router>
    </Provider>
);

export default App;

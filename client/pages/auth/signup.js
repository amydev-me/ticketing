import { useState } from 'react';
import axios from 'axios';
import userRequest from '../../hooks/user-request';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = userRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password
        }
    });

    const onSubmit = async event => {
        event.preventDefault();
         
        doRequest();
    }
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1> 
            <div className="form-group">
                <lable>Email Address</lable>
                <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}  
                    className="form-control" />
            </div>
            <div className="form-group">
                <lable>Password</lable>
                <input 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    type="password" 
                    className="form-control" />
            </div>
            { errors }
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};
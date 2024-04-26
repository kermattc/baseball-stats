import { toggleLogin, updateUsername } from '../../store/reducers/loginStatus.js'

import Layout from '../layouts'

import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { Link } from 'react-router-dom';

const Register = () => {

    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.login.loggedIn);

    const usernameOrEmail = useSelector((state) => state.login.username);

    console.log("Log in status: ", loggedIn)

    const handleLogin = () => {
        dispatch(toggleLogin());
    }
    
    const updateUserOrEmail = (userOrEmail) => {
        dispatch(updateUsername(userOrEmail))
    }
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passVis, setPassVis] = useState(false)

    const [registered, setRegistered] = useState(false);

    const onRegisterUser = () => {
        axios.post('/user/register', {
            username: username,
            email: email,
            password: password
        })
        .then(response => {
            const res = response.data
            console.log("response: ", res)
            if (res.status === 'SUCCESS') {
                axios.post('/user/getJWT', {
                    username: username
                }).then(response => {
                    // console.log("Access token from response: ", response.data.access_token)
                    const accessToken = response.data.access_token;
                    localStorage.setItem('access_token', accessToken);

                    handleLogin();
                    updateUserOrEmail(username)
                })
                .catch(error => {
                    console.log("Error: ", error, res);
                });

                setRegistered(true);
            }
        })
        .catch(error => {
            console.error("Error occurred: ", error);
        })
    }

    const togglePasswordVis = () => {
        setPassVis(!passVis)
    }

    // Displays success message upon successful form submission
    const successMessage = () => {
        console.log("displaying success message")
        return (
            <div>
                <center>
                    <p className='register_redirect mt-2'>Account created successfully 
                        <b> <a href='/'>Go back to the main page</a></b>
                    </p>
                
                </center>
            </div>
        )
    }

    return (
        <>
            <Layout>
                {/* <div className="register-form-container"> */}
                <div>
                    <form className="register-form" onSubmit={onRegisterUser}>
                    <input
                        type="text"
                        placeholder=""
                        name="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                    <input
                        type={passVis ? 'text':'password'}
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                    <span onClick={togglePasswordVis}>
                        <Icon icon={ passVis ? eye : eyeOff } size={25}/>
                    </span>

                    </form>
                </div>
                {/* <div>Arrived at register page yay!</div> */}
                <button onClick={() => onRegisterUser()}>Register User</button>
                <Link to="/">Get me outta here!</Link>
                { registered ? successMessage() : null}
            </Layout>
        </>
    )
}

export default Register;
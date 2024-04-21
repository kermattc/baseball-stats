import axios from 'axios';
import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const Register = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passVis, setPassVis] = useState(false)

    const [submitted, setSubmitted] = useState(false);

    const onRegisterUser = () => {
        axios.post('/user/register', {
            username: username,
            email: email,
            password: password
        })
        .then(response => {
            console.log("Got response: ", response.data)
        })
        .catch(error => {
            console.error("Error occurred: ", error);
        })
    }

    const togglePasswordVis = () => {
        setPassVis(!passVis)
    }

    return (
        <>
            <div className="register-form-container">
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
        </>
    )
}

export default Register;
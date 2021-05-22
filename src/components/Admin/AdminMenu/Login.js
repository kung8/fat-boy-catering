import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../../_Global/Toast';
import { toast } from 'react-toastify';

export default function Login(props) {
    const { handleUserUpdate, user } = props;
    const [username, updateUsername] = useState('');
    const [password, updatePassword] = useState('');
    const [numberOfAttempts, updateNumberOfAttempts] = useState(1);
    const [disabled, updateDisabled] = useState(false);
    const time = 1000 * 60 * 60;

    useEffect(() => {
        checkCookie('maxed');
    }, []);

    const checkCookie = async (name) => {
        if (document.cookie.includes(name)) {
            await updateDisabled(true);
        }
    }

    const setCookie = async (name, value, duration) => {
        let date = new Date();
        date.setTime(date.getTime() + duration);
        let expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    const handleCookie = async () => {
        let cookieExist = await document.cookie.includes('maxed');
        if (!cookieExist) {
            await setCookie('maxed', true, time);
        } else {
            await checkCookie('maxed');
        }
        toast.dismiss();
        toast('You have maxed out your attempts. Try again later.', { className: 'salmon' });
    }

    const handleLogin = async () => {
        try {
            if (username !== '' && password !== '') {
                const { data } = await axios.post('/api/user', { username, password });
                await handleUserUpdate(data);
            }
        } catch {
            toast.dismiss();
            toast('Unauthorized to view this page!', { className: 'salmon' });
            let attempts = numberOfAttempts + 1;
            await updateNumberOfAttempts(attempts);
            if (attempts > 3) {
                await handleCookie();
                await updateDisabled(true);
                let interval = setInterval(async () => {
                    setCookie('maxed', null, -1 * time);
                    await updateDisabled(false);
                    await updateNumberOfAttempts(0);
                    clearInterval(interval);
                }, time);
            }
        }
    }

    return (
        <div className="login-wrapper flex-all-ctr">
            <div className="login-modal-container col flex-evenly align-ctr">
                <h2 className="login-header">Fat Boy Catering</h2>
                <input id="username" type="text" placeholder="Username" onChange={e => updateUsername(e.target.value)} />
                <input id="password" type="password" placeholder="Password" onChange={e => updatePassword(e.target.value)} />
                <button className={`${disabled && 'transparentize'}`} disabled={disabled} onClick={handleLogin}>Login</button>
            </div>
            {Toast}
        </div>
    )
}
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import bgLogin from '../assets/bglog2.jpeg';
import loginService from '../api/loginService';

import { useAuth } from '../auth/AuthContext';

const Login = () => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { logIn } = useAuth();

    const handleLogin = async () => {
        const loginData = {
            userName: userName,
            password: password
        };
        
        try {
            setError(null);
            const response = await loginService.login(loginData);
            logIn(response.data);
            navigate("/main", { replace: true });
            console.log("USerLogResponse", response);
            
        } catch (error) {
            setError("Invalid credentials");
            console.error("LoginError", error);
            
        }
    }

    // const handleLogin = () => {
    //     if (userName === 'admin' && password === '1234') {
    //         console.log("Success");
    //         setError(null);
    //         onLogin();

    //         navigate('/main');
    //     }
    //     else {
    //         setError("Invalid username or password");
    //     }
    // }
    const handleClear = () => {
        setUserName(""),
        setPassword("");
        setError(null);
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundImage: `url(${bgLogin})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'


            }}>
                <Box sx={{
                    maxWidth: 400,
                    py: 3,
                    px: 2,
                    // border: '2px solid black',
                    boxShadow: '5px 5px 13px rgba(0, 0, 0,8)',
                    textAlign: 'center',
                    // backgroundColor: '#d4deeeff',
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    backdropFilter: 'blur(10px)'
                }}>
                    <Typography variant='h5' color='#614804ff'>
                        Welcome Back...
                    </Typography>
                    <TextField
                        label='UserName'
                        fullWidth
                        margin='normal'
                        autoComplete='off'
                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize: "14px",
                                color: "#333"
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "14px",
                                color: "#555"
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#5a1e25ff"
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#620a26ff",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#5f0320ff"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#5d0621ff",
                                }
                            }
                        }}

                        size='small'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.trim())}

                    />
                    <TextField
                        label='Password'
                        fullWidth
                        margin='normal'
                        size='small'
                        autoComplete='off'

                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize: "14px",
                                color: "#333"
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "14px",
                                color: "#555"
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#5a1e25ff"
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#620a26ff",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#5f0320ff"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#5d0621ff",
                                }
                            }
                        }}

                        value={password}
                        onChange={(e) => setPassword(e.target.value.trim())}
                    />
                    {error && (
                        <Typography color='error'
                            sx={{
                                fontSize: "14px"
                            }}
                        >
                            {error}
                        </Typography>
                    )}
                    <Stack direction='row' spacing={1} marginTop={2}>
                        <Button
                            variant='contained'
                            // color='primary'
                            size='small'
                            disabled={!userName || !password}
                            onClick={ async () => await handleLogin()}
                            sx={{
                                textTransform: "none",
                                fontSize: "14px",
                                px: 4,
                                color: "#e8ece9ff",
                                backgroundColor: "#5a0d1cff",
                                borderColor: "#1a0307ff",
                                borderRadius: 2,

                                "&:hover": {
                                    backgroundColor: "#6c1325ff",
                                },
                                "&.Mui-disabled": {

                                }
                            }}

                        >
                            Login
                        </Button>
                        <Button
                            variant='contained'
                            // color='primary'
                            size='small'
                            sx={{
                                fontSize: "14px",
                                textTransform: "none",
                                px: 4,
                                color: "#e8ece9ff",
                                backgroundColor: "#5a0d1cff",
                                borderColor: "#1a0307ff",
                                borderRadius: 2,

                                "&:hover": {
                                    backgroundColor: "#6c1325ff",
                                },

                            }}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                    </Stack>
                </Box>

            </Box>

        </>
    )
}

export default Login
import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await onLogin({ username, password });
    if (!response.success) {
      setErrorMessage("Invalid credentials");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
      <img
        src="/assets/bg.jpeg"
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute w-full h-full bg-black/40"></div>

      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4">
        <div className="p-8 bg-white rounded-xl shadow-xl w-full max-w-md">
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

            {errorMessage && (
              <div className="text-red-600 text-center mb-4">
                {errorMessage}
              </div>
            )}

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

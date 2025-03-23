import React, { useState, useEffect } from "react";
import axios from "axios";

// Set the API base URL dynamically from .env or fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [waterIntake, setWaterIntake] = useState([]);
  const [amount, setAmount] = useState("");
  const [isRegistering, setIsRegistering] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchWaterIntake(token);
      setUser(true);
    } else {
      setIsRegistering(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(true);
      fetchWaterIntake(res.data.token);
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(true);
      fetchWaterIntake(res.data.token);
    } catch (err) {
      alert("Registration failed");
    }
  };

  const fetchWaterIntake = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/water/history`, {
        headers: { Authorization: token },
      });
      setWaterIntake(res.data);
    } catch (err) {
      console.log("Error fetching water intake data");
    }
  };

  const addWaterIntake = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/water/add`,
        { amount },
        { headers: { Authorization: token } }
      );
      setAmount(""); 
      fetchWaterIntake(token);
    } catch (err) {
      console.log("Error adding water intake");
    }
  };

  const handleLogout = () => {
    //localStorage.removeItem("token");
    setUser(null);
    setWaterIntake([]);
    setIsRegistering(true);
  };

  return (
    <div style={{
      background: "linear-gradient(to right, #e0f7fa, #ffffff)",
      minHeight: "100vh",
      color: "#333",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Water Intake Reminder</h1>
      
      {!user ? (
        <div style={{ textAlign: "center", padding: "20px", background: "#ffffff", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px", width: "100%" }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px", width: "100%" }}
            />
            <button type="submit" style={{ padding: "10px", borderRadius: "5px", background: "#00796b", color: "#fff", border: "none", cursor: "pointer" }}>
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: "transparent", color: "#00796b", border: "none", cursor: "pointer", marginTop: "10px" }}>
            {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      ) : (
        <div>
          <h2>Dashboard</h2>
          <h3>Track Your Water Intake</h3>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
            <input
              type="number"
              placeholder="Enter amount (ml)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginRight: "10px", flex: "1" }}
            />
            <button
              onClick={addWaterIntake}
              style={{ minWidth: '150px', padding: '8px 16px', borderRadius: "5px", background: "#00796b", color: "#fff", border: "none", cursor: "pointer" }}
            >
              Add Water Intake
            </button>
          </div>
          <h3>Water Intake History</h3>
          {waterIntake.map((entry, index) => (
            <li key={index} style={{ listStyle: "none", padding: "5px", color: "#333" }}>
              {entry.amount} ml - {new Date(entry.date).toLocaleString()}
            </li>
          ))}
          <button onClick={handleLogout} style={{ backgroundColor: "red", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" }}>Logout</button>  
        </div>
      )}
    </div>
  );
};

export default App;

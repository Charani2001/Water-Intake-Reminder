import React, { useState, useEffect } from "react";
import Login from "./login.js";
import Register from "./Register.js";
import axios from "axios";

// Use environment variable from .env file
//const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const App = () => {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(true);
  const [amount, setAmount] = useState("");
  const [waterIntake, setWaterIntake] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
      fetchWaterIntake(token);
    }
  }, []);

  const fetchWaterIntake = async (token) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/water/history`, {
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
        `${process.env.REACT_APP_BACKEND_URL}/api/water/add`,
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
    localStorage.removeItem("token");
    setUser(null);
    setWaterIntake([]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Water Intake Reminder</h1>
      {!user ? (
        <div>
          {isRegistering ? (
            <Register onRegister={(token) => {
              setUser(true);
              fetchWaterIntake(token);
            }} />
          ) : (
            <Login onLogin={(token) => {
              setUser(true);
              fetchWaterIntake(token);
            }} />
          )}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      ) : (
        <div>
          <h2>Dashboard</h2>
          <input
            type="number"
            placeholder="Enter amount (ml)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={addWaterIntake}>Add Water</button>
          <ul>
            {waterIntake.map((entry, index) => (
              <li key={index}>
                {entry.amount} ml - {new Date(entry.date).toLocaleString()}
              </li>
            ))}
          </ul>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;

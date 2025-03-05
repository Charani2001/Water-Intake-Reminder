import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [waterIntake, setWaterIntake] = useState([]);
  const [amount, setAmount] = useState("");
  const [isRegistering, setIsRegistering] = useState(true); // Default to Registration page

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchWaterIntake(token);
      setUser(true);
    } else {
      setIsRegistering(true); // Ensure Registration page loads first
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
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
      const res = await axios.post("http://localhost:5000/api/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(true);
      fetchWaterIntake(res.data.token);
    } catch (err) {
      alert("Registration failed");
    }
  };

  const fetchWaterIntake = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/water/history", {
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
        "http://localhost:5000/api/water/add",
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
    setIsRegistering(true); // Reset to Registration page on logout
  };

  return (
    <div>
      <h1>Water Intake Reminder</h1>

      {!user ? (
        <div>
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">{isRegistering ? "Register" : "Login"}</button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)}>
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
    style={{ marginRight: '10px', flex: '1' }} // Use flex to make the input take available space
  />
  <button
    onClick={addWaterIntake}
    style={{ minWidth: '150px', padding: '8px 16px' }} // Adjust minWidth and padding for button size
  >
    Add Water Intake
  </button>
</div>
          <h3>Water Intake History</h3>
          
            {waterIntake.map((entry, index) => (
              <li key={index}>
                {entry.amount} ml - {new Date(entry.date).toLocaleString()}
              </li>
            ))}

          <button onClick={handleLogout} style={{ backgroundColor: "red", color: "#fff" }}>Logout</button>  
        </div>
      )}
    </div>
  );
};

export default App;
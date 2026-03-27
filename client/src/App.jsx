import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    sleepHours: 7,
    stressLevel: 5,
    screenTime: 4,
    hydration: 1000
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For hackathon demo, we simulate weather data
      const mockWeather = { pressure: 1002 }; 
      
      const response = await axios.post('/api/calculate-risk', {
        ...formData,
        weatherData: mockWeather
      });
      
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to calculate risk");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>NeuroGuard</h1>
        <p>AI-Powered Migraine Prediction</p>
      </header>

      <main>
        <div className="card">
          <h2>Daily Check-In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Sleep (Hours)</label>
              <input 
                type="number" 
                name="sleepHours" 
                value={formData.sleepHours} 
                onChange={handleChange} 
                min="0" max="24"
              />
            </div>
            
            <div className="form-group">
              <label>Stress (1-10)</label>
              <input 
                type="range" 
                name="stressLevel" 
                value={formData.stressLevel} 
                onChange={handleChange} 
                min="1" max="10"
              />
              <span>{formData.stressLevel}</span>
            </div>

            <div className="form-group">
              <label>Screen Time (Hours)</label>
              <input 
                type="number" 
                name="screenTime" 
                value={formData.screenTime} 
                onChange={handleChange} 
              />
            </div>

            <button type="submit" className="btn-primary">Calculate Risk</button>
          </form>
        </div>

        {result && (
          <div className={`card result ${result.level.toLowerCase()}`}>
            <h2>Risk Level: {result.level}</h2>
            <div className="score-circle">{result.score}%</div>
            
            {result.factors.length > 0 && (
              <div className="factors">
                <h3>Risk Factors:</h3>
                <ul>
                  {result.factors.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
            
            <div className="advice">
              <strong>Advice:</strong> {result.advice}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

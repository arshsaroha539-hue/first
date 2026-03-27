// This is our simplified "AI" model for the Hackathon.
// It uses weighted heuristics to mimic the output of a gradient-boosted tree.

exports.calculateRisk = (req, res) => {
  try {
    const { 
      sleepHours,       // User input: hours slept (e.g., 6.5)
      stressLevel,      // User input: 1-10
      screenTime,       // User input: hours
      hydration,        // User input: ml
      weatherData       // From OpenWeather API (pressure, humidity)
    } = req.body;

    let riskScore = 0;
    let riskFactors = [];

    // --- LOGIC: Sleep (40% weight) ---
    // Ideal sleep is 7-9 hours. Less than 6 implies high risk.
    if (sleepHours < 6) {
      riskScore += 40;
      riskFactors.push("High sleep deprivation");
    } else if (sleepHours < 7) {
      riskScore += 20;
      riskFactors.push("Mild sleep debt");
    }

    // --- LOGIC: Stress (30% weight) ---
    // Stress above 7 is dangerous.
    if (stressLevel >= 8) {
      riskScore += 30;
      riskFactors.push("Severe stress levels");
    } else if (stressLevel >= 5) {
      riskScore += 15;
    }

    // --- LOGIC: Environmental (30% weight) ---
    // Barometric pressure drops are a classic trigger.
    // We assume 'weatherData' has a 'pressure' field (hPa).
    // Normal is ~1013 hPa. Significant drop is < 1005.
    if (weatherData && weatherData.pressure < 1005) {
        riskScore += 30;
        riskFactors.push("Low barometric pressure detected");
    }

    // Cap at 100
    riskScore = Math.min(riskScore, 100);

    // Determine Risk Level
    let riskLevel = "Low";
    if (riskScore > 70) riskLevel = "High";
    else if (riskScore > 40) riskLevel = "Medium";

    res.json({
      score: riskScore,
      level: riskLevel,
      factors: riskFactors,
      advice: getAdvice(riskLevel)
    });

  } catch (error) {
    console.error("Error calculating risk:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function getAdvice(level) {
  if (level === "High") return "Take a break immediately. Drink 500ml water. Avoid screens for 1 hour.";
  if (level === "Medium") return "Monitor your symptoms. Ensure you stay hydrated.";
  return "You are doing great! Keep up the good habits.";
}

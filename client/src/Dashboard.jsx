import { useState, useEffect } from "react";

const API = "http://localhost:5001/api";

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [error, setError] = useState("");

  const [workoutForm, setWorkoutForm] = useState({
    userId: "user1", date: "", type: "Cardio",
    duration: "", intensity: "Medium", caloriesBurned: "",
  });

  const [nutritionForm, setNutritionForm] = useState({
    userId: "user1", date: "", mealName: "", calories: "",
    macros: { protein: 0, carbs: 0, fat: 0 },
  });

  const fetchAll = async () => {
    try {
      const [w, n, a] = await Promise.all([
        fetch(`${API}/workouts`).then((r) => r.json()),
        fetch(`${API}/nutrition`).then((r) => r.json()),
        fetch(`${API}/analytics`).then((r) => r.json()),
      ]);
      setWorkouts(w);
      setNutrition(n);
      setAnalytics(a);
    } catch (err) {
      setError("Failed to load data");
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const addWorkout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...workoutForm,
          duration: Number(workoutForm.duration),
          caloriesBurned: Number(workoutForm.caloriesBurned),
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      setError("");
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const addNutrition = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/nutrition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nutritionForm, calories: Number(nutritionForm.calories) }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      setError("");
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  // Event delegation - handles bubbling from list items
  const handleListClick = (e) => {
    const item = e.target.closest("[data-id]");
    if (item) console.log("Selected log ID:", item.dataset.id);
  };

  const deleteWorkout = async (id) => {
    await fetch(`${API}/workouts/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const deleteNutrition = async (id) => {
    await fetch(`${API}/nutrition/${id}`, { method: "DELETE" });
    fetchAll();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>FitLife Pro Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ background: "#f0f4ff", padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h2>Daily Summary</h2>
        <p>Calorie Balance: <strong>{analytics.calorieBalance ?? "—"} kcal</strong></p>
        <p>Cardio Sessions: <strong>{analytics.cardioSessions ?? "—"}</strong></p>
      </section>

      <section>
        <h2>Log Workout</h2>
        <form onSubmit={addWorkout} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Date (YYYY-MM-DD)" value={workoutForm.date}
            onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })} required />
          <select value={workoutForm.type}
            onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}>
            {["Cardio", "Strength", "Flexibility", "HIIT"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="Duration (mins)" value={workoutForm.duration}
            onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })} required />
          <select value={workoutForm.intensity}
            onChange={(e) => setWorkoutForm({ ...workoutForm, intensity: e.target.value })}>
            {["Low", "Medium", "High"].map((i) => <option key={i}>{i}</option>)}
          </select>
          <input type="number" placeholder="Calories Burned" value={workoutForm.caloriesBurned}
            onChange={(e) => setWorkoutForm({ ...workoutForm, caloriesBurned: e.target.value })} required />
          <button type="submit">Add Workout</button>
        </form>
        <ul onClick={handleListClick}>
          {workouts.map((w) => (
            <li key={w._id} data-id={w._id} style={{ margin: "6px 0" }}>
              {w.date} | {w.type} | {w.duration} mins | {w.caloriesBurned} kcal
              <button onClick={() => deleteWorkout(w._id)} style={{ marginLeft: 8 }}>✕</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Log Nutrition</h2>
        <form onSubmit={addNutrition} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Date (YYYY-MM-DD)" value={nutritionForm.date}
            onChange={(e) => setNutritionForm({ ...nutritionForm, date: e.target.value })} required />
          <input placeholder="Meal name" value={nutritionForm.mealName}
            onChange={(e) => setNutritionForm({ ...nutritionForm, mealName: e.target.value })} required />
          <input type="number" placeholder="Calories" value={nutritionForm.calories}
            onChange={(e) => setNutritionForm({ ...nutritionForm, calories: e.target.value })} required />
          <button type="submit">Add Meal</button>
        </form>
        <ul onClick={handleListClick}>
          {nutrition.map((n) => (
            <li key={n._id} data-id={n._id} style={{ margin: "6px 0" }}>
              {n.date} | {n.mealName} | {n.calories} kcal
              <button onClick={() => deleteNutrition(n._id)} style={{ marginLeft: 8 }}>✕</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

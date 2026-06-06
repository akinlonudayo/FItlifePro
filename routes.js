const express = require("express");
const router = express.Router();
const { WorkoutModel, NutritionModel, GoalModel } = require("./db");
const { Workout, Nutrition } = require("./models");
const { validateWorkout, validateNutrition, calorieBalance, filterByType } = require("./utils");

// --- Workouts ---
router.get("/workouts", async (req, res) => {
  try {
    const workouts = await WorkoutModel.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/workouts", async (req, res) => {
  try {
    const error = validateWorkout(req.body);
    if (error) return res.status(400).json({ error });
    const entry = new Workout(
      req.body.userId, req.body.date, req.body.type,
      req.body.duration, req.body.intensity, req.body.caloriesBurned
    );
    const saved = await WorkoutModel.create(entry);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/workouts/:id", async (req, res) => {
  try {
    await WorkoutModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Nutrition ---
router.get("/nutrition", async (req, res) => {
  try {
    const logs = await NutritionModel.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/nutrition", async (req, res) => {
  try {
    const error = validateNutrition(req.body);
    if (error) return res.status(400).json({ error });
    const entry = new Nutrition(
      req.body.userId, req.body.date, req.body.mealName,
      req.body.calories, req.body.macros
    );
    const saved = await NutritionModel.create(entry);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/nutrition/:id", async (req, res) => {
  try {
    await NutritionModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Analytics ---
router.get("/analytics", async (req, res) => {
  try {
    const workouts = await WorkoutModel.find();
    const nutrition = await NutritionModel.find();
    const balance = calorieBalance(nutrition, workouts);
    const cardio = filterByType(workouts, "Cardio");
    res.json({ calorieBalance: balance, cardioSessions: cardio.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Goals ---
router.get("/goals", async (req, res) => {
  try {
    const goals = await GoalModel.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/goals", async (req, res) => {
  try {
    const saved = await GoalModel.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

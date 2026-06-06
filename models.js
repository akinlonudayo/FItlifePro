class WellnessLog {
  constructor(userId, date, notes = "") {
    this.userId = userId;
    this.date = date || new Date().toISOString().split("T")[0];
    this.notes = notes;
  }

  getSummary() {
    return `Log for user ${this.userId} on ${this.date}`;
  }
}

class Workout extends WellnessLog {
  constructor(userId, date, type, duration, intensity, caloriesBurned) {
    super(userId, date);
    this.type = type;           // e.g. "Cardio", "Strength"
    this.duration = duration;   // minutes
    this.intensity = intensity; // "Low" | "Medium" | "High"
    this.caloriesBurned = caloriesBurned;
  }

  getSummary() {
    return `${this.type} workout - ${this.duration} mins, burned ${this.caloriesBurned} kcal`;
  }
}

class Nutrition extends WellnessLog {
  constructor(userId, date, mealName, calories, macros) {
    super(userId, date);
    this.mealName = mealName;
    this.calories = calories;
    this.macros = macros; // { protein, carbs, fat }
  }

  getSummary() {
    return `${this.mealName} - ${this.calories} kcal`;
  }
}

module.exports = { WellnessLog, Workout, Nutrition };
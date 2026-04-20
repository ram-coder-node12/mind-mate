import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';

const useBurnoutScore = () => {
  const { tasks, checkins } = useAppData();

  const burnoutData = useMemo(() => {
    if (checkins.length === 0) return { score: 0, level: 'Low Risk', message: 'No data yet. Start your first check-in!' };

    const latest = checkins[0];
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.deadline && new Date(t.deadline) < new Date());

    let score = 0;

    // Mood (1-5) -> 5 is good, 1 is bad
    score += (5 - latest.mood) * 10;

    // Stress (1-5) -> 1 is low, 5 is high
    score += latest.stress * 10;

    // Energy (1-5) -> 5 is high, 1 is low
    score += (5 - latest.energy) * 10;

    // Sleep (Threshold 7 hours)
    if (latest.sleepHours < 7) {
      score += (7 - latest.sleepHours) * 8;
    }

    // Study hours (Threshold 8 hours)
    if (latest.studyHours > 8) {
      score += (latest.studyHours - 8) * 5;
    }

    // Workload
    score += pendingTasks.length * 4;
    score += overdueTasks.length * 10;

    // Normalize to 0-100
    score = Math.min(100, Math.max(0, score));

    let level = 'Low Risk';
    let message = 'You are in a good place. Keep it up!';

    if (score >= 70) {
      level = 'High Risk';
      message = 'CRITICAL: You are showing signs of severe burnout. Please take a break immediately and prioritize rest.';
    } else if (score >= 40) {
      level = 'Medium Risk';
      message = 'CAUTION: Your stress levels are rising. Consider slowing down and managing your task load.';
    }

    return { 
      score: Math.round(score), 
      level, 
      message,
      latestMetrics: {
        mood: latest.mood,
        stress: latest.stress,
        sleep: latest.sleepHours,
        study: latest.studyHours,
        energy: latest.energy
      }
    };
  }, [tasks, checkins]);

  return burnoutData;
};

export default useBurnoutScore;

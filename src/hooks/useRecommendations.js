import { useMemo } from 'react';

const useRecommendations = (burnoutData) => {
  const recommendations = useMemo(() => {
    const recs = [];
    const { score, latestMetrics } = burnoutData;

    if (!latestMetrics) return [];

    if (score > 70) {
      recs.push({
        id: 'urgent-rest',
        title: 'Emergency Rest',
        text: 'Stop studying for today. Your vitals show a high burnout risk.',
        type: 'danger'
      });
    }

    if (latestMetrics.sleep < 6) {
      recs.push({
        id: 'sleep-more',
        title: 'Prioritize Sleep',
        text: 'Aim for at least 7.5 hours of sleep tonight to improve cognitive function.',
        type: 'warning'
      });
    }

    if (latestMetrics.stress > 3) {
      recs.push({
        id: 'meditation',
        title: 'Stress Management',
        text: 'Take a 10-minute mindfulness break. High stress is reducing your efficiency.',
        type: 'warning'
      });
    }

    if (latestMetrics.study > 10) {
      recs.push({
        id: 'study-cap',
        title: 'Diminishing Returns',
        text: 'You have studied for over 10 hours. Your focus is likely low now. Call it a day.',
        type: 'info'
      });
    }

    if (recs.length === 0) {
      recs.push({
        id: 'keep-going',
        title: 'Steady Pace',
        text: 'You are maintaining a healthy balance. Keep focusing on your top priorities.',
        type: 'success'
      });
    }

    return recs;
  }, [burnoutData]);

  return recommendations;
};

export default useRecommendations;

import Analytics from '../models/Analytics.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';
import Achievement from '../models/Achievement.js';
import Timeline from '../models/Timeline.js';

export const getAnalytics = async (req, res) => {
  try {
    const [analytics, projects, blogs, skills, certificates, achievements, timeline] =
      await Promise.all([
        Analytics.findOne(),
        Project.countDocuments(),
        Blog.countDocuments(),
        Skill.countDocuments(),
        Certificate.countDocuments(),
        Achievement.countDocuments(),
        Timeline.countDocuments(),
      ]);
    res.json({
      totalVisitors: analytics?.totalVisitors || 0,
      pageViews: analytics?.pageViews || 0,
      projects, blogs, skills, certificates, achievements, timeline,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const trackVisit = async (req, res) => {
  try {
    let analytics = await Analytics.findOne();
    if (!analytics) analytics = await Analytics.create({ totalVisitors: 0, pageViews: 0 });
    analytics.totalVisitors += 1;
    analytics.pageViews += 1;
    analytics.lastVisit = new Date();
    await analytics.save();
    res.json({ totalVisitors: analytics.totalVisitors });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

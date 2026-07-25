import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import SocialLink from '../models/SocialLink.js';

export const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const lower = (message || '').toLowerCase();

    if (lower.includes('project')) {
      const projects = await Project.find().limit(3).select('title description');
      const list = projects.map(p => `• **${p.title}**: ${p.description?.slice(0, 80)}...`).join('\n');
      return res.json({ answer: `Here are some projects:\n${list}\n\nVisit the **Projects** page for more!` });
    }

    if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack')) {
      const skills = await Skill.find().select('name category');
      const names = skills.map(s => s.name).join(', ');
      return res.json({ answer: `My skills include: **${names}**. Check the Skills page for proficiency levels!` });
    }

    if (lower.includes('contact') || lower.includes('email') || lower.includes('hire')) {
      const social = await SocialLink.findOne();
      return res.json({ answer: `You can reach me at **${social?.email || 'hello@dev.com'}** or use the Contact page. I respond within 24 hours!` });
    }

    res.json({ answer: "I can answer questions about projects, skills, GitHub, LeetCode, resume, and contact info. Ask away!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

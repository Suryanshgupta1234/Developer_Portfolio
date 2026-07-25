import SocialLink from '../models/SocialLink.js';

export const getSocial = async (req, res) => {
  try {
    let social = await SocialLink.findOne();
    if (!social) social = await SocialLink.create({});
    res.json(social);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateSocial = async (req, res) => {
  try {
    let social = await SocialLink.findOne();
    if (!social) social = await SocialLink.create(req.body);
    else social = await SocialLink.findByIdAndUpdate(social._id, req.body, { new: true });
    res.json(social);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

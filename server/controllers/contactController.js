export const sendContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email, and message are required' });
    // In production, integrate NodeMailer or send via EmailJS from frontend
    console.log('📧 Contact form:', { name, email, subject, message });
    res.json({ message: 'Message received. Will respond soon!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

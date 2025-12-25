const axios = require('axios');

/**
 * chatWithBot
 * - Accepts { message, lang }
 * - If a TRANSLATE_API is configured and lang is set and not 'en', translates incoming message to 'en',
 *   forwards to AI API, then translates AI response back to user's lang.
 * - If TRANSLATE_API is not configured, forwards { message, lang } to AI API and returns reply.
 */
exports.chatWithBot = async (req, res) => {
  try {
    let { message, lang } = req.body;

    const aiApi = process.env.AI_API; // required for AI
    const translateApi = process.env.TRANSLATE_API; // optional translator endpoint

    if (!aiApi) {
      return res.status(500).json({ error: 'AI_API not configured on server' });
    }

    // If translation service is configured and requested language is not English, translate incoming
    let originalLang = lang || 'en';
    let textForAi = message;

    if (translateApi && originalLang && originalLang !== 'en') {
      try {
        // Expect translator to accept { q, source, target } or { text, source, target }
        const tPayload = { q: message, source: originalLang, target: 'en' };
        const tResp = await axios.post(translateApi, tPayload);
        // Try multiple possible response shapes
        textForAi = (tResp.data && (tResp.data.translatedText || tResp.data.translated || tResp.data.result)) || tResp.data || message;
      } catch (tErr) {
        // If translation fails, continue with original message (best-effort)
        console.warn('Translation (to en) failed, continuing with original message', tErr && tErr.message);
        textForAi = message;
      }
    }

    // Send to AI provider
    const payload = { message: textForAi, lang: 'en' };
    const aiResp = await axios.post(aiApi, payload);
    let aiReply = aiResp.data && (aiResp.data.reply || aiResp.data.text) || 'No reply from AI';

    // If we translated the user's input, translate the AI reply back to user's language
    if (translateApi && originalLang && originalLang !== 'en') {
      try {
        const backPayload = { q: aiReply, source: 'en', target: originalLang };
        const backResp = await axios.post(translateApi, backPayload);
        aiReply = (backResp.data && (backResp.data.translatedText || backResp.data.translated || backResp.data.result)) || backResp.data || aiReply;
      } catch (tErr) {
        console.warn('Translation (to user lang) failed, returning English reply', tErr && tErr.message);
      }
    }

    res.json({ reply: aiReply });
  } catch (err) {
    console.error('chatWithBot error:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'AI service not available' });
  }
};

// Helper to call Gemini API
export const callGeminiAPI = async (prompt, retries = 2) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""
  if (!apiKey) return "(AI disabled - no API key configured)"

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  const payload = { contents: [{ parts: [{ text: prompt }] }] }

  try {
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const json = await resp.json()
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "(AI returned empty response)"
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1000))
      return callGeminiAPI(prompt, retries - 1)
    }
    console.error("Gemini call failed:", err)
    return "(AI service unreachable)"
  }
}
import { reviewCode } from "../utils/AICode.js";

export async function handleReviewRequest(req, res) {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, error: "code is requierd" });
    }
    if (!language) {
      return res
        .status(400)
        .json({ success: false, error: "language is requierd" });
    }
    const result = await reviewCode(code, language);
    res.json({ success: true, output: result });
  } catch (error) {
    console.error(`Error Occured while handling review code request: ${error}`);
    res
      .status(500)
      .json({ success: false, error: error?.message ?? "AI review failed" });
  }
}

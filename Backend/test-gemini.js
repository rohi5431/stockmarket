const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AIzaSyCHKRgs2netZ8YZPRvdZnp0yV7U_MUYHmU";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log("Response for 1.5-flash:", result.response.text());
  } catch(e) {
    console.error("1.5-flash failed:", e.message);
  }
}
run();

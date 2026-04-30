const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AIzaSyCHKRgs2netZ8YZPRvdZnp0yV7U_MUYHmU";
async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
  console.log("Available generateContent models:", models.map(m => m.name));
}
run();

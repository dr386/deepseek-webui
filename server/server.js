const express = require("express");
const cors = require("cors");
const { Ollama } = require("ollama");

const app = express();
app.use(cors());
app.use(express.json());

const ollama = new Ollama();
const chatHistory = [];

app.post("/chat", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const { message } = req.body;
    
    // Ensure message exists
    if (!message || typeof message !== "string") {
        console.error("Received an empty or invalid message");
        return res.status(400).send("Invalid message");
    }

    // Append user message to history
    chatHistory.push({ role: "user", content: message });

    // Send full history to Deepseek R1
    const stream = await ollama.chat({ model: "deepseek-r1:8b", messages: chatHistory, stream: true });

    let botReply = "";

    for await (const chunk of stream) {
        botReply += chunk.message.content;
        res.write(chunk.message.content);
    }

    chatHistory.push({ role: "assistant", content: botReply });

    res.end();
});

app.listen(3000, () => console.log("Server running on port 3000"));

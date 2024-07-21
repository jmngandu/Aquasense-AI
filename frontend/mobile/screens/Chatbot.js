import React, { useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const ChatbotApp = () => {
    const [messages, setMessages] = useState([
        {
            _id: 1,
            text: "Hello! I am your GFG chatbot. How can I help you?",
            createdAt: new Date(),
            user: { _id: 2, name: "Chatbot" },
        },
    ]);

    const handleSend = (newMessages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );

        const userMessage = newMessages[0].text;
        const botResponse = generateChatbotResponse(userMessage);

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
                {
                    _id: Math.round(Math.random() * 1000000),
                    text: botResponse,
                    createdAt: new Date(),
                    user: { _id: 2, name: "Chatbot" },
                },
            ])
        );
    };

    const generateChatbotResponse = (userMessage) => {
        switch (userMessage.toLowerCase()) {
            case "hello":
                return "Hi there! How can I assist you today?";
            case "how are you":
                return "I am just a chatbot, but thanks for asking!";
            case "bye":
                return "Goodbye! If you have more questions, feel free to ask.";
            case "javascript":
                return "JavaScript is a programming language commonly used to create interactive effects within web browsers.";
            case "python":
                return "Python is a versatile and easy-to-read programming language often used for web development, data analysis, and artificial intelligence.";
            case "html":
                return "HTML (Hypertext Markup Language) is the standard markup language for documents designed to be displayed in a web browser.";
            case "css":
                return "CSS (Cascading Style Sheets) is a style sheet language used for describing the look and formatting of a document written in HTML.";
            case "git":
                return "Git is a distributed version control system used to track changes in source code during software development.";
            case "api":
                return "An API (Application Programming Interface) is a set of rules that allows one software application to interact with another.";
            case "algorithm":
                return "An algorithm is a step-by-step procedure or formula for solving a problem or accomplishing a task in computer science.";
            case "database":
                return "A database is an organized collection of data, typically stored and accessed electronically from a computer system.";

            default:
                return "I'm sorry, I didn't understand that. Can you please rephrase?";
        }
    };

    return (
        <GiftedChat
            messages={messages}
            onSend={(newMessages) => handleSend(newMessages)}
            user={{ _id: 1, name: "User" }}
        />
    );
};

export default ChatbotApp;
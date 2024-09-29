

// Add event listener to trigger send button on Enter key
document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if inside a form
        document.getElementById('sendButton').click(); // Trigger the send button click
    }
});

document.getElementById('sendButton').addEventListener('click', async function() {
    const userInput = document.getElementById('userInput').value;
    const fileInput = document.getElementById('file');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        await uploadFile(file);
        fileInput.value = ''; // Clear the file input after uploading
    }
    if (userInput) {
        addMessage(userInput, 'user');
        document.getElementById('userInput').value = '';

        // Simulate bot response
        
        const response=await getBotResponse(userInput);
        addMessage(response,'bot')
    }
});

function addMessage(message, sender) {
    const chatbox = document.getElementById('chatbox');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const profilePic = document.createElement('img');
    profilePic.className = 'profile-pic';
    
    if (sender === 'user') {
        profilePic.src = '../static/user.jpeg'; // User profile picture
        messageDiv.classList.add('sender');
    } else {
        profilePic.src = '../static/icon128.png'; // Bot profile picture
        messageDiv.classList.add('receiver');
    }

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message;

    messageDiv.appendChild(profilePic);
    messageDiv.appendChild(textDiv);
    
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto scroll to the bottom
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:4000/upload/", {
            method: 'POST',
            body: formData
        });

        const data = await response.json();  // assuming the response is JSON
        console.log('File uploaded successfully:', data);

        if (data && data.detection_results) {
            await addMessage(data.detection_results, 'bot');  // Show the response in the chat
        }

    } catch (error) {
        console.error("Error uploading file:", error);
    }
}



async function getBotResponse(input) {
    try {
        const response = await fetch("http://127.0.0.1:4000/gemini_message/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: input })
        });

        const data = await response.json();
        if (data.text) {
            return data.text; // Return the bot's response
        } else {
            return "Sorry, I didn't understand that."; // Fallback response
        }
    } catch (error) {
        console.error("Error getting bot response:", error);
        return "Sorry, I encountered an error while processing your request."; // Error handling response
    }
}
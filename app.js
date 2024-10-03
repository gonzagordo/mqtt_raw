let client;
let refreshInterval;

const connectBtn = document.getElementById("connect-btn");
const resetBtn = document.getElementById("reset-btn");
const brokerInput = document.getElementById("broker-ip");
const refreshRateInput = document.getElementById("refresh-rate");
const topicInputs = document.querySelectorAll(".topic-input");

const mqttValues = {
    "topic/1": document.getElementById("mqtt-value-1"),
    "topic/2": document.getElementById("mqtt-value-2"),
    "topic/3": document.getElementById("mqtt-value-3"),
    "topic/4": document.getElementById("mqtt-value-4"),
    "topic/5": document.getElementById("mqtt-value-5"),
    "topic/6": document.getElementById("mqtt-value-6"),
};

connectBtn.addEventListener("click", () => {
    if (client) {
        client.end(); // Disconnect previous client
    }
    const brokerIP = brokerInput.value;
    client = mqtt.connect(`ws://${brokerIP}:8080`);

    client.on("connect", () => {
        console.log("Connected to broker");
        subscribeToTopics();
    });

    client.on("message", (topic, message) => {
        if (mqttValues[topic]) {
            mqttValues[topic].innerText = message.toString();
        }
    });
});

resetBtn.addEventListener("click", () => {
    clearInterval(refreshInterval);
    const refreshRate = refreshRateInput.value * 1000;
    refreshInterval = setInterval(subscribeToTopics, refreshRate);
});

function subscribeToTopics() {
    topicInputs.forEach((input, index) => {
        const topic = input.value;
        const id = `mqtt-topic-${index + 1}`;
        const displayElement = document.getElementById(id);
        if (displayElement.innerText !== topic) {
            displayElement.innerText = topic;
            client.subscribe(topic);
        }
    });
}

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./key.json";
const express = require("express");
const speech = require("@google-cloud/speech");

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

const speechClient = new speech.SpeechClient();

io.on("connection", (socket) => {
	let recognizeStream = null;
	console.log(
		"\n" + socket.client.conn.server.clientsCount + " users connected"
	);
	console.log("\n Server: A user connected with " + socket.id + "\n");

	socket.on("disconnect", () => {
		console.log(
			"\n Server: user with socket Id " + socket.id + " disconnected \n"
		);
	});

	socket.on("client_to_server_send_message", (message) => {
		console.log("\n Server: message: " + message);
		setTimeout(() => {
			io.emit("server_to_client_send_message", "got this message" + message);
		}, 1000);
	});

	socket.on("startTranscription", function (data) {
		startGoogleStream(this, data);
	});

	socket.on("stopTranscription", function () {
		console.log("\n Server: Stopping google  stream \n");
		stopGoogleStream();
	});

	socket.on("client_to_server_send_audio_data", async (audioData) => {
		io.emit("server_to_client_send_message", "Got audio data");
		if (recognizeStream !== null) {
			try {
				recognizeStream.write(audioData.audio);
			} catch (err) {
				console.log("Error calling google api " + err);
			}
		} else {
			//console.log("RecognizeStream is null");
		}
	});

	function startGoogleStream(client) {
		console.log("\n startGoogleStream\n");
		try {
			recognizeStream = speechClient
				.streamingRecognize(request)
				.on("error", console.error)
				.on("data", (data) => {
					const result = data.results[0];
					const isFinal = result.isFinal;

					const transcription = data.results
						.map((result) => result.alternatives[0].transcript)
						.join("\n");

					console.log(`Transcription: `, transcription);

					client.emit("receive_audio_text", {
						text: transcription,
						isFinal: isFinal,
					});

					if (data.results[0] && data.results[0].isFinal) {
						stopGoogleStream();
						startGoogleStream(client);
						console.log("Restarted stream from server-side");
					}
				});
		} catch (err) {
			console.error("Error streaming google api " + err);
		}
	}

	function stopGoogleStream() {
		if (recognizeStream) {
			console.log("\n Server: stopGoogleStream \n");
			recognizeStream.end();
		}
		recognizeStream = null;
	}
});

server.listen(8082, () => {
	console.log("WebSocket server listening on port 8082.");
});

const request = {
	config: {
		encoding: "LINEAR16",
		sampleRateHertz: 16000,
		languageCode: "en-IN",
		alternativeLanguageCodes: ["en-US", "en-IN", "hi", "kn", "te", "ml", "ta"],
		enableWordTimeOffsets: true,
		enableAutomaticPunctuation: true,
		enableWordConfidence: true,
		enableSpeakerDiarization: true,
		model: "default",
		useEnhanced: true,
	},
	interimResults: true,
};

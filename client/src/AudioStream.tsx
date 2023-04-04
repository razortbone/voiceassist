/* eslint-disable react-hooks/exhaustive-deps */
import { default as React, useEffect, useState, useRef } from "react";
// import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import * as io from "socket.io-client";
// import CreateNote from "./components/CreateNote";
import "./css/Note.css";
import { TextField } from "@mui/material";
// import Note from "./components/Note";
// import { noteType } from "./components/Notes";

const sampleRate = 16000;

const getMediaStream = () =>
	navigator.mediaDevices.getUserMedia({
		audio: {
			deviceId: "default",
			sampleRate: sampleRate,
			sampleSize: 16,
			channelCount: 1,
		},
		video: false,
	});

interface WordRecognized {
	final: boolean;
	text: string;
}

const AudioStream: React.FC = () => {
	const [connection, setConnection] = useState<io.Socket>();
	const [currentRecognition, setCurrentRecognition] = useState<string>();
	const [recognitionHistory, setRecognitionHistory] = useState<string[]>([]);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [recorder, setRecorder] = useState<any>();
	const processorRef = useRef<any>();
	const audioContextRef = useRef<any>();
	const audioInputRef = useRef<any>();
	const speechRecognized = (data: WordRecognized) => {
		if (data.final) {
			setCurrentRecognition("...");
			setRecognitionHistory((old) => [data.text, ...old]);
		} else setCurrentRecognition(data.text + "...");
	};

	const connect = () => {
		connection?.disconnect();
		const socket = io.connect("http://localhost:8082");
		socket.on("connect", () => {
			console.log("connected", socket.id);
			setConnection(socket);
		});

		socket.emit("client_to_server_send_message", "hello world");

		socket.emit("startTranscription");

		socket.on("server_to_client_send_message", (data) => {
			console.log("received message", data);
		});

		socket.on("receive_audio_text", (data) => {
			speechRecognized(data);
			console.log("received audio text", data);
		});

		socket.on("disconnect", () => {
			console.log("disconnected", socket.id);
		});
	};

	const disconnect = () => {
		if (!connection) return;
		connection?.emit("stopTranscription");
		connection?.disconnect();
		processorRef.current?.disconnect();
		audioInputRef.current?.disconnect();
		audioContextRef.current?.close();
		setConnection(undefined);
		setRecorder(undefined);
		setIsRecording(false);
	};

	useEffect(() => {
		(async () => {
			if (connection) {
				if (isRecording) {
					return;
				}

				const stream = await getMediaStream();

				audioContextRef.current = new window.AudioContext();

				await audioContextRef.current.audioWorklet.addModule(
					"/src/worklets/recorderWorkletProcessor.js"
				);

				audioContextRef.current.resume();

				audioInputRef.current =
					audioContextRef.current.createMediaStreamSource(stream);

				processorRef.current = new AudioWorkletNode(
					audioContextRef.current,
					"recorder.worklet"
				);

				processorRef.current.connect(audioContextRef.current.destination);
				audioContextRef.current.resume();

				audioInputRef.current.connect(processorRef.current);

				processorRef.current.port.onmessage = (event: any) => {
					const audioData = event.data;
					connection.emit("client_to_server_send_audio_data", {
						audio: audioData,
					});
				};
				setIsRecording(true);
			} else {
				console.error("No connection");
			}
		})();
		return () => {
			if (isRecording) {
				processorRef.current?.disconnect();
				audioInputRef.current?.disconnect();
				if (audioContextRef.current?.state !== "closed") {
					audioContextRef.current?.close();
				}
			}
		};
	}, [connection, isRecording, recorder]);

	return (
		<React.Fragment>
			<Container className="py-5 text-center">
				<Container fluid className="py-5 bg-primary text-light text-center ">
					<div>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<button
							className={isRecording ? "start_button" : "start_button_light"}
							onClick={connect}
							disabled={isRecording}
						>
							Start
						</button>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<button
							className="start_button_light"
							onClick={disconnect}
							disabled={!isRecording}
						>
							Stop
						</button>
					</div>
				</Container>
				<Container className="py-5 text-center">
					<div className="col-md-3 center">
						{recognitionHistory.map((tx, idx) => (
							<p style={{ color: "white" }} key={idx}>
								{tx}
							</p>
						))}
						<p style={{ color: "white" }}>{currentRecognition}</p>
					</div>
				</Container>
			</Container>
		</React.Fragment>
	);
};

export default AudioStream;

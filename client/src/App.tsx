import React from "react";
import "./css/App.css";
import AudioStream from "./AudioStream";
import Container from "react-bootstrap/Container";
import Notes from "./components/Notes";
import Header from "./components/Header";
function App() {
	return (
		<Container className="py-5 text-center">
			<Header />
			<AudioStream />
			<Notes />
		</Container>
	);
}

export default App;

import React from "react";
import { useState /*, useEffect*/ } from "react";
import "../css/Note.css";
import Note from "./Note";
import { v4 as uuid } from "uuid";

import CreateNote from "./CreateNote";

export interface noteType {
	id: string;
	text: string;
}
export interface CreateNoteType {
	textHandler: (e: any) => void;
	saveHandler: () => void;
	inputText: string;
}

export interface NoteDeleteType {
	id: string;
	text: string;
	deleteNote: (id: string) => void;
}

function Notes() {
	const [notes, setNotes] = useState<noteType[]>([]);
	const [inputText, setInputText] = useState<string>("");

	const deleteNote = (id: string) => {
		const filteredNotes = notes.filter((note) => note.id !== id);
		setNotes(filteredNotes);
	};

	const textHandler = (e: any) => {
		setInputText(e.target.value);
	};

	const saveHandler = () => {
		setNotes((prevState) => [
			...prevState,
			{
				id: uuid(),
				text: inputText,
			},
		]);
		//clear the textarea
		setInputText("");
	};
	// useEffect(() => {
	// 	const data = JSON.parse(localStorage.getItem("Notes") ?? "");
	// 	if (data) {
	// 		setNotes(data);
	// 	}
	// }, []);

	// //saving data to local storage
	// useEffect(() => {
	// 	localStorage.setItem("Notes", JSON.stringify(notes));
	// }, [notes]);

	return (
		<div className="notes">
			{notes.map((note) => (
				<Note
					key={note.id}
					id={note.id}
					text={note.text}
					deleteNote={deleteNote}
				/>
			))}
			<CreateNote
				textHandler={textHandler}
				saveHandler={saveHandler}
				inputText={inputText}
			/>
		</div>
	);
}
export default Notes;

// import React, { useState } from "react";
// import { dNote } from "./Note";
// const Form = (props: dNote) => {
// 	const [note, setNote] = useState<dNote>({
// 		title: "",
// 		content: "",
// 		id: "",
// 		getId,
// 	});

// 	const handleChange = (e) => {
// 		const name = e.target.name;
// 		const value = e.target.value;
// 		setNote({ ...note, [name]: value });
// 	};

// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		// console.log(note);
// 		props.onCreate(note);
// 		setNote({ title: "", content: "" });
// 	};

// 	return (
// 		<form method="post" onSubmit={handleSubmit}>
// 			<input
// 				type="text"
// 				name="title"
// 				placeholder="Enter Title..."
// 				onChange={handleChange}
// 				value={note.title}
// 			/>
// 			<textarea
// 				name="content"
// 				placeholder="Type Content Here..."
// 				onChange={handleChange}
// 				value={note.content}
// 				rows="4"
// 			></textarea>
// 			<button type="submit">submit</button>
// 		</form>
// 	);
// };

// export default Form;

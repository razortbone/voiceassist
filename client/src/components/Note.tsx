import React from "react";
import { NoteDeleteType } from "./Notes";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
function Note(noteDeleteType: NoteDeleteType) {
	return (
		<div className="note">
			<div className="note__body">{noteDeleteType.text}</div>
			<div className="note__footer" style={{ justifyContent: "flex-end" }}>
				<DeleteForeverOutlinedIcon
					className="note__delete"
					aria-hidden="true"
					onClick={() => noteDeleteType.deleteNote(noteDeleteType.id)}
				></DeleteForeverOutlinedIcon>
			</div>
		</div>
	);
}
export default Note;

// import React from "react";
// import DisplayNote from "./DisplayNote";
// import Form from "./Form";
// import { useState } from "react";

// export interface dNote {
// 	title: string;
// 	content: string;
// 	id: number;
// 	getId: (id: number) => void;
// 	// onCreate: (note: dNote) => void;
// }

// const Note = () => {
// 	const [notes, setNotes] = useState<dNote[]>([]);

// 	const createNote = (note: dNote) => {
// 		console.log(note);
// 		setNotes((prevNotes) => {
// 			return [...prevNotes, note];
// 		});
// 	};

// 	const deleteNote = (id: number) => {
// 		// console.log(id);
// 		setNotes((prevNotes) => {
// 			return prevNotes.filter((item, index) => {
// 				return index !== id;
// 			});
// 		});
// 	};

// 	return (
// 		<div className="container">
// 			<Form onCreate={createNote} />
// 			<div className="note-container">
// 				{notes &&
// 					notes.map((note, index) => (
// 						<DisplayNote
// 							title={note.title}
// 							content={note.content}
// 							id={index}
// 							getId={deleteNote}
// 						/>
// 					))}
// 			</div>
// 		</div>
// 	);
// };

// export default Note;

// // import React from "react";
// // import { Button } from "react-bootstrap";
// // // import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
// // const Note = () => {
// // 	return (
// // 		<div className="note">
// // 			<div className="note__body"></div>
// // 			<div className="note__footer" style={{ justifyContent: "flex-end" }}>
// // 				<Button className="btn-outline-light" variant="Primary">
// // 					Delete
// // 				</Button>
// // 			</div>
// // 		</div>
// // 	);
// // };
// // export default Note;

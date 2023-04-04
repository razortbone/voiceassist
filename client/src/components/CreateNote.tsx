import React from "react";
import { CreateNoteType } from "./Notes";
import LinearProgress from "@mui/material/LinearProgress";

function CreateNote(createNoteType: CreateNoteType) {
	//character limit
	const charLimit = 1000;
	const charLeft = charLimit - createNoteType.inputText.length;
	return (
		<div className="note" style={{ background: "rgba(255, 255, 255, 0)" }}>
			<textarea
				cols={10}
				rows={5}
				value={createNoteType.inputText}
				placeholder="Edit/Save Transcription .."
				onChange={createNoteType.textHandler}
				maxLength={1000}
			></textarea>
			<div className="note__footer">
				<span className="label">{charLeft} left</span>
				<button className="note__save" onClick={createNoteType.saveHandler}>
					Save
				</button>
			</div>
			<LinearProgress
				className="char__progress"
				variant="determinate"
				value={charLeft}
			/>
		</div>
	);
}

export default CreateNote;

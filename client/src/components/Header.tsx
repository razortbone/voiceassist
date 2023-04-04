import React from "react";
import Container from "react-bootstrap/Container";
import "../css/App.css";

function Header() {
	return (
		<React.Fragment>
			<Container className="text-center">
				<div className="header">
					{/* <div></div> */}
					<div className="boxlayout">
						<h1 className="notes__title">
							&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Speech to
							Text Transcription
						</h1>
					</div>
				</div>
			</Container>
		</React.Fragment>
	);
}
export default Header;

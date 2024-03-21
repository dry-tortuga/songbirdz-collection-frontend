import React from "react";

const BirdAudioFile = (props) => {

	const { birdId, ...restProps } = props;

	return (
		<audio
			{...restProps}
			src={`${process.env.PUBLIC_URL}/audio/${birdId}.mp3`}
			controlsList="nodownload"
			controls />
	);

};

export default BirdAudioFile;

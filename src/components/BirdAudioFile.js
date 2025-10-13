import React from "react";

const BirdAudioFile = (props) => {

	const { bird, ...restProps } = props;

	return (
		<div {...restProps}>
			<audio
				src={`${process.env.PUBLIC_URL}/audio/${bird.id}.mp3`}
				style={{ width: '100%' }}
				controlsList="nodownload"
				controls
				loop />
			<p
				className="text-muted text-center mt-1"
				style={{ fontSize: '0.85rem' }}>
				{bird.owner ? bird.audio_contributor_species : ''} © {bird.audio_contributor_name}; Songbirdz Library
			</p>
		</div>
	);

};

export default BirdAudioFile;

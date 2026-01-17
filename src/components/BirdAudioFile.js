import React from "react";

const BirdAudioFile = (props) => {

	const { bird, ...restProps } = props;

	let filename = `XC${bird.audioMetadata.id} · ${bird.audioMetadata.en} · ${bird.audioMetadata.gen} ${bird.audioMetadata.sp}`;

	if (!bird.owner) {
		filename = `XC${bird.audioMetadata.id}`;
	}

	return (
		<div {...restProps}>
			{bird.audioMetadata ? (
				<>
					<audio
						src={bird.audio}
						style={{ width: '100%' }}
						controlsList="nodownload"
						controls
						loop />
					<p
						className="text-muted text-center mt-1"
						style={{ fontSize: '0.7rem' }}>
						{`The original recording has been modified by the Songbirdz project. `}
						{`Original recording is "${filename}" `}
						{`by ${bird.audioMetadata.rec}. `}
						{`Available for use under the CC ${bird.audioMetadata.lic} license (creativecommons.org/licenses/${bird.audioMetadata.lic}), at `}
						<a
							href={`https://www.xeno-canto.org/${bird.audioMetadata.id}`}
							target="_blank"
							rel="noopener noreferrer nofollow">
							{`www.xeno-canto.org/${bird.audioMetadata.id}`}
						</a>
						{"."}
					</p>
				</>
			) : "None"}
		</div>
	);

};

export default BirdAudioFile;

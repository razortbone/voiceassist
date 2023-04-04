export const getMedia = () =>
	navigator.mediaDevices.getUserMedia({
		audio: {
			deviceId: "default",
			sampleRate: 16000,
			sampleSize: 16,
			channelCount: 1,
		},
		video: false,
	});

export interface WordType {
	final: boolean;
	text: string;
}

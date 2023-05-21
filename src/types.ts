export interface ICachedImage {
	id: string;
	data: Buffer;
}

export interface IResizeInfo {
	width: number;
	height: number;
	toString: () => string;
}

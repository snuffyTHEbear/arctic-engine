import * as PIXI from "pixi.js";

export interface IScene
{
	init(add: PIXI.Application): void

	update(): void

	cleanup(): void;
}
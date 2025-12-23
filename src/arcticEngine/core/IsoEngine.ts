import {Graphics} from 'pixi.js';

/**
 * drawIso - Only draws the iso object, stroke, fill, colours etc handled outside of this function
 * @param iso : Graphics
 * @param tileWidth : number = 64
 * @param tileHeight : number = 32
 */
export function drawIso(iso: Graphics, tileWidth: number = 64, tileHeight: number = 32): void
{
	iso.moveTo(0, -tileHeight / 2)        //TOP
		.lineTo(tileWidth / 2, 0)        //RIGHT
		.lineTo(0, tileHeight / 2)        //BOTTOM
		.lineTo(-tileWidth / 2, 0)        //LEFT
		.lineTo(0, -tileHeight / 2);		//TOP (Close Loop)
}
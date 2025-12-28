import {Container, Graphics} from "pixi.js";
import {IsoUtils} from "./utils/IsoUtils.ts";
import {Colour24} from "./graphics/Colour24.ts";

export class Block extends Container
{
	public gridRow: number;
	public gridCol: number;
	public zHeight: number;

	private _colour: Colour24;

	private _graphics: Graphics;

	constructor(row: number, col: number, z: number = 0, colour: number = 0xFFB6C1)
	{
		super();

		this.gridRow = row;
		this.gridCol = col;
		this.zHeight = z;
		this._colour = new Colour24(colour);

		const pos = IsoUtils.isoToScreen(row, col);
		this.x = pos.x;
		this.y = pos.y;

		this.zIndex = row + col;

		this._graphics = new Graphics();
		this.addChild(this._graphics);
		this.redraw();
	}

	public set colour(c: number)
	{
		this._colour.colour = c;
	}

	public redraw(): void
	{
		const g: Graphics = this._graphics;
		g.clear();

		const halfW: number = IsoUtils.TILE_W / 2;
		const halfH: number = IsoUtils.TILE_H / 2;
		const topY: number = -this.zHeight;

		this._colour.darkenColour(25, 25, 25);
		g.poly([
			halfW, 0,
			0, halfH,
			0, topY + halfH,
			halfW, topY
		]).fill(this._colour.colour);

		this._colour.lightenColour(25, 25, 25)
		g.poly([
			-halfW, 0,
			0, halfH,
			0, topY + halfH,
			-halfW, topY
		]).fill(this._colour.colour);

		g.poly([
			0, topY - halfH,
			halfW, topY,
			0, topY + halfH,
			-halfW, topY
		]).fill(this._colour.baseColour);

		g.stroke({width: 0, color: 0x000000, alpha: 0.3});
	}
}
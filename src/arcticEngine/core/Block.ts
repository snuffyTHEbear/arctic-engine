import {Container, Graphics, Ticker} from "pixi.js";
import {IsoUtils} from "./utils/IsoUtils.ts";
import {Colour24} from "./graphics/Colour24.ts";

export class Block extends Container
{
	public gridRow: number;
	public gridCol: number;
	public zHeight: number;

	private _colour: Colour24;
	private readonly _graphics: Graphics;

	private _waveOffset: number = 0;

	private _targetX: number = 0;
	private _targetY: number = 0;

	private _speed: number = 0.15;

	constructor(row: number, col: number, z: number = 0, colour: number = 0xFFB6C1, ticker: boolean = false)
	{
		super();

		this.gridRow = row;
		this.gridCol = col;
		this.zHeight = z;
		this._colour = new Colour24(colour);

		const pos = IsoUtils.isoToScreen(row, col);
		this.x = this._targetX = pos.x;
		this.y = this._targetY = pos.y;

		this.zIndex = row + col;

		this._graphics = new Graphics();
		this.addChild(this._graphics);
		this.redraw();
		ticker ? Ticker.shared.add(this.update, this) : null;
	}

	public set colour(c: number)
	{
		this._colour.baseColour = c;
		this._colour.colour = c;
	}

	public get waveOffset(): number
	{
		return this._waveOffset;
	}

	public set waveOffset(n: number)
	{
		this._waveOffset = n;
	}

	public moveTo(newRow: number, newCol: number, liftHeight: number = 0): void
	{
		this.gridRow = newRow;
		this.gridCol = newCol;

		const pos: { x: number, y: number } = IsoUtils.isoToScreen(newRow, newCol);
		this._targetX = pos.x;
		this._targetY = pos.y - liftHeight;

		this.zIndex = newRow + newCol + 1;
	}

	private update(ticker: Ticker): void
	{
		console.log("Block update");
		const dx: number = this._targetX - this.x;
		const dy: number = this._targetY - this.y;

		if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)
		{
			this.x += dx * this._speed;
			this.y += dy * this._speed;
		}
		else
		{
			this.x = this._targetX;
			this.y = this._targetY;
		}
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
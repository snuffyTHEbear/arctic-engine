import {Container, Graphics} from "pixi.js";
import {IsoUtils} from "./utils/IsoUtils.ts";

export class Clock extends Container
{
	public gridRow: number;
	public gridCol: number;
	public zHeight: number;

	private _graphics: Graphics;

	constructor(row: number, col: number, z: number = 0)
	{
		super();

		this.gridRow = row;
		this.gridCol = col;
		this.zHeight = z;

		const pos = IsoUtils.isoToScreen(row, col);
		this.x = pos.x;
		this.y = pos.y;

		this.zIndex = row + col;

		this._graphics = new Graphics();
		this.addChild(this._graphics);
		this.redraw();
	}

	public redraw(): void
	{

	}
}
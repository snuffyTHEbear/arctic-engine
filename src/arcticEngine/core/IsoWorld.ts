import {Container} from "pixi.js";
import {Block} from "./Block.ts";

export class IsoWorld extends Container
{
	private _blocks: Block[] = [];
	private readonly _rows: number;
	private readonly _cols: number;

	public get rows(): number
	{
		return this._rows;
	}

	public get cols(): number
	{
		return this._cols;
	}

	public get blocks(): Block[]
	{
		return this._blocks;
	}

	constructor(rows: number, cols: number)
	{
		super();
		this._rows = rows;
		this._cols = cols;

		this.sortableChildren = true;

		this.generateMap();
	}

	private generateMap(): void
	{
		for (let row: number = 0; row < this._rows; row++)
		{
			for (let col: number = 0; col < this._cols; col++)
			{
				let height = 0;
				//if (Math.random() > 0.8) height = 60;

				const block = new Block(row, col, height);
				//block.waveOffset = row + (height * this._cols);
				this.addChild(block);
				this._blocks.push(block);
			}
		}
	}

	public redraw(): void
	{
		for (let j: number = 0; j < this._blocks.length; j++)
		{
			let b: Block = this._blocks[j];
			b.redraw();
		}
	}

	public getBlock(row: number, col: number): Block | null
	{
		return this._blocks.find(b => b.gridRow === row && b.gridCol === col) || null;
	}

	public isValid(row: number, col: number): boolean
	{
		return !(row < 0 || row >= this.rows || col < 0 || col >= this.cols);

	}
}
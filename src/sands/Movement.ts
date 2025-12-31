import type {Application} from "pixi.js";
import * as PIXI from "pixi.js";
import {IsoWorld} from "../arcticEngine/core/IsoWorld.ts";
import {Block} from "../arcticEngine/core/Block.ts";
import {IsoUtils} from "../arcticEngine/core/utils/IsoUtils.ts";
import type {IScene} from "../arcticEngine/core/IScene.ts";
import {DebugPanel} from "../arcticEngine/core/utils/DebugPanel.ts";

export class Movement implements IScene
{
	private app: PIXI.Application | null = null;
	private container: PIXI.Container;
	private world: IsoWorld;
	private player: Block;
	private debugPanel: DebugPanel;

	constructor()
	{
		this.container = new PIXI.Container();
		this.world = new IsoWorld(10, 10);
		this.player = new Block(0, 0, 25, IsoUtils.PastelPalette.Green, true);
		this.debugPanel = new DebugPanel();
		this.debugPanel.position.set(10, 10);
	}

	public init(app: Application): void
	{
		this.app = app;
		this.app.stage.addChild(this.container)
		this.app.stage.addChild(this.debugPanel);
		this.container.addChild(this.world);
		this.world.addChild(this.player);
		console.log("Movement initialized.");
		window.addEventListener("keydown", (ev) =>
		{
			console.log(this);
			let nextRow: number = this.player.gridRow;
			let nextCol: number = this.player.gridCol;

			switch (ev.code)
			{
				case "ArrowUp":
					nextRow--;
					break;
				case "ArrowDown":
					nextRow++;
					break;
				case "ArrowLeft":
					nextCol--;
					break;
				case "ArrowRight":
					nextCol++;
					break;
			}

			if (this.world.isValid(nextRow, nextCol))
			{
				const tile: Block | null = this.world.getBlock(nextRow, nextCol);
				const tileHeight: number = tile ? tile.zHeight : 0;

				const currentTile: Block | null = this.world.getBlock(this.player.gridRow, this.player.gridCol);
				const currentHeight: number = currentTile ? currentTile.zHeight : 0;

				if (Math.abs(tileHeight - currentHeight) <= 40)
				{
					this.player.moveTo(nextRow, nextCol, tileHeight);
				}
			}
		});
	}

	public update(): void
	{
		this.world.redraw();
		this.debugPanel.log("Last Key", 5);
	}

	public cleanup(): void
	{
		if (this.app)
		{
			this.app.stage.removeChild(this.container);
		}

		this.container.destroy({children: true});
		console.log("Movement cleanup.");
	}
}




import {Application, Graphics} from "pixi.js";
import {IsoWorld} from "./arcticEngine/core/IsoWorld.ts";
import {IsoUtils} from "./arcticEngine/core/utils/IsoUtils.ts";
import {DebugPanel} from "./arcticEngine/core/utils/DebugPanel.ts";

const app: Application = new Application();
await app.init({width: 1200, height: 800, backgroundColor: 0x333333});
document.body.appendChild(app.canvas);

const world: IsoWorld = new IsoWorld(15, 15);
app.stage.addChild(world);

const debugPanel = new DebugPanel();
debugPanel.position.set(10, 10);
app.stage.addChild(debugPanel);

const cursor: Graphics = new Graphics();
cursor.poly([
	0, -IsoUtils.TILE_H / 2, IsoUtils.TILE_W / 2, 0, 0, IsoUtils.TILE_H / 2, -IsoUtils.TILE_W / 2, 0
]).stroke({width: 2, color: 0xFF0000});
app.stage.addChild(cursor);

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

let currentRow: number = 0;
let currentCol: number = 0;
let prevBlock: Block;

app.ticker.add((): void =>
{
	return;
	const mouse = app.renderer.events.pointer;

	const gridPos: { row: number, col: number } = IsoUtils.screenToIso(mouse.global.x, mouse.global.y);
	const {row, col} = gridPos;

	if (currentCol == world.rows)
	{
		currentCol = 0;
		currentRow += 1;
	}
	else if (currentRow == world.rows)
	{
		currentCol = 0;
		currentRow = 0;
	}
	else
	{
		currentCol++;
	}
	// currentRow = currentCol = 0;
	debugPanel.log("Row", currentRow);
	debugPanel.log("Col", currentCol);

	const hoveredBlock = world.getBlock(currentRow, currentCol);
	debugPanel.log("Grid Pos", `${gridPos.row} : ${gridPos.col}`);
	debugPanel.log("Mouse Pos", `${mouse.global.x} : ${mouse.global.y}`);
	if (prevBlock)
	{
		prevBlock.zHeight = 0;
	}
	if (hoveredBlock)
	{
		hoveredBlock.zHeight = 10;
		cursor.x = hoveredBlock.x;
		cursor.y = hoveredBlock.y;
		prevBlock = hoveredBlock;
	}

	// if (hoveredBlock)
	// {
	// 	cursor.visible = true;
	//
	// 	const screenPos: { x: number, y: number } = IsoUtils.isoToScreen(row, col);
	// 	cursor.x = screenPos.x;
	// 	cursor.y = screenPos.y - hoveredBlock.zHeight;
	// }
	// else
	// {
	// 	cursor.visible = false;
	// }

	world.redraw();

});
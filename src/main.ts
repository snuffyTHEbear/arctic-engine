import {Application, Graphics} from "pixi.js";
import {IsoWorld} from "./arcticEngine/core/IsoWorld.ts";
import {IsoUtils} from "./arcticEngine/core/utils/IsoUtils.ts";
import {DebugPanel} from "./arcticEngine/core/utils/DebugPanel.ts";

const app: Application = new Application();
await app.init({width: 800, height: 600, backgroundColor: 0x333333});
document.body.appendChild(app.canvas);

const world: IsoWorld = new IsoWorld(8, 8);
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

app.ticker.add((): void =>
{
	const mouse = app.renderer.events.pointer;

	const gridPos: { row: number, col: number } = IsoUtils.screenToIso(mouse.global.x, mouse.global.y);
	const {row, col} = gridPos;
	const hoveredBlock = world.getBlock(row, col);
	debugPanel.log("Grid Pos", `${gridPos.row} : ${gridPos.col}`);
	debugPanel.log("Mouse Pos", `${mouse.global.x} : ${mouse.global.y}`);

	if (hoveredBlock)
	{
		cursor.visible = true;

		const screenPos: { x: number, y: number } = IsoUtils.isoToScreen(row, col);
		cursor.x = screenPos.x;
		cursor.y = screenPos.y - hoveredBlock.zHeight;
	}
	else
	{
		cursor.visible = false;
	}
});
import {Application, Graphics, Ticker} from 'pixi.js';
import {DebugPanel} from "./arcticEngine/core/utils/DebugPanel.ts";

const app: Application = new Application();

await app.init({width: 800, height: 600, backgroundColor: 0x1099bb});
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.sortableChildren = true;
document.body.appendChild(app.canvas);

const debugPanel = new DebugPanel();
debugPanel.position.set(10, 10);
app.stage.addChild(debugPanel);


export const PastelPalette =
	{
		Red: "#FFB3BA",
		Orange: "#FFDFBA",
		Yellow: "#FFFFBA",
		Green: "#BAFFC9",
		Blue: "#BAE1FF",
		Violet: "#C7CEEA",
		TeaGreen: "#E2F0CB",
		Peach: "#FFDAC1",
		Salmon: "#FF9AA2",
		Lavender: "#E0BBE4",
	} as const;

// Optional: Create a type derived from the values
// This is useful if a function must accept *only* one of these specific hex codes.
export type PastelColorHex = typeof PastelPalette[keyof typeof PastelPalette];

const centreX: number = app.canvas.width / 2;
const centreY: number = app.canvas.height / 2;

let mousePos: { x: number, y: number } = {x: 0, y: 0};

//--- CONFIG ---
const TILE_W: number = 64;
const TILE_H: number = 32;
const MAP_ROWS: number = 10;
const MAP_COLS: number = 10;
const START_X: number = centreX;
const START_Y: number = 100;

const mapData: number[][] = [];
const mapDataTemp: number[][] = [];
for (let r: number = 0; r < MAP_ROWS; r++)
{
	mapData[r] = [];
	mapDataTemp[r] = [];
	for (let c: number = 0; c < MAP_COLS; c++)
	{
		mapData[r][c] = 0;
		mapDataTemp[r][c] = 0;
	}
}

const grid: Graphics = new Graphics();

for (let row = 0; row < MAP_ROWS; row++)
{
	for (let col = 0; col < MAP_COLS; col++)
	{
		//const tx: number = (col - row) * (TILE_W / 2) + START_X;
		//const ty: number = (col + row) * (TILE_H / 2) + START_Y;

		let height: number = 0;

		if (row > 1 && row < 8 && col > 1 && col < 8)
		{
			height = Math.floor(Math.random() * 50);
			mapData[row][col] = height;
			mapDataTemp[row][col] = height;
		}

		/*
		grid.moveTo(tx, ty - TILE_H / 2)    //TOP
			.lineTo(tx + TILE_W / 2, ty)    //RIGHT
			.lineTo(tx, ty + TILE_H / 2)    //BOTTOM
			.lineTo(tx - TILE_W / 2, ty)        //LEFT
			.lineTo(tx, ty - TILE_H / 2);	//TOP (Close loop)
		*/
	}
}

//grid.stroke({width: 2, color: PastelPalette.Violet, alpha: 0.5})
app.stage.addChild(grid);

const cursor: Graphics = new Graphics();
drawIso(cursor);
cursor.stroke({width: 2, color: PastelPalette.Yellow, alpha: 0.5})
cursor.fill({color: PastelPalette.Green, alpha: 0.5})
cursor.x = centreX;
cursor.y = 100;
cursor.visible = false;
app.stage.addChild(cursor);

app.stage.on('pointermove', (e) =>
{
	mousePos = e.global;
})

app.ticker.add((ticker: Ticker): void =>
{
	const gridPos: { row: number, col: number } = screenToIso(mousePos.x, mousePos.y);
	debugPanel.log("Grid Pos", `${gridPos.row} : ${gridPos.col}`);
	debugPanel.log("Mouse Pos", `${mousePos.x} : ${mousePos.y}`);
	if (gridPos.row >= 0 && gridPos.row < MAP_ROWS && gridPos.col >= 0 && gridPos.col < MAP_COLS)
	{
		//cursor.visible = true;
		//console.log(gridPos)
		const tileZ: number = mapData[gridPos.row][gridPos.col];

		if (gridPos.row > 1 && gridPos.row < 8 && gridPos.col > 1 && gridPos.col < 8)
		{
			mapData[gridPos.row][gridPos.col] += 25;
		}

		const tx: number = (gridPos.col - gridPos.row) * (TILE_W / 2) + START_X;
		const ty: number = (gridPos.col + gridPos.row) * (TILE_H / 2) + START_Y;

		cursor.x = tx;
		cursor.y = ty - tileZ;
	}
	else
	{
		//cursor.visible = false;
	}
	grid.clear();
	drawIsoMap();
	resetMapData();
})

function resetMapData(): void
{
	for (let i: number = 0; i < mapData.length; ++i)
	{
		for (let j: number = 0; j < mapData[i].length; j++)
		{
			mapData[i][j] = mapDataTemp[i][j];
		}
	}
}

function drawIsoMap(): void
{
	for (let row = 0; row < MAP_ROWS; row++)
	{
		for (let col = 0; col < MAP_COLS; col++)
		{
			const tx: number = (col - row) * (TILE_W / 2) + START_X;
			const ty: number = (col + row) * (TILE_H / 2) + START_Y;
			drawIsoBlock(grid, tx, ty, mapData[row][col], 0x1099bb);
		}
	}
}

/**
 * drawIso - Only draws the iso object, stroke, fill, colours etc handled outside of this function
 * @param iso : Graphics
 * @param tileWidth : number = 64
 * @param tileHeight : number = 32
 */
function drawIso(iso: Graphics, tileWidth: number = 64, tileHeight: number = 32): void
{
	iso.moveTo(0, -tileHeight / 2)        //TOP
		.lineTo(tileWidth / 2, 0)        //RIGHT
		.lineTo(0, tileHeight / 2)        //BOTTOM
		.lineTo(-tileWidth / 2, 0)        //LEFT
		.lineTo(0, -tileHeight / 2);		//TOP (Close Loop)
}

/**
 *
 * @param iso
 * @param x
 * @param y
 * @param z
 * @param colour
 * @param tileWidth
 * @param tileHeight
 */
function drawIsoBlock(iso: Graphics, x: number, y: number, z: number, colour: number, tileWidth: number = 64, tileHeight: number = 32): void
{
	const halfWidth = tileWidth / 2;
	const halfHeight = tileHeight / 2;

	const cTop: number = colour;
	const cRight: number = 0x888888;
	const cLeft: number = 0xCCCCCC;

	const topY: number = y - z;

	iso.poly([
		x + halfWidth, y,
		x, y + halfHeight,
		x, topY + halfHeight,
		x + halfWidth, topY
	]);

	iso.fill(cRight);

	iso.poly([
		x - halfWidth, y,
		x, y + halfHeight,
		x, topY + halfHeight,
		x - halfWidth, topY
	]);
	iso.fill(cLeft);

	iso.poly([
		x, topY - halfHeight,
		x + halfWidth, topY,
		x, topY + halfHeight,
		x - halfWidth, topY
	]);
	iso.fill(cTop);

	//iso.stroke({width: 1, color: 0x000000, alpha: 0.2});
}

/**
 *
 * @param x - Global screen x
 * @param y - Global screen y
 */
function screenToIso(x: number, y: number): { row: number, col: number }
{
	//Adjusted for where the map starts on the screen
	const adjX: number = x - START_X;
	const adjY: number = y - START_Y + 15;

	//col = (adjY / H) + (adjX / W)
	//row = (adjY / H) - (adjX / W)

	const col: number = Math.floor((adjY / TILE_H) + (adjX / TILE_W));
	const row: number = Math.floor((adjY / TILE_H) - (adjX / TILE_W));

	return {row, col}
}
import {Application, Graphics} from "pixi.js";
import {IsoWorld} from "../arcticEngine/core/IsoWorld.ts";
import {IsoUtils} from "../arcticEngine/core/utils/IsoUtils.ts";
import {DebugPanel} from "../arcticEngine/core/utils/DebugPanel.ts";
import type {Block} from "../arcticEngine/core/Block.ts";
import {Colour24} from "../arcticEngine/core/graphics/Colour24.ts";

const app: Application = new Application();
await app.init({width: 1200, height: 800, backgroundColor: 0x333333});

document.body.appendChild(app.canvas);

const world: IsoWorld = new IsoWorld(18, 18);
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

let yAngle: number = 0;
let yRange: number = 60;
let ySpeed: number = (Math.PI * 2) / 360;

//Create aray of yVals loop till the value matches the first value and use these rather than calculate in main loop
let yVals: number[] = [];
let normalizedVals: number[] = [];
//let wavelengths: number[] = [];
let ind: number = 0;

const colourTop: Colour24 = new Colour24(IsoUtils.PastelPalette.TeaGreen);
const colourBot: Colour24 = new Colour24(IsoUtils.PastelPalette.Orange);

createYVals();

function createYVals(): void
{
	const steps: number = Math.ceil((Math.PI * 2) / ySpeed);
	for (let i = 0; i < steps; i++)
	{
		yAngle = i * ySpeed;
		let yVal: number = (Math.sin(yAngle) * yRange) + yRange;
		normalizedVals.push(normalize(yVal, 0, 27))
		yVals.push(yVal);
	}
	const wavelength: number = 18;
	world.blocks.forEach((block: Block): void =>
	{
		// Left to Right	b.x * spacing
		// Front to Back	b.z * spacing
		// Diagonal	(b.x + b.z) * spacing
		// Circular (Ripple)	Math.sqrt(b.x*b.x + b.z*b.z) * spacing
		block.waveOffset = Math.floor((Math.sqrt(block.gridRow * block.gridRow + block.gridCol * block.gridCol)) * wavelength);
	})
}

app.ticker.add((): void =>
{
	ind = (ind + 1) % yVals.length;
	debugPanel.log("Y Vals", yVals.length);

	//yVal = (Math.sin(yAngle) * yRange) + yRange;

	//const mouse = app.renderer.events.pointer;

	//const gridPos: { row: number, col: number } = IsoUtils.screenToIso(mouse.global.x, mouse.global.y);
	//const {row, col} = gridPos;

	world.blocks.forEach((block: Block): void =>
	{
		let frame: number = (ind + block.waveOffset) % yVals.length;
		block.zHeight = yVals[frame];
		block.colour = lerpColour(colourTop, colourBot, normalizedVals[frame]).colour;
	})

	//debugPanel.log("Grid Pos", `${gridPos.row} : ${gridPos.col}`);
	//debugPanel.log("Mouse Pos", `${mouse.global.x} : ${mouse.global.y}`);

	world.redraw();


});

function normalize(height: number, minHeight: number, maxHeight: number): number
{
	let t: number = ((height - minHeight) / (maxHeight - minHeight));
	return t;
}

function lerpColour(colourA: Colour24, colourB: Colour24, t: number): Colour24
{
	const r: number = Math.floor(lerp(colourA.red, colourB.red, t));
	const g: number = Math.floor(lerp(colourA.green, colourB.green, t));
	const b: number = Math.floor(lerp(colourA.blue, colourB.blue, t));
	let c: Colour24 = new Colour24(0);
	c.red = r;
	c.green = g;
	c.blue = b;
	return c;
}

function lerp(x: number, y: number, a: number): number
{
	return x + (y - x) * a;
}
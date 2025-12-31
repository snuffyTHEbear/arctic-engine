import {Application} from "pixi.js";
import type {IScene} from "./arcticEngine/core/IScene.ts";
import {Movement} from "./sands/Movement.ts";

const app = new Application();
await app.init(
	{
		width: 1200,
		height: 800,
		backgroundColor: 0x1099bb
	});
document.body.appendChild(app.canvas);

let currentScene: IScene | null = null;

function changeProject(newScene: IScene)
{
	if (currentScene)
	{
		app.ticker.remove(boundUpdate);
		currentScene.cleanup();
	}

	currentScene = newScene;
	currentScene.init(app);
	app.ticker.add(boundUpdate);
}

function boundUpdate()
{
	if (currentScene)
	{
		currentScene.update();
	}
}

const project: Movement = new Movement();
changeProject(project);
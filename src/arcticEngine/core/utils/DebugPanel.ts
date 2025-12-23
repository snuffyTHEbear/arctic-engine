import * as PIXI from 'pixi.js';

export class DebugPanel extends PIXI.Container
{
	private _background:PIXI.Graphics;
	private _text:PIXI.Text;
	private _debugData:Map<string, any> = new Map();
	private _fpsAccumulator:number = 0;
	private _fpsCount:number = 0;
	private _currentFps:number = 0;

	constructor(width:number = 200, height:number = 200)
	{
		super();

		this._background = new PIXI.Graphics();
		this._background.fill({color:0x000000, alpha:0.7});
		this._background.rect(0, 0, width, height);
		//this._background
		this.addChild(this._background);

		const style = new PIXI.TextStyle
		({
			fontFamily: 'monospace',
			fontSize:12,
			fill:'white',
			wordWrap:true,
			wordWrapWidth: width - 10,
			lineHeight:16
		})

		this._text = new PIXI.Text();
		this._text.style = style;
		this._text.text = 'Initializing...'
		this._text.x = 5;
		this._text.y = 5;
		this.addChild(this._text);

		this.zIndex = 9999;

		PIXI.Ticker.shared.add(this.update, this);
	}

	/**
	 * Add or update a debug value to be displayed
	 * @param label
	 * @param value
	 */
	public log(label:string, value:any):void
	{
		this._debugData.set(label, value);
	}

	private update(ticker:PIXI.Ticker):void
	{
		this._fpsAccumulator += ticker.deltaTime;
		this._fpsCount++;
		//Update FPS readout every ~60 frames ~1s
		if(this._fpsCount >= 60)
		{
			this._currentFps = Math.round(PIXI.Ticker.shared.FPS);
			this._fpsCount = 0;
			this._fpsAccumulator = 0;
		}

		let output:string = `FPS: ${this._currentFps}\n`;
		output += `-------------\n`

		this._debugData.forEach((value, key) =>
		{
			const displayValue:any = typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value;
			output += `${key}: ${displayValue}\n`;
		});

		this._text.text = output;
	}
}
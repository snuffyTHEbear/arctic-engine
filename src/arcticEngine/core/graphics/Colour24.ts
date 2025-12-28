export class Colour24
{
	/**
	 *Constants to hold the actual maximum value the max variable can be set to
	 */
	public static readonly MAXIMUM_VALUE: number = 255.0;
	/**
	 *Constants to hold the actual maximum value the max variable can be set to
	 */
	public static readonly MINIMUM_VALUE: number = 0.0;

	/**
	 * Blue Value of type number
	 */
	private _blue: number;
	/**
	 * Colour made up of the red, green and blue values of type uint
	 */
	private _colour: number;
	private _baseColour: number;
	/**
	 * Green value of type number
	 */
	private _green: number;
	/**
	 *Holds the maximum value the raw values can reach
	 */
	private _max: number = 255;
	/**
	 *Holds the minimum value the raw values can go down to
	 */
	private _min: number = 0;
	/**
	 * Red value of type number
	 */
	private _red: number;

	constructor(colour: number)
	{
		this._colour = colour;
		this._baseColour = colour;
		this._red = Colour24.extractRed(this._colour);
		this._green = Colour24.extractGreen(this._colour);
		this._blue = Colour24.extractBlue(this._colour);
		this.combine();
	}

	public get baseColour(): number
	{
		return this._baseColour;
	}

	/**
	 * Specifies the raw value representing blue of the colour
	 */
	public get blue(): number
	{
		return this._blue;
	}

	public set blue(v: number)
	{
		this._blue = this.correctValue(v);
		this.combine();
	}

	/**
	 * Specifies the colour fo the three raw values combined
	 */
	public get colour(): number
	{
		return this._colour;
	}

	public set colour(v: number)
	{
		this._colour = v;
		this.extract();
	}

	/**
	 * Specifies the raw value representing green of the colour
	 */
	public get green(): number
	{
		return this._green;
	}

	public set green(v: number)
	{
		this._green = this.correctValue(v);
		this.combine();
	}

	/**
	 * Specifies the maximum value the raw values can reach
	 */
	public get max(): number
	{
		return this._max;
	}

	public set max(v: number)
	{
		this._max = Math.min(v, Colour24.MAXIMUM_VALUE);
	}

	/**
	 * Specifies the maximum value the raw values can go down to
	 */
	public get min(): number
	{
		return this._min;
	}

	public set min(v: number)
	{
		this._min = Math.max(v, Colour24.MINIMUM_VALUE);
	}

	public modifyColour(redAmount: number, greenAmount: number, blueAmount: number): void
	{
		this._red = this.correctValue(this._red += redAmount);
		this._green = this.correctValue(this._green += greenAmount);
		this._blue = this.correctValue(this._blue += blueAmount);
		this.combine();
	}

	/*
	*Getters / Setters
	*/
	/**
	 * Specifies the raw value representing red of the colour
	 */
	public get red(): number
	{
		return this._red;
	}

	public set red(v: number)
	{
		this._red = this.correctValue(v);
		this.combine();
	}

	/**
	 *
	 * @param min
	 * @param max
	 */
	public setRange(min: number, max: number): void
	{
		this._min = min;
		this._max = max;
	}

	/**
	 *Combines the three raw values red, green, blue and alpha and set's the colour to the resulting value.
	 *
	 */
	private combine(): void
	{
		this._colour = (this._red) << 16 | (this._green) << 8 | (this.blue);
	}

	/**
	 *
	 * @param value
	 * @private
	 */
	private correctValue(value: number): number
	{
		return Math.min(Math.max(value, this._min), this._max);
	}

	/**
	 *Extracts the raw values red, green, blue and alpha from the colour property
	 *
	 */
	private extract(): void
	{
		this._red = this._colour >> 16 & 0xFF;
		this._green = this._colour >> 8 & 0xFF;
		this._blue = this._colour & 0xFF;
	}

	static extractColours(colour: number): { r: number, g: number, b: number }
	{
		return {
			r: this.extractRed(colour),
			g: this.extractGreen(colour),
			b: this.extractBlue(colour)
		};
	}

	static extractRed(colour: number): number
	{
		return colour >> 16;
	}

	static extractGreen(colour: number): number
	{
		return colour >> 8 & 0xFF;
	}

	static extractBlue(colour: number): number
	{
		return colour & 0xFF;
	}

	static extractAlpha(colour: number): number
	{
		return colour >> 24;
	}

	public lightenColour(redAmount: number, greenAmount: number, blueAmount: number): void
	{
		if (this._red < 255 - redAmount)
			this._red += (redAmount);
		if (this._green < 255 - greenAmount)
			this._green += (greenAmount);
		if (this._blue < 255 - blueAmount)
			this._blue += (blueAmount);
		this.combine();
	}

	public darkenColour(redAmount: number, greenAmount: number, blueAmount: number): void
	{
		if (this._red >= redAmount)
			this._red -= (redAmount);
		if (this._green >= greenAmount)
			this._green -= (greenAmount);
		if (this._blue >= blueAmount)
			this._blue -= (blueAmount);
		this.combine();
	}
}
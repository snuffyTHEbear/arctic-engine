export class IsoUtils
{
	static readonly TILE_W: number = 64;
	static readonly TILE_H: number = 32;
	static readonly START_X: number = 600;
	static readonly START_Y: number = 200;

	static readonly PastelPalette = {
		Red: 0xFFB3BA,
		Orange: 0xFFDFBA,
		Yellow: 0xFFFFBA,
		Green: 0xBAFFC9,
		Blue: 0xBAE1FF,
		Violet: 0xC7CEEA,
		TeaGreen: 0xE2F0CB,
		Peach: 0xFFDAC1,
		Salmon: 0xFF9AA2,
		Lavender: 0xE0BBE4,
	} as const;

	/**
	 * Converts Grid (row, col) to Screen coordinates (x, y)
	 * @param row
	 * @param col
	 */
	static isoToScreen(row: number, col: number): { x: number, y: number }
	{
		const x: number = (col - row) * (this.TILE_W / 2) + this.START_X;
		const y: number = (col + row) * (this.TILE_H / 2) + this.START_Y;
		return {x, y};
	}

	static screenToIso(x: number, y: number): { row: number, col: number }
	{
		const adjX: number = x - this.START_X;
		const adjY: number = y - this.START_Y + 15;

		const col: number = Math.floor((adjY / this.TILE_H) + (adjX / this.TILE_W));
		const row: number = Math.floor((adjY / this.TILE_H) - (adjX / this.TILE_W));

		return {row, col};
	}
}
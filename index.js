const { promisify } = require('util');
const execAsync = promisify(require('child_process').exec);
const { join } = require('path');
const request = require('./request');
const fs = require('fs');
class Oneesama {
	/**
	 * @param {string} [dir='./oppai'] oppai folder path, leave it null if you have the oppai folder in your PATH.
	 * @param {string} shell Shell to use to run bash commands
	 */
	constructor({ shell, oppaiDir = 'oppai', tempFolder = 'beatmaps' }) {
		this.shell = shell;
		this.oppaiDir = oppaiDir;
		this.tempFolder = join(process.cwd(), tempFolder);
		this.execOptions = {
			windowsHide: true
		};
		if (shell) this.execOptions.shell = shell;
	}
	/**
	 *
	 * @typedef {Object} ParserOptions
	 * @property {string} beatmapId osu beatmap id
	 * @property {?Array<number>} [accs=[100]] accuracy values
	 * @property {?boolean} [deleteFile=false] Whether or not to delete the beatmap file after calculation process
	 * @property {?string} mods Mods to be used in calculations
	 * @property {?number} misses Amount of misses to use in calculations
	 * @property {?boolean} forceTaiko Whether or not to force taiko mode for converted maps
	 */
	/**
	 * Get oppai data from CLI
	 * @param {ParserOptions} options
	 * @return {Promise<OppaiData>}
	 */
	async get({
		beatmapId,
		accs = [100],
		deleteFile = false,
		mods,
		misses,
		forceTaiko
	}) {
		const data = await request(`https://osu.ppy.sh/osu/${beatmapId}`);
		try {
			fs.mkdirSync(this.tempFolder);
		} catch (e) {
			// ignored
		}
		const filePath = join(this.tempFolder, `${beatmapId}.osu`).replace(
			/\\/g,
			'/'
		);
		fs.writeFileSync(filePath, data);
		const child = await execAsync(
			`cat ${filePath} | ${this.oppaiDir} - ${mods ? `+${mods}` : ''} -ojson ${
				forceTaiko ? '-taiko' : ''
			}`,
			this.execOptions
		);
		const totalPPList = [];
		const promises = [];
		for (const acc of accs) {
			promises.push(
				execAsync(
					`cat ${filePath} | ${this.oppaiDir} - ${
						mods ? `+${mods}` : ''
					} ${acc}% ${misses ? `${misses}m` : ''} -ojson ${
						forceTaiko ? '-taiko' : ''
					}`,
					this.execOptions
				)
			);
		}
		const allData = await Promise.all(promises);
		for (const proc of allData) {
			const result = JSON.parse(proc.stdout);
			totalPPList.push(result.pp);
		}
		const b = JSON.parse(child.stdout);
		const oppaiJson = {
			version: b.version,
			title: b.title,
			fullTitle: `${b.artist} - ${b.title}`,
			stars: b.stars,
			artist: b.artist,
			creator: b.creator,
			maxCombo: b.max_combo,
			numCircles: b.num_circles,
			numSliders: b.num_sliders,
			numSpinners: b.num_spinners,
			modsStr: b.mods_str,
			aimPp: b.aim_pp,
			speedPp: b.speed_pp,
			accPp: b.acc_pp,
			accs,
			pp: totalPPList,
			cs: b.cs,
			od: b.od,
			ar: b.ar,
			hp: b.hp
		};
		if (deleteFile) fs.unlinkSync(filePath);
		return oppaiJson;
	}
}

module.exports = Oneesama;

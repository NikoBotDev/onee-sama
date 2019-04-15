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
	 * Get oppai data from CLI
	 * @param {string} id beatmap id
	 * @param {?Array<number>} [accs=[100]] accuracy values
	 * @return {Promise<OppaiData>}
	 */
	async get(id, accs = [100]) {
		const data = await request(`https://osu.ppy.sh/osu/${id}`);
		try {
			fs.mkdirSync(this.tempFolder);
		} catch (e) {
			// ignored
		}
		const filePath = join(this.tempFolder, `${id}.osu`).replace(/\\/g, '/');
		fs.writeFileSync(filePath, data);
		const child = await execAsync(
			`cat ${filePath} | ${this.oppaiDir} - -ojson`,
			this.execOptions
		);
		const totalPPList = [];
		const promises = [];
		for (const acc of accs) {
			promises.push(
				execAsync(
					`cat ${filePath} | ${this.oppaiDir} - ${acc}% -ojson`,
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
		fs.unlinkSync(filePath);
		return oppaiJson;
	}
}

module.exports = Oneesama;

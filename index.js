const { promisify } = require('util');
const execAsync = promisify(require('child_process').exec);
class Oneesama {
    /**
     * @param {string} [dir='./oppai'] oppai folder path, leave it null if you have the oppai folder in your PATH.
     */
	constructor(dir = './oppai') {
		if(dir) {
			this.dir = dir;
		} else {
			this.dir = 'oppai';
		}
	}
    /**
     * @typedef {Object} OppaiData
     * @property {string} version beatmap diff name
     * @property {string} title beatmap title
     * @property {string} fullTitle beatmap full title
     * @property {number} stars beatmap star rate
     * @property {string} artist beatmap artist name
     * @property {string} creator beatmap author username
     * @property {number} maxCombo beatmap max combo
     * @property {number} numCircles number of hitcircles.
     * @property {number} numSliders number of sliders.
     * @property {number} numSpinners number of spinners.
     * @property {Array<number>} pp pp raw value for all accs (sum of aim pp, acc pp and speed pp).
     * @property {number} aimPp aim pp value
     * @property {number} speedPp speed pp value.
     * @property {number} accPp acc pp value
     * @property {Array<number>} accs All accs values being calculated.
     * @property {number} cs circle size value
     * @property {number} od overral difficulty value.
     * @property {number} ar approach rate value
     * @property {number} hp Drain rate value.
     */
    /**
     * Get oppai data from the pure oppai binding.
     * @param {string} id beatmap id
     * @param {?Array<number>} [accs=[100]] accuracy values
     * @return {Promise<OppaiData>}
     */
	async get(id, accs = [100]) {
		try {
			const child = await execAsync(`curl https://osu.ppy.sh/osu/${id} | ${this.dir} - -ojson`, { windowsHide: true });
			const totalPPList = [];
			const promises = [];
			for(const acc of accs) {
				promises.push(execAsync(`curl https://osu.ppy.sh/osu/${id} | ${this.dir} - ${acc}% -ojson`,
				{ windowsHide: true }));
			}
			const allData = await Promise.all(promises);
			for(const proc of allData) {
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
			return oppaiJson;
		} catch(err) {
			throw err;
		}
	}
}

module.exports = Oneesama;

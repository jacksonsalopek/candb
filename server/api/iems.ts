import { readdirSync } from "fs";

const BRANDS = [
	"64 Audio",
	"7Hz",
	"7th Acoustics",
	"AFUL",
	"Apple",
	"Audeze",
	"BGVP",
	"Campfire Audio",
	"Cayin",
	"CCA",
	"DUNU",
	"Empire Ears",
	"Etymotic",
	"FiiO",
	"Final Audio",
	"Hidition",
	"HIFIMAN",
	"JVC",
	"Kiwi Ears",
	"KZ",
	"Massdrop",
	"MEE Audio",
	"Monoprice",
	"Moondrop",
	"Nothing",
	"Prisma Audio",
	"qdc",
	"Samsung",
	"Sennheiser",
	"Shanling",
	"Shozy",
	"Shuoer",
	"Shure",
	"Simgot",
	"Sony",
	"Symphonium Audio",
	"Tanchjim",
	"ThieAudio",
	"Tin HiFi",
	"Tripowin",
	"Truthear",
	"Unique Melody",
	"Vision Ears",
	"VSonic",
	"Yanyin",
];

interface IEM {
	brand: string;
	model: string;
	measurers: string[];
}

export default defineEventHandler((event) => {
	const params = getQuery(event);
	const measurementsDirStr = `${Bun.env.PWD}/AutoEQ/measurements`;
	const measurementsDir = readdirSync(measurementsDirStr);
	const iems = new Map<string, IEM>();
	for (const measurer of measurementsDir) {
		if (measurer === ".DS_Store") continue;
		const overEarDirStr = `${measurementsDirStr}/${measurer}/data/in-ear`;
		let overEarDir = undefined;
		try {
			overEarDir = readdirSync(overEarDirStr);
		} catch (e) {
			continue;
		}
		for (const measurementFile of overEarDir) {
			for (const brand of BRANDS) {
				if (measurementFile.startsWith(brand)) {
					const model = measurementFile.slice(brand.length + 1, -4);
					if (iems.has(model)) {
						iems.get(model)?.measurers.push(measurer);
					} else {
						iems.set(model, {
							brand,
							model,
							measurers: [measurer],
						});
					}
				}
			}
		}
	}
	// Sort by brand, then model
	const data = {
		iems: Array.from(iems.values()).sort((a, b) => {
			if (a.brand < b.brand) return -1;
			if (a.brand > b.brand) return 1;
			if (a.model < b.model) return -1;
			if (a.model > b.model) return 1;
			return 0;
		}),
	};
	if (params.brand) {
		data.iems = data.iems.filter((h) => h.brand === params.brand);
	}
	return data;
});

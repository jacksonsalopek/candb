import { readdirSync } from "fs";
import { BRANDS_HEADPHONE } from "~/shared/constants";

interface Headphone {
	brand: string;
	model: string;
	measurers: string[];
}

export default defineEventHandler((event) => {
	const params = getQuery(event);
	const measurementsDirStr = `${Bun.env.PWD}/AutoEQ/measurements`;
	const measurementsDir = readdirSync(measurementsDirStr);
	const headphones = new Map<string, Headphone>();
	for (const measurer of measurementsDir) {
		if (measurer === ".DS_Store") continue;
		const overEarDirStr = `${measurementsDirStr}/${measurer}/data/over-ear`;
		let overEarDir = undefined;
		try {
			overEarDir = readdirSync(overEarDirStr);
		} catch (e) {
			continue;
		}
		for (const measurementFile of overEarDir) {
			for (const brand of BRANDS_HEADPHONE) {
				if (measurementFile.startsWith(brand)) {
					const model = measurementFile.slice(brand.length + 1, -4);
					if (headphones.has(model)) {
						headphones.get(model)?.measurers.push(measurer);
					} else {
						headphones.set(model, {
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
		headphones: Array.from(headphones.values()).sort((a, b) => {
			if (a.brand < b.brand) return -1;
			if (a.brand > b.brand) return 1;
			if (a.model < b.model) return -1;
			if (a.model > b.model) return 1;
			return 0;
		}),
	};
	if (params.brand) {
		data.headphones = data.headphones.filter((h) => h.brand === params.brand);
	}
	return data;
});

import { parse } from "@fast-csv/parse";
import headphones from "./headphones";
import iems from "./iems";

interface FrequencyResponse {
	frequency: number;
	raw: number;
}

export default defineEventHandler(async (event) => {
	const params = getQuery(event);
	if (!params.brand || !params.model) {
		return { error: "brand and model are required parameters" };
	}
	const allDevices = headphones(event)
		.headphones.map((h) => ({ ...h, type: "over-ear" }))
		.concat(iems(event).iems.map((i) => ({ ...i, type: "in-ear" })));
	const device = allDevices.find(
		(d) => d.brand === params.brand && d.model === params.model,
	);
	if (!device) {
		return { error: "Device not found" };
	}
	const filename = `${Bun.env.PWD}/AutoEQ/measurements/${device.measurers[0]}/data/${device.type}/${device.brand} ${device.model}.csv`;
	let file = undefined;
	const data: unknown[] = [];
	try {
		file = Bun.file(filename);
	} catch (e) {
		return { error: "File not found" };
	}
	const text = await file.text();

	const csvParse = new Promise((resolve, reject) => {
		const results: FrequencyResponse[] = [];
		const stream = parse({ delimiter: ",", headers: true })
			.on("error", (error) => reject(error))
			.on("data", (row) =>
				results.push({ frequency: +row.frequency, raw: +row.raw }),
			)
			.on("end", () => {
				resolve(results);
			});
		stream.write(text);
		stream.end();
	});
	return { fr: await csvParse };
});

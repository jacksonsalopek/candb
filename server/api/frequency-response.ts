import { parse } from "@fast-csv/parse";

interface FrequencyResponse {
	frequency: number;
	raw: number;
}

export default defineEventHandler(async (event) => {
	const params = getQuery(event);
	if (!params.brand || !params.model || !params.measurer || !params.type) {
		return { error: "brand, model, type and measurer are required parameters" };
	}
	const filename = `${Bun.env.PWD}/AutoEQ/measurements/${params.measurer}/data/${params.type}/${params.brand} ${params.model}.csv`;
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

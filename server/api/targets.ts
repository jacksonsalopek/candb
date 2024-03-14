import { parse } from "@fast-csv/parse";
import type { FrequencyResponse } from "../types";

export default defineEventHandler(async (event) => {
	const params = getQuery(event);
	if (!params.name) {
    return { error: "No target specified" };
  }

	const filename = `${Bun.env.PWD}/AutoEQ/targets/${params.name}.csv`;
	let file = undefined;
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

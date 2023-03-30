const { mkdir } = require("node:fs");
const { join } = require("node:path");

const type = ["k", "w"];
const subType = ["mrq", "cls", "cnt", "mdn"];
const idx = ["0", "1", "2"];
const dirs = ["thumbnail", "imgArr"];

type.forEach((x) => {
	subType.forEach((y) => {
		idx.forEach((z) => {
			dirs.forEach((dir) => {
				mkdir(
					join("public", "images", x, y, z, dir),
					{ recursive: true },
					(err, path) => {
						if (err) { console.log(err); }
						else { console.log(path); }
					}
				);
			});
		});
	});
});

/*
type.forEach((x) => {
	mkdir(
		join("public", "images", x),
		(err, path) => {
			if (err) { console.log(err); }
			subType.forEach((y) => {
				mkdir(
					join("public", "images", x, y),
					(err, path) => {
						if (err) { console.log(err); }
						idx.forEach((z) => {
							mkdir(
								join("public", "images", x, y, z),
								(err, path) => {
									if (err) { console.log(err); }
									dirs.forEach((dir) => {
										mkdir(
											join("public" ,"images", x, y, z, dir),
											(err, path) => {
												if (err) { console.log(err); }
											}
										);
									});
								}
							);
						});
					}
				);
			});
		}
	);
});
*/

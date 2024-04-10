/* eslint-disable @typescript-eslint/no-var-requires */

/* const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const isToDesktop = process.env.TODESKTOP_CI === "true";
const isWindows = os.platform() === "win32";

const postInstall = async () => {
	if (!(isToDesktop && isWindows)) {
		console.log('Skipping "postinstall" script...');
		return;
	}

	const prebuildsDir = path.join(
		__dirname,
		'..', 'node_modules', '@parcel', 'watcher', 'prebuilds'
	);
	console.log(prebuildsDir)
	// print out the ls of the __dirname
	console.log(await fs.readdir(__dirname));
	// check to see if prebuilds dir exists
	if (!(await fs.stat(prebuildsDir)).isDirectory()) {
		console.log(`Prebuilds dir "${prebuildsDir}" does not exist.`);
		return;
	}


	// get all folders in prebuilds dir
	const prebuilds = await fs.readdir(prebuildsDir);
	// iterate over folders
	for (const prebuild of prebuilds) {
		// if prebuild is not for current platform then remove it
		if (!prebuild.startsWith(os.platform())) {
			const fullPath = path.join(prebuildsDir, prebuild);
			console.log(`Removing prebuild fir "${fullPath}"...`);
			await fs.rm(fullPath, { recursive: true });
		}
	}
};

void postInstall();
*/

const postInstall = async () => {
	if (!(isToDesktop && isWindows)) {
		console.log('Skipping "postinstall" script...');
		return;
	}

	const prebuildsDir = path.join(
		__dirname,
		'..', 'node_modules', '@parcel', 'watcher', 'prebuilds'
	);
	console.log(prebuildsDir)
	// print out the ls of the __dirname
	console.log(await fs.readdir(__dirname));
	// check to see if prebuilds dir exists
	if (!(await fs.stat(prebuildsDir)).isDirectory()) {
		console.log(`Prebuilds dir "${prebuildsDir}" does not exist.`);
		return;
	}


	// get all folders in prebuilds dir
	const prebuilds = await fs.readdir(prebuildsDir);
	// iterate over folders
	for (const prebuild of prebuilds) {
		// if prebuild is not for current platform then remove it
		if (!prebuild.startsWith(os.platform())) {
			const fullPath = path.join(prebuildsDir, prebuild);
			console.log(`Removing prebuild fir "${fullPath}"...`);
			await fs.rm(fullPath, { recursive: true });
		}
	}
};

void postInstall();
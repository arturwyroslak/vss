// todesktop:afterPack - (optional) path to script

// Example: ./scripts/afterPack.js.

// The path to a script that will be run after the app has been packed (but before it has been transformed into a distributable installer format and signed).

// The afterPack function also has the following arguments added to it's signature:

//     appPkgName - string - the name of the app package
//     appId - string - the app id
//     shouldCodeSign - boolean - whether the app will be code signed or not
//     outDir - string - the path to the output directory
//     appOutDir - string - the path to the app output directory
//     arch - string - the architecture of the app
//     packager - object - the packager object

const fs = require('fs');
const path = require('path');
const os = require('os');

function copyFiltered(src, dest, filterFn) {
	if (fs.statSync(src).isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		const files = fs.readdirSync(src);
		files.forEach((file) => {
			const srcPath = path.join(src, file);
			const destPath = path.join(dest, file);
			if (filterFn(srcPath)) {
				copyFiltered(srcPath, destPath, filterFn);
			}
		});
	} else {
		fs.copyFileSync(src, dest);
	}
}

const asar = require('@electron/asar');

async function createAsarAndUnpacked(src, dest) {
	const asarOptions = {
		unpack:
			'{**/*.node,**/@vscode/ripgrep/bin/*,**/node-pty/build/Release/*,**/node-pty/lib/worker/conoutSocketWorker.js,**/node-pty/lib/shared/conout.js,**/*.wasm,**/node-vsce-sign/bin/*}',
	};
	const asarDest = path.join(dest, 'node_modules.asar');

	return asar.createPackageWithOptions(src, asarDest, asarOptions);
}

function matchesGlobPattern(pattern, str) {
	const parts = pattern.split('/**/');
	return parts.every((part, index) => {
		const regex = new RegExp(
			'^' +
			part
				.split('*')
				.map((p) => (p ? p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '.*'))
				.join('.*') +
			'$'
		);
		const searchFrom =
			index === 0 ? 0 : str.indexOf(parts[index - 1]) + parts[index - 1].length;
		const match = str.slice(searchFrom).match(regex);
		return match !== null;
	});
}

module.exports = async ({ appOutDir, packager }) => {
	let appPath;
	let macResources = '';

	if (os.platform() === 'darwin') {
		const appName = packager.appInfo.productFilename;
		const appPath2 = path.join(`${appOutDir}`, `${appName}.app`);
		macResources = path.join(appPath2, 'Contents', 'Resources');
		appPath = path.join(macResources, 'app');
	} else if (os.platform() === 'win32' || os.platform() === 'linux') {
		appPath = path.join(appOutDir, 'resources', 'app');
	} else {
		console.error('Unsupported platform:', os.platform());
		process.exit(1);
	}
	// TODO: handle windows and linux too
	const nodeModulesPath = path.join(appPath, 'node_modules');

	// Handle file_service regardless of platform!!
	try {
		const currentFileservicePath = path.join(appPath, 'node_modules', '@anysphere');
		const newPath = path.join(appPath, 'extensions', 'cursor-retrieval', 'node_modules', '@anysphere');
		// move this
		fs.renameSync(currentFileservicePath, newPath);
	} catch (e) {
		console.error(e);
	}

	if (os.platform() === 'win32') {
		// Delete node_modules/@parcel/watcher/prebuilds/linux-* and the same for mac
		fs.rmSync(path.join(nodeModulesPath, '@parcel', 'watcher', 'prebuilds', 'linux-x64'), { recursive: true, force: true });
		fs.rmSync(path.join(nodeModulesPath, '@parcel', 'watcher', 'prebuilds', 'darwin-x64'), { recursive: true, force: true });
		fs.rmSync(path.join(nodeModulesPath, '@parcel', 'watcher', 'prebuilds', 'darwin-arm64'), { recursive: true, force: true });

		try {
			const otherNodeModulesPath = path.join(appPath, 'extensions', 'cursor-tokenize', 'node_modules', 'tiktoken-node', 'dist');
			fs.rmSync(path.join(otherNodeModulesPath, 'tiktoken-node', 'dist', 'tiktoken-node.darwin-arm64.node'), { force: true });
			fs.rmSync(path.join(otherNodeModulesPath, 'tiktoken-node', 'dist', 'tiktoken-node.darwin-x64.node'), { force: true });
			fs.rmSync(path.join(otherNodeModulesPath, 'tiktoken-node', 'dist', 'tiktoken-node.linux-arm64.node'), { force: true });
			fs.rmSync(path.join(otherNodeModulesPath, 'tiktoken-node', 'dist', 'tiktoken-node.linux-x64.node'), { force: true });
		} catch (e) {
			console.error(e);
		}


		try {
			const distPath = path.join(appPath, 'extensions', 'cursor-tokenize', 'dist');
			fs.rmSync(path.join(distPath, '5e31c058e76bbddadce952be72a94abe.node'), { force: true });
			fs.rmSync(path.join(distPath, 'a24d70445de38ef314f7b95cbc322ca7.node'), { force: true });
			fs.rmSync(path.join(distPath, 'f482f9cb02102d88aef0351c0e0b4a1f.node'), { force: true });
			fs.rmSync(path.join(distPath, 'fae3f9596da905bac0c119236d95c06f.node'), { force: true });
		} catch (e) {
		}
	}
	// arm
	if (os.platform() == 'darwin') {
		fs.cpSync(path.join(macResources, 'todesktopResources', 'rgArm'), path.join(nodeModulesPath, '@vscode', 'ripgrep', 'bin', 'rgArm'), { force: true });
	}
	fs.rmSync(path.join(macResources, 'todesktopResources'), { recursive: true, force: true });

	const tempDir = path.join(appPath, 'temp');
	fs.mkdirSync(tempDir);

	const filterFn = (srcPath) => {
		const relativePath = path.relative(nodeModulesPath, srcPath);
		const excludePatterns = [
			'!**/bin/darwin-arm64-87/**',
			'!**/package-lock.json',
			'!**/yarn.lock',
			'!**/*.js.map',
		];
		return excludePatterns.every((pattern) => {
			const isNegative = pattern.startsWith('!');
			const globPattern = isNegative ? pattern.slice(1) : pattern;
			const match = matchesGlobPattern(globPattern, relativePath);
			return isNegative ? !match : match;
		});
	};

	copyFiltered(nodeModulesPath, tempDir, filterFn);

	console.log(
		'Node modules copied to temp dir',
		tempDir,
		'from',
		nodeModulesPath
	);

	// rename appPath/extensions/node_modules_todesktop_please_dont_delete to appPath/extensions/node_modules
	const oldDir = path.join(appPath, 'extensions', 'node_module_todesktop_please_dont_delete');
	const newDir = path.join(appPath, 'extensions', 'node_modules');
	fs.renameSync(oldDir, newDir);

	// Rename .d.d_todesktop_please_dont_delete files back to .d.ts
	const renameFilesInDir = (dir) => {
		const files = fs.readdirSync(dir);

		files.forEach((file) => {
			const filePath = path.join(dir, file);
			const fileStat = fs.statSync(filePath);

			if (fileStat.isDirectory()) {
				renameFilesInDir(filePath); // Recursively process subdirectories
			} else if (path.extname(file) === '.d_todesktop_please_dont_delete') {
				const newFilePath = path.join(dir, path.basename(file, '.d_todesktop_please_dont_delete') + '.ts');
				fs.renameSync(filePath, newFilePath);
			}
		});
	};

	renameFilesInDir(newDir);

	console.log({
		tempDir,
		appPath,
	});

	await createAsarAndUnpacked(tempDir, appPath);

	console.log('Deleting nodeModulesPath...');
	fs.rmSync(nodeModulesPath, { recursive: true, force: true });
	console.log('Deleted nodeModulesPath.');

	console.log('Deleting tempDir...');
	fs.rmSync(tempDir, { recursive: true, force: true });
	console.log('Deleted tempDir.');
};

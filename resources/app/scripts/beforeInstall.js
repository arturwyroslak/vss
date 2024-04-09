const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function asyncExec(command) {
	try {
		const { stdout, stderr } = await exec(command);
		if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	} catch (error) {
		console.error(`error: ${error.message}`);
	}
}

async function installScript() {
	// Get the operating system
	const platform = os.platform();

	if (platform === "win32") {
		try {
			console.log("python version");
			await asyncExec("python --version");
			await asyncExec("python --version");
		} catch (error) {
			console.error("python version error", error);
		}

		try {
			console.log("pip version");
			await asyncExec("python -m pip --version");
			await asyncExec("pip --version");
		} catch (error) {
			console.error("pip version error", error);
		}

		console.log("python -m pip install packaging");
		await asyncExec("python -m pip install packaging");

		console.log("python -m pip install setuptools");
		await asyncExec("python -m pip install setuptools");
	}
}

module.exports = async () => {
	if (process.env.TODESKTOP_CI) {
		try {
			await installScript();
		} catch (error) {
			console.error("installScript error", error);
		}
	} else {
		console.log(
			"Skipping todesktop-beforeInstall because we are not running in ToDesktop CI"
		);
	}
};

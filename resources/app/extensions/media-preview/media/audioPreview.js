/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
"use strict";

// This script provides the functionality for previewing audio files within the Visual Studio Code editor.
// It handles the loading and control of audio media, allowing users to play, pause, and seek audio files.

(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	/**
	 * Retrieves the settings for the audio preview from the DOM.
	 * @return {Object} The parsed settings object.
	 * @throws Will throw an error if the settings cannot be loaded.
	 */
	function getSettings() {
		const element = document.getElementById('settings');
		if (element) {
			const data = element.getAttribute('data-settings');
			if (data) {
				return JSON.parse(data);
			}
		}

		throw new Error(`Could not load settings`);
	}

	const settings = getSettings();

	// State
	let hasLoadedMedia = false;

	// Elements
	const container = document.createElement('div');
	container.className = 'audio-container';
	document.body.appendChild(container);

	// Create an audio element and set its source based on the settings.
	const audio = new Audio(settings.src === null ? undefined : settings.src);
	// Enable the default audio controls.
	audio.controls = true;

	/**
	 * Handles the event when the audio is ready to be played.
	 * It updates the UI to reflect that the audio is ready and appends the audio element to the container.
	 */
	function onLoaded() {
		if (hasLoadedMedia) {
			return;
		}
		hasLoadedMedia = true;

		document.body.classList.remove('loading');
		document.body.classList.add('ready');
		container.append(audio);
	}

	audio.addEventListener('error', e => {
		if (hasLoadedMedia) {
			return;
		}

		hasLoadedMedia = true;
		document.body.classList.add('error');
		document.body.classList.remove('loading');
	});

	if (settings.src === null) {
		onLoaded();
	} else {
		audio.addEventListener('canplaythrough', () => {
			onLoaded();
		});
	}

	document.querySelector('.open-file-link')?.addEventListener('click', (e) => {
		e.preventDefault();
		vscode.postMessage({
			type: 'reopen-as-text',
		});
	});
}());

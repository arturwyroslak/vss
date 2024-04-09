/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
"use strict";

(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

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
	const video = document.createElement('video');
	if (settings.src !== null) {
		video.src = settings.src;
	}
	video.playsInline = true;
	video.controls = true;
	video.autoplay = settings.autoplay;
	video.muted = settings.autoplay;
	video.loop = settings.loop;

	// Marks the video as loaded and updates the UI accordingly.
	function markVideoAsLoaded() {
		hasLoadedMedia = true;
		document.body.classList.remove('loading');
		document.body.classList.add('ready');
		document.body.append(video);
	}

	// Wrapper function to check if the media has already been loaded.
	function onLoaded() {
		if (hasLoadedMedia) {
			return;
		}
		markVideoAsLoaded();
	}

	// Event listener for handling video loading errors.
	video.addEventListener('error', e => {
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
		// Event listener to ensure the video is ready for playback.
	video.addEventListener('canplaythrough', () => {
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

export function getSettings(elementId, defaultSettings = { src: null, autoplay: false, loop: false }) {
    const element = document.getElementById(elementId);
    if (element) {
        const data = element.getAttribute('data-settings');
        if (data) {
            return JSON.parse(data);
        }
    }
    return defaultSettings;
}

(()=>{"use strict";var t={496:t=>{t.exports=require("vscode")},147:t=>{t.exports=require("fs")},808:t=>{t.exports=require("net")},17:t=>{t.exports=require("path")}},e={};function a(n){var s=e[n];if(void 0!==s)return s.exports;var o=e[n]={exports:{}};return t[n](o,o.exports,a),o.exports}var n={};(()=>{var t=n;Object.defineProperty(t,"__esModule",{value:!0}),t.deactivate=t.activate=void 0;const e=a(147),s=a(808),o=a(17),i=a(496),r={disabled:i.l10n.t("Auto Attach: Disabled"),always:i.l10n.t("Auto Attach: Always"),smart:i.l10n.t("Auto Attach: Smart"),onlyWithFlag:i.l10n.t("Auto Attach: With Flag")},c={disabled:i.l10n.t("Disabled"),always:i.l10n.t("Always"),smart:i.l10n.t("Smart"),onlyWithFlag:i.l10n.t("Only With Flag")},l={disabled:i.l10n.t("Auto attach is disabled and not shown in status bar"),always:i.l10n.t("Auto attach to every Node.js process launched in the terminal"),smart:i.l10n.t("Auto attach when running scripts that aren't in a node_modules folder"),onlyWithFlag:i.l10n.t("Only auto attach when the `--inspect` flag is given")},u=i.l10n.t("Toggle auto attach in this workspace"),d=i.l10n.t("Toggle auto attach on this machine"),g=i.l10n.t("Temporarily disable auto attach in this session"),h=i.l10n.t("Re-enable auto attach"),p=i.l10n.t("Auto Attach: Disabled"),w="extension.node-debug.toggleAutoAttach",f="jsDebugIpcState",m="debug.javascript",b="autoAttachFilter",y=new Set(["autoAttachSmartPattern",b].map((t=>`debug.javascript.${t}`)));let A,v,x,C=!1;function T(){_("disabled"),_(S())}async function k(t,e){const a=i.workspace.getConfiguration(m);var n;const s=(e=e||((n=a.inspect(b))?n.workspaceFolderValue?i.ConfigurationTarget.WorkspaceFolder:n.workspaceValue?i.ConfigurationTarget.Workspace:(n.globalValue,i.ConfigurationTarget.Global):i.ConfigurationTarget.Global))===i.ConfigurationTarget.Global,o=i.window.createQuickPick(),r=S(),p=["always","smart","onlyWithFlag","disabled"].map((t=>({state:t,label:c[t],description:l[t],alwaysShow:!0})));"disabled"!==r&&p.unshift({setTempDisabled:!C,label:C?h:g,alwaysShow:!0}),o.items=p,o.activeItems=C?[p[0]]:o.items.filter((t=>"state"in t&&t.state===r)),o.title=s?d:u,o.buttons=[{iconPath:new i.ThemeIcon(s?"folder":"globe"),tooltip:s?u:d}],o.show();let w=await new Promise((t=>{o.onDidAccept((()=>t(o.selectedItems[0]))),o.onDidHide((()=>t(void 0))),o.onDidTriggerButton((()=>{t({scope:s?i.ConfigurationTarget.Workspace:i.ConfigurationTarget.Global})}))}));if(o.dispose(),w){if("scope"in w)return await k(t,w.scope);"state"in w&&(w.state!==r?a.update(b,w.state,e):C&&(w={setTempDisabled:!1})),"setTempDisabled"in w&&(V(t,r,!0),C=w.setTempDisabled,w.setTempDisabled?await F():await D(t),V(t,r,!1))}}function S(){return i.workspace.getConfiguration(m).get(b)??"disabled"}async function D(t){const a=await async function(t){const e=t.workspaceState.get(f),a=i.extensions.getExtension("ms-vscode.js-debug-nightly")?.extensionPath||i.extensions.getExtension("ms-vscode.js-debug")?.extensionPath,n=function(){const t={},e=i.workspace.getConfiguration(m);for(const a of y)t[a]=e.get(a);return JSON.stringify(t)}();if(e?.jsDebugPath===a&&e?.settingsValue===n)return e.ipcAddress;const s=await i.commands.executeCommand("extension.js-debug.setAutoAttachVariables",e?.ipcAddress);if(!s)return;const o=s.ipcAddress;return await t.workspaceState.update(f,{ipcAddress:o,jsDebugPath:a,settingsValue:n}),o}(t);if(a)return x=j(a).catch((async t=>{if(console.error("[debug-auto-launch] Error creating auto attach server: ",t),"win32"!==process.platform)try{await e.promises.access((0,o.dirname)(a))}catch{return console.error("[debug-auto-launch] Refreshing variables from error"),void T()}})),await x}t.activate=function(t){A=Promise.resolve({context:t,state:null}),t.subscriptions.push(i.commands.registerCommand(w,k.bind(null,t))),t.subscriptions.push(i.workspace.onDidChangeConfiguration((t=>{(t.affectsConfiguration(`debug.javascript.${b}`)||[...y].some((e=>t.affectsConfiguration(e))))&&T()}))),_(S())},t.deactivate=async function(){await F()};const j=async t=>{try{return await P(t)}catch(a){return await e.promises.unlink(t).catch((()=>{})),await P(t)}},P=t=>new Promise(((e,a)=>{const n=(0,s.createServer)((t=>{const e=[];t.on("data",(async a=>{if(0===a[a.length-1]){e.push(a.slice(0,-1));try{await i.commands.executeCommand("extension.js-debug.autoAttachToProcess",JSON.parse(Buffer.concat(e).toString())),t.write(Buffer.from([0]))}catch(e){t.write(Buffer.from([1])),console.error(e)}}else e.push(a)}))})).on("error",a).listen(t,(()=>e(n)))}));async function F(){const t=await x;t&&await new Promise((e=>t.close(e)))}const W={async disabled(t){await async function(t){(x||await t.workspaceState.get(f))&&(await t.workspaceState.update(f,void 0),await i.commands.executeCommand("extension.js-debug.clearAutoAttachVariables"),await F())}(t)},async onlyWithFlag(t){await D(t)},async smart(t){await D(t)},async always(t){await D(t)}};function V(t,e,a=!1){if("disabled"===e&&!a)return void v?.hide();v||(v=i.window.createStatusBarItem("status.debug.autoAttach",i.StatusBarAlignment.Left),v.name=i.l10n.t("Debug Auto Attach"),v.command=w,v.tooltip=i.l10n.t("Automatically attach to node.js processes in debug mode"),t.subscriptions.push(v));let n=a?"$(loading) ":"";n+=C?p:r[e],v.text=n,v.show()}function _(t){A=A.then((async({context:e,state:a})=>t===a?{context:e,state:a}:(null!==a&&V(e,a,!0),await W[t](e),C=!1,V(e,t,!1),{context:e,state:t})))}})();var s=exports;for(var o in n)s[o]=n[o];n.__esModule&&Object.defineProperty(s,"__esModule",{value:!0})})();
//# sourceMappingURL=https://cursor-sourcemaps.s3.amazonaws.com/sourcemaps/fcd6e551d6f014d13071eac9bd4904e7e0346720/extensions/debug-auto-launch/dist/extension.js.map
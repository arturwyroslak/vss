"use strict";const performance=require("./vs/base/common/performance");performance.mark("code/fork/start");const bootstrap=require("./bootstrap"),bootstrapNode=require("./bootstrap-node");configureCrashReporter(),bootstrapNode.removeGlobalNodeModuleLookupPaths(),bootstrap.enableASARSupport(),process.env.VSCODE_INJECT_NODE_MODULE_LOOKUP_PATH&&bootstrapNode.injectNodeModuleLookupPath(process.env.VSCODE_INJECT_NODE_MODULE_LOOKUP_PATH),process.send&&process.env.VSCODE_PIPE_LOGGING==="true"&&pipeLoggingToParent(),process.env.VSCODE_HANDLES_UNCAUGHT_ERRORS||handleExceptions(),process.env.VSCODE_PARENT_PID&&terminateWhenParentTerminates(),require("./bootstrap-amd").load(process.env.VSCODE_AMD_ENTRYPOINT);function pipeLoggingToParent(){function l(e){const s=[],c=[];if(e.length)for(let n=0;n<e.length;n++){let r=e[n];if(typeof r>"u")r="undefined";else if(r instanceof Error){const o=r;o.stack?r=o.stack:r=o.toString()}c.push(r)}try{const n=JSON.stringify(c,function(r,o){if(d(o)||Array.isArray(o)){if(s.indexOf(o)!==-1)return"[Circular]";s.push(o)}return o});return n.length>1e5?"Output omitted for a large object that exceeds the limits":n}catch(n){return`Output omitted for an object that cannot be inspected ('${n.toString()}')`}}function E(e){try{process.send&&process.send(e)}catch{}}function d(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)&&!(e instanceof RegExp)&&!(e instanceof Date)}function _(e,s){E({type:"__$console",severity:e,arguments:s})}function i(e,s){Object.defineProperty(console,e,{set:()=>{},get:()=>function(){_(s,l(arguments))}})}function p(e,s){const c=process[e],n=c.write;let r="";Object.defineProperty(c,"write",{set:()=>{},get:()=>(o,u,O)=>{r+=o.toString(u);const f=r.length>1048576?r.length:r.lastIndexOf(`
`);f!==-1&&(console[s](r.slice(0,f)),r=r.slice(f+1)),n.call(c,o,u,O)}})}process.env.VSCODE_VERBOSE_LOGGING==="true"?(i("info","log"),i("log","log"),i("warn","warn"),i("error","error")):(console.log=function(){},console.warn=function(){},console.info=function(){},i("error","error")),p("stderr","error"),p("stdout","log")}function handleExceptions(){process.on("uncaughtException",function(t){console.error("Uncaught Exception: ",t)}),process.on("unhandledRejection",function(t){console.error("Unhandled Promise Rejection: ",t)})}function terminateWhenParentTerminates(){const t=Number(process.env.VSCODE_PARENT_PID);typeof t=="number"&&!isNaN(t)&&setInterval(function(){try{process.kill(t,0)}catch{process.exit()}},5e3)}function configureCrashReporter(){const t=process.env.VSCODE_CRASH_REPORTER_PROCESS_TYPE;if(t)try{process.crashReporter&&typeof process.crashReporter.addExtraParameter=="function"&&process.crashReporter.addExtraParameter("processType",t)}catch(a){console.error(a)}}

//# sourceMappingURL=https://cursor-sourcemaps.s3.amazonaws.com/sourcemaps/fcd6e551d6f014d13071eac9bd4904e7e0346720/core/bootstrap-fork.js.map

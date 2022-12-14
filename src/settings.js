document.getElementById('title').innerText = document.title

const { appWindow } = window.__TAURI__.window;
const { open, save } = window.__TAURI__.dialog;
const { readTextFile, writeTextFile } = window.__TAURI__.fs;
const { emit, listen } = window.__TAURI__.event;
const { getVersion, getTauriVersion } = window.__TAURI__.app;
const shell = window.__TAURI__.shell;
const os = window.__TAURI__.os;
const path = window.__TAURI__.path;
var platform = await os.platform()

if (platform == "win32" || platform == "linux") {
  document.getElementById('win-buttons').style.display = "flex"
  document.getElementById('win-minimize').onclick = () => appWindow.minimize()
  document.getElementById('win-maximize').onclick = () => appWindow.toggleMaximize()
  document.getElementById('win-close').onclick = () => appWindow.close()
} else if (platform == "darwin") {
  document.getElementById("title").style.opacity = 0
  document.getElementById("title").style.width = "3.5rem"
  document.getElementById('mac-buttons').style.display = "flex"
  document.getElementById('mac-minimize').onclick = () => appWindow.minimize()
  document.getElementById('mac-maximize').onclick = () => appWindow.toggleMaximize()
  document.getElementById('mac-close').onclick = () => appWindow.close()
}

document.getElementById('exitbtn').onclick = () => appWindow.close()
document.getElementById('cfgopen').onclick = async () => shell.open(await path.appConfigDir())

const themeselector = document.getElementById('themeselector')
const opacityslider = document.getElementById('opacityslider')
const opacityvalue = document.getElementById('opacityvalue')

listen("gotConfig", ({ event, payload }) => {
  console.log(payload.appearance.theme)
  opacityvalue.innerText = `(${payload.appearance.opacity})`
  opacityslider.value = payload.appearance.opacity * 100/5
  themeselector.value = payload.appearance.theme
})

themeselector.onchange = async () => {
  await emit('settheme', {theme: themeselector.value.toString()})
}
opacityslider.onchange = async () => {
  var opacity = opacityslider.value * 5/100
  await emit('setopacity', {opacity: opacity})
}
opacityslider.oninput = () => {
  opacityvalue.innerText = `(${opacityslider.value * 5/100})`
}

document.getElementById('appversion').innerText = "v" + await getVersion();
document.getElementById('appos').innerText = platform
document.getElementById('osarch').innerText = await os.arch()
document.getElementById('tauriversion').innerText = await getTauriVersion();

document.getElementById('visuals-category').onclick = () => document.getElementById('appearance').scrollIntoView({behavior:"smooth"});
document.getElementById('editor-category').onclick = () => document.getElementById('editor').scrollIntoView({behavior:"smooth"});
document.getElementById('info-category').onclick = () => document.getElementById('info').scrollIntoView({behavior:"smooth"});

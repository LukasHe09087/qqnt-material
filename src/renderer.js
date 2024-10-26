import * as materialColorUtilities from './material-color-utilities.js';
const { plugin: pluginPath, data: dataPath } = LiteLoader?.plugins?.qqnt_material?.path;

const devMode = !0;
function log(...args) {
  console.log('[QQNT Material]', ...args);
}

// 打开设置界面时触发
// export const onSettingWindowCreated = (view) => {
//     // view 为 Element 对象，修改将同步到插件设置界面
// }

interval();
function interval(i = 0) {
  const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
  if (!themeColor) {
    setTimeout(() => {
      interval(++i);
    }, 100);
    return;
  }

  try {
    const backgroundElement = `<div class="qqnt-material-wallpaper"></div>`;
    let foo = document.createElement('div');
    foo.innerHTML = backgroundElement;
    foo = foo.firstChild;
    document.body.appendChild(foo);
  } catch (error) {
    log(error);
  }

  main(themeColor);
  if (devMode) {
    setInterval(() => {
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
      main(themeColor);
    }, 10 * 1000);
  }
}

async function main(themeColor) {
  const theme = materialColorUtilities.themeFromSourceColor(materialColorUtilities.argbFromHex(themeColor), []);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  materialColorUtilities.applyTheme(theme, { target: document.documentElement, dark: systemDark });

  const themeStylePath = `local:///${pluginPath}/src/style.css`;
  let themeStyle = await (await fetch(themeStylePath)).text();
  document.querySelectorAll('style[qqnt-material]').forEach(ele => {
    ele.remove();
  });
  (() => {
    try {
      let foo = document.createElement('style');
      foo.innerText = themeStyle;
      foo.setAttribute('qqnt-material', '');
      document.body.appendChild(foo);
    } catch (error) {
      log(error);
    }
  })();
}

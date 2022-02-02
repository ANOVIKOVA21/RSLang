import {
  getHomeComponent,
  getBookComponent,
  getSprintComponent,
  getAudioCallComponent,
  getErrorComponent,
} from './components';

const routes = [
  { path: '/', component: getHomeComponent() },
  { path: '/book', component: getBookComponent() },
  { path: '/sprint', component: getSprintComponent() },
  { path: '/audioCall', component: getAudioCallComponent() },
];
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const findComponentByPath = (path: string) =>
  routes.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gmi'))) || undefined;
const router = () => {
  const path = parseLocation();
  const { component = getErrorComponent() } = findComponentByPath(path) || {};
  (document.getElementById('main') as HTMLElement).innerHTML = component;
};
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

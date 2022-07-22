import '../styles.css';
import {
  getHomeComponent,
  getBookComponent,
  getSprintComponent,
  getAudioCallComponent,
  getErrorComponent,
} from './components';
import { addListeners } from './listeners';
import { addAuthorizationListeners } from './listeners';
import { checkTokens } from './user';
import { showLoading } from './general-functions';

addAuthorizationListeners();
const routes = [
  { path: `/book`, componentFunc: (path: string) => getBookComponent(path) },
  { path: '/sprint', componentFunc: (path: string) => getSprintComponent(path) },
  { path: '/audioCall', componentFunc: (path: string) => getAudioCallComponent(path) },
  { path: '/', componentFunc: () => getHomeComponent() },
];
const parseLocation = () => location.hash.slice(1) || '/';
const findComponentByPath = (path: string) => {
  const route = routes.find((r) => path.startsWith(r.path));

  if (!route) return undefined;

  return route.componentFunc(path);
};

const router = async () => {
  const path = parseLocation();
  // debugger
  showLoading(document.getElementById('main') as HTMLElement);
  checkTokens();
  const component = findComponentByPath(path) || getErrorComponent();
  (document.getElementById('main') as HTMLElement).innerHTML = await component;
  addListeners();
};
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

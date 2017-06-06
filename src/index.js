import ReactDOM from 'react-dom';
import routes from './routes';

import 'icono';
require('./app.less');
require('./icono.less');


ReactDOM.render(routes, document.getElementById('app'));
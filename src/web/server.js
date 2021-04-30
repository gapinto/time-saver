import App from './app';
import { scopePerRequest, loadControllers } from 'awilix-express';
import container from '../container.js';

App.express.use(scopePerRequest(container));

App.express.use(loadControllers('controller/*.js', { cwd: __dirname }));

App.express.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));


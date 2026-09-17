import express, {
  static as expressStatic,
  urlencoded as expressUrlencoded,
} from 'express';
import path from 'node:path';
import expressLayouts from 'express-ejs-layouts';
import { errorHandler } from './errors.js';
import { createIndexRouter } from './routers/indexRouter.js';
import { parsedEnvironment } from './settings/parsedEnvironment.js';
import { setupSessionStore } from './settings/sessionStore.js';
import { setupPassport } from './settings/passport.js';

const { PORT } = parsedEnvironment;
const { dirname } = import.meta;

const app = express();

app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressStatic(path.join(dirname, 'public')));
app.use(expressUrlencoded({ extended: true }));

setupSessionStore(app);
setupPassport(app);

app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.use(expressLayouts);

app.use('/', createIndexRouter());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Express app listening on port ${PORT}! http://localhost:${PORT}`,
  );
});

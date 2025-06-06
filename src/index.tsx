import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './store/Store';
import Spinner from './views/spinner/Spinner';
import './utils/i18n';
import './_mockApis';
import './assets/css/customOverrides.css';
import './assets/css/globalOverrides.css';
import './assets/css/imageStyles.css';
import './assets/css/fixedImageSize.css';
import './assets/css/cardStyles.css';
import './assets/css/blogCardFix.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

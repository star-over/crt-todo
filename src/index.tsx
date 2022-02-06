import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { AboutPage, MainPage, NotFoundPage } from './pages/pages';
import { routePaths } from './routes/routes';
import StoreContext, { stores } from './store/StoreContext';
import './styles/output.css';

ReactDOM.render(
  <React.StrictMode>
    <div className='min-h-screen bg-gray-50 flex flex-col relative overflow-hidden'>
      <section className='
          ring-2 transition-all duration-500 bg-white shadow-xl ring-gray-900/5
          mx-auto px-0 pt-0 pb-0 min-w-full
          sm:max-w-xl sm:rounded-lg sm:p-3 sm:w-full sm:min-w-0
          md:max-w-2xl md:mx-auto md:rounded-lg md:p-10 md:w-11/12 md:my-3
          lg:max-w-3xl lg:mx-auto lg:rounded-lg lg:w-5/6 lg:px-12
          xl:max-w-4xl xl:mx-auto xl:rounded-lg xl:w-3/4 xl:px-20
          2xl:max-w-4xl 2xl:mx-auto 2xl:rounded-lg 2xl:w-2/3
        '>
        <BrowserRouter>
          <StoreContext.Provider value={stores}>
          <Header />
          <ThemeToggle />
          <Routes>
            <Route path={routePaths.HOME.path} element={<MainPage/>}/>
            <Route path={routePaths.ABOUT.path} element={<AboutPage/>}/>
            <Route path={routePaths.NOT_FOUND.path} element={<NotFoundPage/>}/>
          </Routes>
          </StoreContext.Provider>
        </BrowserRouter>
      </section>
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
);

import React from 'react';
import { Helmet } from 'react-helmet';
import Navigation from '../Navigation';
import style from './style.module.less';

export default function ({ children, title, path }) {
    return (
        <>
            <div className={style.container}>
                <div className={style.inner}>
                    <h1 className={style.title}>{title}</h1>
                    {children}
                </div>
            </div>

            <Helmet title={`Timo Becker • ${title}`}>
                <link rel="shortcut icon" type="image/png" href="/favicon.png" />
            </Helmet>
            <Navigation currentPath={path} />
        </>
    );
}

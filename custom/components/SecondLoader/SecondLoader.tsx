import React from 'react'

import css from './style.module.css'

export const SecondLoader = () => {
  return (
    <div className={css.container}>
        <div className={css.loader}></div>
        <p className={css.text}>Cargando</p>
    </div>
  )
}

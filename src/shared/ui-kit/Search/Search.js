import React, { useState } from 'react'
import style from './Search.module.scss'
import { searchIco } from '../../../shared/icons/_index'

function Search({ placeholder, value, onChange }) {
  return (
    <div className={style.inputWrapper}>
      <input
        className={style.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <img className={style.ico} src={searchIco} alt="" />
    </div>
  )
}
export default Search

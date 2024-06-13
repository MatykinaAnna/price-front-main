import styles from './Loader.module.scss'
import { load_ico } from '../../shared/icons/_index'

export const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <img src={load_ico} alt="" />
      </div>
    </div>
  )
}

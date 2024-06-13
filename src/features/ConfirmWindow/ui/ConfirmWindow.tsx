import classNames from 'classnames';
import styles from './ConfirmWindow.module.scss';
import { greenKr, save } from 'shared/icons/_index';
import { ConfirmWindowProps } from 'shared/interfaces';

export const ConfirmWindow = (props: ConfirmWindowProps) => {
  return (
    <>
      <div
        className={classNames(styles.background)}
        data-testid="background"></div>
      <div className={classNames(styles.body)} data-testid="confirm-window">
        <div className={classNames(styles.header)}>
          <div className={classNames(styles.header_text)}>Внимание</div>
          <div>
            <button
              className={classNames(styles.btn_close)}
              data-testid="btn_close"
              onClick={() => {
                props.onTrickClick('btn_close');
              }}>
              <img src={greenKr} alt="btn_close" width={15} height={15} />
            </button>
          </div>
        </div>
        <div className={classNames(styles.content)}>
          <div className={classNames(styles.text)}>{props.text}</div>
          <div className={classNames(styles.buttons)}>
            <div>
              <button
                name="btn-true"
                onClick={() => {
                  props.onTrickClick('btn-true');
                }}>
                Да
              </button>
              <button
                name="btn-true"
                onClick={() => {
                  props.onTrickClick('btn-false');
                }}>
                Нет
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

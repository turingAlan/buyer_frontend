import React from "react";
import styles from "../../../Styles/actionCard.module.scss";
export default function CustomRadioButton(props) {
  const { checked, oneditaddress, iseditable = false } = props;
  return (
    <div className={`d-flex align-items-start ${styles.parent_radio}`}>
      <button className={`${styles.radio_button_wrapper} p-2 my-1`} {...props}>
        <div className={styles.box_basis}>
          <div className={styles.radio_button_background}>
            <div className={checked ? styles.active : styles.non_active}></div>
          </div>
        </div>
        <div className={styles.name_basis}>{props.children}</div>
      </button>
      {iseditable && <div className={`p-2 my-1 ${styles.parent_edit_button}`}>
        <button className={styles.edit_button} onClick={() => oneditaddress()}>edit</button>
      </div>}
    </div>
  );
}

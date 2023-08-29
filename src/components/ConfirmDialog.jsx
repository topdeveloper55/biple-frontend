import React from 'react';

import { openReusableDialog } from 'action/navigation';

// import Text from 'atoms/text/Text';
// import Button from 'atoms/button/Button';

function ConfirmDialog({
  desc, actionTitle, actionType, onComplete,
}) {
  return (
    <div className="confirm-dialog">
      <p>{desc}</p>
      <div className="confirm-dialog__btn">
        <button variant={actionType} onClick={() => onComplete(true)}>{actionTitle}</button>
        <button onClick={() => onComplete(false)}>Cancel</button>
      </div>
    </div>
  );
}

/**
 * @param {string} title title of confirm dialog
 * @param {string} desc description of confirm dialog
 * @param {string} actionTitle title of main action to take
 * @param {'primary' | 'positive' | 'danger' | 'caution'} actionType type of action. default=primary
 * @return {Promise<boolean>} does it get's confirmed or not
 */
// eslint-disable-next-line import/prefer-default-export
export const confirmDialog = (title, desc, actionTitle, actionType = 'primary') => new Promise((resolve) => {
  let isCompleted = false;
  openReusableDialog(
    <p variant="s1" weight="medium">{title}</p>,
    (requestClose) => (
      <ConfirmDialog
        desc={desc}
        actionTitle={actionTitle}
        actionType={actionType}
        onComplete={(isConfirmed) => {
          isCompleted = true;
          resolve(isConfirmed);
          requestClose();
        }}
      />
    ),
    () => {
      if (!isCompleted) resolve(false);
    },
  );
});

import type { FC, TeactNode } from '../../../../lib/teact/teact';
import React from '../../../../lib/teact/teactn';

import buildClassName from '../../../../util/buildClassName';

import Button from '../../../ui/Button';

import styles from './Layout.module.scss';

type OwnProps = {
  classNameTitle?: string;
  classNameSubtitle?: string;
  classNameChildren?: string;
  children: TeactNode;
  title: string;
  actionText: string;
  actionHandler: () => void;
  subtitle: string;
};

const Layout: FC<OwnProps> = ({
  children, title, subtitle, actionText, actionHandler, classNameTitle, classNameSubtitle, classNameChildren,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.titles}>
          <div className={buildClassName(styles.title, classNameTitle)}>{ title }</div>
          <div className={buildClassName(styles.subtitle, classNameSubtitle)}>{ subtitle }</div>
        </div>
        <div className={buildClassName(styles.children, classNameChildren)}>
          { children }
        </div>
      </div>
      <Button className={styles.actionButton} color="none" ripple onClick={actionHandler}>{actionText}</Button>
    </div>
  );
};

export default Layout;

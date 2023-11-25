/* eslint-disable no-console */
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { FC } from '../../../lib/teact/teact';
import React, { memo } from '../../../lib/teact/teact';
import { withGlobal } from '../../../global';

import type { ApiPhoto, ApiUser } from '../../../api/types';

import { selectUser, selectUserFullInfo } from '../../../global/selectors';

import ProfilePhoto from '../../common/ProfilePhoto';

import styles from './UluHeaderProfile.module.scss';

type OwnProps = {
  onClick?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export type Workspace = {
  id: string;
  name: string;
  logoUrl?: string;
};

type StateProps = {
  user?: ApiUser;
  currentWorkspace?: Workspace;
  userPersonalPhoto?: ApiPhoto;
  userProfilePhoto?: ApiPhoto;
  userFallbackPhoto?: ApiPhoto;
};

const getUserFullName = (user?: ApiUser) => {
  if (!user) {
    return '';
  }

  let userFullName = user.firstName || '';
  if (user.lastName) {
    userFullName += ` ${user.lastName}`;
  }

  return userFullName;
};

const UluHeaderProfile: FC<OwnProps & StateProps> = ({
  user, currentWorkspace, userFallbackPhoto, userPersonalPhoto, userProfilePhoto, onClick,
}) => {
  console.log('Current Workspace:', currentWorkspace); // Debugging
  console.log('User:', user); // Debugging
  const isPersonalWorkspace = currentWorkspace?.id === 'personal';
  console.log('Is Personal Workspace:', isPersonalWorkspace); // Debugging

  function renderPhoto() {
    if (isPersonalWorkspace) {
      const profilePhoto = userPersonalPhoto || userProfilePhoto || userFallbackPhoto;
      return (
        <ProfilePhoto
          user={user}
          photo={profilePhoto}
          canPlayVideo
        />
      );
    } else {
      if (currentWorkspace?.logoUrl) {
        return <img className="ProfilePhoto" src={currentWorkspace.logoUrl} alt={`${currentWorkspace.name} logo`} />;
      }
      // Рендер заглушки, если нет logoUrl
      const firstLetter = currentWorkspace?.name?.[0] || '';
      return (
        <div className="placeholder">
          {firstLetter}
        </div>
      );
    }
  }

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.photoWrapper}>
        {renderPhoto()}
      </div>
      <div className={styles.userName}>
        {isPersonalWorkspace ? getUserFullName(user) : currentWorkspace?.name}
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>((global) => {
  const { currentUserId } = global;
  const user = selectUser(global, currentUserId!);
  const userFullInfo = selectUserFullInfo(global, currentUserId!);

  // Retrieve the current workspace ID from localStorage
  const currentWorkspaceId = localStorage.getItem('currentWorkspace');
  const savedWorkspacesString = localStorage.getItem('workspaces') || '[]';
  const savedWorkspaces = JSON.parse(savedWorkspacesString) as Workspace[];

  // Find the current workspace or default to personal if not found
  let currentWorkspace = savedWorkspaces.find((ws: {
    id: string;
  }) => ws.id === currentWorkspaceId);
  if (!currentWorkspaceId || !currentWorkspace) {
    // Define a default personal workspace object
    currentWorkspace = { id: 'personal', name: 'Personal Workspace', logoUrl: undefined };
  }

  return {
    user,
    currentWorkspace,
    userPersonalPhoto: userFullInfo?.personalPhoto,
    userProfilePhoto: userFullInfo?.profilePhoto,
    userFallbackPhoto: userFullInfo?.fallbackPhoto,
  };
})(UluHeaderProfile));

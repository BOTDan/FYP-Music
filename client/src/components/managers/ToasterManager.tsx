import {
  faCheckCircle, faCircleXmark, faInfoCircle, faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/helper';
import { removeToaster } from '../../store/reducers/notifications';
import { ToasterDefinition, ToasterType } from '../../types';
import './ToasterManager.scss';

interface ToasterProps {
  definition: ToasterDefinition;
  onExpire(toast: ToasterDefinition): void;
}

/**
 * Creates a toaster popup notification.
 * These should be created using the store and the manager in this file.
 * @param props The props object
 */
function Toaster({ definition, onExpire }: ToasterProps) {
  const [dying, setDying] = useState(false);

  const animTime = 500;

  const classList = ['Toaster'];
  classList.push(definition.type);
  if (dying) { classList.push('fadeout'); }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onExpire(definition);
    }, (definition.created + definition.lifetime + animTime) - Date.now());

    const animTimer = window.setTimeout(() => {
      setDying(true);
    }, (definition.created + definition.lifetime) - Date.now());

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(animTimer);
    };
  });

  let icon = faInfoCircle;
  if (definition.type === ToasterType.Success) { icon = faCheckCircle; }
  if (definition.type === ToasterType.Warning) { icon = faWarning; }
  if (definition.type === ToasterType.Danger) { icon = faCircleXmark; }

  return (
    <div className={classList.join(' ')}>
      <div className="Toaster__Icon">
        <FontAwesomeIcon icon={icon} fixedWidth />
      </div>
      <div className="Toaster__Content">
        <p className="Toaster__Content__Title">{definition.title}</p>
        {definition.description
        && <p className="Toaster__Content__Description">{definition.description}</p>}
      </div>
    </div>
  );
}

/**
 * Manages displaying toaster notifications
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 */
export function ToasterManager() {
  const toasters = useAppSelector((state) => state.notifications.toasters);
  const dispatch = useAppDispatch();

  const handleOnExpire = (toast: ToasterDefinition) => {
    dispatch(removeToaster(toast));
  };

  return (
    <div className="ToasterHolder">
      {toasters.map((toast) => (
        <Toaster
          definition={toast}
          onExpire={handleOnExpire}
          key={toast.id}
        />
      ))}
    </div>
  );
}

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { mediaProviderPrettyPrint } from '../../helper';
import { MediaProvider } from '../../types';
import { classes, ProviderIcon } from '../icons/ProviderIcon';
import './ProviderCard.scss';

export interface ProviderCardProps {
  provider: MediaProvider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const classList = ['ProviderCard'];
  classList.push(classes[provider]);
  return (
    <Link className={classList.join(' ')} to={`./${provider}`}>
      <div className="ProviderCard__Left">
        <ProviderIcon provider={provider} />
      </div>
      <div className="ProviderCard__Center">
        <p>{mediaProviderPrettyPrint(provider)}</p>
      </div>
      <div className="ProviderCard__Right">
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </Link>
  );
}

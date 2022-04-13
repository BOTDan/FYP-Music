import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { mediaProviderPrettyPrint } from '../../helper';
import { MediaProvider } from '../../types';
import { classes, ProviderIcon } from '../icons/ProviderIcon';
import { IconCard } from './IconCard';
import './ProviderCard.scss';

export interface ProviderCardProps {
  provider: MediaProvider;
}

/**
 * Creates an icon card using the icon and brnading of the given media provider
 * @param props
 * @returns An icon card with provider icon+text
 */
export function ProviderCard({ provider }: ProviderCardProps) {
  const classList = ['ProviderCard'];
  classList.push(classes[provider]);

  return (
    <IconCard
      className={classList.join(' ')}
      iconContent={(<ProviderIcon provider={provider} />)}
      to={`./${provider}`}
      showArrow
    >
      {mediaProviderPrettyPrint(provider)}
    </IconCard>
  );
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

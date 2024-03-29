import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { providerPrettyPrint } from '../../helper';
import { AuthProvider, MediaProvider } from '../../types/public';
import { classes, ProviderIcon } from '../icons/ProviderIcon';
import { IconCard } from './IconCard';
import './ProviderCard.scss';

export interface ProviderCardProps {
  provider: MediaProvider | AuthProvider;
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
      {providerPrettyPrint(provider)}
    </IconCard>
  );
  return (
    <Link className={classList.join(' ')} to={`./${provider}`}>
      <div className="ProviderCard__Left">
        <ProviderIcon provider={provider} />
      </div>
      <div className="ProviderCard__Center">
        <p>{providerPrettyPrint(provider)}</p>
      </div>
      <div className="ProviderCard__Right">
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </Link>
  );
}

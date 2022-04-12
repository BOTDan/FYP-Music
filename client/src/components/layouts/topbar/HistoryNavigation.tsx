import React, { useState } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { Button } from '../../input/Button';
import './HistoryNavigation.scss';

/**
 * Buttons used to go back/forward through history
 * @returns Navigation buttons for page history
 */
export function HistoryNavigation() {
  const [backDisabled] = useState(false);
  const [forwardDisabled] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="HistoryNavigation">
      <Button leftIcon={faChevronLeft} onClick={() => navigate(-1)} disabled={backDisabled} />
      <Button rightIcon={faChevronRight} onClick={() => navigate(1)} disabled={forwardDisabled} />
    </div>
  );
}

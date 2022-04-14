import React, { useEffect, useState } from 'react';
import { ExternalPlaylist, PlaylistDTO } from '../../../types/public';
import { SquareImage } from '../../structure/SquareImage';
import { MultiSelect, MultiSelectOption } from '../MultiSelect';
import './PlaylistMultiSelect.scss';

type PlaylistType = PlaylistDTO | ExternalPlaylist;

export interface PlaylistMultiSelectProps<T extends PlaylistType> {
  playlists: T[];
  checked: T[];
  onCheck(playlist: T): void;
  onUncheck(playlist: T): void;
}

export function PlaylistMultiSelect<T extends PlaylistType>({
  playlists, checked, onCheck: onAdded, onUncheck: onRemoved,
}: PlaylistMultiSelectProps<T>) {
  const [checkedInternal, setCheckedInternal] = useState<MultiSelectOption<T>[]>([]);
  const [optionsInternal, setOptionsInternal] = useState<MultiSelectOption<T>[]>([]);

  function handleOnChange(option: MultiSelectOption<T>, isChecked: boolean) {
    if (isChecked) {
      onAdded(option.value);
    } else {
      onRemoved(option.value);
    }
  }

  useEffect(() => {
    const checkedNames = checked.map((o) => (o as PlaylistDTO).id
      ?? (o as ExternalPlaylist).providerId);
    setCheckedInternal(
      optionsInternal.filter(
        (option) => checkedNames.includes(
          (option.value as PlaylistDTO).id
          ?? (option.value as ExternalPlaylist).providerId,
        ),
      ),
    );
  }, [checked]);

  useEffect(() => {
    setOptionsInternal(playlists.map((playlist) => ({
      content: (
        <div className="PlaylistMultiSelect__Label">
          <SquareImage
            className="PlaylistMultiSelect__Label__Image"
            // src={playlist.image}
            fallbackSrc="/assets/img/playlist_placeholder.png"
          />
          <p className="PlaylistMultiSelect__Label__Text">
            {playlist.name}
          </p>
        </div>
      ),
      name: (playlist as PlaylistDTO).id ?? (playlist as ExternalPlaylist).providerId,
      value: playlist,
    })));
  }, [playlists]);

  return (
    <MultiSelect
      className="PlaylistMultiSelect"
      rightAlign
      options={optionsInternal}
      checked={checkedInternal}
      onChange={handleOnChange}
    />
  );
}

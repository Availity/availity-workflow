import { createContext, useContext } from 'react';
import { observable } from 'mobx';
import { avSlotmachineApi } from '@availity/api-axios';
import get from 'lodash.get';

class SpaceStore {
  @observable
  space = null;

  @observable
  error = null;

  fetchSpace = async spaceId => {
    const response = await avSlotmachineApi.query(spaceQuery(spaceId));

    this.space = get(response,'data.space.space');
  };
}

export const SpaceContext = createContext(new SpaceStore());

export const useSpace = spaceId => {
  const { space, fetchSpace, ...rest } = useContext(SpaceContext);

  if (!space) {
    fetchSpace(spaceId);
  }

  return { space, ...rest };
};

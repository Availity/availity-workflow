import { useState, useEffect } from 'react';
import get from 'lodash.get';
import { avSpacesApi } from '@availity/api-axios';

export default spaceId => {
  const [loading,setLoading] = useState(true);
  const [space, setSpace] = useState(null);

  const fetchSpace = async () => {
    const response = await avSpacesApi.get(spaceId);

    setSpace(get(response,'data'));
    setLoading(false);
  };

  useEffect(() => {
    fetchSpace();
  },[])

  return [space,loading];
};

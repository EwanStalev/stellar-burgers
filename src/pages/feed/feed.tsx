import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllFeeds } from '../../services/reducers/feedReducer';

export const Feed: FC = () => {
  const { orders, isOrdersLoading } = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  if (isOrdersLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getAllFeeds());
      }}
    />
  );
};

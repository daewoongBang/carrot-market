import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';

import { Review, User } from '@prisma/client';
import Rating from '@components/rating';

interface ReviewWithUser extends Review {
  createdBy: User;
}

interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

const Reviews: NextPage = () => {
  const [url, setUrl] = useState<string>();

  const { data } = useSWR<ReviewsResponse>(url);

  useEffect(() => {
    setUrl('/api/reviews');
  }, []);

  return (
    <div>
      {data?.reviews.map(review => (
        <div key={review.id} className='mt-12'>
          <div className='flex space-x-4 items-center'>
            <div className='w-12 h-12 rounded-full bg-slate-400' />

            <div>
              <h4 className='text-sm font-bold text-gray-800'>
                {review.createdBy.name}
              </h4>

              <Rating star={review.score} />
            </div>
          </div>

          <div className='mt-4 text-gray-600 text-sm'>
            <p>{review.review}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;

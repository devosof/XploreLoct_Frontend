import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ReviewSection({ eventId, reviews = [], onSubmitReview }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <div className="space-y-8">
      {/* Review Form - Only show if authenticated */}
      {isAuthenticated ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
            />

            <button
              type="submit"
              disabled={!rating || !comment}
              className="mt-4 px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">
            Please{' '}
            <Link to="/login" className="text-green-800 hover:underline font-medium">
              login
            </Link>
            {' '}to add a review
          </p>
        </div>
      )}

      {/* Reviews List - Always show */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {Array.isArray(reviews) && reviews.map((review) => (
          <div key={review.review_id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={review.user?.avatar_url || 'https://ui-avatars.com/api/?name=' + review.user.name}
                alt={review.user?.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">{review.user.username}</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
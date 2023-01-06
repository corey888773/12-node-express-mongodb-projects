[
  {
    $match: {
      product: new ObjectId("63b5b71f49fd4b2b83a9f47c"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numberOfReviews: {
        $sum: 1,
      },
    },
  },
];

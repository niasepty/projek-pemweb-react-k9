const CommentBox = async ({ anime_mal_id }) => {
  const comments = await prisma.comment.findMany({ where: { anime_mal_id } });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white p-4 rounded shadow text-sm sm:text-base md:text-lg text-black"
        >
          <p className="font-semibold">{comment.username}</p>
          <p className="mt-2 break-words">{comment.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentBox;

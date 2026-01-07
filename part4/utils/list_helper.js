const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};
  const mostLikes = blogs.reduce((prev, current) => {
    return current.likes > prev.likes ? current : prev;
  });
  return {
    title: mostLikes.title,
    author: mostLikes.author,
    url: mostLikes.url,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  const authorCounts = _.countBy(blogs, "author");

  const sortedAuthor = _.maxBy(Object.entries(authorCounts), (pair) => pair[1]);

  return {
    author: sortedAuthor[0],
    blogs: sortedAuthor[1]
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};
  const groupedBlogs = _.groupBy(blogs, "author");

  const authorLikes = _.map(groupedBlogs, (authorBlogs, name) => ({
    author: name,
    likes: _.sumBy(authorBlogs, "likes")
  }));

  return _.maxBy(authorLikes, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};

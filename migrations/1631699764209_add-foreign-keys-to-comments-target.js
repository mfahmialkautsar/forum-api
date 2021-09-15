/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'comments',
    'fk_comments.parent_comment_id_comments.id',
    'FOREIGN KEY(parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.parent_comment_id_comments.id');
};

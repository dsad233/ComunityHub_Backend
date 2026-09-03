/**
 * 게시글 (Posts)
 */
export enum IsPublicStatus {
  ALL = 'ALL',
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum CommentStatus {
  ALL = 'ALL',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
}

// comments 에서도 사용
export enum OrderByStatus {
  NEW = 'NEW',
  OLD = 'OLD',
  POPULAR = 'POPULAR',
  COMMENTS = 'COMMENTS',
  VIEWS = 'VIEWS',
  LIKES = 'LIKES',
}

export enum CategoryStatus {
  ALL = 'ALL',
  FREE = 'FREE',
  SPORTS = 'SPORTS',
  GAME = 'GAME',
}

export enum AuthEmailStatus {
  LOGINID = 'LOGINID',
  PASSWORD = 'PASSWORD',
}

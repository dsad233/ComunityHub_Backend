import mongoose from 'mongoose';
import { MONGO_DB_URL } from './keys';
import { PostsSchema as _PostsSchema } from '../../../mongodb/schemas/posts.mongo';

export async function MongoDBConfig() {
  mongoose
    .connect(MONGO_DB_URL)
    .then(() => console.log('mongodb 연결 완료.'))
    .catch((err) => {
      console.error('mongodb 연결 오류 발생!: ', err);
      process.exit(1);
    });

  loadMongoSchema();
}

// MongoDB 스키마 로드
async function loadMongoSchema() {
  mongoose.model('posts', _PostsSchema);
}

// 스키마 exports
export const PostsSchema = mongoose.model('posts', _PostsSchema);

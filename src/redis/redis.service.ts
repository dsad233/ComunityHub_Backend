import Redis from 'ioredis';

export class RedisService {
  private redis: Redis;
  constructor(redis: Redis) {
    this.redis = redis;
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async incr(key: string): Promise<void> {
    await this.redis.incr(key);
  }

  async zincr(key: string, member: string): Promise<void> {
    await this.redis.zincrby(key, 1, member);
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redis.zrevrange(key, start, stop);
  }

  async zscore(key: string, member: string): Promise<string | null> {
    return await this.redis.zscore(key, member);
  }
}

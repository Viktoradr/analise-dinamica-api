import { Module } from '@nestjs/common';
import { AwsBucketService } from './aws-bucket.service';

@Module({
  providers: [AwsBucketService],
  exports: [AwsBucketService],
})
export class AwsBucketModule {}

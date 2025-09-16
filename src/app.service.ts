import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<html>
        <head><title>Hello</title></head>
        <body>
          <h1>Hello World em HTML 🚀</h1>
        </body>
      </html>`;
  }
}

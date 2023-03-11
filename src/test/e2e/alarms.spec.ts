import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import * as AlarmApis from '../../api/functional/api/v1/alarms';
import * as AuthApis from '../../api/functional/api/v1/auth';
import typia from 'typia';
import { CreateUserDto } from '../../models/dtos/create-user.dto';

describe('E2E alarms test', () => {
  const host = 'http://localhost:4000';
  let app: INestApplication;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await (await app.init()).listen(4000);
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * 게임의 일일퀘스트처럼, 알림만 눌러가면서도 우리 서비스를 모두 쓰게 만들 만큼의 사용성이 있어야 한다.
   * 각 알림은 아이디 값과, 그 아이디가 어떤 리소스의 PK인지, 논리적인 값을 가져야 한다.
   */
  describe('GET api/v1/alarms', () => {
    let token: string = '';
    beforeAll(async () => {
      const designer = typia.random<CreateUserDto>();
      await AuthApis.sign_up.signUp({ host }, designer);
      const response = await AuthApis.login({ host }, designer);
      token = response.data;
    });

    it('조회 결과 값은 페이지네이션 가능한 배열의 형태여야 한다.', async () => {
      const readResponse = await AlarmApis.read(
        {
          host,
          headers: {
            authorization: token,
          },
        },
        { page: 1, limit: 10 },
      );

      expect(readResponse.data.list).toBeInstanceOf(Array);
    });

    it.todo('각 알람에는 논리적 ID 값이 있어야 한다.');
  });
});

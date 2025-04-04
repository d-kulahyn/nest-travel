import {Test, TestingModule} from '@nestjs/testing';
import {UsersController} from './controllers/users.controller';
import {UserService} from './services/user.service';

describe('UserController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UserService],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

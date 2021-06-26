import { Request, Response } from 'express';
import { getCustomRepository, Like } from 'typeorm';
import { UsersRepository } from '@repositories/UsersRepository';
import { AppError } from '@errors/AppError';
import {
  validateNickname, validateId, validateFindAllByNameLastName, validateStore, validateUpdate,
} from '@Utils/validators/userValidate';

class UserController {
  // Cria um novo usuário recebendo os dados pelo corpo da requisição: retorna os dados do usuário criado com status correspondente.
  // Se nickname já existe, retornar status e mensagem de erro.
  async store(request: Request, response: Response) {
    const {
      name, lastname, nickname, address, bio,
    } = request.body;

    // validation
    await validateStore(name, lastname, nickname, address, bio);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ nickname });

    if (userAlreadyExists) {
      throw new AppError('User Already Exists!', 409);
    }

    try {
      const userData = userRepository.create({
        name, lastname, nickname, address, bio,
      });
      const user = await userRepository.save(userData);
      return response.json(user).status(201);
    } catch (error) {
      throw new AppError(error);
    }
  }

  // Lista todos os usuários cadastrados filtrados pelos campos nome e/ou sobrenome, filtrados por parâmetros de consulta: retorna um array de usuários.
  async findAllByNameLastName(request: Request, response: Response) {
    const { name, lastname } = request.query;
    // validation
    await validateFindAllByNameLastName(name, lastname);
    if (typeof name === 'undefined' && typeof lastname === 'undefined') {
      throw new AppError('Undefined Values', 400);
    }
    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.find({
      where: [{
        name: Like(name),
      }, {
        lastname: Like(lastname),
      }],
    });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }
    return response.json(userAlreadyExists).status(200);
  }

  // Lista um usuário pelo nickname passado como parâmetro: retorna um único usuário com nome, sobrenome e nickname.
  async findByNickname(request: Request, response: Response) {
    const nick = request.params.nickname;
    // validation
    await validateNickname(...nick);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ nickname: nick });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found', 404);
    }

    const { name, lastname, nickname } = userAlreadyExists;
    return response.json({ name, lastname, nickname }).status(200);
  }

  // Altera o sobrenome e o endereço do usuário recebido no corpo da requisição, baseado no id recebido como parâmetro de rota: retorna o usuário alterado com as novas informações.
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { lastname, address } = request.body;
    // validation
    await validateId(id);
    await validateUpdate(lastname, address);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ id });

    if ((userAlreadyExists.lastname == lastname) && (userAlreadyExists.address == address)) {
      throw new AppError('User Params Already Exists!', 409);
    }

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }

    try {
      const user = await userRepository.save({ ...userAlreadyExists, lastname, address });
      return response.json(user).status(200);
    } catch (error) {
      throw new AppError(error);
    }
  }

  // Altera o nickname de um usuário recebido no corpo da requisição, baseado no id recebido como parâmetro de rota: retorna o usuário alterado com as novas informações.
  // Se o nickname passado já existir, deve retornar status e mensagem de erro.
  async updateNickname(request: Request, response: Response) {
    const { id } = request.params;
    const { nickname } = request.body;
    // validation
    await validateId(id);
    await validateNickname(nickname);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ id });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }

    if (userAlreadyExists.nickname == nickname) {
      throw new AppError('User Nickname Aready Exists!', 409);
    }

    try {
      const user = await userRepository.save({ ...userAlreadyExists, nickname });
      return response.json(user).status(200);
    } catch (error) {
      throw new AppError(error);
    }
  }

  // Deleta um usuário baseado no id recebido como parâmetro de rota: retorna o status de sucesso.
  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    // validation
    await validateId(id);

    const usersRepository = getCustomRepository(UsersRepository);
    const [userAlreadyExists] = await usersRepository.find({ id });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }
    try {
      await usersRepository.delete(userAlreadyExists.id);
      return response.status(200).json(userAlreadyExists);
    } catch (error) {
      throw new AppError(error);
    }
  }
}
export default new UserController();

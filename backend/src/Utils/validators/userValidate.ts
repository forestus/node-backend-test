import * as yup from 'yup';

export async function validateStore(name?, lastname?, nickname?, address?, bio?) {
  const schema = yup.object().shape({
    name: yup.string().required(),
    lastname: yup.string().required(),
    nickname: yup.string().required().max(30),
    address: yup.string().required(),
    bio: yup.string().required().max(100),
  });
  // check validity
  await schema.validate({
    name, lastname, nickname, address, bio,
  });
}

export async function validateFindAllByNameLastName(name?, lastname?) {
  const schema = yup.object().shape({
    name: yup.string(),
    lastname: yup.string(),
  });
  // check validity
  await schema.validate({
    name, lastname,
  });
}

export async function validateNickname(nickname?) {
  const schema = yup.object().shape({
    nickname: yup.string().required().max(30),
  });
  // check validity
  await schema.validate({
    nickname,
  });
}

export async function validateUpdate(lastname?, address?) {
  const schema = yup.object().shape({
    lastname: yup.string().required(),
    address: yup.string().required(),
  });
  // check validity
  await schema.validate({
    lastname, address,
  });
}

export async function validateId(id) {
  const schema = yup.object().shape({
    id: yup.number().required(),
  });
    // check validity
  await schema.validate({ id });
}

const Accounts = require('../models/account');
const { cpf } = require('cpf-cnpj-validator');
const generateHashedPassword = require('../utils/generateHashedPassword');
const bcrypt = require('bcrypt');

module.exports = {
  async store(req, res, next) {
    const { name, password } = req.body;
    const sentCpf = req.body.cpf.toString();

    try {
      //verifica se a senha está vazia
      if (!password.length) return res.status(400).json({ message: "Password cannot be null" })

      //verifica se o cpf é válido
      if (!cpf.isValid(sentCpf)) return res.status(401).json({ message: 'CPF Not Valid' })

      const payload = {
        name,
        cpf: sentCpf,
        password: generateHashedPassword(password)
      };

      req.newAccount = payload;
      return next();
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async deposit(req, res, next) {
    try {
      const { cash, password } = req.body;

      if (cash <= 0 || cash > 2000) return res.status(400).json({ message: 'Invalid Cash Value' });

      const sentCpf = req.body.cpf.toString();

      if (cpf.isValid(sentCpf)) {
        const account = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });
        if (account) {

          //compara senha para executar depósito
          bcrypt.compare(password, account.password, async (err, result) => {
            //verifica se houve um erro na comparação
            if (err) res.status(400).json({ error: err });

            //verifica se o resultado foi negativo e retorna 401 caso seja
            if (!result) return res.status(401).json({ isCorrect: result, message: 'Invalid Password' })

            const newBalance = account.balance + cash;

            req.account_id = account.id;
            req.newBalance = newBalance;
            return next();
          })
        } else {
          return res.status(404).json({ message: 'Account Not Found'})
        }
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error });
    }
  },

  async withdrawal(req, res, next) {
    try {
      const { cash, password } = req.body;

      //valida valores a serem inseridos no banco
      if (cash <= 0 || cash > 2000) return res.status(400).json({ message: 'Invalid Cash Value' });

      const sentCpf = req.body.cpf.toString();

      if (cpf.isValid(sentCpf)) {
        const account = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });
        if (account) {

          //compara senha para executar depósito
          bcrypt.compare(password, account.password, async (err, result) => {
            //verifica se houve um erro na comparação
            if (err) res.status(400).json({ error: err });

            //verifica se o resultado foi negativo e retorna 401 caso seja
            if (!result) return res.status(401).json({ isCorrect: result, message: 'Invalid Password' });

            const newBalance = account.balance + cash;

            req.account = account;
            req.newBalance = newBalance;
            return next();
          })
        }
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async changePassword(req, res, next) {

    try {
      /** 
        * para segurança na mudança de senha, é solicitado o id (ou número de conta)
        *pelo parâmetro da url (account/:id)
        *
        *além disso, o cpf da conta também é solicitado pelo corpo da requisição
        *somente se os dois estiverem corretos, a mudança é feita
        */

      const { id } = req.params;
      const { password } = req.body;

      const sentCpf = req.body.cpf.toString();

      //valida cpf
      if (!cpf.isValid(sentCpf)) return res.status(404).json({ message: 'Incorrect Account or CPF' });

      const account = await Accounts.findOne({
        where: {
          cpf: sentCpf
        }
      });

      //se o id recebido na req estiver, não é permitido trocar a senha
      if (account.id !== id) return res.status(404).json({ message: 'Incorrect Account or CPF' });

      const newPassword = generateHashedPassword(password);

      req.account_id = account.id;
      req.newPassword = newPassword;
      return next();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};

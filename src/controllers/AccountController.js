const Accounts = require('../models/account');
const bcrypt = require('bcrypt');
const generateHashedPassword = require('../utils/generateHashedPassword');

module.exports = {
  async create(req, res) {
    try {
      /**
       * a nova conta é enviada para que o usuário saiba qual é o id da conta
       */
      const { newAccount } = req;
      const account = await Accounts.create(newAccount);

      account.password = undefined;
      if (account) return res.status(201).json(account);

    } catch (error) {
      //se o cpf já está sendo utilizado
      if (error.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'CPF Already Used' });

      console.log(error)
      return res.status(500).send({ message: error });
    }
  },

  async index(req, res) {
    try {
      /**
       * este método mostra todas as contas
       * são puxados do banco somente os campos necessários, por questão de segurança de
       * pegar o hash da senha neste caso não se faria necessário, e abriria vulnerabilidades
       */
      const response = await Accounts.findAll({
        attributes: [
          'id',
          'name',
          'cpf',
          'balance'
        ]
      });
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'No Account found' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async show(req, res) {
    try {
      /**
       * este método mostra somente a conta cujo id seja o mesmo passado pela url (/accounts/:id)
       * são puxados do banco somente os campos necessários, por questão de segurança de
       * pegar o hash da senha neste caso não se faria necessário, e abriria vulnerabilidades
       */
      const { id } = req.params;
      const response = await Accounts.findByPk(id, {
        attributes: [
          'id',
          'name',
          'cpf',
          'balance'
        ], include: [{
          association: 'sent_transfers',
          attributes: ['id', 'sender', 'receiver', 'value']
        }, {
          association: 'received_transfers',
          attributes: ['id', 'sender', 'receiver', 'value']
        }]
      });
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'Account Not found' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async updateBalance(req, res) {
    try {

      const { account_id, newBalance } = req;
      console.log(account_id);
      const updatedAccount = await Accounts.update({
        balance: newBalance
      }, {
        where: { id: account_id }
      })
      /**
      * não é enviado o response do cadastro para o client por questão de segurança
      */
      if (updatedAccount) return res.status(200).send();
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  },

  async changePassword(req, res) {
    try {
      //pega os dados da camada de domínio para executar ação no banco de dados
      const { account_id, newPassword } = req;

      const response = await Accounts.update({
        password: newPassword
      }, {
        where: {
          id: account_id
        }
      });
      if (response) return res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },
}
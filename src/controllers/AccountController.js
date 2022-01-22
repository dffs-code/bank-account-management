const Accounts = require('../models/account');
const { cpf } = require('cpf-cnpj-validator');
const bcrypt = require('bcrypt');
const generateHashedPassword = require('../utils/generateHashedPassword');

module.exports = {
  async create(req, res) {
    try {
      const { name } = req.body;
      const sentCpf = req.body.cpf;
      if (cpf.isValid(sentCpf)) {
        const accountAlreadyExists = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });

        if (accountAlreadyExists) {
          return res.status(401).json({ message: 'CPF already used' });
        };

        const response = await Accounts.create({
          name,
          cpf: sentCpf,
          password: generateHashedPassword(req.body.password),
        })
        response.password = undefined;
        return res.status(201).json(response);

      } else {
        return res.status(403).json({ message: 'CPF not valid' })
      }

    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error });
    }
  },

  async index(req, res) {
    try {
      const response = await Accounts.findAll();
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'No Account found' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const response = await Accounts.findByPk(id);
      response.password = undefined;
      res.status(200).json(response);
      if (!response) res.status(404).json({ message: 'Account Not found' })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async deposit(req, res) {
    try {
      const { cash, password } = req.body;
      const sentCpf = req.body.cpf;

      if (cpf.isValid(sentCpf)) {
        const account = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });
        if (account) {
          bcrypt.compare(password, account.password, async (err, result) => {
            if (err) res.status(400).json({ error: err });

            if (result) {
              const newBalance = account.balance + cash;
              const response = await account.update({
                balance: newBalance
              });
              response.password = undefined;
              if (!response)
                return res.status(404).json({ message: 'Account Not found' })
              return res.status(200).json(response);
            } else {
              res.status(401).json({
                isCorrect: result,
                message: 'Invalid Password'
              })
            }
          })
        }
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const sentCpf = req.body.cpf;

      if (cpf.isValid(sentCpf)) {
        const account = await Accounts.findOne({
          where: {
            cpf: sentCpf
          }
        });
        if (account) {
          const response = await account.update({
            password: generateHashedPassword(password)
          });
          response.password = undefined;
          if (!response)
            return res.status(404).json({ message: 'Account Not found' })
          return res.status(200).json({message: 'Password changed successfully'});
        }
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },
}